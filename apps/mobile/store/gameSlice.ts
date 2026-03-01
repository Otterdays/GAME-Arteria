/**
 * Game slice — manages the entire player state in Redux.
 *
 * The game engine is a pure-TS calculator; Redux holds the state.
 * This slice provides actions for starting/stopping tasks,
 * processing ticks, and applying offline reports.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    INVENTORY_SLOT_CAP_F2P,
    INVENTORY_SLOT_CAP_PATRON,
    XP_BONUS_PATRON,
} from '@/constants/game';
import { logger } from '@/utils/logger';

// ─── Inline types (mirrors @arteria/engine types) ───
// We inline these so the mobile app doesn't need to resolve
// the workspace package at compile time immediately.
// TODO: reference @arteria/engine directly once monorepo linking is configured

export type SkillId =
    | 'mining'
    | 'logging'
    | 'fishing'
    | 'harvesting'
    | 'scavenging'
    | 'cooking'
    | 'smithing'
    | 'crafting'
    | 'farming'
    | 'herblore'
    | 'agility'
    | 'attack'
    | 'strength'
    | 'defence'
    | 'hitpoints';

interface SkillState {
    id: SkillId;
    xp: number;
    level: number;
    mastery: Record<string, number>;
}

export interface InventoryItem {
    id: string;
    quantity: number;
    isLocked?: boolean;
}

type EquipSlot =
    | 'head' | 'body' | 'legs' | 'feet'
    | 'weapon' | 'shield' | 'ring' | 'amulet';

interface CombatStats {
    maxHitpoints: number;
    currentHitpoints: number;
    attackSpeed: number;
    maxHit: number;
    accuracy: number;
    meleeDefence: number;
    rangedDefence: number;
    magicDefence: number;
}

interface ActiveTask {
    type: 'skilling' | 'combat';
    skillId?: SkillId;
    actionId: string;
    intervalMs: number;
    partialTickMs: number;
}

export interface PlayerState {
    name: string;
    skills: Record<SkillId, SkillState>;
    inventory: InventoryItem[];
    equipment: Partial<Record<EquipSlot, string>>;
    gold: number;
    combatStats: CombatStats;
    activeTask: ActiveTask | null;
    lastSaveTimestamp: number;
    /** Standard version tracking for updates modal (e.g. "0.3.0") */
    lastSeenVersion?: string;
    /** UI preferences (persisted with save) */
    settings?: {
        bankPulseEnabled?: boolean;
        horizonHudEnabled?: boolean;
        sfxEnabled?: boolean;
        bgmEnabled?: boolean;
        /** Patron's Pack — 7d offline cap, 100 slots, +20% XP, badge */
        isPatron?: boolean;
    };
}

// ─── Helpers ───

const ALL_SKILLS: SkillId[] = [
    'mining', 'logging', 'fishing', 'harvesting', 'scavenging', 'cooking', 'smithing',
    'crafting', 'farming', 'herblore', 'agility',
    'attack', 'strength', 'defence', 'hitpoints',
];

// Inline XP table for level calculation
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

function createFreshPlayer(): PlayerState {
    const skills = {} as Record<SkillId, SkillState>;
    for (const id of ALL_SKILLS) {
        skills[id] = {
            id,
            xp: id === 'hitpoints' ? 1154 : 0,
            level: id === 'hitpoints' ? 10 : 1,
            mastery: {},
        };
    }
    return {
        name: 'Adventurer',
        skills,
        inventory: [],
        equipment: {},
        gold: 0,
        combatStats: {
            maxHitpoints: 100,
            currentHitpoints: 100,
            attackSpeed: 2400,
            maxHit: 1,
            accuracy: 1,
            meleeDefence: 1,
            rangedDefence: 1,
            magicDefence: 1,
        },
        activeTask: null,
        lastSaveTimestamp: Date.now(),
        settings: { bankPulseEnabled: true, horizonHudEnabled: true, sfxEnabled: true, bgmEnabled: true, isPatron: false },
    };
}

/**
 * Migrates a saved PlayerState to the current schema.
 * - Renames old skill IDs (woodcutting -> logging)
 * - Fills in any missing skills with a fresh level-1 state
 * This prevents crashes when loading an older save after skill additions/renames.
 */
