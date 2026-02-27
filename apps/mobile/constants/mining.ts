export interface MiningNode {
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

export const MINING_NODES: MiningNode[] = [
    {
        id: 'copper_ore',
        name: 'Copper Vein',
        levelReq: 1,
        xpPerTick: 17.5,
        baseTickMs: 3000,
        successRate: 1,
        masteryXp: 2,
        items: [{ id: 'copper_ore', quantity: 1 }],
        emoji: '🪨',
    },
    {
        id: 'tin_ore',
        name: 'Tin Vein',
        levelReq: 1,
        xpPerTick: 17.5,
        baseTickMs: 3000,
        successRate: 1,
        masteryXp: 2,
        items: [{ id: 'tin_ore', quantity: 1 }],
        emoji: '🪨',
    },
    {
        id: 'iron_ore',
        name: 'Iron Vein',
        levelReq: 15,
        xpPerTick: 35,
        baseTickMs: 3000,
        successRate: 0.95,
        masteryXp: 3,
        items: [{ id: 'iron_ore', quantity: 1 }],
        emoji: '⛰️',
    },
    {
        id: 'coal_ore',
        name: 'Coal Vein',
        levelReq: 30,
        xpPerTick: 50,
        baseTickMs: 4000,
        successRate: 0.9,
        masteryXp: 4,
        items: [{ id: 'coal', quantity: 1 }],
        emoji: '⚫',
    },
    {
        id: 'gold_ore',
        name: 'Gold Vein',
        levelReq: 40,
        xpPerTick: 65,
        baseTickMs: 4000,
        successRate: 0.85,
        masteryXp: 5,
        items: [{ id: 'gold_ore', quantity: 1 }],
        emoji: '🟡',
    },
    {
        id: 'mithril_ore',
        name: 'Mithril Vein',
        levelReq: 55,
        xpPerTick: 80,
        baseTickMs: 5000,
        successRate: 0.8,
        masteryXp: 6,
        items: [{ id: 'mithril_ore', quantity: 1 }],
        emoji: '🔵',
    },
    {
        id: 'adamantite_ore',
        name: 'Adamantite Vein',
        levelReq: 70,
        xpPerTick: 95,
        baseTickMs: 6000,
        successRate: 0.75,
        masteryXp: 7,
        items: [{ id: 'adamantite_ore', quantity: 1 }],
        emoji: '🟢',
    },
    {
        id: 'runite_ore',
        name: 'Runite Vein',
        levelReq: 85,
        xpPerTick: 125,
        baseTickMs: 8000,
        successRate: 0.7,
        masteryXp: 10,
        items: [{ id: 'runite_ore', quantity: 1 }],
        emoji: '🛸',
    }
];
