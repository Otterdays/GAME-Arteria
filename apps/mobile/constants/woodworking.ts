/**
 * Woodworking — Logs → Furniture, Shields, Staves.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE §10; MASTER_DESIGN_DOC Wood Chain]
 */

export type WoodworkingCategory = 'furniture' | 'combat' | 'utility';

export interface WoodworkingRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: { id: string; quantity: number }[];
    items: { id: string; quantity: number }[];
    emoji: string;
    category: WoodworkingCategory;
}

export const WOODWORKING_RECIPES: WoodworkingRecipe[] = [
    // Furniture
    { id: 'craft_pine_stool', name: 'Pine Stool', levelReq: 1, xpPerTick: 15, baseTickMs: 3000, successRate: 1, consumedItems: [{ id: 'normal_log', quantity: 2 }], items: [{ id: 'pine_stool', quantity: 1 }], emoji: '🪑', category: 'furniture' },
    { id: 'craft_maple_dining_table', name: 'Maple Dining Table', levelReq: 50, xpPerTick: 90, baseTickMs: 6000, successRate: 0.95, consumedItems: [{ id: 'maple_log', quantity: 5 }], items: [{ id: 'maple_dining_table', quantity: 1 }], emoji: '🪑', category: 'furniture' },

    // Combat
    { id: 'craft_training_staff', name: 'Training Staff', levelReq: 10, xpPerTick: 30, baseTickMs: 3500, successRate: 1, consumedItems: [{ id: 'oak_log', quantity: 1 }], items: [{ id: 'training_staff', quantity: 1 }], emoji: '🪄', category: 'combat' },
    { id: 'craft_willow_shield', name: 'Willow Shield', levelReq: 25, xpPerTick: 50, baseTickMs: 4000, successRate: 0.98, consumedItems: [{ id: 'willow_log', quantity: 2 }], items: [{ id: 'willow_shield', quantity: 1 }], emoji: '🛡️', category: 'combat' },

    // Utility
    { id: 'craft_barrel', name: 'Barrel', levelReq: 5, xpPerTick: 20, baseTickMs: 3200, successRate: 1, consumedItems: [{ id: 'normal_log', quantity: 3 }], items: [{ id: 'barrel', quantity: 1 }], emoji: '🛢️', category: 'utility' },
];

export const WOODWORKING_CATEGORIES: WoodworkingCategory[] = ['furniture', 'combat', 'utility'];
