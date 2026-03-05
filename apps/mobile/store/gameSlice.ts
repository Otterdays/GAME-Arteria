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
import type { ThemeId } from '@/constants/theme';
import { getMasteryXpMultiplier } from '@/constants/mastery';
import { getItemMeta } from '@/constants/items';
import { logger } from '@/utils/logger';

// ─── Inline types (mirrors @arteria/engine types) ───
// We inline these so the mobile app doesn't need to resolve
// the workspace package at compile time immediately.
// TODO: reference @arteria/engine directly once monorepo linking is configured

export type SkillId =
    | 'mining'
    | 'logging'
    | 'fishing'
    | 'runecrafting'
    | 'harvesting'
    | 'scavenging'
    | 'cooking'
    | 'smithing'
    | 'forging'
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

export interface ActiveTask {
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
    /** Story progression, quests, and flags */
    narrative: {
        flags: string[];
        activeQuests: Record<string, string[]>;
        completedQuests: string[];
    };
    /** Standard version tracking for Update Board (e.g. "0.2.7") */
    lastSeenVersion?: string;
    /** UI preferences (persisted with save) */
    settings?: {
        bankPulseEnabled?: boolean;
        horizonHudEnabled?: boolean;
        sfxEnabled?: boolean;
        bgmEnabled?: boolean;
        /** Patron's Pack — 7d offline cap, 100 slots, +20% XP, badge */
        isPatron?: boolean;
        /** Ask before switching to a different task when one is already active */
        confirmTaskSwitch?: boolean;
        /** After 5 min no touch, show true-black dim overlay to save battery */
        batterySaverEnabled?: boolean;
        /** Notify when player gains a level (local notification) */
        notifyLevelUp?: boolean;
        /** Notify when a task completes (e.g. crafting; local notification) */
        notifyTaskComplete?: boolean;
        /** Notify when offline progression cap is reached */
        notifyIdleCapReached?: boolean;
        /** Idle soundscapes (ambient loops per skill screen) */
        idleSoundscapesEnabled?: boolean;
        /** UI theme: system, dark, light, sepia. [TRACE: DOCU/THEMING.md] */
        themeId?: ThemeId;
    };
    /** Easter egg: "Don't Push This" press count. At 1000 unlocks title "The Stubborn". */
    dontPushCount?: number;
    /** Unlocked display titles (e.g. "The Stubborn") */
    unlockedTitles?: string[];
    /** Random events: cooldown and completion tracking for frequency tuning. */
    randomEvents?: {
        lastTriggeredAt: number;
        ticksSinceLastEvent: number;
        completedCount: number;
    };
    /** Mastery: unspent points per skill (earned 1 per level-up). */
    masteryPoints?: Partial<Record<SkillId, number>>;
    /** Mastery: purchased upgrade levels per skill (e.g. mining: { xp_bonus: 2 }). */
    masterySpent?: Partial<Record<SkillId, Record<string, number>>>;
    /** Detailed stats: by item type (ore, log, fish, rune, bar, equipment, other), first/last play. */
    stats?: {
        byType: Partial<Record<string, number>>;
        firstPlayedAt: number;
        lastPlayedAt: number;
    };
    /** Daily (radiant) quests: reset at midnight; list of 3 with progress and rewards. */
    dailyQuests?: {
        resetAt: number;
        quests: Array<{
            id: string;
            templateId: string;
            label: string;
            objective: { type: 'gather'; itemId: string; quantity: number };
            current: number;
            rewardGold: number;
            rewardLumina?: number;
            completed: boolean;
        }>;
    };
    /** Custom bank tabs: user-created tabs with name, emoji, and assigned item IDs. */
    customBankTabs?: Array<{ id: string; name: string; emoji: string; itemIds: string[] }>;
    /** Item IDs the player has marked as junk (for "Sell All Junk"). */
    junkItemIds?: string[];
    /** Login bonus: last claim date (YYYY-MM-DD), consecutive day count (1–7). */
    loginBonus?: { lastClaimDate: string | null; consecutiveDays: number };
    /** Premium currency (Lumina). Earned from login bonus day 7, future shop. */
    lumina?: number;
    /** Bestiary: enemy IDs the player has spotted (e.g. goblin_peek adds enemy_goblin). */
    seenEnemies?: string[];
    /** Skill pets unlocked and active. */
    pets?: {
        activePetId: string | null;
        unlocked: string[];
    };
}

