/**
 * useGameLoop — Drives the real-time idle progression.
 *
 * Runs a setInterval that processes ticks via the engine
 * and dispatches results to Redux. Also handles offline
 * catch-up when the app resumes from background.
 */

import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getQuestStepsToComplete } from '../../../packages/engine/src/utils/narrative';
import { ALL_QUESTS } from '../../../packages/engine/src/data/quests';
import { gameActions, SkillId, OfflineReport, ActiveCombat } from '@/store/gameSlice';
import { logger } from '@/utils/logger';
import { OFFLINE_CAP_F2P_MS, OFFLINE_CAP_PATRON_MS, XP_BONUS_PATRON } from '@/constants/game';

// ── Inline engine math (mirrors @arteria/engine) ──
// We inline the XP + tick logic here so we don't need
// workspace linking yet. This will be replaced with
// a direct import from @arteria/engine once the monorepo
// linking is configured for Metro.

const XP_TABLE: number[] = [];
(function buildTable() {
    XP_TABLE.push(0);
    let cum = 0;
    for (let lvl = 1; lvl < 99; lvl++) {
        cum += Math.floor(lvl + 300 * Math.pow(2, lvl / 7)) / 4;
        XP_TABLE.push(Math.floor(cum));
    }
})();

function levelForXP(xp: number): number {
    for (let lvl = 99; lvl >= 1; lvl--) {
        if (xp >= XP_TABLE[lvl - 1]) return lvl;
    }
    return 1;
}

// ── Action definitions (all skilling nodes) ──
interface ActionDef {
    xpPerTick: number;
    items: { id: string; quantity: number }[];           // items PRODUCED per tick
    consumedItems?: { id: string; quantity: number }[];   // items CONSUMED per tick (Runecrafting)
    successRate: number;
    masteryXp: number;
}

import { MINING_NODES } from '@/constants/mining';
import { LOGGING_NODES } from '@/constants/logging';
import { FISHING_SPOTS } from '@/constants/fishing';
import { HARVESTING_NODES } from '@/constants/harvesting';
import { SCAVENGING_NODES } from '@/constants/scavenging';
import { RUNE_ALTARS } from '@/constants/runecrafting';
import { SMELTING_RECIPES } from '@/constants/smithing';
import { FORGING_RECIPES } from '@/constants/forging';
import { COOKING_RECIPES } from '@/constants/cooking';
import { HERBLORE_RECIPES } from '@/constants/herblore';
import { ASTROLOGY_CONSTELLATIONS } from '@/constants/astrology';
import {
    RANDOM_EVENT_CHANCE_BASE,
    RANDOM_EVENT_COOLDOWN_TICKS,
    BLIBBERTOOTH_XP_MULTIPLIER,
    GENIE_XP_MULTIPLIER,
    TREASURE_GOLD_BASE,
    TREASURE_GOLD_PER_LEVEL,
    LUCKY_STRIKE_XP_MULTIPLIER,
    RANDOM_EVENT_TYPES,
} from '@/constants/randomEvents';
import { SKILL_PETS } from '@/constants/pets';
import { getMasteryYieldMultiplier, getMasterySpeedMultiplier, getMasteryDoubleDropChance, getMasteryPreserveChance } from '@/constants/mastery';

const ACTION_DEFS: Record<string, ActionDef> = {};

// Standard gathering nodes
[...MINING_NODES, ...LOGGING_NODES, ...FISHING_SPOTS, ...HARVESTING_NODES, ...SCAVENGING_NODES, ...ASTROLOGY_CONSTELLATIONS].forEach((node) => {
    ACTION_DEFS[node.id] = {
        xpPerTick: node.xpPerTick,
        items: node.items,
        successRate: node.successRate,
        masteryXp: node.masteryXp,
    };
});

// Runecrafting altars: consume essence, produce runes
RUNE_ALTARS.forEach((altar) => {
    ACTION_DEFS[altar.id] = {
        xpPerTick: altar.xpPerEssence * altar.essencePerBatch,
        items: [{ id: altar.outputRuneId, quantity: altar.runesPerBatch }],
        consumedItems: [{ id: altar.essenceType, quantity: altar.essencePerBatch }],
        successRate: 1,
        masteryXp: 1,
    };
});

