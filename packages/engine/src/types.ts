/**
 * Core type definitions for the Arteria game engine.
 */

/** Unique identifier for a skill */
export type SkillId =
    | 'mining'
    | 'woodcutting'
    | 'fishing'
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

/** State of a single skill */
export interface SkillState {
    id: SkillId;
    xp: number;
    level: number;
    /** Mastery XP per individual action/item within a skill */
    mastery: Record<string, number>;
}

/** A single item in the player's bank/inventory */
export interface InventoryItem {
    id: string;
    quantity: number;
}

/** Equipment slot keys */
export type EquipSlot =
    | 'head'
    | 'body'
    | 'legs'
    | 'feet'
    | 'weapon'
    | 'shield'
    | 'ring'
    | 'amulet';

/** Player combat stats */
export interface CombatStats {
    maxHitpoints: number;
    currentHitpoints: number;
    attackSpeed: number; // ms per attack
    maxHit: number;
    accuracy: number;
    meleeDefence: number;
    rangedDefence: number;
    magicDefence: number;
}

/** Full player state (serializable as JSON for saves) */
export interface PlayerState {
    name: string;
    skills: Record<SkillId, SkillState>;
    inventory: InventoryItem[];
    equipment: Partial<Record<EquipSlot, string>>;
    gold: number;
    combatStats: CombatStats;
    /** Currently active task/skill, null if idle */
    activeTask: ActiveTask | null;
    /** Unix timestamp (ms) of last save */
    lastSaveTimestamp: number;
}

/** Describes what the player is currently doing */
export interface ActiveTask {
    type: 'skilling' | 'combat';
    skillId?: SkillId;
    actionId: string; // e.g. "copper_ore" or "goblin"
    /** ms per tick for this action */
    intervalMs: number;
    /** Accumulated partial tick progress in ms */
    partialTickMs: number;
}

/** Result of processing one or more ticks */
export interface TickResult {
    xpGained: Record<SkillId, number>;
    itemsGained: InventoryItem[];
    masteryGained: Record<string, number>;
    ticksProcessed: number;
}

/** Report generated after calculating offline progression */
export interface OfflineReport {
    elapsedMs: number;
    ticksProcessed: number;
    xpGained: Record<string, number>;
    itemsGained: InventoryItem[];
    levelsGained: Record<string, number>;
}

/** Global game configuration constants */
export interface GameConfig {
    /** Max skill level */
    maxLevel: number;
    /** Default tick interval if not overridden by action */
    defaultTickIntervalMs: number;
    /** Max offline time to calculate (e.g. 12 hours) */
    maxOfflineMs: number;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
    maxLevel: 99,
    defaultTickIntervalMs: 3000, // 3 seconds per action
    maxOfflineMs: 12 * 60 * 60 * 1000, // 12 hours
};
