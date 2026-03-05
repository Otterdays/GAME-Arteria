/**
 * Harvesting nodes — plants, fibers, reagents.
 * [TRACE: ROADMAP Phase 2.1 — Harvesting]
 */

export interface HarvestingNode {
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

export const HARVESTING_NODES: HarvestingNode[] = [
    { id: 'wheat_field', name: 'Wheat Field', levelReq: 1, xpPerTick: 12, baseTickMs: 2500, successRate: 1, masteryXp: 1, items: [{ id: 'wheat', quantity: 1 }], emoji: '🌾' },
    { id: 'cabbage_patch', name: 'Cabbage Patch', levelReq: 10, xpPerTick: 25, baseTickMs: 3000, successRate: 0.95, masteryXp: 2, items: [{ id: 'cabbage', quantity: 1 }], emoji: '🥬' },
    { id: 'tomato_vine', name: 'Tomato Vine', levelReq: 20, xpPerTick: 45, baseTickMs: 3500, successRate: 0.9, masteryXp: 3, items: [{ id: 'tomato', quantity: 1 }], emoji: '🍅' },
    { id: 'sweetcorn_field', name: 'Sweetcorn Field', levelReq: 35, xpPerTick: 65, baseTickMs: 4000, successRate: 0.85, masteryXp: 4, items: [{ id: 'sweetcorn', quantity: 1 }], emoji: '🌽' },
    { id: 'strawberry_bush', name: 'Strawberry Bush', levelReq: 50, xpPerTick: 90, baseTickMs: 5000, successRate: 0.8, masteryXp: 5, items: [{ id: 'strawberry', quantity: 1 }], emoji: '🍓' },
    { id: 'snape_grass', name: 'Snape Grass', levelReq: 65, xpPerTick: 130, baseTickMs: 6000, successRate: 0.75, masteryXp: 6, items: [{ id: 'snape_grass', quantity: 1 }], emoji: '🌿' },
    { id: 'void_caps', name: 'Void Caps', levelReq: 80, xpPerTick: 210, baseTickMs: 8000, successRate: 0.65, masteryXp: 8, items: [{ id: 'void_cap_mushroom', quantity: 1 }], emoji: '🍄' },
];
