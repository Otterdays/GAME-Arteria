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
import { gameActions, SkillId, OfflineReport } from '@/store/gameSlice';
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
import { RUNE_ALTARS } from '@/constants/runecrafting';
import { SMELTING_RECIPES } from '@/constants/smithing';
import { FORGING_RECIPES } from '@/constants/forging';
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

const ACTION_DEFS: Record<string, ActionDef> = {};

// Standard gathering nodes
[...MINING_NODES, ...LOGGING_NODES, ...FISHING_SPOTS].forEach((node) => {
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

const TICK_INTERVAL_MS = 100; // Process check every 100ms for smooth progress

export function useGameLoop() {
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

    // Process a delta of time.
    // If accumulator is passed, results are added into it instead of dispatching immediately.
    const processDelta = useCallback(
        (deltaMs: number, accumulator?: OfflineReport) => {
            if (!activeTask) return;

            const action = ACTION_DEFS[activeTask.actionId];
            if (!action) return;

            const interval = activeTask.intervalMs;
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
                // Consume the essence
                dispatch(
                    gameActions.removeItems(
                        action.consumedItems.map((c) => ({ id: c.id, quantity: c.quantity * cappedTicks }))
                    )
                );
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
                                type: 'info',
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
                                type: 'info',
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
                                type: 'info',
                                title: 'Lucky Strike!',
                                message: `Double XP this tick! +${bonusXp} bonus.`,
                            })
                        );
                        dispatch(gameActions.pushActivityLog({ type: 'random_event', message: 'Lucky Strike!', data: { skillId, bonusXp } }));
                        logger.info('Engine', 'RandomEvent: lucky_strike', { skillId, bonusXp });
                    }
                }

                dispatch(gameActions.applyXP({ skillId, xp: totalXP }));

                let items = action.items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity * successfulTicks,
                }));
                if (pendingCosmicSneezeRef.current && items.length > 0) {
                    items = items.map((i) => ({ ...i, quantity: i.quantity * 2 }));
                    pendingCosmicSneezeRef.current = false;
                    dispatch(
                        gameActions.pushFeedbackToast({
                            type: 'info',
                            title: 'Cosmic Sneeze!',
                            message: 'Your next haul was doubled!',
                        })
                    );
                    dispatch(gameActions.pushActivityLog({ type: 'random_event', message: 'Cosmic Sneeze!' }));
                }
                dispatch(gameActions.addItems(items));

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

    // Main game loop interval
    useEffect(() => {
        if (!activeTask || !isLoaded) return;

        lastTickRef.current = Date.now();

        const intervalId = setInterval(() => {
            const now = Date.now();
            const delta = now - lastTickRef.current;
            lastTickRef.current = now;
            processDelta(delta);
        }, TICK_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [activeTask, isLoaded, processDelta]);

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
