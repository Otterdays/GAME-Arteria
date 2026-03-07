export interface CraftingRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: { id: string; quantity: number }[];
    items: { id: string; quantity: number }[];
    emoji: string;
    category: string;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
    // Tanning
    { id: 'craft_leather', name: 'Tan Leather', levelReq: 1, xpPerTick: 10, baseTickMs: 2500, successRate: 1, consumedItems: [{ id: 'leather_hide', quantity: 1 }], items: [{ id: 'leather', quantity: 1 }], emoji: '🟤', category: 'materials' },

    // Leather Armour
    { id: 'craft_leather_boots', name: 'Leather Boots', levelReq: 3, xpPerTick: 15, baseTickMs: 3000, successRate: 1, consumedItems: [{ id: 'leather', quantity: 1 }], items: [{ id: 'leather_boots', quantity: 1 }], emoji: '👢', category: 'armour' },
    { id: 'craft_leather_cowl', name: 'Leather Cowl', levelReq: 7, xpPerTick: 18, baseTickMs: 3200, successRate: 1, consumedItems: [{ id: 'leather', quantity: 1 }], items: [{ id: 'leather_cowl', quantity: 1 }], emoji: '🪖', category: 'armour' },
    { id: 'craft_leather_chaps', name: 'Leather Chaps', levelReq: 11, xpPerTick: 25, baseTickMs: 3800, successRate: 1, consumedItems: [{ id: 'leather', quantity: 2 }], items: [{ id: 'leather_chaps', quantity: 1 }], emoji: '👖', category: 'armour' },
    { id: 'craft_leather_body', name: 'Leather Body', levelReq: 14, xpPerTick: 35, baseTickMs: 4500, successRate: 1, consumedItems: [{ id: 'leather', quantity: 3 }], items: [{ id: 'leather_body', quantity: 1 }], emoji: '🧥', category: 'armour' },

    // Jewelry (Rings)
    { id: 'craft_sapphire_ring', name: 'Sapphire Ring', levelReq: 20, xpPerTick: 40, baseTickMs: 4000, successRate: 1, consumedItems: [{ id: 'gold_bar', quantity: 1 }, { id: 'sapphire', quantity: 1 }], items: [{ id: 'sapphire_ring', quantity: 1 }], emoji: '💍', category: 'jewelry' },
    { id: 'craft_emerald_ring', name: 'Emerald Ring', levelReq: 27, xpPerTick: 55, baseTickMs: 4500, successRate: 1, consumedItems: [{ id: 'gold_bar', quantity: 1 }, { id: 'emerald', quantity: 1 }], items: [{ id: 'emerald_ring', quantity: 1 }], emoji: '💍', category: 'jewelry' },
    { id: 'craft_ruby_ring', name: 'Ruby Ring', levelReq: 34, xpPerTick: 70, baseTickMs: 5000, successRate: 1, consumedItems: [{ id: 'gold_bar', quantity: 1 }, { id: 'ruby', quantity: 1 }], items: [{ id: 'ruby_ring', quantity: 1 }], emoji: '💍', category: 'jewelry' },
    { id: 'craft_diamond_ring', name: 'Diamond Ring', levelReq: 43, xpPerTick: 85, baseTickMs: 5500, successRate: 1, consumedItems: [{ id: 'gold_bar', quantity: 1 }, { id: 'diamond', quantity: 1 }], items: [{ id: 'diamond_ring', quantity: 1 }], emoji: '💍', category: 'jewelry' },

    // Jewelry (Amulets)
    { id: 'craft_sapphire_amulet', name: 'Sapphire Amulet', levelReq: 24, xpPerTick: 45, baseTickMs: 4200, successRate: 1, consumedItems: [{ id: 'gold_bar', quantity: 1 }, { id: 'sapphire', quantity: 1 }], items: [{ id: 'sapphire_amulet', quantity: 1 }], emoji: '📿', category: 'jewelry' },
    { id: 'craft_emerald_amulet', name: 'Emerald Amulet', levelReq: 31, xpPerTick: 60, baseTickMs: 4700, successRate: 1, consumedItems: [{ id: 'gold_bar', quantity: 1 }, { id: 'emerald', quantity: 1 }], items: [{ id: 'emerald_amulet', quantity: 1 }], emoji: '📿', category: 'jewelry' },
    { id: 'craft_ruby_amulet', name: 'Ruby Amulet', levelReq: 40, xpPerTick: 80, baseTickMs: 5200, successRate: 1, consumedItems: [{ id: 'gold_bar', quantity: 1 }, { id: 'ruby', quantity: 1 }], items: [{ id: 'ruby_amulet', quantity: 1 }], emoji: '📿', category: 'jewelry' },
    { id: 'craft_diamond_amulet', name: 'Diamond Amulet', levelReq: 50, xpPerTick: 100, baseTickMs: 6000, successRate: 1, consumedItems: [{ id: 'gold_bar', quantity: 1 }, { id: 'diamond', quantity: 1 }], items: [{ id: 'diamond_amulet', quantity: 1 }], emoji: '📿', category: 'jewelry' },
];

export const CRAFTING_CATEGORIES = ['materials', 'armour', 'jewelry'] as const;
