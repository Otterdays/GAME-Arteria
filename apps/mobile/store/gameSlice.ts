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
import { PRAYER_MAP } from '@/constants/prayers';

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
    | 'thieving'
    | 'fletching'
    | 'tailoring'
    | 'prayer'
    | 'construction'
    | 'leadership'
    | 'adventure'
    | 'dungeoneering'
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

export type EquipSlot =
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

/** Tracks an active auto-combat encounter. */
export interface ActiveCombat {
    enemyId: string;
    enemyName: string;
    enemyMaxHp: number;
    enemyCurrentHp: number;
    enemyAttack: number;
    enemyDefense: number;
    enemyAccuracy: number;
    enemyAttackSpeed: number;
    /** ms elapsed toward the player's next attack */
    playerAttackTimerMs: number;
    /** ms elapsed toward the enemy's next attack */
    enemyAttackTimerMs: number;
    /** Kills this session (for this enemy type) */
    killCount: number;
    /** Zone the player is fighting in */
    zoneId: string;
    /** Combat style determines XP distribution */
    combatStyle: CombatStyle;
}

/** Combat style determines how combat XP is distributed. */
export type CombatStyle = 'controlled' | 'aggressive' | 'defensive' | 'accurate';

export interface CombatLogEntry {
    id: number;
    message: string;
    type: 'player_hit' | 'enemy_hit' | 'player_miss' | 'enemy_miss' | 'kill' | 'loot' | 'died' | 'info';
    timestamp: number;
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
        /** Vibration/Haptics toggle */
        vibrationEnabled?: boolean;
        /** Screen shake effects during skilling */
        shakeEffectsEnabled?: boolean;
        /** Floating XP popups when gaining XP */
        floatingXpEnabled?: boolean;
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
    /** Mini-spec at level 25: 1 of 3 chosen per skill. */
    miniSpecs?: Partial<Record<SkillId, string>>;
    /** Full specialization at level 50: 1 of 3 chosen per skill. */
    specializations?: Partial<Record<SkillId, string>>;
    /** Unlocked synergy combos (5 combos, tracked by ID). */
    unlockedSynergies?: string[];
    /** Transcendence count per skill (visual 99★N). */
    transcendences?: Partial<Record<SkillId, number>>;
    /** Is skill transcended (XP curve flattened for this skill)? */
    isTranscended?: Partial<Record<SkillId, boolean>>;
    /** Item mastery: track totalCrafted, masteryTier, isPerfect per item. */
    itemMastery?: Partial<Record<string, {
        totalCrafted: number;
        masteryTier: number; // 0-4
        isPerfect: boolean;
    }>>;
    /** Account-wide Cosmic Weight: +0.25% XP per transcendence (global buff). */
    cosmicWeightXPBonus?: number;
    /** Detailed stats: by item type (ore, log, fish, rune, bar, equipment, other), first/last play. */
    stats?: {
        byType: Partial<Record<string, number>>;
        firstPlayedAt: number;
        lastPlayedAt: number;
    };
    /** Lifetime combat and economy stats (v0.5.2+) */
    lifetimeStats?: {
        enemiesDefeated: number;     // total kill count across all sessions
        totalGoldEarned: number;     // gold earned from ALL sources (combat, quests, sell, login)
        totalDeaths: number;         // how many times player has died in combat
        highestHit: number;          // highest single hit landed on an enemy
        totalItemsProduced: number;  // total crafted/smelted/cooked/brewed items
        /** Per-item produced count: { 'bronze_bar': 42, 'cooked_shrimp': 17, ... } */
        byItem: Partial<Record<string, number>>;
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
    /** Custom bank tabs: user-created tabs with name, emoji, and assigned item IDs. Max 6 (OSRS-style). */
    customBankTabs?: Array<{ id: string; name: string; emoji: string; itemIds: string[] }>;
    /** Last selected bank tab id ('main' or custom tab id). Restored on next open. */
    lastBankTab?: string;
    /** Item IDs the player has marked as junk (for "Sell All Junk"). */
    junkItemIds?: string[];
    /** Login bonus: last claim date (YYYY-MM-DD), consecutive_day_count (1–7). */
    loginBonus?: { lastClaimDate: string | null; consecutiveDays: number };
    /** Premium currency (Lumina). Earned from login bonus day 7, Lumina Shop. */
    lumina?: number;
    /** Lumina Shop: rerolls used today (resets at midnight). */
    luminaShopRerollsUsedToday?: number;
    /** Lumina Shop: date of last reroll use. */
    luminaShopRerollDate?: string;
    /** XP boost from Lumina Shop: expires at timestamp. */
    xpBoostExpiresAt?: number;
    /** Bestiary: enemy IDs the player has spotted (e.g. goblin_peek adds enemy_goblin). */
    seenEnemies?: string[];
    /** Skill pets unlocked and active. */
    pets?: {
        activePetId: string | null;
        unlocked: string[];
    };
    /** All-time count of daily quests claimed (for display on Quests screen). */
    totalDailyQuestsCompleted?: number;
    /** Active auto-combat encounter state. null = not fighting. */
    activeCombat?: ActiveCombat | null;
    /** Prayer points: drained while prayers are active in combat. */
    prayerPoints?: number;
    /** Maximum prayer points based on Prayer level. */
    maxPrayerPoints?: number;
    /** Currently active prayer IDs. */
    activePrayers?: string[];
}

// ─── Helpers ───

const ALL_SKILLS: SkillId[] = [
    'mining', 'logging', 'fishing', 'runecrafting', 'harvesting', 'scavenging', 'cooking', 'smithing', 'forging',
    'crafting', 'farming', 'herblore', 'agility', 'thieving', 'fletching', 'tailoring', 'prayer', 'construction', 'leadership', 'adventure', 'dungeoneering',
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
            vibrationEnabled: true,
            shakeEffectsEnabled: true,
            floatingXpEnabled: true,
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
        lifetimeStats: {
            enemiesDefeated: 0,
            totalGoldEarned: 0,
            totalDeaths: 0,
            highestHit: 0,
            totalItemsProduced: 0,
            byItem: {},
        },
        customBankTabs: [],
        lastBankTab: 'main',
        junkItemIds: [],
        loginBonus: { lastClaimDate: null, consecutiveDays: 0 },
        lumina: 0,
        seenEnemies: [],
        pets: { activePetId: null, unlocked: [] },
        totalDailyQuestsCompleted: 0,
        prayerPoints: 10,
        maxPrayerPoints: 10,
        activePrayers: [],
    };
}

