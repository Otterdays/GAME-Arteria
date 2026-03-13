/**
 * Fletching — Logs + Feathers + Bars → Arrows, Bows.
 * [TRACE: DOCU/FLETCHING_TAILORING.md; SKILLS_ARCHITECTURE]
 */

export type FletchingCategory = 'shafts' | 'arrows' | 'bows';

export interface FletchingRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: { id: string; quantity: number }[];
    items: { id: string; quantity: number }[];
    emoji: string;
    category: FletchingCategory;
}

export const FLETCHING_RECIPES: FletchingRecipe[] = [
    // Shafts
    { id: 'fletch_arrow_shaft', name: 'Arrow Shafts', levelReq: 1, xpPerTick: 12, baseTickMs: 2500, successRate: 1, consumedItems: [{ id: 'normal_log', quantity: 1 }], items: [{ id: 'arrow_shaft', quantity: 15 }], emoji: '📏', category: 'shafts' },

    // Arrows (shaft + feathers + bar)
    { id: 'fletch_bronze_arrows', name: 'Bronze Arrows', levelReq: 1, xpPerTick: 18, baseTickMs: 3000, successRate: 1, consumedItems: [{ id: 'arrow_shaft', quantity: 15 }, { id: 'feathers', quantity: 15 }, { id: 'bronze_bar', quantity: 1 }], items: [{ id: 'bronze_arrows', quantity: 15 }], emoji: '🏹', category: 'arrows' },
    { id: 'fletch_iron_arrows', name: 'Iron Arrows', levelReq: 15, xpPerTick: 35, baseTickMs: 3500, successRate: 1, consumedItems: [{ id: 'arrow_shaft', quantity: 15 }, { id: 'feathers', quantity: 15 }, { id: 'iron_bar', quantity: 1 }], items: [{ id: 'iron_arrows', quantity: 15 }], emoji: '🏹', category: 'arrows' },
    { id: 'fletch_steel_arrows', name: 'Steel Arrows', levelReq: 30, xpPerTick: 55, baseTickMs: 4000, successRate: 1, consumedItems: [{ id: 'arrow_shaft', quantity: 15 }, { id: 'feathers', quantity: 15 }, { id: 'steel_bar', quantity: 1 }], items: [{ id: 'steel_arrows', quantity: 15 }], emoji: '🏹', category: 'arrows' },

    // Bows
    { id: 'fletch_oak_shortbow', name: 'Oak Shortbow', levelReq: 5, xpPerTick: 25, baseTickMs: 4000, successRate: 1, consumedItems: [{ id: 'oak_log', quantity: 1 }], items: [{ id: 'oak_shortbow', quantity: 1 }], emoji: '🏹', category: 'bows' },
    { id: 'fletch_willow_longbow', name: 'Willow Longbow', levelReq: 20, xpPerTick: 45, baseTickMs: 5000, successRate: 0.98, consumedItems: [{ id: 'willow_log', quantity: 1 }], items: [{ id: 'willow_longbow', quantity: 1 }], emoji: '🏹', category: 'bows' },
];

export const FLETCHING_CATEGORIES: FletchingCategory[] = ['shafts', 'arrows', 'bows'];
