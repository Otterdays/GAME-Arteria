/**
 * Alchemy — Potions, Bombs, Transmutations.
 * [TRACE: ROADMAP 3.2 — Alchemy; MASTER_DESIGN_DOC §2.4]
 * Crafting Pillars: Volatility minigame for bonus potency.
 */

export type AlchemyCategory = 'potions' | 'bombs' | 'transmutation';

export interface AlchemyRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: { id: string; quantity: number }[];
    items: { id: string; quantity: number }[];
    emoji: string;
    category: AlchemyCategory;
    description: string;
}

export const ALCHEMY_RECIPES: AlchemyRecipe[] = [
    // Potions (Enhancing Herblore outputs or unique buffs)
    {
        id: 'alch_greater_healing',
        name: 'Greater Healing Potion',
        levelReq: 10,
        xpPerTick: 45,
        baseTickMs: 4000,
        successRate: 0.9,
        consumedItems: [{ id: 'minor_healing_potion', quantity: 2 }, { id: 'stardust', quantity: 1 }],
        items: [{ id: 'greater_healing_potion', quantity: 1 }],
        emoji: '🧪',
        category: 'potions',
        description: 'Concentrated restorative power. Heals significantly more than minor variants.',
    },
    {
        id: 'alch_elixir_of_luck',
        name: 'Elixir of Luck',
        levelReq: 25,
        xpPerTick: 80,
        baseTickMs: 5000,
        successRate: 0.85,
        consumedItems: [{ id: 'empty_vial', quantity: 1 }, { id: 'fey_trinket', quantity: 1 }, { id: 'stardust', quantity: 5 }],
        items: [{ id: 'luck_elixir', quantity: 1 }],
        emoji: '🍀',
        category: 'potions',
        description: 'Increases the chance of finding rare loot for a short duration.',
    },

    // Bombs (Combat consumables)
    {
        id: 'alch_fire_bomb',
        name: 'Fire Bomb',
        levelReq: 15,
        xpPerTick: 60,
        baseTickMs: 4500,
        successRate: 0.95,
        consumedItems: [{ id: 'empty_vial', quantity: 1 }, { id: 'coal', quantity: 5 }, { id: 'fire_rune', quantity: 2 }],
        items: [{ id: 'fire_bomb', quantity: 1 }],
        emoji: '💣',
        category: 'bombs',
        description: 'Explodes on impact, dealing fire damage to all nearby enemies.',
    },
    {
        id: 'alch_void_grenade',
        name: 'Void Grenade',
        levelReq: 40,
        xpPerTick: 120,
        baseTickMs: 6000,
        successRate: 0.8,
        consumedItems: [{ id: 'empty_vial', quantity: 1 }, { id: 'voidmire_crystal', quantity: 1 }, { id: 'void_rune', quantity: 1 }],
        items: [{ id: 'void_grenade', quantity: 1 }],
        emoji: '🌀',
        category: 'bombs',
        description: 'A volatile orb that implodes, dealing massive void damage.',
    },

    // Transmutation (Converting resources)
    {
        id: 'alch_transmute_iron',
        name: 'Transmute Iron to Steel',
        levelReq: 20,
        xpPerTick: 50,
        baseTickMs: 3500,
        successRate: 1,
        consumedItems: [{ id: 'iron_bar', quantity: 2 }, { id: 'stardust', quantity: 2 }],
        items: [{ id: 'steel_bar', quantity: 2 }],
        emoji: '⚗️',
        category: 'transmutation',
        description: 'Synthetically hardens iron into steel across the fabric of reality.',
    },
    {
        id: 'alch_transmute_gold',
        name: 'Transmute Lead to Gold',
        levelReq: 60,
        xpPerTick: 250,
        baseTickMs: 8000,
        successRate: 0.7,
        consumedItems: [{ id: 'rusty_scrap', quantity: 10 }, { id: 'golden_stardust', quantity: 2 }],
        items: [{ id: 'gold_bar', quantity: 5 }],
        emoji: '🪙',
        category: 'transmutation',
        description: 'The ultimate alchemical dream. Turns worthless scrap into pure gold.',
    },
];

export const ALCHEMY_CATEGORIES: AlchemyCategory[] = ['potions', 'bombs', 'transmutation'];