export function recalculateCombatStats(player: PlayerState): void {
    const hpLevel = player.skills['hitpoints']?.level ?? 10;
    const strLevel = player.skills['strength']?.level ?? 1;
    const attLevel = player.skills['attack']?.level ?? 1;
    const defLevel = player.skills['defence']?.level ?? 1;

    let maxHit = Math.floor(strLevel / 10) + 1;
    let accuracy = attLevel;
    let meleeDefence = defLevel;
    let rangedDefence = defLevel;
    let magicDefence = defLevel;
    let attackSpeed = 2400; // Unarmed speed

    // Sum equipment stats
    for (const slotKey in player.equipment) {
        const slot = slotKey as EquipSlot;
        const itemId = player.equipment[slot];
        if (!itemId) continue;
        const meta = getItemMeta(itemId);
        if (meta && meta.equipmentStats) {
            const stats = meta.equipmentStats;
            if (stats.maxHit) maxHit += stats.maxHit;
            if (stats.accuracy) accuracy += stats.accuracy;
            if (stats.meleeDefence) meleeDefence += stats.meleeDefence;
            if (stats.rangedDefence) rangedDefence += stats.rangedDefence;
            if (stats.magicDefence) magicDefence += stats.magicDefence;
            if (slot === 'weapon' && stats.attackSpeed) {
                attackSpeed = stats.attackSpeed;
            }
        }
    }

    const maxHp = hpLevel * 10;

    player.combatStats.maxHitpoints = maxHp;
    if (player.combatStats.currentHitpoints > maxHp) {
        player.combatStats.currentHitpoints = maxHp;
    }
    player.combatStats.maxHit = maxHit;
    player.combatStats.accuracy = accuracy;
    player.combatStats.meleeDefence = meleeDefence;
    player.combatStats.rangedDefence = rangedDefence;
    player.combatStats.magicDefence = magicDefence;
    player.combatStats.attackSpeed = attackSpeed;
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
        vibrationEnabled: saved.settings?.vibrationEnabled ?? true,
        shakeEffectsEnabled: saved.settings?.shakeEffectsEnabled ?? true,
        floatingXpEnabled: saved.settings?.floatingXpEnabled ?? true,
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
    const lastBankTab = saved.lastBankTab ?? 'main';
    const junkItemIds = saved.junkItemIds ?? [];
    const loginBonus = saved.loginBonus ?? { lastClaimDate: null, consecutiveDays: 0 };
    const lumina = saved.lumina ?? 0;
    const luminaShopRerollsUsedToday = saved.luminaShopRerollsUsedToday ?? 0;
    const luminaShopRerollDate = saved.luminaShopRerollDate;
    const xpBoostExpiresAt = saved.xpBoostExpiresAt;
    const name = saved.name ?? '';
    const seenEnemies = saved.seenEnemies ?? [];
    const pets = saved.pets ?? { activePetId: null, unlocked: [] };
    const totalDailyQuestsCompleted = saved.totalDailyQuestsCompleted ?? 0;
    const lifetimeStats = saved.lifetimeStats ?? {
        enemiesDefeated: 0,
        totalGoldEarned: 0,
        totalDeaths: 0,
        highestHit: 0,
        totalItemsProduced: 0,
        byItem: {},
    };

    // Migrate legacy *_sword items to *_shortsword (weapon expansion: sword → shortsword, longsword, scimitar, 2h_longblade)
    const inventory = (saved.inventory ?? []).map((item) => {
        if (item.id.endsWith('_sword') && !['raw_swordfish', 'cooked_swordfish'].includes(item.id)) {
            return { ...item, id: item.id.replace(/_sword$/, '_shortsword') };
        }
        return item;
    });

    const migrated = { ...saved, name, skills: skills as Record<SkillId, SkillState>, settings, narrative, dontPushCount, unlockedTitles, randomEvents, masteryPoints, masterySpent, stats, lifetimeStats, customBankTabs, lastBankTab, junkItemIds, loginBonus, lumina, luminaShopRerollsUsedToday, luminaShopRerollDate, xpBoostExpiresAt, seenEnemies, pets, totalDailyQuestsCompleted, inventory };
    recalculateCombatStats(migrated);
    return migrated;
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

/** Activity log entry — random events, level-ups, skill happenings, daily quest claims. [TRACE: User request] */
export type ActivityLogType = 'random_event' | 'level_up' | 'skill_start' | 'daily_quest_complete';

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
    /** Combat log — scrolling messages from auto-battler */
    combatLog: CombatLogEntry[];
}