function migratePlayer(saved: PlayerState): PlayerState {
    const skills = { ...saved.skills } as Record<string, SkillState>;

    // Rename legacy skill IDs
    if (skills['woodcutting'] && !skills['logging']) {
        skills['logging'] = { ...skills['woodcutting'], id: 'logging' };
        delete skills['woodcutting'];
    }

    // Ensure every current skill exists (fill missing ones at level 1)
    for (const id of ALL_SKILLS) {
        if (!skills[id]) {
            skills[id] = {
                id,
                xp: id === 'hitpoints' ? 1154 : 0,
                level: id === 'hitpoints' ? 10 : 1,
                mastery: {},
            };
        }
    }

    const settings = {
        bankPulseEnabled: saved.settings?.bankPulseEnabled ?? true,
        horizonHudEnabled: saved.settings?.horizonHudEnabled ?? true,
        sfxEnabled: saved.settings?.sfxEnabled ?? true,
        bgmEnabled: saved.settings?.bgmEnabled ?? true,
        isPatron: saved.settings?.isPatron ?? false,
    };
    return { ...saved, skills: skills as Record<SkillId, SkillState>, settings };
}

// ─── Slice ───

export interface OfflineReport {
    elapsedMs: number;
    xpGained: Partial<Record<SkillId, number>>;
    itemsGained: InventoryItem[];
    wasCapped: boolean;
    /** When wasCapped: "24h (F2P)" or "7 days (Patron)" */
    capLabel?: string;
}

export interface LevelUpEvent {
    id: string; // unique ID for the toast
    skillId: SkillId;
    level: number;
}

export interface LootVacuumEvent {
    id: string;
    itemId: string;
    quantity: number;
}

interface GameState {
    player: PlayerState;
    isLoaded: boolean;
    offlineReport: OfflineReport | null;
    levelUpQueue: LevelUpEvent[];
    /** X. Pulsing Tab Glow — which tab should pulse gold until visited */
    pulseTab: 'skills' | 'bank' | null;
    /** S. Loot Vacuum — queue of items to animate flying to Bank */
    lootVacuumQueue: LootVacuumEvent[];
}