// Smithing smelting: consume ore(s), produce bars
SMELTING_RECIPES.forEach((recipe) => {
    ACTION_DEFS[recipe.id] = {
        xpPerTick: recipe.xpPerTick,
        items: recipe.items,
        consumedItems: recipe.consumedItems,
        successRate: recipe.successRate,
        masteryXp: 1,
    };
});

// Forging: consume bars, produce equipment
FORGING_RECIPES.forEach((recipe) => {
    ACTION_DEFS[recipe.id] = {
        xpPerTick: recipe.xpPerTick,
        items: recipe.items,
        consumedItems: recipe.consumedItems,
        successRate: recipe.successRate,
        masteryXp: 1,
    };
});

// Cooking: consume raw fish, produce cooked food
COOKING_RECIPES.forEach((recipe) => {
    ACTION_DEFS[recipe.id] = {
        xpPerTick: recipe.xpPerTick,
        items: recipe.items,
        consumedItems: recipe.consumedItems,
        successRate: recipe.successRate,
        masteryXp: 1,
    };
});

// Herblore: consume herb + vial, produce potion
HERBLORE_RECIPES.forEach((recipe) => {
    ACTION_DEFS[recipe.id] = {
        xpPerTick: recipe.xpPerTick,
        items: recipe.items,
        consumedItems: recipe.consumedItems,
        successRate: recipe.successRate,
        masteryXp: 1,
    };
});

const TICK_INTERVAL_MS = 100; // Process check every 100ms for smooth progress

export interface UseGameLoopOptions {
    /** Called when ticks complete successfully (for SFX). Once per processDelta. */
    onTickComplete?: (skillId: string) => void;
}