const ACTIVITY_LOG_MAX = 50;
const COMBAT_LOG_MAX = 40;
let combatLogIdCounter = 0;

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
    combatLog: [],
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

        /** Equip an item into its designated slot. */
        equipItem(state, action: PayloadAction<{ itemId: string }>) {
            const meta = getItemMeta(action.payload.itemId);
            if (!meta || meta.type !== 'equipment' || !meta.equipSlot) return;

            const slot = meta.equipSlot as EquipSlot;

            const inventoryIndex = state.player.inventory.findIndex(i => i.id === action.payload.itemId);
            if (inventoryIndex === -1) return;
            const inventoryItem = state.player.inventory[inventoryIndex];

            // Remove from inventory
            inventoryItem.quantity -= 1;
            if (inventoryItem.quantity <= 0) {
                state.player.inventory.splice(inventoryIndex, 1);
            }

            // If something is already equipped in this slot, return it
            const currentlyEquipped = state.player.equipment[slot];
            if (currentlyEquipped) {
                const existing = state.player.inventory.find(i => i.id === currentlyEquipped);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    state.player.inventory.push({ id: currentlyEquipped, quantity: 1 });
                }
            }

            // Handle 2H weapons -> unequip shield
            if (slot === 'weapon' && meta.label.includes('2H')) {
                const shield = state.player.equipment['shield'];
                if (shield) {
                    const existingShield = state.player.inventory.find(i => i.id === shield);
                    if (existingShield) {
                        existingShield.quantity += 1;
                    } else {
                        state.player.inventory.push({ id: shield, quantity: 1 });
                    }
                    delete state.player.equipment['shield'];
                }
            }

            // Handle shield -> unequip 2H weapon
            if (slot === 'shield') {
                const weapon = state.player.equipment['weapon'];
                if (weapon) {
                    const wepMeta = getItemMeta(weapon);
                    if (wepMeta.label.includes('2H')) {
                        const existingWeapon = state.player.inventory.find(i => i.id === weapon);
                        if (existingWeapon) {
                            existingWeapon.quantity += 1;
                        } else {
                            state.player.inventory.push({ id: weapon, quantity: 1 });
                        }
                        delete state.player.equipment['weapon'];
                    }
                }
            }

            state.player.equipment[slot] = action.payload.itemId;
            recalculateCombatStats(state.player);
        },

        /** Unequip an item from a specific slot. */
        unequipItem(state, action: PayloadAction<{ slot: EquipSlot }>) {
            const itemId = state.player.equipment[action.payload.slot];
            if (!itemId) return;

            const existing = state.player.inventory.find(i => i.id === itemId);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.player.inventory.push({ id: itemId, quantity: 1 });
            }

            delete state.player.equipment[action.payload.slot];
            recalculateCombatStats(state.player);
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

        /** Apply XP gains from a tick result (auto-computes level). Patron gets +20%. Lumina XP boost +25%. */
        applyXP(state, action: PayloadAction<{ skillId: SkillId; xp: number }>) {
            const { skillId, xp } = action.payload;
            const masteryMult = getMasteryXpMultiplier(state.player, skillId);
            const xpMultiplier = state.player.settings?.isPatron ? XP_BONUS_PATRON : 1;
            const luminaXpBoost = (state.player.xpBoostExpiresAt && state.player.xpBoostExpiresAt > Date.now()) ? 1.25 : 1;
            const effectiveXp = Math.floor(xp * masteryMult * xpMultiplier * luminaXpBoost);
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
                    if (['hitpoints', 'attack', 'strength', 'defence'].includes(skillId)) {
                        recalculateCombatStats(state.player);
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

                // Lifetime Produced Tracking (Non-raw gathering items)
                const isProduced = ['bar', 'food', 'potion', 'rune', 'equipment'].includes(t);
                if (isProduced) {
                    if (!state.player.lifetimeStats) {
                        state.player.lifetimeStats = { enemiesDefeated: 0, totalGoldEarned: 0, totalDeaths: 0, highestHit: 0, totalItemsProduced: 0, byItem: {} };
                    }
                    const ls = state.player.lifetimeStats;
                    ls.totalItemsProduced += item.quantity;
                    ls.byItem[item.id] = (ls.byItem[item.id] ?? 0) + item.quantity;
                }

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
            if (!state.player.lifetimeStats) {
                state.player.lifetimeStats = { enemiesDefeated: 0, totalGoldEarned: 0, totalDeaths: 0, highestHit: 0, totalItemsProduced: 0, byItem: {} };
            }
            state.player.lifetimeStats.totalGoldEarned += action.payload;
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
        setVibrationEnabled: (state, action: PayloadAction<boolean>) => {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.vibrationEnabled = action.payload;
        },
        setShakeEffectsEnabled: (state, action: PayloadAction<boolean>) => {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.shakeEffectsEnabled = action.payload;
        },
        setFloatingXpEnabled: (state, action: PayloadAction<boolean>) => {
            if (!state.player.settings) state.player.settings = {};
            state.player.settings.floatingXpEnabled = action.payload;
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
                const earned = quantity * pricePer;
                state.player.gold += earned;
                if (!state.player.lifetimeStats) {
                    state.player.lifetimeStats = { enemiesDefeated: 0, totalGoldEarned: 0, totalDeaths: 0, highestHit: 0, totalItemsProduced: 0, byItem: {} };
                }
                state.player.lifetimeStats.totalGoldEarned += earned;
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
        /** Mark a daily quest complete and grant rewards. Increment all-time counter and log. */
        completeDailyQuest(state, action: PayloadAction<string>) {
            const questId = action.payload;
            const dq = state.player.dailyQuests?.quests.find((q) => q.id === questId);
            if (!dq || dq.completed) return;
            dq.completed = true;
            state.player.gold += dq.rewardGold;
            if (!state.player.lifetimeStats) {
                state.player.lifetimeStats = { enemiesDefeated: 0, totalGoldEarned: 0, totalDeaths: 0, highestHit: 0, totalItemsProduced: 0, byItem: {} };
            }
            state.player.lifetimeStats.totalGoldEarned += dq.rewardGold;
            if (dq.rewardLumina) {
                state.player.lumina = (state.player.lumina ?? 0) + dq.rewardLumina;
            }
            state.player.totalDailyQuestsCompleted = (state.player.totalDailyQuestsCompleted ?? 0) + 1;
            const entry: ActivityLogEntry = {
                id: Math.random().toString(36).substring(7),
                timestamp: Date.now(),
                type: 'daily_quest_complete',
                message: `Completed: ${dq.label}`,
                data: { questId: dq.id, label: dq.label, rewardGold: dq.rewardGold },
            };
            state.activityLog = state.activityLog ?? [];
            state.activityLog.unshift(entry);
            if (state.activityLog.length > ACTIVITY_LOG_MAX) {
                state.activityLog = state.activityLog.slice(0, ACTIVITY_LOG_MAX);
            }
        },

        // ─── Stats (detailed stats screen) ───
        /** Update last played timestamp (e.g. on app focus). */
        touchLastPlayed(state) {
            if (state.player.stats) state.player.stats.lastPlayedAt = Date.now();
        },

        // ─── Custom Bank Tabs (max 6, OSRS-style) ───
        addCustomBankTab(state, action: PayloadAction<{ id: string; name: string; emoji: string }>) {
            const tabs = state.player.customBankTabs ?? [];
            if (tabs.length >= 6) return;
            state.player.customBankTabs = [...tabs, { ...action.payload, itemIds: [] }];
        },
        /** Create a new tab and assign one item (e.g. long-press "Put in new tab"). Max 6 tabs. */
        addCustomBankTabWithItem(state, action: PayloadAction<{ id: string; name: string; emoji: string; itemId: string }>) {
            const tabs = state.player.customBankTabs ?? [];
            if (tabs.length >= 6) return;
            const { id, name, emoji, itemId } = action.payload;
            state.player.customBankTabs = [...tabs, { id, name, emoji, itemIds: [itemId] }];
        },
        setLastBankTab(state, action: PayloadAction<string>) {
            state.player.lastBankTab = action.payload;
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
                const earned = item.quantity * meta.sellValue;
                state.player.gold += earned;
                if (!state.player.lifetimeStats) {
                    state.player.lifetimeStats = { enemiesDefeated: 0, totalGoldEarned: 0, totalDeaths: 0, highestHit: 0, totalItemsProduced: 0, byItem: {} };
                }
                state.player.lifetimeStats.totalGoldEarned += earned;
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
            if (!state.player.lifetimeStats) {
                state.player.lifetimeStats = { enemiesDefeated: 0, totalGoldEarned: 0, totalDeaths: 0, highestHit: 0, totalItemsProduced: 0, byItem: {} };
            }
            state.player.lifetimeStats.totalGoldEarned += action.payload.gold;
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
        spendLumina(state, action: PayloadAction<number>) {
            const current = state.player.lumina ?? 0;
            if (current >= action.payload) {
                state.player.lumina = current - action.payload;
            }
        },
        /** Track Lumina Shop reroll usage (per day). */
        incrementLuminaRerollsUsed(state) {
            const today = new Date().toISOString().slice(0, 10);
            const stored = state.player.luminaShopRerollDate;
            if (stored !== today) {
                state.player.luminaShopRerollsUsedToday = 1;
                state.player.luminaShopRerollDate = today;
            } else {
                state.player.luminaShopRerollsUsedToday = (state.player.luminaShopRerollsUsedToday ?? 0) + 1;
            }
        },
        /** Set XP boost expiry (Lumina Shop). */
        setXpBoostExpiresAt(state, action: PayloadAction<number>) {
            state.player.xpBoostExpiresAt = action.payload;
        },

        // ─── Combat System ───

        /** Start fighting an enemy. */
        startCombat(state, action: PayloadAction<{ enemyId: string; zoneId: string }>) {
            const { ENEMIES } = require('@/constants/enemies');
            const enemy = ENEMIES[action.payload.enemyId];
            if (!enemy || !enemy.combat) return;

            // Stop any active skilling task
            state.player.activeTask = null;

            state.player.activeCombat = {
                enemyId: enemy.id,
                enemyName: enemy.name,
                enemyMaxHp: enemy.combat.hp,
                enemyCurrentHp: enemy.combat.hp,
                enemyAttack: enemy.combat.attack,
                enemyDefense: enemy.combat.defense,
                enemyAccuracy: enemy.combat.accuracy ?? 0.8,
                enemyAttackSpeed: enemy.combat.attackSpeed ?? 2400,
                playerAttackTimerMs: 0,
                enemyAttackTimerMs: 0,
                killCount: 0,
                zoneId: action.payload.zoneId,
                combatStyle: 'controlled',
            };

            // Record enemy as seen
            const ids = state.player.seenEnemies ?? [];
            if (!ids.includes(enemy.id)) {
                state.player.seenEnemies = [...ids, enemy.id];
            }

            // Clear combat log for fresh fight
            state.combatLog = [];
            combatLogIdCounter = 0;

            // Push initial log entry
            state.combatLog.push({
                id: combatLogIdCounter++,
                message: `You engage ${enemy.name} (Lv. ${enemy.level ?? 1})!`,
                type: 'info',
                timestamp: Date.now(),
            });
        },

        /** Stop combat (flee or manual stop). */
        fleeCombat(state) {
            if (!state.player.activeCombat) return;
            const name = state.player.activeCombat.enemyName;
            state.combatLog.push({
                id: combatLogIdCounter++,
                message: `You fled from ${name}!`,
                type: 'info',
                timestamp: Date.now(),
            });
            state.player.activeCombat = null;
        },

        /** Change combat style (determines XP distribution). */
        setCombatStyle(state, action: PayloadAction<CombatStyle>) {
            if (state.player.activeCombat) {
                state.player.activeCombat.combatStyle = action.payload;
            }
        },

        /** Eat food during combat to heal. Consumes 1 of the given item. */
        eatFood(state, action: PayloadAction<{ itemId: string; healAmount: number }>) {
            const { itemId, healAmount } = action.payload;
            const playerStats = state.player.combatStats;
            if (playerStats.currentHitpoints >= playerStats.maxHitpoints) return; // Already full

            const item = state.player.inventory.find(i => i.id === itemId);
            if (!item || item.quantity <= 0) return;

            // Consume 1
            item.quantity -= 1;
            if (item.quantity <= 0) {
                state.player.inventory = state.player.inventory.filter(i => i.id !== itemId);
            }

            // Heal
            const oldHp = playerStats.currentHitpoints;
            playerStats.currentHitpoints = Math.min(
                playerStats.maxHitpoints,
                playerStats.currentHitpoints + healAmount
            );
            const healed = playerStats.currentHitpoints - oldHp;

            state.combatLog.push({
                id: combatLogIdCounter++,
                message: `You eat ${itemId.replace(/_/g, ' ')} and heal ${healed} HP.`,
                type: 'info',
                timestamp: Date.now(),
            });
        },

        /** Bury a bone to gain prayer experience. */
        buryBone(state, action: PayloadAction<{ itemId: string }>) {
            const { itemId } = action.payload;
            const item = state.player.inventory.find(i => i.id === itemId);
            if (!item || item.quantity <= 0) return;

            // Consume 1 bone
            item.quantity -= 1;
            if (item.quantity <= 0) {
                state.player.inventory = state.player.inventory.filter(i => i.id !== itemId);
            }

            // Grant 15 base prayer XP
            const masteryMult = getMasteryXpMultiplier(state.player, 'prayer');
            const xpMultiplier = state.player.settings?.isPatron ? XP_BONUS_PATRON : 1;
            const luminaXpBoost = (state.player.xpBoostExpiresAt && state.player.xpBoostExpiresAt > Date.now()) ? 1.25 : 1;
            const effectiveXp = Math.floor(15 * masteryMult * xpMultiplier * luminaXpBoost);
            const skill = state.player.skills['prayer'];
            if (skill) {
                const oldLevel = skill.level;
                skill.xp += effectiveXp;
                skill.level = levelForXP(skill.xp);

                if (skill.level > oldLevel) {
                    const levelsGained = skill.level - oldLevel;
                    state.player.masteryPoints = state.player.masteryPoints ?? {};
                    state.player.masteryPoints['prayer'] = (state.player.masteryPoints['prayer'] ?? 0) + levelsGained;
                    state.levelUpQueue.push({ id: Math.random().toString(36).substring(7), skillId: 'prayer', level: skill.level });
                    state.pulseTab = 'skills';
                    // Recalculate max prayer points (level * 10)
                    state.player.maxPrayerPoints = skill.level * 10;
                    state.player.prayerPoints = Math.min(
                        state.player.prayerPoints ?? 0,
                        state.player.maxPrayerPoints
                    );

                    state.activityLog = state.activityLog ?? [];
                    state.activityLog.unshift({
                        id: Math.random().toString(36).substring(7),
                        timestamp: Date.now(),
                        type: 'level_up',
                        message: `Level ${skill.level} prayer`,
                        data: { skillId: 'prayer', level: skill.level },
                    });
                }
            }

            // Restore 1 prayer point per bone buried (capped at max)
            const prayerLvl = state.player.skills['prayer']?.level ?? 1;
            state.player.maxPrayerPoints = prayerLvl * 10;
            state.player.prayerPoints = Math.min(
                (state.player.prayerPoints ?? 0) + 1,
                state.player.maxPrayerPoints
            );

            // Log activity
            state.activityLog = state.activityLog ?? [];
            state.activityLog.unshift({
                id: Math.random().toString(36).substring(7),
                timestamp: Date.now(),
                type: 'skill_start',
                message: `You bury the bones and feel a divine presence... (+1 prayer point)`,
            });
            if (state.activityLog.length > ACTIVITY_LOG_MAX) {
                state.activityLog = state.activityLog.slice(0, ACTIVITY_LOG_MAX);
            }
        },

        /** Toggle a prayer on/off during combat. */
        togglePrayer(state, action: PayloadAction<{ prayerId: string }>) {
            const { prayerId } = action.payload;
            const pDef = PRAYER_MAP[prayerId];
            if (!pDef) return;

            const prayerLevel = state.player.skills['prayer']?.level ?? 1;
            if (prayerLevel < pDef.levelRequired) return;

            state.player.activePrayers = state.player.activePrayers ?? [];

            const idx = state.player.activePrayers.indexOf(prayerId);
            if (idx >= 0) {
                // Deactivate
                state.player.activePrayers.splice(idx, 1);
            } else {
                // Activate — check prayer points
                const pp = state.player.prayerPoints ?? 0;
                if (pp <= 0) return;
                state.player.activePrayers.push(prayerId);
            }
        },
        /** Helper to ensure lifetimeStats exists (internal use in reducers) */
        _ensureLifetimeStats(state: any) {
            if (!state.player.lifetimeStats) {
                state.player.lifetimeStats = {
                    enemiesDefeated: 0,
                    totalGoldEarned: 0,
                    totalDeaths: 0,
                    highestHit: 0,
                    totalItemsProduced: 0,
                    byItem: {},
                };
            }
        },
        /** Process combat tick: called with deltaMs from game loop. */
        processCombatTick(state, action: PayloadAction<{ deltaMs: number }>) {
            const combat = state.player.activeCombat;
            if (!combat) return;

            const { deltaMs } = action.payload;
            const playerStats = state.player.combatStats;
            const playerAttackSpeed = playerStats.attackSpeed || 2400;

            // ── Prayer point drain ──
            const activePrayers = state.player.activePrayers ?? [];
            if (activePrayers.length > 0) {
                let totalDrain = 0;
                for (const pid of activePrayers) {
                    const def = PRAYER_MAP[pid];
                    if (def) totalDrain += def.drainPerTick;
                }
                // drainPerTick is calibrated for 100ms ticks; scale to actual delta
                const scaledDrain = totalDrain * (deltaMs / 100);
                state.player.prayerPoints = Math.max(0, (state.player.prayerPoints ?? 0) - scaledDrain);
                if (state.player.prayerPoints <= 0) {
                    state.player.prayerPoints = 0;
                    state.player.activePrayers = [];
                    state.combatLog.push({
                        id: combatLogIdCounter++,
                        message: 'Your prayer points have been exhausted.',
                        type: 'info',
                        timestamp: Date.now(),
                    });
                }
            }

            // ── Compute prayer bonuses ──
            let prayerAtkBonus = 0;
            let prayerStrBonus = 0;
            let prayerDefBonus = 0;
            let prayerDmgReduction = 0;
            for (const pid of (state.player.activePrayers ?? [])) {
                const def = PRAYER_MAP[pid];
                if (!def) continue;
                prayerAtkBonus += def.bonuses.attackPercent ?? 0;
                prayerStrBonus += def.bonuses.strengthPercent ?? 0;
                prayerDefBonus += def.bonuses.defencePercent ?? 0;
                prayerDmgReduction += def.bonuses.damageReductionPercent ?? 0;
            }
            const enemyAttackSpeed = combat.enemyAttackSpeed || 2400;

            // Accumulate timers
            combat.playerAttackTimerMs += deltaMs;
            combat.enemyAttackTimerMs += deltaMs;

            // --- Helper: apply combat XP properly (mirrors applyXP reducer logic) ---
            const applyCombatXP = (skillId: SkillId, xp: number) => {
                const masteryMult = getMasteryXpMultiplier(state.player, skillId);
                const xpMult = state.player.settings?.isPatron ? XP_BONUS_PATRON : 1;
                const luminaBoost = (state.player.xpBoostExpiresAt && state.player.xpBoostExpiresAt > Date.now()) ? 1.25 : 1;
                const effectiveXp = Math.floor(xp * masteryMult * xpMult * luminaBoost);
                const skill = state.player.skills[skillId];
                if (!skill) return;
                const oldLevel = skill.level;
                skill.xp += effectiveXp;
                skill.level = levelForXP(skill.xp);
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
                    recalculateCombatStats(state.player);
                }
            };

            // --- Player attacks ---
            while (combat.playerAttackTimerMs >= playerAttackSpeed) {
                combat.playerAttackTimerMs -= playerAttackSpeed;

                // Accuracy roll: player accuracy (+ prayer bonus) vs enemy defense
                const boostedAccuracy = playerStats.accuracy * (1 + prayerAtkBonus);
                const hitChance = Math.min(0.95, Math.max(0.05,
                    0.5 + (boostedAccuracy - combat.enemyDefense) * 0.02
                ));
                const hits = Math.random() < hitChance;

                if (hits) {
                    // Damage: 1 to maxHit (+ prayer strength bonus)
                    const boostedMaxHit = Math.max(1, Math.floor(playerStats.maxHit * (1 + prayerStrBonus)));
                    const damage = Math.floor(Math.random() * boostedMaxHit) + 1;
                    combat.enemyCurrentHp -= damage;

                    // Update highest hit
                    if (!state.player.lifetimeStats) {
                        state.player.lifetimeStats = { enemiesDefeated: 0, totalGoldEarned: 0, totalDeaths: 0, highestHit: 0, totalItemsProduced: 0, byItem: {} };
                    }
                    if (damage > (state.player.lifetimeStats.highestHit ?? 0)) {
                        state.player.lifetimeStats.highestHit = damage;
                    }

                    state.combatLog.push({
                        id: combatLogIdCounter++,
                        message: `You hit ${combat.enemyName} for ${damage} damage.`,
                        type: 'player_hit',
                        timestamp: Date.now(),
                    });

                    // Enemy killed?
                    if (combat.enemyCurrentHp <= 0) {
                        combat.killCount += 1;
                        // lifetime stats tracking
                        state.player.lifetimeStats.enemiesDefeated = (state.player.lifetimeStats.enemiesDefeated ?? 0) + 1;

                        state.combatLog.push({
                            id: combatLogIdCounter++,
                            message: `${combat.enemyName} defeated! (Kill #${combat.killCount})`,
                            type: 'kill',
                            timestamp: Date.now(),
                        });

                        // ── Combat XP — style determines distribution ──
                        // Hitpoints always gets 33% of base XP (like OSRS)
                        // The remaining style-specific XP goes to the chosen skill(s)
                        const baseXp = combat.enemyMaxHp;
                        const hpXp = Math.floor(baseXp * 0.33);
                        applyCombatXP('hitpoints', hpXp);

                        switch (combat.combatStyle) {
                            case 'aggressive':
                                // All combat XP → Strength
                                applyCombatXP('strength', baseXp);
                                break;
                            case 'defensive':
                                // All combat XP → Defence
                                applyCombatXP('defence', baseXp);
                                break;
                            case 'accurate':
                                // All combat XP → Attack
                                applyCombatXP('attack', baseXp);
                                break;
                            case 'controlled':
                            default:
                                // Split evenly: attack, strength, defence
                                const third = Math.floor(baseXp / 3);
                                applyCombatXP('attack', third);
                                applyCombatXP('strength', third);
                                applyCombatXP('defence', third);
                                break;
                        }

                        // Loot drops
                        const { ENEMIES } = require('@/constants/enemies');
                        const enemyMeta = ENEMIES[combat.enemyId];
                        if (enemyMeta?.drops) {
                            for (const drop of enemyMeta.drops) {
                                if (Math.random() < drop.chance) {
                                    const qty = drop.minQty + Math.floor(Math.random() * (drop.maxQty - drop.minQty + 1));
                                    const existing = state.player.inventory.find(i => i.id === drop.itemId);
                                    if (existing) {
                                        existing.quantity += qty;
                                    } else {
                                        state.player.inventory.push({ id: drop.itemId, quantity: qty });
                                    }
                                    state.combatLog.push({
                                        id: combatLogIdCounter++,
                                        message: `Loot: ${drop.itemId} x${qty}`,
                                        type: 'loot',
                                        timestamp: Date.now(),
                                    });
                                }
                            }
                        }

                        // Gold drop (enemy HP * 1-3)
                        const goldDrop = Math.floor(combat.enemyMaxHp * (1 + Math.random() * 2));
                        state.player.gold += goldDrop;
                        if (state.player.lifetimeStats) {
                            state.player.lifetimeStats.totalGoldEarned += goldDrop;
                        }
                        state.combatLog.push({
                            id: combatLogIdCounter++,
                            message: `+${goldDrop} gold`,
                            type: 'loot',
                            timestamp: Date.now(),
                        });

                        // HP regen on kill (10% of max)
                        const healAmount = Math.floor(playerStats.maxHitpoints * 0.1);
                        playerStats.currentHitpoints = Math.min(
                            playerStats.maxHitpoints,
                            playerStats.currentHitpoints + healAmount
                        );

                        // Respawn enemy (auto-battler: continuous fighting)
                        combat.enemyCurrentHp = combat.enemyMaxHp;
                        combat.playerAttackTimerMs = 0;
                        combat.enemyAttackTimerMs = 0;
                    }
                } else {
                    state.combatLog.push({
                        id: combatLogIdCounter++,
                        message: `You miss ${combat.enemyName}.`,
                        type: 'player_miss',
                        timestamp: Date.now(),
                    });
                }
            }

            // --- Enemy attacks ---
            while (combat.enemyAttackTimerMs >= enemyAttackSpeed) {
                combat.enemyAttackTimerMs -= enemyAttackSpeed;

                const enemyHitChance = Math.min(0.95, Math.max(0.05,
                    combat.enemyAccuracy - playerStats.meleeDefence * 0.015
                ));
                const enemyHits = Math.random() < enemyHitChance;

                if (enemyHits) {
                    const maxDmg = Math.max(1, combat.enemyAttack);
                    let damage = Math.floor(Math.random() * maxDmg) + 1;
                    // Prayer damage reduction
                    if (prayerDmgReduction > 0) {
                        damage = Math.max(1, Math.floor(damage * (1 - prayerDmgReduction)));
                    }
                    // Prayer defence bonus applies to melee defence check above
                    playerStats.currentHitpoints -= damage;

                    state.combatLog.push({
                        id: combatLogIdCounter++,
                        message: `${combat.enemyName} hits you for ${damage} damage.`,
                        type: 'enemy_hit',
                        timestamp: Date.now(),
                    });

                    // Player dies?
                    if (playerStats.currentHitpoints <= 0) {
                        playerStats.currentHitpoints = playerStats.maxHitpoints; // Respawn at full HP
                        if (state.player.lifetimeStats) {
                            state.player.lifetimeStats.totalDeaths += 1;
                        }
                        state.combatLog.push({
                            id: combatLogIdCounter++,
                            message: 'You have been defeated! Respawning...',
                            type: 'died',
                            timestamp: Date.now(),
                        });
                        // Stop combat on death — deactivate prayers
                        state.player.activeCombat = null;
                        state.player.activePrayers = [];
                        return;
                    }
                } else {
                    state.combatLog.push({
                        id: combatLogIdCounter++,
                        message: `${combat.enemyName} misses you.`,
                        type: 'enemy_miss',
                        timestamp: Date.now(),
                    });
                }
            }

            // Trim combat log
            if (state.combatLog.length > COMBAT_LOG_MAX) {
                state.combatLog = state.combatLog.slice(-COMBAT_LOG_MAX);
            }
        },

        /** Push a manual combat log entry. */
        pushCombatLog(state, action: PayloadAction<{ message: string; type: CombatLogEntry['type'] }>) {
            state.combatLog.push({
                id: combatLogIdCounter++,
                message: action.payload.message,
                type: action.payload.type,
                timestamp: Date.now(),
            });
            if (state.combatLog.length > COMBAT_LOG_MAX) {
                state.combatLog = state.combatLog.slice(-COMBAT_LOG_MAX);
            }
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
