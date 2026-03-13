/**
 * Tailoring — Cloth → Gloves, Hats, Shoes.
 * [TRACE: DOCU/FLETCHING_TAILORING.md; SKILLS_ARCHITECTURE]
 */

export type TailoringCategory = 'cloth' | 'leather';

export interface TailoringRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: { id: string; quantity: number }[];
    items: { id: string; quantity: number }[];
    emoji: string;
    category: TailoringCategory;
}

export const TAILORING_RECIPES: TailoringRecipe[] = [
    // Cloth armour (cloth from shop or scavenging)
    { id: 'tailor_cloth_gloves', name: 'Cloth Gloves', levelReq: 1, xpPerTick: 12, baseTickMs: 2800, successRate: 1, consumedItems: [{ id: 'cloth', quantity: 1 }], items: [{ id: 'cloth_gloves', quantity: 1 }], emoji: '🧤', category: 'cloth' },
    { id: 'tailor_cloth_cap', name: 'Cloth Cap', levelReq: 5, xpPerTick: 18, baseTickMs: 3200, successRate: 1, consumedItems: [{ id: 'cloth', quantity: 1 }], items: [{ id: 'cloth_cap', quantity: 1 }], emoji: '🧢', category: 'cloth' },
    { id: 'tailor_cloth_shoes', name: 'Cloth Shoes', levelReq: 3, xpPerTick: 15, baseTickMs: 3000, successRate: 1, consumedItems: [{ id: 'cloth', quantity: 1 }], items: [{ id: 'cloth_shoes', quantity: 1 }], emoji: '👟', category: 'cloth' },
    { id: 'tailor_cloth_vest', name: 'Cloth Vest', levelReq: 10, xpPerTick: 28, baseTickMs: 4000, successRate: 1, consumedItems: [{ id: 'cloth', quantity: 2 }], items: [{ id: 'cloth_vest', quantity: 1 }], emoji: '🧥', category: 'cloth' },
];

export const TAILORING_CATEGORIES: TailoringCategory[] = ['cloth', 'leather'];
