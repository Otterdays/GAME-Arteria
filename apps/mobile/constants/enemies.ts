/**
 * Enemy definitions for combat and bestiary.
 * [TRACE: ROADMAP Phase 4 — Combat; bestiary expansion groundwork]
 */

/** Drop table entry: itemId, quantity range, drop chance (0–1). */
export interface EnemyDrop {
    itemId: string;
    minQty: number;
    maxQty: number;
    chance: number;
}

/** Location where enemy can spawn (for bestiary "Found in" display). */
export interface EnemyLocation {
    id: string;
    name: string;
    /** Optional: area/dungeon tier for future gating. */
    tier?: number;
}

/** Combat stats for Phase 4 auto-combat. Placeholder values until combat is implemented. */
export interface EnemyCombatStats {
    hp: number;
    attack: number;
    defense: number;
    /** Accuracy modifier (0–1). */
    accuracy?: number;
}

export interface EnemyMeta {
    id: string;
    name: string;
    /** Asset path relative to assets/images (e.g. goblin_1.svg). */
    assetPath: string;
    level?: number;
    description?: string;
    /** Combat stats for Phase 4. Optional until combat implemented. */
    combat?: EnemyCombatStats;
    /** Drop table. Empty until combat loot is implemented. */
    drops?: EnemyDrop[];
    /** Locations where this enemy spawns. For bestiary "Found in" section. */
    locations?: EnemyLocation[];
}

/** First random enemy — appears in "Goblin Peek" random event. Asset: goblin_1.svg */
export const ENEMY_GOBLIN: EnemyMeta = {
    id: 'enemy_goblin',
    name: 'Goblin',
    assetPath: 'goblin_1.svg',
    level: 1,
    description: 'A green goblin that sometimes peeks out from the shadows while you train.',
    combat: { hp: 10, attack: 2, defense: 1, accuracy: 0.8 },
    drops: [{ itemId: 'bronze_dagger', minQty: 1, maxQty: 1, chance: 0.05 }],
    locations: [{ id: 'crownlands_shadows', name: 'Crownlands (random peek)', tier: 1 }],
};

/** Placeholder: future low-level enemy. */
export const ENEMY_SLIME: EnemyMeta = {
    id: 'enemy_slime',
    name: 'Slime',
    assetPath: 'slime_1.svg',
    level: 1,
    description: 'A gelatinous blob. Harmless until provoked.',
    combat: { hp: 5, attack: 1, defense: 0, accuracy: 0.7 },
    drops: [],
    locations: [{ id: 'whispering_woods', name: 'Whispering Woods', tier: 1 }],
};

/** Placeholder: future early combat enemy. */
export const ENEMY_WOLF: EnemyMeta = {
    id: 'enemy_wolf',
    name: 'Wolf',
    assetPath: 'wolf_1.svg',
    level: 3,
    description: 'A wild wolf. Hunts in packs.',
    combat: { hp: 25, attack: 5, defense: 2, accuracy: 0.85 },
    drops: [],
    locations: [{ id: 'whispering_woods', name: 'Whispering Woods', tier: 1 }],
};

export const ENEMIES: Record<string, EnemyMeta> = {
    [ENEMY_GOBLIN.id]: ENEMY_GOBLIN,
    [ENEMY_SLIME.id]: ENEMY_SLIME,
    [ENEMY_WOLF.id]: ENEMY_WOLF,
};

/** All enemy IDs for iteration. */
export const ENEMY_IDS = Object.keys(ENEMIES) as (keyof typeof ENEMIES)[];
