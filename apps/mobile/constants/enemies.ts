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

/** Combat stats for Phase 4 auto-combat. */
export interface EnemyCombatStats {
    hp: number;
    attack: number;
    defense: number;
    /** Accuracy modifier (0–1). */
    accuracy?: number;
    /** Attack speed in ms (default 2400). Faster enemies use lower values. */
    attackSpeed?: number;
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
    combat: { hp: 10, attack: 2, defense: 1, accuracy: 0.8, attackSpeed: 2000 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'bronze_dagger', minQty: 1, maxQty: 1, chance: 0.05 }],
    locations: [{ id: 'goblin_house', name: 'Goblin House', tier: 1 }],
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

export const ENEMY_COW: EnemyMeta = {
    id: 'enemy_cow',
    name: 'Cow',
    assetPath: 'cow_1.svg',
    level: 2,
    description: 'A sturdy farm animal. Drops raw beef.',
    combat: { hp: 12, attack: 1, defense: 1, accuracy: 0.6 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'raw_beef', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'leather_hide', minQty: 1, maxQty: 1, chance: 1.0 }],
    locations: [{ id: 'sunny_meadows_farm', name: 'Sunny Meadows Farm', tier: 1 }],
};

export const ENEMY_CHICKEN: EnemyMeta = {
    id: 'enemy_chicken',
    name: 'Chicken',
    assetPath: 'chicken_1.svg',
    level: 1,
    description: 'A frantic bird. Pecks aggressively.',
    combat: { hp: 3, attack: 1, defense: 0, accuracy: 0.8 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'raw_chicken', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'feathers', minQty: 5, maxQty: 15, chance: 1.0 }],
    locations: [{ id: 'sunny_meadows_farm', name: 'Sunny Meadows Farm', tier: 1 }],
};

export const ENEMY_SHEEP: EnemyMeta = {
    id: 'enemy_sheep',
    name: 'Sheep',
    assetPath: 'sheep_1.svg',
    level: 2,
    description: 'A fluffy grazers. Sometimes headbutts.',
    combat: { hp: 10, attack: 1, defense: 2, accuracy: 0.5 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }],
    locations: [{ id: 'sunny_meadows_farm', name: 'Sunny Meadows Farm', tier: 1 }],
};

export const ENEMY_PIG: EnemyMeta = {
    id: 'enemy_pig',
    name: 'Pig',
    assetPath: 'pig_1.svg',
    level: 3,
    description: 'A muddy swine. surprisingly tough.',
    combat: { hp: 15, attack: 2, defense: 2, accuracy: 0.6 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'raw_pork', minQty: 1, maxQty: 1, chance: 1.0 }],
    locations: [{ id: 'sunny_meadows_farm', name: 'Sunny Meadows Farm', tier: 1 }],
};

/** Placeholder: future early combat enemy. */
export const ENEMY_WOODLAND_WOLF: EnemyMeta = {
    id: 'enemy_woodland_wolf',
    name: 'Woodland Wolf',
    assetPath: 'wolf_1.svg',
    level: 3,
    description: 'A wild wolf. Hunts in packs.',
    combat: { hp: 25, attack: 5, defense: 2, accuracy: 0.85, attackSpeed: 1800 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'bad_meat', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'wolf_bones', minQty: 1, maxQty: 2, chance: 0.25 }, { itemId: 'iron_dagger', minQty: 1, maxQty: 1, chance: 0.05 }, { itemId: 'cooked_trout', minQty: 1, maxQty: 2, chance: 0.15 }],
    locations: [{ id: 'whispering_woods_forest', name: 'Whispering Woods Forest', tier: 1 }],
};

export const ENEMY_ARCTIC_WOLF: EnemyMeta = {
    id: 'enemy_arctic_wolf',
    name: 'Arctic Wolf',
    assetPath: 'wolf_arctic_1.svg',
    level: 5,
    description: 'A fierce white wolf adapted to the freezing cold.',
    combat: { hp: 45, attack: 8, defense: 5, accuracy: 0.85, attackSpeed: 1600 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'bad_meat', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'wolf_bones', minQty: 1, maxQty: 3, chance: 0.4 }, { itemId: 'spirit_shard', minQty: 2, maxQty: 5, chance: 0.1 }, { itemId: 'steel_scimitar', minQty: 1, maxQty: 1, chance: 0.05 }, { itemId: 'cooked_salmon', minQty: 1, maxQty: 2, chance: 0.15 }],
    locations: [{ id: 'frostfall_mountain', name: 'Frostfall Mountain', tier: 2 }],
};