const initialState: GameState = {
    player: createFreshPlayer(),
    isLoaded: false,
    offlineReport: null,
    levelUpQueue: [],
    pulseTab: null,
    lootVacuumQueue: [],
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        /** Load a saved player state */
        loadPlayer(state, action: PayloadAction<PlayerState>) {
            state.player = migratePlayer(action.payload);
            state.isLoaded = true;
            state.pulseTab = null;
            state.lootVacuumQueue = [];
        },

        /** Start a new game */
        newGame(state, action: PayloadAction<string | undefined>) {
            state.player = createFreshPlayer();
            if (action.payload) state.player.name = action.payload;
            state.isLoaded = true;
            state.pulseTab = null;
            state.lootVacuumQueue = [];
        },

        /** Set the active task */
        startTask(state, action: PayloadAction<ActiveTask>) {
            state.player.activeTask = action.payload;
            logger.info('Analytics', 'skill_started', {
                skillId: action.payload.skillId,
                actionId: action.payload.actionId,
            });
        },

        /** Clear the active task */
        stopTask(state) {
            state.player.activeTask = null;
        },

        /** Apply XP gains from a tick result (auto-computes level). Patron gets +20%. */
        applyXP(state, action: PayloadAction<{ skillId: SkillId; xp: number }>) {
            const { skillId, xp } = action.payload;
            const xpMultiplier = state.player.settings?.isPatron ? XP_BONUS_PATRON : 1;
            const effectiveXp = Math.floor(xp * xpMultiplier);
            const skill = state.player.skills[skillId];
            if (skill) {
                const oldLevel = skill.level;
                skill.xp += effectiveXp;
                skill.level = levelForXP(skill.xp);

                // If we leveled up, queue a toast and pulse Skills tab
                if (skill.level > oldLevel) {
                    state.levelUpQueue.push({
                        id: Math.random().toString(36).substring(7),
                        skillId,
                        level: skill.level,
                    });
                    state.pulseTab = 'skills';
                    logger.info('Analytics', 'level_up', { skillId, level: skill.level });
                }
            }
        },

        /** Add items to inventory. V: Respect slot cap. S: Queue loot vacuum (max 5). X: Pulse Bank tab. */
        addItems(state, action: PayloadAction<InventoryItem[]>) {
            if (state.player.settings?.bankPulseEnabled !== false) {
                state.pulseTab = 'bank';
            }
            const slotCap = state.player.settings?.isPatron ? INVENTORY_SLOT_CAP_PATRON : INVENTORY_SLOT_CAP_F2P;
            for (const item of action.payload) {
                const existing = state.player.inventory.find((i) => i.id === item.id);
                if (existing) {
                    existing.quantity += item.quantity;
                } else if (state.player.inventory.length < slotCap) {
                    state.player.inventory.push({ ...item });
                }
                if (state.lootVacuumQueue.length < 5) {
                    state.lootVacuumQueue.push({
                        id: Math.random().toString(36).substring(7),
                        itemId: item.id,
                        quantity: item.quantity,
                    });
                }
            }
        },

        /** Update the partial tick progress */
        updatePartialTick(state, action: PayloadAction<number>) {
            if (state.player.activeTask) {
                state.player.activeTask.partialTickMs = action.payload;
            }
        },

        /** Update the save timestamp */
        updateSaveTimestamp(state) {
            state.player.lastSaveTimestamp = Date.now();
        },

        /** Add gold */
        addGold(state, action: PayloadAction<number>) {
            state.player.gold += action.payload;
        },

        /** Mark a version as seen by the user (clears updates modal) */
        updateSeenVersion(state, action: PayloadAction<string>) {
            state.player.lastSeenVersion = action.payload;
        },

        /** Store the offline catchup report so the WYWA modal can display it */
        setOfflineReport(state, action: PayloadAction<OfflineReport>) {
            state.offlineReport = action.payload;
        },

        /** Clear the offline report once the player has dismissed the modal */
        clearOfflineReport(state) {
            state.offlineReport = null;
        },

        /** Dismiss the oldest level up toast */
        popLevelUp(state) {
            state.levelUpQueue.shift();
        },

        /** X. Clear tab pulse when user visits that tab */
        clearPulseTab(state, action: PayloadAction<'skills' | 'bank'>) {
            if (state.pulseTab === action.payload) state.pulseTab = null;
        },

        /** Toggle Bank tab pulse on loot (Settings) */
        setBankPulseEnabled(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.bankPulseEnabled = action.payload;
        },

        /** Toggle Horizon HUD (Settings) */
        setHorizonHudEnabled(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.horizonHudEnabled = action.payload;
        },

        /** Toggle SFX (Settings) — placeholder, no-op for now */
        setSfxEnabled(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.sfxEnabled = action.payload;
        },

        /** Toggle BGM (Settings) — placeholder, no-op for now */
        setBgmEnabled(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.bgmEnabled = action.payload;
        },

        /** Patron's Pack — mock purchase unlocks 7d offline, 100 slots, +20% XP. [TRACE: Patron's Pack] */
        setPatron(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.isPatron = action.payload;
        },

        /** S. Remove completed loot vacuum animation */
        popLootVacuum(state, action: PayloadAction<string>) {
            state.lootVacuumQueue = state.lootVacuumQueue.filter((e) => e.id !== action.payload);
        },

        /** Sell an item (to Nick / merchant). */
        sellItem(state, action: PayloadAction<{ id: string; quantity: number; pricePer: number }>) {
            const { id, quantity, pricePer } = action.payload;
            const item = state.player.inventory.find(i => i.id === id);
            if (item && !item.isLocked && item.quantity >= quantity) {
                state.player.gold += quantity * pricePer;
                item.quantity -= quantity;
            }
            // Cleanup zero quantities
            state.player.inventory = state.player.inventory.filter(i => i.quantity > 0);
        },

        /** Buy item from Nick's Shop. Respects gold and slot cap. [TRACE: ROADMAP 2.3] */
        buyItem(state, action: PayloadAction<{ id: string; quantity: number; totalCost: number }>) {
            const { id, quantity, totalCost } = action.payload;
            if (state.player.gold < totalCost || quantity < 1) return;
            const slotCap = state.player.settings?.isPatron ? INVENTORY_SLOT_CAP_PATRON : INVENTORY_SLOT_CAP_F2P;
            const existing = state.player.inventory.find((i) => i.id === id);
            const needNewSlot = !existing && state.player.inventory.length >= slotCap;
            if (needNewSlot) return;
            state.player.gold -= totalCost;
            if (existing) {
                existing.quantity += quantity;
            } else {
                state.player.inventory.push({ id, quantity });
            }
        },

        /** Toggle item lock state */
        toggleItemLock(state, action: PayloadAction<string>) {
            const item = state.player.inventory.find((i) => i.id === action.payload);
            if (item) {
                item.isLocked = !item.isLocked;
            }
        },
    },
});

export const gameActions = gameSlice.actions;
