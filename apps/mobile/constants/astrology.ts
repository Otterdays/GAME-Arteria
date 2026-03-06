export interface AstrologyConstellation {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    masteryXp: number;
    items: { id: string; quantity: number }[];
    emoji: string;
}

export const ASTROLOGY_CONSTELLATIONS: AstrologyConstellation[] = [
    {
        id: 'deedree_constellation',
        name: 'Deedree',
        levelReq: 1,
        xpPerTick: 20,
        baseTickMs: 4000,
        successRate: 1.0,
        masteryXp: 2,
        items: [{ id: 'stardust', quantity: 1 }],
        emoji: '⭐',
    },
    {
        id: 'the_anchor_eternal',
        name: 'The Anchor Eternal',
        levelReq: 20,
        xpPerTick: 40,
        baseTickMs: 5000,
        successRate: 1.0,
        masteryXp: 3,
        items: [{ id: 'stardust', quantity: 1 }],
        emoji: '⚓',
    },
    {
        id: 'the_void_fish',
        name: 'The Void Fish',
        levelReq: 45,
        xpPerTick: 65,
        baseTickMs: 6500,
        successRate: 1.0,
        masteryXp: 4,
        items: [{ id: 'stardust', quantity: 2 }],
        emoji: '🐟',
    },
    {
        id: 'the_lumina_tree',
        name: 'The Lumina Tree',
        levelReq: 70,
        xpPerTick: 110,
        baseTickMs: 8000,
        successRate: 1.0,
        masteryXp: 6,
        items: [{ id: 'stardust', quantity: 2 }],
        emoji: '🌳',
    },
];