export function useGameLoop(options?: UseGameLoopOptions) {
    const dispatch = useAppDispatch();
    const activeTask = useAppSelector((s) => s.game.player.activeTask);
    const lastSaveTimestamp = useAppSelector((s) => s.game.player.lastSaveTimestamp);
    const isLoaded = useAppSelector((s) => s.game.isLoaded);
    const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
    const activeSkillLevel = useAppSelector((s) => {
        const st = s.game.player.activeTask;
        if (!st?.skillId) return 1;
        return s.game.player.skills[st.skillId]?.level ?? 1;
    });
    const skills = useAppSelector((s) => s.game.player.skills);
    const player = useAppSelector((s) => s.game.player);
    const activeCombat = useAppSelector((s) => s.game.player.activeCombat);

    const lastTickRef = useRef<number>(Date.now());
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);
    const hasProcessedOfflineRef = useRef(false);
    const ticksSinceLastEventRef = useRef(0);
    const pendingCosmicSneezeRef = useRef(false);
    // Ref to current inventory so processDelta can read it without a stale closure
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const inventoryRef = useRef(inventory);
    inventoryRef.current = inventory;
    const activeSkillLevelRef = useRef(activeSkillLevel);
    activeSkillLevelRef.current = activeSkillLevel;
    const skillsRef = useRef(skills);
    skillsRef.current = skills;
    const playerRef = useRef(player);
    playerRef.current = player;
    const onTickCompleteRef = useRef(options?.onTickComplete);
    onTickCompleteRef.current = options?.onTickComplete;

    // Process a delta of time.
    // If accumulator is passed, results are added into it instead of dispatching immediately.
    const processDelta = useCallback(
        (deltaMs: number, accumulator?: OfflineReport) => {
            if (!activeTask) return;

            const action = ACTION_DEFS[activeTask.actionId];
            if (!action) return;

            const baseInterval = activeTask.intervalMs;
            const speedMult = activeTask.skillId
                ? getMasterySpeedMultiplier(playerRef.current, activeTask.skillId as SkillId)
                : 1;
            const interval = baseInterval / speedMult;
            const partialMs = (activeTask.partialTickMs || 0) + deltaMs;
            const fullTicks = Math.floor(partialMs / interval);
            const leftover = partialMs - fullTicks * interval;

            // Update partial tick progress
            dispatch(gameActions.updatePartialTick(leftover));

            if (fullTicks <= 0) return;

            // If this action consumes items (e.g. Runecrafting), check stock before rolling
            // and clamp ticks to how many we can actually process.
            let cappedTicks = fullTicks;
            if (action.consumedItems && action.consumedItems.length > 0) {
                for (const consumed of action.consumedItems) {
                    const ownedQty = inventoryRef.current.find((i) => i.id === consumed.id)?.quantity ?? 0;
                    const maxAffordable = consumed.quantity > 0 ? Math.floor(ownedQty / consumed.quantity) : fullTicks;
                    cappedTicks = Math.min(cappedTicks, maxAffordable);
                }
                if (cappedTicks <= 0) {
                    // Out of essence — stop the task automatically
                    dispatch(gameActions.stopTask());
                    return;
                }
                // Consume the essence (mastery preserve chance can save some)
                const preserveChance = activeTask.skillId
                    ? getMasteryPreserveChance(playerRef.current, activeTask.skillId as SkillId)
                    : 0;
                const actualConsumed = action.consumedItems.map((c) => {
                    let saved = 0;
                    if (preserveChance > 0) {
                        for (let t = 0; t < cappedTicks; t++) {
                            if (Math.random() < preserveChance) saved++;
                        }
                    }
                    return { id: c.id, quantity: c.quantity * (cappedTicks - saved) };
                });
                dispatch(gameActions.removeItems(actualConsumed));
            }

            // Roll for success on each tick
            let successfulTicks = 0;
            for (let i = 0; i < cappedTicks; i++) {
                if (Math.random() <= action.successRate) {
                    successfulTicks++;
                }
            }

            if (successfulTicks > 0 && activeTask.skillId) {
                const skillId = activeTask.skillId as SkillId;
                const totalXP = action.xpPerTick * successfulTicks;

                ticksSinceLastEventRef.current += successfulTicks;

                // Random events: roll once per batch (max 1 event per processDelta)
                const canRoll =
                    ticksSinceLastEventRef.current >= RANDOM_EVENT_COOLDOWN_TICKS;
                const bonusXpBySkill: Partial<Record<SkillId, number>> = {};
                if (canRoll && Math.random() < RANDOM_EVENT_CHANCE_BASE * successfulTicks) {
                    const eventType =
                        RANDOM_EVENT_TYPES[Math.floor(Math.random() * RANDOM_EVENT_TYPES.length)];
                    ticksSinceLastEventRef.current = 0;
                    dispatch(gameActions.recordRandomEventTriggered());

                    if (eventType === 'blibbertooth_blessing') {
                        const lvl = activeSkillLevelRef.current;
                        const bonusXp = lvl * BLIBBERTOOTH_XP_MULTIPLIER;
                        bonusXpBySkill[skillId] = (bonusXpBySkill[skillId] ?? 0) + (isPatron ? Math.floor(bonusXp * XP_BONUS_PATRON) : bonusXp);
                        dispatch(gameActions.applyXP({ skillId, xp: bonusXp }));
                        dispatch(
                            gameActions.pushFeedbackToast({
                                type: 'lucky',
                                title: "Blibbertooth's Blessing!",
                                message: `+${bonusXp} bonus XP to ${skillId}.`,
                            })
                        );
                        dispatch(gameActions.pushActivityLog({ type: 'random_event', message: "Blibbertooth's Blessing!", data: { skillId, bonusXp } }));
                        logger.info('Engine', 'RandomEvent: blibbertooth_blessing', { skillId, bonusXp });
                    } else if (eventType === 'cosmic_sneeze') {
                        pendingCosmicSneezeRef.current = true;
                        logger.info('Engine', 'RandomEvent: cosmic_sneeze', { skillId });
                    } else if (eventType === 'genie_gift') {
                        const sk = skillsRef.current;
                        const eligible = (Object.keys(sk) as SkillId[]).filter(
                            (k) => sk[k]?.level && sk[k].level >= 1
                        );
                        const targetSkill = eligible.length > 0
                            ? eligible[Math.floor(Math.random() * eligible.length)]
                            : skillId;
                        const lvl = sk[targetSkill]?.level ?? 1;
                        const bonusXp = lvl * GENIE_XP_MULTIPLIER;
                        bonusXpBySkill[targetSkill] = (bonusXpBySkill[targetSkill] ?? 0) + (isPatron ? Math.floor(bonusXp * XP_BONUS_PATRON) : bonusXp);
                        dispatch(gameActions.applyXP({ skillId: targetSkill, xp: bonusXp }));
                        dispatch(
                            gameActions.pushFeedbackToast({
                                type: 'info',
                                title: "A Genie Appeared!",
                                message: `+${bonusXp} XP to ${targetSkill}.`,
                            })
                        );
                        dispatch(gameActions.pushActivityLog({ type: 'random_event', message: "A Genie Appeared!", data: { targetSkill, bonusXp } }));
                        logger.info('Engine', 'RandomEvent: genie_gift', { targetSkill, bonusXp });
                    } else if (eventType === 'treasure_chest') {
                        const lvl = activeSkillLevelRef.current;
                        const base = TREASURE_GOLD_BASE + lvl * TREASURE_GOLD_PER_LEVEL;
                        const gold = base + Math.floor(Math.random() * base);
                        dispatch(gameActions.addGold(gold));
                        dispatch(
                            gameActions.pushFeedbackToast({
                                type: 'lucky',
                                title: 'Treasure Chest!',
                                message: `+${gold} gold found!`,
                            })
                        );
                        dispatch(gameActions.pushActivityLog({ type: 'random_event', message: 'Treasure Chest!', data: { gold } }));
                        logger.info('Engine', 'RandomEvent: treasure_chest', { gold });
                    } else if (eventType === 'lucky_strike') {
                        const bonusXp = totalXP * (LUCKY_STRIKE_XP_MULTIPLIER - 1);
                        bonusXpBySkill[skillId] = (bonusXpBySkill[skillId] ?? 0) + (isPatron ? Math.floor(bonusXp * XP_BONUS_PATRON) : bonusXp);
                        dispatch(gameActions.applyXP({ skillId, xp: bonusXp }));
                        dispatch(
                            gameActions.pushFeedbackToast({
                                type: 'lucky',
                                title: 'Lucky Strike!',
                                message: `Double XP this tick! +${bonusXp} bonus.`,
                            })
                        );
                        dispatch(gameActions.pushActivityLog({ type: 'random_event', message: 'Lucky Strike!', data: { skillId, bonusXp } }));
                        logger.info('Engine', 'RandomEvent: lucky_strike', { skillId, bonusXp });
                    } else if (eventType === 'goblin_peek') {
                        dispatch(gameActions.recordEnemySeen('enemy_goblin'));
                        dispatch(gameActions.setShowGoblinPeek(true));
                        dispatch(
                            gameActions.pushFeedbackToast({
                                type: 'lucky',
                                title: 'A Goblin!',
                                message: 'It peeked from the shadows... then scurried away. Your first enemy sighting!',
                            })
                        );
                        dispatch(gameActions.pushActivityLog({ type: 'random_event', message: 'A Goblin peeked out!', data: { enemyId: 'enemy_goblin' } }));
                        logger.info('Engine', 'RandomEvent: goblin_peek', { skillId });
                    }
                }

                // Pet Roll
                let rolledPetId: string | null = null;
                for (const [petId, petInfo] of Object.entries(SKILL_PETS)) {
                    if (petInfo.skillId === skillId) {
                        for (let i = 0; i < successfulTicks; i++) {
                            if (Math.random() < petInfo.dropChanceBase) {
                                rolledPetId = petId;
                                break;
                            }
                        }
                    }
                    if (rolledPetId) break;
                }

                if (rolledPetId) {
                    const unlockedPets = playerRef.current.pets?.unlocked || [];
                    if (!unlockedPets.includes(rolledPetId)) {
                        dispatch(gameActions.unlockPet(rolledPetId));
                        const pet = SKILL_PETS[rolledPetId];
                        dispatch(gameActions.pushFeedbackToast({
                            type: 'lucky',
                            title: 'A New Friend!',
                            message: `You found ${pet.name}! Go to Settings to equip it.`
                        }));
                        dispatch(gameActions.pushActivityLog({ type: 'random_event', message: `Found skill pet: ${pet.name}!`, data: { petId: rolledPetId } }));
                        logger.info('Engine', 'Pet Unlocked', { skillId, petId: rolledPetId });
                    }
                }

                dispatch(gameActions.applyXP({ skillId, xp: totalXP }));

                const yieldMult = getMasteryYieldMultiplier(playerRef.current, skillId);
                let items = action.items.map((item) => ({
                    id: item.id,
                    quantity: Math.floor(item.quantity * successfulTicks * yieldMult),
                }));

                // Mastery double-drop: roll per successful tick for bonus items
                const doubleChance = getMasteryDoubleDropChance(playerRef.current, skillId);
                if (doubleChance > 0) {
                    let doubleCount = 0;
                    for (let t = 0; t < successfulTicks; t++) {
                        if (Math.random() < doubleChance) doubleCount++;
                    }
                    if (doubleCount > 0) {
                        items = items.map((item) => ({
                            ...item,
                            quantity: item.quantity + Math.floor((item.quantity / successfulTicks) * doubleCount),
                        }));
                    }
                }

                if (pendingCosmicSneezeRef.current && items.length > 0) {
                    items = items.map((i) => ({ ...i, quantity: i.quantity * 2 }));
                    pendingCosmicSneezeRef.current = false;
                    dispatch(
                        gameActions.pushFeedbackToast({
                            type: 'lucky',
                            title: 'Cosmic Sneeze!',
                            message: 'Your next haul was doubled!',
                        })
                    );
                    dispatch(gameActions.pushActivityLog({ type: 'random_event', message: 'Cosmic Sneeze!' }));
                }
                dispatch(gameActions.addItems(items));

                // Mining rare gem drops (ore nodes only, per ORE_CHAIN_EXPANSION.md)
                const ORE_NODE_IDS = new Set(['copper_ore', 'tin_ore', 'iron_ore', 'coal_ore', 'gold_ore', 'mithril_ore', 'adamantite_ore', 'runite_ore']);
                const GEM_DROPS: { nodeIds: string[]; gemId: string; chance: number }[] = [
                    { nodeIds: ['iron_ore', 'coal_ore', 'gold_ore', 'mithril_ore', 'adamantite_ore', 'runite_ore'], gemId: 'sapphire', chance: 0.02 },
                    { nodeIds: ['coal_ore', 'gold_ore', 'mithril_ore', 'adamantite_ore', 'runite_ore'], gemId: 'emerald', chance: 0.015 },
                    { nodeIds: ['mithril_ore', 'adamantite_ore', 'runite_ore'], gemId: 'ruby', chance: 0.01 },
                    { nodeIds: ['adamantite_ore', 'runite_ore'], gemId: 'diamond', chance: 0.005 },
                ];
                if (skillId === 'mining' && ORE_NODE_IDS.has(activeTask.actionId)) {
                    const gemItems: { id: string; quantity: number }[] = [];
                    for (let t = 0; t < successfulTicks; t++) {
                        for (const drop of GEM_DROPS) {
                            if (drop.nodeIds.includes(activeTask.actionId) && Math.random() < drop.chance) {
                                gemItems.push({ id: drop.gemId, quantity: 1 });
                            }
                        }
                    }
                    if (gemItems.length > 0) {
                        const combined: Record<string, number> = {};
                        for (const g of gemItems) {
                            combined[g.id] = (combined[g.id] ?? 0) + g.quantity;
                        }
                        const gemEntries = Object.entries(combined).map(([id, qty]) => ({ id, quantity: qty }));
                        dispatch(gameActions.addItems(gemEntries));
                        if (accumulator) {
                            for (const item of gemEntries) {
                                const existing = accumulator.itemsGained.find((i) => i.id === item.id);
                                if (existing) existing.quantity += item.quantity;
                                else accumulator.itemsGained.push({ ...item });
                            }
                        }
                    }
                }

                onTickCompleteRef.current?.(skillId);

                // If accumulating for an offline report, add effective XP (reducer applies Patron multiplier)
                if (accumulator) {
                    const effectiveXp = isPatron ? Math.floor(totalXP * XP_BONUS_PATRON) : totalXP;
                    accumulator.xpGained[skillId] = (accumulator.xpGained[skillId] ?? 0) + effectiveXp;
                    for (const [sid, xp] of Object.entries(bonusXpBySkill)) {
                        accumulator.xpGained[sid as SkillId] = (accumulator.xpGained[sid as SkillId] ?? 0) + xp;
                    }
                    for (const item of items) {
                        const existing = accumulator.itemsGained.find((i) => i.id === item.id);
                        if (existing) existing.quantity += item.quantity;
                        else accumulator.itemsGained.push({ ...item });
                    }
                }
            }
        },
        [activeTask, dispatch, isPatron]
    );

    // Independent polling interval for quest auto-completion (every 1s)
    useEffect(() => {
        if (!isLoaded) return;
        const intervalId = setInterval(() => {
            const steps = getQuestStepsToComplete(playerRef.current, ALL_QUESTS);
            steps.forEach(({ questId, stepId }) => {
                dispatch(gameActions.completeQuestStep({ questId, stepId }));
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [isLoaded, dispatch]);

    // Main game loop interval
    useEffect(() => {
        if ((!activeTask && !activeCombat) || !isLoaded) return;

        lastTickRef.current = Date.now();

        const intervalId = setInterval(() => {
            const now = Date.now();
            const delta = now - lastTickRef.current;
            lastTickRef.current = now;
            if (activeTask) processDelta(delta);
            // Combat ticks run independently of skilling
            if (playerRef.current.activeCombat) {
                dispatch(gameActions.processCombatTick({ deltaMs: delta }));
            }
        }, TICK_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [activeTask, activeCombat, isLoaded, processDelta, dispatch]);

    // Handle initial offline catch-up when app loads
    useEffect(() => {
        if (isLoaded && !hasProcessedOfflineRef.current && activeTask) {
            hasProcessedOfflineRef.current = true;

            const now = Date.now();
            let elapsed = now - lastSaveTimestamp;

            const CAP_MS = isPatron ? OFFLINE_CAP_PATRON_MS : OFFLINE_CAP_F2P_MS;
            if (elapsed > CAP_MS) {
                elapsed = CAP_MS;
            }

            if (elapsed > 1000) {
                const wasCapped = (now - lastSaveTimestamp) > CAP_MS;
                const report: OfflineReport = {
                    elapsedMs: elapsed,
                    xpGained: {},
                    itemsGained: [],
                    wasCapped,
                    capLabel: wasCapped ? (isPatron ? '7 days (Patron)' : '24h (F2P limit)') : undefined,
                };
                processDelta(elapsed, report);
                dispatch(gameActions.setOfflineReport(report));
                logger.info('Engine', `Caught up ${Math.floor(elapsed / 1000)}s. Items: ${report.itemsGained.length}`);
            }
        }
    }, [isLoaded, activeTask, lastSaveTimestamp, processDelta, isPatron]);

    // Handle app going to background / foreground
    useEffect(() => {
        const capMs = isPatron ? OFFLINE_CAP_PATRON_MS : OFFLINE_CAP_F2P_MS;
        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                if (
                    appStateRef.current.match(/inactive|background/) &&
                    nextState === 'active'
                ) {
                    const now = Date.now();
                    let offlineDelta = now - lastTickRef.current;
                    if (offlineDelta > capMs) offlineDelta = capMs;
                    if (offlineDelta > 1000) {
                        processDelta(offlineDelta);
                    }
                    lastTickRef.current = now;
                }
                appStateRef.current = nextState;
            }
        );

        return () => subscription.remove();
    }, [processDelta, isPatron]);
}
