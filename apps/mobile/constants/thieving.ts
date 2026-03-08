export interface ThievingTarget {
    id: string;
    name: string;
    type: 'pickpocket' | 'stall';
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number; // 0.0 to 1.0 (base success rate)
    lootGold?: { min: number; max: number };
    lootItems?: { id: string; chance: number; min: number; max: number }[];
    emoji: string;
}

export const THIEVING_TARGETS: ThievingTarget[] = [
    // Pickpocketing
    {
        id: 'thieving_man',
        name: 'Man',
        type: 'pickpocket',
        levelReq: 1,
        xpPerTick: 8,
        baseTickMs: 2000,
        successRate: 0.85,
        lootGold: { min: 1, max: 3 },
        emoji: '🧔',
    },
    {
        id: 'thieving_woman',
        name: 'Woman',
        type: 'pickpocket',
        levelReq: 1,
        xpPerTick: 8,
        baseTickMs: 2000,
        successRate: 0.85,
        lootGold: { min: 1, max: 3 },
        emoji: '👩',
    },
    {
        id: 'thieving_farmer',
        name: 'Farmer',
        type: 'pickpocket',
        levelReq: 10,
        xpPerTick: 14.5,
        baseTickMs: 2000,
        successRate: 0.70,
        lootGold: { min: 9, max: 15 },
        emoji: '👨‍🌾',
    },
    {
        id: 'thieving_guard',
        name: 'Guard',
        type: 'pickpocket',
        levelReq: 40,
        xpPerTick: 46.5,
        baseTickMs: 2000,
        successRate: 0.55,
        lootGold: { min: 30, max: 50 },
        emoji: '💂',
    },
    {
        id: 'thieving_paladin',
        name: 'Paladin',
        type: 'pickpocket',
        levelReq: 70,
        xpPerTick: 151,
        baseTickMs: 2000,
        successRate: 0.35,
        lootGold: { min: 80, max: 150 },
        emoji: '🛡️',
    },
    // Stalls
    {
        id: 'thieving_fruit_stall',
        name: 'Fruit Stall',
        type: 'stall',
        levelReq: 5,
        xpPerTick: 15,
        baseTickMs: 3000,
        successRate: 0.90,
        lootItems: [
            { id: 'shrimp', chance: 0.1, min: 1, max: 1 },
            { id: 'copper_ore', chance: 0.05, min: 1, max: 1 }
        ],
        emoji: '🍎',
    },
    {
        id: 'thieving_silk_stall',
        name: 'Silk Stall',
        type: 'stall',
        levelReq: 20,
        xpPerTick: 24,
        baseTickMs: 3000,
        successRate: 0.80,
        lootItems: [
            { id: 'leather', chance: 0.2, min: 1, max: 3 }
        ],
        lootGold: { min: 10, max: 30 },
        emoji: '🧣',
    },
    {
        id: 'thieving_gem_stall',
        name: 'Gem Stall',
        type: 'stall',
        levelReq: 75,
        xpPerTick: 160,
        baseTickMs: 3500,
        successRate: 0.60,
        lootItems: [
            { id: 'sapphire', chance: 0.2, min: 1, max: 1 },
            { id: 'emerald', chance: 0.1, min: 1, max: 1 },
            { id: 'ruby', chance: 0.05, min: 1, max: 1 },
            { id: 'diamond', chance: 0.01, min: 1, max: 1 },
        ],
        emoji: '💎',
    }
];
