/**
 * Cooking — Fish → Food recipes.
 * [TRACE: ROADMAP 3.2 — Cooking; v0.4.1 The Anchor Man]
 */

export interface CookingRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: { id: string; quantity: number }[];
    items: { id: string; quantity: number }[];
    perfectId?: string;
    emoji: string;
}

export const COOKING_RECIPES: CookingRecipe[] = [
    { id: 'cook_shrimp', name: 'Cooked Shrimp', levelReq: 1, xpPerTick: 8, baseTickMs: 2500, successRate: 1, consumedItems: [{ id: 'raw_shrimp', quantity: 1 }], items: [{ id: 'cooked_shrimp', quantity: 1 }], perfectId: 'perfect_shrimp', emoji: '🍤' },
    { id: 'cook_sardine', name: 'Cooked Sardine', levelReq: 5, xpPerTick: 15, baseTickMs: 2800, successRate: 1, consumedItems: [{ id: 'raw_sardine', quantity: 1 }], items: [{ id: 'cooked_sardine', quantity: 1 }], perfectId: 'perfect_sardine', emoji: '🐟' },
    { id: 'cook_herring', name: 'Cooked Herring', levelReq: 10, xpPerTick: 22, baseTickMs: 3000, successRate: 1, consumedItems: [{ id: 'raw_herring', quantity: 1 }], items: [{ id: 'cooked_herring', quantity: 1 }], perfectId: 'perfect_herring', emoji: '🐟' },
    { id: 'cook_trout', name: 'Cooked Trout', levelReq: 15, xpPerTick: 30, baseTickMs: 3500, successRate: 0.95, consumedItems: [{ id: 'raw_trout', quantity: 1 }], items: [{ id: 'cooked_trout', quantity: 1 }], perfectId: 'perfect_trout', emoji: '🎣' },
    { id: 'cook_salmon', name: 'Cooked Salmon', levelReq: 25, xpPerTick: 45, baseTickMs: 4000, successRate: 0.9, consumedItems: [{ id: 'raw_salmon', quantity: 1 }], items: [{ id: 'cooked_salmon', quantity: 1 }], perfectId: 'perfect_salmon', emoji: '🐠' },
    { id: 'cook_tuna', name: 'Cooked Tuna', levelReq: 40, xpPerTick: 60, baseTickMs: 4500, successRate: 0.85, consumedItems: [{ id: 'raw_tuna', quantity: 1 }], items: [{ id: 'cooked_tuna', quantity: 1 }], perfectId: 'perfect_tuna', emoji: '🐡' },
    { id: 'cook_lobster', name: 'Cooked Lobster', levelReq: 55, xpPerTick: 75, baseTickMs: 5000, successRate: 0.8, consumedItems: [{ id: 'raw_lobster', quantity: 1 }], items: [{ id: 'cooked_lobster', quantity: 1 }], perfectId: 'perfect_lobster', emoji: '🦞' },
    { id: 'cook_swordfish', name: 'Cooked Swordfish', levelReq: 65, xpPerTick: 90, baseTickMs: 5500, successRate: 0.75, consumedItems: [{ id: 'raw_swordfish', quantity: 1 }], items: [{ id: 'cooked_swordfish', quantity: 1 }], perfectId: 'perfect_swordfish', emoji: '🐬' },
    { id: 'cook_shark', name: 'Cooked Shark', levelReq: 80, xpPerTick: 110, baseTickMs: 6000, successRate: 0.7, consumedItems: [{ id: 'raw_shark', quantity: 1 }], items: [{ id: 'cooked_shark', quantity: 1 }], perfectId: 'perfect_shark', emoji: '🦈' },
    { id: 'cook_cosmic_jellyfish', name: 'Cooked Cosmic Jellyfish', levelReq: 90, xpPerTick: 150, baseTickMs: 7000, successRate: 0.6, consumedItems: [{ id: 'raw_cosmic_jellyfish', quantity: 1 }], items: [{ id: 'cooked_cosmic_jellyfish', quantity: 1 }], perfectId: 'perfect_cosmic_jellyfish', emoji: '🪼' },
];