export const ENEMY_CRAWLING_HAND: EnemyMeta = {
    id: 'enemy_crawling_hand',
    name: 'Crawling Hand',
    assetPath: 'hand_1.svg',
    level: 5,
    description: 'A severed hand that crawls around and grabs ankles.',
    combat: { hp: 30, attack: 4, defense: 2, accuracy: 0.8, attackSpeed: 1200 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'leather_hide', minQty: 1, maxQty: 1, chance: 0.1 }],
    locations: [{ id: 'slayer_tower_b1', name: 'Slayer Tower (B1)', tier: 1 }],
};

export const ENEMY_BANSHEE: EnemyMeta = {
    id: 'enemy_banshee',
    name: 'Banshee',
    assetPath: 'banshee_1.svg',
    level: 15,
    description: 'A banshee with a piercing shriek. Requires earmuffs.',
    combat: { hp: 60, attack: 12, defense: 8, accuracy: 0.9, attackSpeed: 2100 },
    drops: [{ itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 }, { itemId: 'spirit_shard', minQty: 5, maxQty: 15, chance: 0.2 }],
    locations: [{ id: 'slayer_tower_b1', name: 'Slayer Tower (B1)', tier: 1 }],
};

export const ENEMY_GOBLIN_ELITE: EnemyMeta = {
    id: 'enemy_goblin_elite',
    name: 'Goblin Warlord',
    assetPath: 'goblin_elite.svg',
    level: 12,
    description: 'A massive goblin wearing crude iron plate. Much stronger than a regular goblin.',
    combat: { hp: 45, attack: 8, defense: 6, accuracy: 0.85, attackSpeed: 2400 },
    drops: [
        { itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 },
        { itemId: 'iron_platebody', minQty: 1, maxQty: 1, chance: 0.15 },
        { itemId: 'gold_ore', minQty: 5, maxQty: 10, chance: 0.3 }
    ],
    locations: [{ id: 'goblin_house', name: 'Goblin House', tier: 1 }],
};

export const ENEMY_SKELETON_ELITE: EnemyMeta = {
    id: 'enemy_skeleton_elite',
    name: 'Skeletal Champion',
    assetPath: 'skeleton_elite.svg',
    level: 25,
    description: 'The remains of a great warrior, reanimated by dark magic.',
    combat: { hp: 120, attack: 18, defense: 14, accuracy: 0.8, attackSpeed: 2800 },
    drops: [
        { itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 },
        { itemId: 'steel_longsword', minQty: 1, maxQty: 1, chance: 0.1 },
        { itemId: 'iron_bar', minQty: 3, maxQty: 5, chance: 0.5 }
    ],
    locations: [{ id: 'haunted_crypt', name: 'Haunted Crypt', tier: 2 }],
};

export const ENEMY_SKELETON: EnemyMeta = {
    id: 'enemy_skeleton',
    name: 'Skeleton',
    assetPath: 'skeleton_1.svg',
    level: 10,
    description: 'A rattling pile of bones held together by spite.',
    combat: { hp: 40, attack: 6, defense: 4, accuracy: 0.7, attackSpeed: 2400 },
    drops: [
        { itemId: 'bones', minQty: 1, maxQty: 1, chance: 1.0 },
        { itemId: 'iron_dagger', minQty: 1, maxQty: 1, chance: 0.1 }
    ],
    locations: [{ id: 'haunted_crypt', name: 'Haunted Crypt', tier: 2 }],
};

export const ENEMIES: Record<string, EnemyMeta> = {
    [ENEMY_GOBLIN.id]: ENEMY_GOBLIN,
    [ENEMY_COW.id]: ENEMY_COW,
    [ENEMY_CHICKEN.id]: ENEMY_CHICKEN,
    [ENEMY_SHEEP.id]: ENEMY_SHEEP,
    [ENEMY_PIG.id]: ENEMY_PIG,
    [ENEMY_WOODLAND_WOLF.id]: ENEMY_WOODLAND_WOLF,
    [ENEMY_ARCTIC_WOLF.id]: ENEMY_ARCTIC_WOLF,
    [ENEMY_CRAWLING_HAND.id]: ENEMY_CRAWLING_HAND,
    [ENEMY_BANSHEE.id]: ENEMY_BANSHEE,
    [ENEMY_SKELETON.id]: ENEMY_SKELETON,
    [ENEMY_GOBLIN_ELITE.id]: ENEMY_GOBLIN_ELITE,
    [ENEMY_SKELETON_ELITE.id]: ENEMY_SKELETON_ELITE,
};

/** All enemy IDs for iteration. */
export const ENEMY_IDS = Object.keys(ENEMIES) as (keyof typeof ENEMIES)[];