// ─── Helpers ───

const ALL_SKILLS: SkillId[] = [
    'mining', 'logging', 'fishing', 'runecrafting', 'harvesting', 'scavenging', 'cooking', 'smithing', 'forging',
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
        name: '',
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
        narrative: {
            flags: [],
            activeQuests: {},
            completedQuests: [],
        },
        masteryPoints: {},
        masterySpent: {},
        settings: {
            bankPulseEnabled: true,
            horizonHudEnabled: true,
            sfxEnabled: true,
            bgmEnabled: true,
            isPatron: false,
            confirmTaskSwitch: false,
            batterySaverEnabled: false,
            notifyLevelUp: true,
            notifyTaskComplete: true,
            notifyIdleCapReached: true,
            idleSoundscapesEnabled: false,
            themeId: 'dark' as ThemeId,
        },
        dontPushCount: 0,
        unlockedTitles: [],
        randomEvents: {
            lastTriggeredAt: 0,
            ticksSinceLastEvent: 0,
            completedCount: 0,
        },
        stats: {
            byType: {},
            firstPlayedAt: Date.now(),
            lastPlayedAt: Date.now(),
        },
        customBankTabs: [],
        junkItemIds: [],
        loginBonus: { lastClaimDate: null, consecutiveDays: 0 },
        lumina: 0,
        seenEnemies: [],
        pets: { activePetId: null, unlocked: [] },
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
        confirmTaskSwitch: saved.settings?.confirmTaskSwitch ?? false,
        batterySaverEnabled: saved.settings?.batterySaverEnabled ?? false,
        notifyLevelUp: saved.settings?.notifyLevelUp ?? true,
        notifyTaskComplete: saved.settings?.notifyTaskComplete ?? true,
        notifyIdleCapReached: saved.settings?.notifyIdleCapReached ?? true,
        idleSoundscapesEnabled: saved.settings?.idleSoundscapesEnabled ?? false,
        themeId: (saved.settings?.themeId as ThemeId) ?? 'dark',
    };

    // Ensure narrative structure exists on older saves
    const narrative = saved.narrative ?? {
        flags: [],
        activeQuests: {},
        completedQuests: [],
    };

    const dontPushCount = saved.dontPushCount ?? 0;
    const unlockedTitles = saved.unlockedTitles ?? [];
    const randomEvents = saved.randomEvents ?? {
        lastTriggeredAt: 0,
        ticksSinceLastEvent: 0,
        completedCount: 0,
    };
    const masteryPoints = saved.masteryPoints ?? {};
    const masterySpent = saved.masterySpent ?? {};
    const stats = saved.stats ?? { byType: {}, firstPlayedAt: saved.lastSaveTimestamp ?? Date.now(), lastPlayedAt: Date.now() };
    const customBankTabs = saved.customBankTabs ?? [];
    const junkItemIds = saved.junkItemIds ?? [];
    const loginBonus = saved.loginBonus ?? { lastClaimDate: null, consecutiveDays: 0 };
    const lumina = saved.lumina ?? 0;
    const name = saved.name ?? '';
    const seenEnemies = saved.seenEnemies ?? [];
    const pets = saved.pets ?? { activePetId: null, unlocked: [] };
    return { ...saved, name, skills: skills as Record<SkillId, SkillState>, settings, narrative, dontPushCount, unlockedTitles, randomEvents, masteryPoints, masterySpent, stats, customBankTabs, junkItemIds, loginBonus, lumina, seenEnemies, pets };
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

