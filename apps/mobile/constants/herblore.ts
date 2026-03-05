/**
 * Herblore — Herb + Vial → Potion recipes.
 * [TRACE: ROADMAP 3.2 — Herblore; zhipu-ai.md]
 */

export interface HerbloreRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: { id: string; quantity: number }[];
    items: { id: string; quantity: number }[];
    emoji: string;
}

export const HERBLORE_RECIPES: HerbloreRecipe[] = [
    { id: 'brew_minor_healing', name: 'Minor Healing Potion', levelReq: 1, xpPerTick: 12, baseTickMs: 3000, successRate: 1, consumedItems: [{ id: 'wheat', quantity: 1 }, { id: 'empty_vial', quantity: 1 }], items: [{ id: 'minor_healing_potion', quantity: 1 }], emoji: '🧪' },
    { id: 'brew_strength_elixir', name: 'Strength Elixir', levelReq: 5, xpPerTick: 20, baseTickMs: 3500, successRate: 0.95, consumedItems: [{ id: 'cabbage', quantity: 1 }, { id: 'empty_vial', quantity: 1 }], items: [{ id: 'strength_elixir', quantity: 1 }], emoji: '💪' },
    { id: 'brew_agility_tonic', name: 'Agility Tonic', levelReq: 15, xpPerTick: 35, baseTickMs: 4000, successRate: 0.9, consumedItems: [{ id: 'tomato', quantity: 1 }, { id: 'empty_vial', quantity: 1 }], items: [{ id: 'agility_tonic', quantity: 1 }], emoji: '🏃' },
    { id: 'brew_defence_brew', name: 'Defence Brew', levelReq: 25, xpPerTick: 50, baseTickMs: 4500, successRate: 0.85, consumedItems: [{ id: 'sweetcorn', quantity: 1 }, { id: 'empty_vial', quantity: 1 }], items: [{ id: 'defence_brew', quantity: 1 }], emoji: '🛡️' },
    { id: 'brew_xp_boost', name: 'XP Boost Potion', levelReq: 40, xpPerTick: 75, baseTickMs: 5500, successRate: 0.8, consumedItems: [{ id: 'strawberry', quantity: 1 }, { id: 'empty_vial', quantity: 1 }], items: [{ id: 'xp_boost_potion', quantity: 1 }], emoji: '✨' },
    { id: 'brew_natures_blessing', name: "Nature's Blessing", levelReq: 55, xpPerTick: 100, baseTickMs: 6500, successRate: 0.75, consumedItems: [{ id: 'snape_grass', quantity: 1 }, { id: 'empty_vial', quantity: 1 }], items: [{ id: 'natures_blessing', quantity: 1 }], emoji: '🌿' },
    { id: 'brew_void_resistance', name: 'Void Resistance', levelReq: 75, xpPerTick: 140, baseTickMs: 8000, successRate: 0.65, consumedItems: [{ id: 'void_cap_mushroom', quantity: 1 }, { id: 'empty_vial', quantity: 1 }], items: [{ id: 'void_resistance_potion', quantity: 1 }], emoji: '🕳️' },
];
