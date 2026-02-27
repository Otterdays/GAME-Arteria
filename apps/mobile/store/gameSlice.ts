/**
 * Game slice — manages the entire player state in Redux.
 *
 * The game engine is a pure-TS calculator; Redux holds the state.
 * This slice provides actions for starting/stopping tasks,
 * processing ticks, and applying offline reports.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

    return { ...saved, skills: skills as Record<SkillId, SkillState> };
}

// ─── Slice ───

export interface OfflineReport {
    elapsedMs: number;
    xpGained: Partial<Record<SkillId, number>>;
    itemsGained: InventoryItem[];
    wasCapped: boolean;
}

export interface LevelUpEvent {
    id: string; // unique ID for the toast
    skillId: SkillId;
    level: number;
}

interface GameState {
    player: PlayerState;
    isLoaded: boolean;
    offlineReport: OfflineReport | null;
    levelUpQueue: LevelUpEvent[];
}

const initialState: GameState = {
    player: createFreshPlayer(),
    isLoaded: false,
    offlineReport: null,
    levelUpQueue: [],
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        /** Load a saved player state */
        loadPlayer(state, action: PayloadAction<PlayerState>) {
            state.player = migratePlayer(action.payload);
            state.isLoaded = true;
        },

        /** Start a new game */
        newGame(state, action: PayloadAction<string | undefined>) {
            state.player = createFreshPlayer();
            if (action.payload) state.player.name = action.payload;
            state.isLoaded = true;
        },

        /** Set the active task */
        startTask(state, action: PayloadAction<ActiveTask>) {
            state.player.activeTask = action.payload;
        },

        /** Clear the active task */
        stopTask(state) {
            state.player.activeTask = null;
        },

        /** Apply XP gains from a tick result (auto-computes level) */
        applyXP(state, action: PayloadAction<{ skillId: SkillId; xp: number }>) {
            const { skillId, xp } = action.payload;
            const skill = state.player.skills[skillId];
            if (skill) {
                const oldLevel = skill.level;
                skill.xp += xp;
                skill.level = levelForXP(skill.xp);

                // If we leveled up, queue a toast!
                if (skill.level > oldLevel) {
                    state.levelUpQueue.push({
                        id: Math.random().toString(36).substring(7),
                        skillId,
                        level: skill.level,
                    });
                }
            }
        },

        /** Add items to inventory */
        addItems(state, action: PayloadAction<InventoryItem[]>) {
            for (const item of action.payload) {
                const existing = state.player.inventory.find((i) => i.id === item.id);
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    state.player.inventory.push({ ...item });
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
    },
});

export const gameActions = gameSlice.actions;