/** Activity log entry — random events, level-ups, skill happenings. [TRACE: User request] */
export type ActivityLogType = 'random_event' | 'level_up' | 'skill_start';

export interface ActivityLogEntry {
    id: string;
    timestamp: number;
    type: ActivityLogType;
    message: string;
    data?: Record<string, unknown>;
}

/** In-game feedback toast (replaces Alert for locked, no essence, etc.) */
export type FeedbackToastType = 'locked' | 'warning' | 'error' | 'info' | 'lucky';

export interface FeedbackToastEvent {
    id: string;
    type: FeedbackToastType;
    title: string;
    message: string;
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
    /** Active Dialogue Overlay State */
    activeDialogue: { treeId: string; nodeId: string } | null;
    /** In-game feedback toasts (locked, no essence, etc.) */
    feedbackToastQueue: FeedbackToastEvent[];
    /** Activity log — random events, level-ups, skill starts. Max 50 entries. */
    activityLog: ActivityLogEntry[];
    /** Goblin Peek modal — show goblin artwork when goblin_peek random event fires */
    showGoblinPeek: boolean;
    /** First-time: show nickname entry before starting (no save exists) */
    awaitingNameEntry: boolean;
}

const ACTIVITY_LOG_MAX = 50;

const initialState: GameState = {
    player: createFreshPlayer(),
    isLoaded: false,
    offlineReport: null,
    levelUpQueue: [],
    pulseTab: null,
    lootVacuumQueue: [],
    activeDialogue: null,
    feedbackToastQueue: [],
    activityLog: [],
    showGoblinPeek: false,
    awaitingNameEntry: false,
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
            state.showGoblinPeek = false;
            state.awaitingNameEntry = false;
        },

        /** Start a new game (with optional nickname). Clears awaitingNameEntry. */
        newGame(state, action: PayloadAction<string | undefined>) {
            state.player = createFreshPlayer();
            const nick = (action.payload ?? '').trim();
            state.player.name = nick;
            state.isLoaded = true;
            state.pulseTab = null;
            state.lootVacuumQueue = [];
            state.showGoblinPeek = false;
            state.awaitingNameEntry = false;
        },

        /** Show nickname entry (first-time, no save). */
        setAwaitingNameEntry(state, action: PayloadAction<boolean>) {
            state.awaitingNameEntry = action.payload;
        },

        /** Change player nickname (Settings). */
        setPlayerName(state, action: PayloadAction<string>) {
            state.player.name = (action.payload ?? '').trim();
        },

        /** Bestiary: record that the player has spotted an enemy. */
        recordEnemySeen(state, action: PayloadAction<string>) {
            const ids = state.player.seenEnemies ?? [];
            if (!ids.includes(action.payload)) {
                state.player.seenEnemies = [...ids, action.payload];
            }
        },

        /** Set the active task */
        startTask(state, action: PayloadAction<ActiveTask>) {
            state.player.activeTask = action.payload;
            logger.info('Analytics', 'skill_started', {
                skillId: action.payload.skillId,
                actionId: action.payload.actionId,
            });
            if (action.payload.skillId) {
                state.activityLog = state.activityLog ?? [];
                state.activityLog.unshift({
                    id: Math.random().toString(36).substring(7),
                    timestamp: Date.now(),
                    type: 'skill_start',
                    message: `Started ${action.payload.actionId} (${action.payload.skillId})`,
                    data: { skillId: action.payload.skillId, actionId: action.payload.actionId },
                });
                if (state.activityLog.length > ACTIVITY_LOG_MAX) {
                    state.activityLog = state.activityLog.slice(0, ACTIVITY_LOG_MAX);
                }
            }
        },

        /** Clear the active task */
        stopTask(state) {
            state.player.activeTask = null;
        },

        /** Apply XP gains from a tick result (auto-computes level). Patron gets +20%. */
        applyXP(state, action: PayloadAction<{ skillId: SkillId; xp: number }>) {
            const { skillId, xp } = action.payload;
            const masteryMult = getMasteryXpMultiplier(state.player, skillId);
            const xpMultiplier = state.player.settings?.isPatron ? XP_BONUS_PATRON : 1;
            const effectiveXp = Math.floor(xp * masteryMult * xpMultiplier);
            const skill = state.player.skills[skillId];
            if (skill) {
                const oldLevel = skill.level;
                skill.xp += effectiveXp;
                skill.level = levelForXP(skill.xp);

                // If we leveled up, queue a toast, pulse Skills tab, grant mastery points, and log
                if (skill.level > oldLevel) {
                    const levelsGained = skill.level - oldLevel;
                    state.player.masteryPoints = state.player.masteryPoints ?? {};
                    state.player.masteryPoints[skillId] = (state.player.masteryPoints[skillId] ?? 0) + levelsGained;
                    state.levelUpQueue.push({
                        id: Math.random().toString(36).substring(7),
                        skillId,
                        level: skill.level,
                    });
                    state.pulseTab = 'skills';
                    logger.info('Analytics', 'level_up', { skillId, level: skill.level });
                    state.activityLog = state.activityLog ?? [];
                    state.activityLog.unshift({
                        id: Math.random().toString(36).substring(7),
                        timestamp: Date.now(),
                        type: 'level_up',
                        message: `Level ${skill.level} ${skillId}`,
                        data: { skillId, level: skill.level },
                    });
                    if (state.activityLog.length > ACTIVITY_LOG_MAX) {
                        state.activityLog = state.activityLog.slice(0, ACTIVITY_LOG_MAX);
                    }
                }
            }
        },

        /** Spend mastery points on an upgrade. */
        spendMastery(state, action: PayloadAction<{ skillId: SkillId; upgradeId: string; cost: number; maxLevel: number }>) {
            const { skillId, upgradeId, cost, maxLevel } = action.payload;
            state.player.masteryPoints = state.player.masteryPoints ?? {};
            state.player.masterySpent = state.player.masterySpent ?? {};
            const points = state.player.masteryPoints[skillId] ?? 0;
            const spent = state.player.masterySpent[skillId] ?? {};
            const currentLevel = spent[upgradeId] ?? 0;
            if (points >= cost && currentLevel < maxLevel) {
                state.player.masteryPoints[skillId] = points - cost;
                if (!state.player.masterySpent[skillId]) state.player.masterySpent[skillId] = {};
                state.player.masterySpent[skillId]![upgradeId] = currentLevel + 1;
            }
        },

        /** Add items to inventory. V: Respect slot cap. S: Queue loot vacuum (max 5). X: Pulse Bank tab. Stats: increment by item type. */
        addItems(state, action: PayloadAction<InventoryItem[]>) {
            if (state.player.settings?.bankPulseEnabled !== false) {
                state.pulseTab = 'bank';
            }
            const slotCap = state.player.settings?.isPatron ? INVENTORY_SLOT_CAP_PATRON : INVENTORY_SLOT_CAP_F2P;
            if (!state.player.stats) {
                state.player.stats = { byType: {}, firstPlayedAt: Date.now(), lastPlayedAt: Date.now() };
            }
            state.player.stats.lastPlayedAt = Date.now();
            if (!state.player.stats.firstPlayedAt) state.player.stats.firstPlayedAt = Date.now();
            for (const item of action.payload) {
                const existing = state.player.inventory.find((i) => i.id === item.id);
                if (existing) {
                    existing.quantity += item.quantity;
                } else if (state.player.inventory.length < slotCap) {
                    state.player.inventory.push({ ...item });
                }
                const meta = getItemMeta(item.id);
                const t = meta.type;
                state.player.stats.byType[t] = (state.player.stats.byType[t] ?? 0) + item.quantity;
                // Update daily quest progress for gather objectives
                const dqList = state.player.dailyQuests?.quests;
                if (dqList) {
                    for (const q of dqList) {
                        if (q.completed || q.objective.type !== 'gather' || q.objective.itemId !== item.id) continue;
                        q.current = Math.min(q.objective.quantity, q.current + item.quantity);
                    }
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

        /** Remove items from inventory (used by crafting/runecrafting to consume inputs). */
        removeItems(state, action: PayloadAction<{ id: string; quantity: number }[]>) {
            for (const toRemove of action.payload) {
                const item = state.player.inventory.find((i) => i.id === toRemove.id);
                if (item) {
                    item.quantity -= toRemove.quantity;
                }
            }
            // Cleanup zeroed-out entries
            state.player.inventory = state.player.inventory.filter((i) => i.quantity > 0);
        },

        /** Add gold */
        addGold(state, action: PayloadAction<number>) {
            state.player.gold += action.payload;
        },

        /** Mark a version as seen by the user (dismisses Update Board until next bump) */
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

        /** Queue an in-game feedback toast (locked, no essence, etc.) */
        pushFeedbackToast(state, action: PayloadAction<Omit<FeedbackToastEvent, 'id'>>) {
            state.feedbackToastQueue.push({
                ...action.payload,
                id: Math.random().toString(36).substring(7),
            });
        },

        /** Dismiss the oldest feedback toast */
        popFeedbackToast(state) {
            state.feedbackToastQueue.shift();
        },

        /** Push to activity log (random events, level-ups, skill starts). Max 50 entries. */
        pushActivityLog(state, action: PayloadAction<Omit<ActivityLogEntry, 'id' | 'timestamp'>>) {
            const entry: ActivityLogEntry = {
                ...action.payload,
                id: Math.random().toString(36).substring(7),
                timestamp: Date.now(),
            };
            state.activityLog = state.activityLog ?? [];
            state.activityLog.unshift(entry);
            if (state.activityLog.length > ACTIVITY_LOG_MAX) {
                state.activityLog = state.activityLog.slice(0, ACTIVITY_LOG_MAX);
            }
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

        /** Confirm before switching to a different active task (Settings) */
        setConfirmTaskSwitch(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.confirmTaskSwitch = action.payload;
        },

        /** Battery saver: after 5 min no touch, show dim overlay (Settings) */
        setBatterySaverEnabled(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.batterySaverEnabled = action.payload;
        },

        /** Notify on level up (Settings) */
        setNotifyLevelUp(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.notifyLevelUp = action.payload;
        },

        /** Notify on task complete (Settings) */
        setNotifyTaskComplete(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.notifyTaskComplete = action.payload;
        },

        /** Notify when idle cap reached (Settings) */
        setNotifyIdleCapReached(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.notifyIdleCapReached = action.payload;
        },

        /** Idle soundscapes toggle (Settings) — ambient loops per skill */
        setIdleSoundscapesEnabled(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.idleSoundscapesEnabled = action.payload;
        },

        /** Easter egg: "Don't Push This" — at 1000 presses unlock title "The Stubborn" */
        incrementDontPushCount(state) {
            state.player.dontPushCount = (state.player.dontPushCount ?? 0) + 1;
            if (state.player.dontPushCount >= 1000) {
                const titles = state.player.unlockedTitles ?? [];
                if (!titles.includes('The Stubborn')) {
                    state.player.unlockedTitles = [...titles, 'The Stubborn'];
                }
            }
        },

        /** Theme selection (Settings). [TRACE: DOCU/THEMING.md] */
        setThemeId(state, action: PayloadAction<ThemeId>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.themeId = action.payload;
        },

        /** Patron's Pack — mock purchase unlocks 7d offline, 100 slots, +20% XP. [TRACE: Patron's Pack] */
        setPatron(state, action: PayloadAction<boolean>) {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.isPatron = action.payload;
        },

        /** Random events: record trigger for cooldown and frequency tuning. */
        recordRandomEventTriggered(state) {
            if (!state.player.randomEvents) {
                state.player.randomEvents = { lastTriggeredAt: 0, ticksSinceLastEvent: 0, completedCount: 0 };
            }
            const re = state.player.randomEvents;
            re.lastTriggeredAt = Date.now();
            re.ticksSinceLastEvent = 0;
            re.completedCount += 1;
        },

        /** Show Goblin Peek modal (goblin_peek random event). */
        setShowGoblinPeek(state, action: PayloadAction<boolean>) {
            state.showGoblinPeek = action.payload;
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

        // ─── Pets ───

        /** Unlock a new pet */
        unlockPet(state, action: PayloadAction<string>) {
            if (!state.player.pets) {
                state.player.pets = { activePetId: null, unlocked: [] };
            }
            if (!state.player.pets.unlocked.includes(action.payload)) {
                state.player.pets.unlocked.push(action.payload);
            }
        },

        /** Equip or unequip a pet */
        setActivePet(state, action: PayloadAction<string | null>) {
            if (!state.player.pets) {
                state.player.pets = { activePetId: null, unlocked: [] };
            }
            state.player.pets.activePetId = action.payload;
        },

        // ─── Narrative / Quest Actions ───

        /** Add a narrative flag (if not already present) */
        setNarrativeFlag(state, action: PayloadAction<string>) {
            const flag = action.payload;
            if (!state.player.narrative.flags.includes(flag)) {
                state.player.narrative.flags.push(flag);
            }
        },

        /** Start a new quest */
        startQuest(state, action: PayloadAction<string>) {
            const questId = action.payload;
            if (!state.player.narrative.activeQuests[questId]) {
                state.player.narrative.activeQuests[questId] = [];
            }
        },

        /** Mark a specific step of an active quest as completed */
        completeQuestStep(state, action: PayloadAction<{ questId: string; stepId: string }>) {
            const { questId, stepId } = action.payload;
            const questSteps = state.player.narrative.activeQuests[questId];
            if (questSteps && !questSteps.includes(stepId)) {
                questSteps.push(stepId);
            }
        },

        /** Mark a quest as fully completed and remove it from active quests */
        completeQuest(state, action: PayloadAction<string>) {
            const questId = action.payload;
            if (!state.player.narrative.completedQuests.includes(questId)) {
                state.player.narrative.completedQuests.push(questId);
            }
            delete state.player.narrative.activeQuests[questId];
        },

        // ─── Daily Quests ───
        /** Set or replace daily quests (e.g. after reset at midnight). */
        setDailyQuests(state, action: PayloadAction<NonNullable<PlayerState['dailyQuests']>>) {
            state.player.dailyQuests = action.payload;
        },
        /** Update daily quest progress when items are added (called from addItems for matching objective itemId). */
        updateDailyQuestProgress(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
            const { itemId, quantity } = action.payload;
            const dq = state.player.dailyQuests;
            if (!dq?.quests) return;
            for (const q of dq.quests) {
                if (q.completed || q.objective.type !== 'gather' || q.objective.itemId !== itemId) continue;
                q.current = Math.min(q.objective.quantity, q.current + quantity);
            }
        },
        /** Mark a daily quest complete and grant rewards. */
        completeDailyQuest(state, action: PayloadAction<string>) {
            const questId = action.payload;
            const dq = state.player.dailyQuests?.quests.find((q) => q.id === questId);
            if (!dq || dq.completed) return;
            dq.completed = true;
            state.player.gold += dq.rewardGold;
            if (dq.rewardLumina) {
                state.player.lumina = (state.player.lumina ?? 0) + dq.rewardLumina;
            }
        },

        // ─── Stats (detailed stats screen) ───
        /** Update last played timestamp (e.g. on app focus). */
        touchLastPlayed(state) {
            if (state.player.stats) state.player.stats.lastPlayedAt = Date.now();
        },

        // ─── Custom Bank Tabs ───
        addCustomBankTab(state, action: PayloadAction<{ id: string; name: string; emoji: string }>) {
            const tabs = state.player.customBankTabs ?? [];
            state.player.customBankTabs = [...tabs, { ...action.payload, itemIds: [] }];
        },
        removeCustomBankTab(state, action: PayloadAction<string>) {
            state.player.customBankTabs = (state.player.customBankTabs ?? []).filter((t) => t.id !== action.payload);
        },
        assignItemToTab(state, action: PayloadAction<{ tabId: string; itemId: string; add: boolean }>) {
            const { tabId, itemId, add } = action.payload;
            const tab = (state.player.customBankTabs ?? []).find((t) => t.id === tabId);
            if (!tab) return;
            if (add) {
                if (!tab.itemIds.includes(itemId)) tab.itemIds = [...tab.itemIds, itemId];
            } else {
                tab.itemIds = tab.itemIds.filter((id) => id !== itemId);
            }
        },

        // ─── Junk (configurable "Sell All Junk") ───
        toggleJunk(state, action: PayloadAction<string>) {
            const ids = state.player.junkItemIds ?? [];
            const id = action.payload;
            if (ids.includes(id)) {
                state.player.junkItemIds = ids.filter((x) => x !== id);
            } else {
                state.player.junkItemIds = [...ids, id];
            }
        },
        /** Sell all items marked as junk (respects locked). */
        sellAllJunk(state) {
            const junkIds = new Set(state.player.junkItemIds ?? []);
            for (const item of state.player.inventory) {
                if (!junkIds.has(item.id) || item.isLocked) continue;
                const meta = getItemMeta(item.id);
                state.player.gold += item.quantity * meta.sellValue;
                item.quantity = 0;
            }
            state.player.inventory = state.player.inventory.filter((i) => i.quantity > 0);
        },

        // ─── Login Bonus ───
        claimLoginBonus(state, action: PayloadAction<{ gold: number; lumina?: number; day?: number }>) {
            const bonus = state.player.loginBonus ?? { lastClaimDate: null, consecutiveDays: 0 };
            const today = new Date().toISOString().slice(0, 10);
            const day = action.payload.day ?? Math.min(7, bonus.consecutiveDays + 1);
            state.player.loginBonus = { lastClaimDate: today, consecutiveDays: day };
            state.player.gold += action.payload.gold;
            if (action.payload.lumina) {
                state.player.lumina = (state.player.lumina ?? 0) + action.payload.lumina;
            }
        },
        /** Set login bonus streak (e.g. after detecting missed day). */
        setLoginBonusStreak(state, action: PayloadAction<number>) {
            if (!state.player.loginBonus) state.player.loginBonus = { lastClaimDate: null, consecutiveDays: 0 };
            state.player.loginBonus.consecutiveDays = action.payload;
        },

        // ─── Lumina ───
        addLumina(state, action: PayloadAction<number>) {
            state.player.lumina = (state.player.lumina ?? 0) + action.payload;
        },

        // ─── Dialogue Modals ───

        /** Start a dialogue tree */
        startDialogue(state, action: PayloadAction<{ treeId: string; startNodeId: string }>) {
            state.activeDialogue = {
                treeId: action.payload.treeId,
                nodeId: action.payload.startNodeId
            };
        },

        /** Progress to the next dialogue node, or end if 'end' */
        selectDialogueOption(state, action: PayloadAction<string>) {
            if (action.payload === 'end' || action.payload === '') {
                state.activeDialogue = null;
            } else if (state.activeDialogue) {
                state.activeDialogue.nodeId = action.payload;
            }
        },
    },
});

export const gameActions = gameSlice.actions;
