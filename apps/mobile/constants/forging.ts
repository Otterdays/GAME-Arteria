/**
 * Forging — Craft bars into weapons and armour at the anvil.
 * [TRACE: ROADMAP 3.2 — Smithing split: Smithing = bars, Forging = equipment]
 *
 * Smithing = smelting ore → bars (furnace).
 * Forging = bars → daggers, half helmets, full helmets (anvil).
 */

export interface ForgingRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    /** Bars consumed per tick */
    consumedItems: { id: string; quantity: number }[];
    /** Equipment produced per tick */
    items: { id: string; quantity: number }[];
    emoji: string;
    /** Metal tier for grouping (bronze, iron, steel, mithril, adamant) */
    metalTier: string;
}

export const FORGING_RECIPES: ForgingRecipe[] = [
    // Bronze
    { id: 'forge_bronze_dagger', name: 'Bronze Dagger', levelReq: 1, xpPerTick: 12.5, baseTickMs: 2500, successRate: 1, consumedItems: [{ id: 'bronze_bar', quantity: 1 }], items: [{ id: 'bronze_dagger', quantity: 1 }], emoji: '🗡️', metalTier: 'bronze' },
    { id: 'forge_bronze_half_helmet', name: 'Bronze Half Helmet', levelReq: 1, xpPerTick: 12.5, baseTickMs: 2500, successRate: 1, consumedItems: [{ id: 'bronze_bar', quantity: 1 }], items: [{ id: 'bronze_half_helmet', quantity: 1 }], emoji: '⛑️', metalTier: 'bronze' },
    { id: 'forge_bronze_full_helmet', name: 'Bronze Full Helmet', levelReq: 5, xpPerTick: 25, baseTickMs: 4000, successRate: 1, consumedItems: [{ id: 'bronze_bar', quantity: 2 }], items: [{ id: 'bronze_full_helmet', quantity: 1 }], emoji: '🪖', metalTier: 'bronze' },
    // Iron
    { id: 'forge_iron_dagger', name: 'Iron Dagger', levelReq: 15, xpPerTick: 25, baseTickMs: 3000, successRate: 1, consumedItems: [{ id: 'iron_bar', quantity: 1 }], items: [{ id: 'iron_dagger', quantity: 1 }], emoji: '🗡️', metalTier: 'iron' },
    { id: 'forge_iron_half_helmet', name: 'Iron Half Helmet', levelReq: 16, xpPerTick: 25, baseTickMs: 3000, successRate: 1, consumedItems: [{ id: 'iron_bar', quantity: 1 }], items: [{ id: 'iron_half_helmet', quantity: 1 }], emoji: '⛑️', metalTier: 'iron' },
    { id: 'forge_iron_full_helmet', name: 'Iron Full Helmet', levelReq: 18, xpPerTick: 37.5, baseTickMs: 5000, successRate: 1, consumedItems: [{ id: 'iron_bar', quantity: 2 }], items: [{ id: 'iron_full_helmet', quantity: 1 }], emoji: '🪖', metalTier: 'iron' },
    // Steel
    { id: 'forge_steel_dagger', name: 'Steel Dagger', levelReq: 30, xpPerTick: 37.5, baseTickMs: 3500, successRate: 1, consumedItems: [{ id: 'steel_bar', quantity: 1 }], items: [{ id: 'steel_dagger', quantity: 1 }], emoji: '🗡️', metalTier: 'steel' },
    { id: 'forge_steel_half_helmet', name: 'Steel Half Helmet', levelReq: 31, xpPerTick: 37.5, baseTickMs: 3500, successRate: 1, consumedItems: [{ id: 'steel_bar', quantity: 1 }], items: [{ id: 'steel_half_helmet', quantity: 1 }], emoji: '⛑️', metalTier: 'steel' },
    { id: 'forge_steel_full_helmet', name: 'Steel Full Helmet', levelReq: 33, xpPerTick: 50, baseTickMs: 5500, successRate: 1, consumedItems: [{ id: 'steel_bar', quantity: 2 }], items: [{ id: 'steel_full_helmet', quantity: 1 }], emoji: '🪖', metalTier: 'steel' },
    // Mithril
    { id: 'forge_mithril_dagger', name: 'Mithril Dagger', levelReq: 50, xpPerTick: 50, baseTickMs: 4000, successRate: 1, consumedItems: [{ id: 'mithril_bar', quantity: 1 }], items: [{ id: 'mithril_dagger', quantity: 1 }], emoji: '🗡️', metalTier: 'mithril' },
    { id: 'forge_mithril_half_helmet', name: 'Mithril Half Helmet', levelReq: 51, xpPerTick: 50, baseTickMs: 4000, successRate: 1, consumedItems: [{ id: 'mithril_bar', quantity: 1 }], items: [{ id: 'mithril_half_helmet', quantity: 1 }], emoji: '⛑️', metalTier: 'mithril' },
    { id: 'forge_mithril_full_helmet', name: 'Mithril Full Helmet', levelReq: 53, xpPerTick: 62.5, baseTickMs: 6000, successRate: 1, consumedItems: [{ id: 'mithril_bar', quantity: 2 }], items: [{ id: 'mithril_full_helmet', quantity: 1 }], emoji: '🪖', metalTier: 'mithril' },
    // Adamant
    { id: 'forge_adamant_dagger', name: 'Adamant Dagger', levelReq: 70, xpPerTick: 62.5, baseTickMs: 4500, successRate: 1, consumedItems: [{ id: 'adamant_bar', quantity: 1 }], items: [{ id: 'adamant_dagger', quantity: 1 }], emoji: '🗡️', metalTier: 'adamant' },
    { id: 'forge_adamant_half_helmet', name: 'Adamant Half Helmet', levelReq: 71, xpPerTick: 62.5, baseTickMs: 4500, successRate: 1, consumedItems: [{ id: 'adamant_bar', quantity: 1 }], items: [{ id: 'adamant_half_helmet', quantity: 1 }], emoji: '⛑️', metalTier: 'adamant' },
    { id: 'forge_adamant_full_helmet', name: 'Adamant Full Helmet', levelReq: 73, xpPerTick: 75, baseTickMs: 6500, successRate: 1, consumedItems: [{ id: 'adamant_bar', quantity: 2 }], items: [{ id: 'adamant_full_helmet', quantity: 1 }], emoji: '🪖', metalTier: 'adamant' },
];

/** Metal tiers for grouping in the UI. */
export const METAL_TIERS = ['bronze', 'iron', 'steel', 'mithril', 'adamant'] as const;
