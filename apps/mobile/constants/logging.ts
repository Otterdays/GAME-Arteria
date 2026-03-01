export interface LoggingNode {
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

export const LOGGING_NODES: LoggingNode[] = [
    {
        id: 'normal_tree',
        name: 'Normal Tree',
        levelReq: 1,
        xpPerTick: 10,
        baseTickMs: 3000,
        successRate: 1,
        masteryXp: 1,
        items: [{ id: 'normal_log', quantity: 1 }],
        emoji: '🌲',
    },
    {
        id: 'oak_tree',
        name: 'Oak Tree',
        levelReq: 15,
        xpPerTick: 37.5,
        baseTickMs: 4000,
        successRate: 0.95,
        masteryXp: 2,
        items: [{ id: 'oak_log', quantity: 1 }],
        emoji: '🌳',
    },
    {
        id: 'willow_tree',
        name: 'Willow Tree',
        levelReq: 30,
        xpPerTick: 67.5,
        baseTickMs: 5000,
        successRate: 0.9,
        masteryXp: 3,
        items: [{ id: 'willow_log', quantity: 1 }],
        emoji: '🌿',
    },
    {
        id: 'teak_tree',
        name: 'Teak Tree',
        levelReq: 35,
        xpPerTick: 85,
        baseTickMs: 6000,
        successRate: 0.85,
        masteryXp: 4,
        items: [{ id: 'teak_log', quantity: 1 }],
        emoji: '🌴',
    },
    {
        id: 'maple_tree',
        name: 'Maple Tree',
        levelReq: 45,
        xpPerTick: 100,
        baseTickMs: 7000,
        successRate: 0.8,
        masteryXp: 5,
        items: [{ id: 'maple_log', quantity: 1 }],
        emoji: '🍁',
    },
    {
        id: 'mahogany_tree',
        name: 'Mahogany Tree',
        levelReq: 50,
        xpPerTick: 125,
        baseTickMs: 8000,
        successRate: 0.75,
        masteryXp: 6,
        items: [{ id: 'mahogany_log', quantity: 1 }],
        emoji: '🛖',
    },
    {
        id: 'yew_tree',
        name: 'Yew Tree',
        levelReq: 60,
        xpPerTick: 175,
        baseTickMs: 10000,
        successRate: 0.7,
        masteryXp: 8,
        items: [{ id: 'yew_log', quantity: 1 }],
        emoji: '🪴',
    },
    {
        id: 'magic_tree',
        name: 'Magic Tree',
        levelReq: 75,
        xpPerTick: 250,
        baseTickMs: 15000,
        successRate: 0.65,
        masteryXp: 10,
        items: [{ id: 'magic_log', quantity: 1 }],
        emoji: '✨',
    },
    {
        id: 'cosmic_tree',
        name: 'Cosmic Tree',
        levelReq: 90,
        xpPerTick: 500,
        baseTickMs: 20000,
        successRate: 0.5,
        masteryXp: 15,
        items: [{ id: 'cosmic_wood', quantity: 1 }],
        emoji: '🌌',
    }
];
