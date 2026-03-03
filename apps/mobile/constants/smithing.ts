/**
 * Smithing — Smelting recipes (ore → bars).
 * [TRACE: ROADMAP 3.2 — Smithing]
 *
 * Smithing = furnace: ore(s) → bars.
 * Forging = anvil: bars → weapons & armour (see constants/forging.ts).
 */

// @ts-ignore
import { NarrativeRequirement } from '../../../packages/engine/src/data/story';

export interface SmeltingRecipe {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    /** Items consumed per tick */
    consumedItems: { id: string; quantity: number }[];
    /** Items produced per tick */
    items: { id: string; quantity: number }[];
    emoji: string;
    requirement?: NarrativeRequirement;
}

export const SMELTING_RECIPES: SmeltingRecipe[] = [
    {
        id: 'smelt_bronze',
        name: 'Bronze Bar',
        levelReq: 1,
        xpPerTick: 6.25,
        baseTickMs: 3000,
        successRate: 1,
        consumedItems: [
            { id: 'copper_ore', quantity: 1 },
            { id: 'tin_ore', quantity: 1 },
        ],
        items: [{ id: 'bronze_bar', quantity: 1 }],
        emoji: '🟤',
    },
    {
        id: 'smelt_iron',
        name: 'Iron Bar',
        levelReq: 15,
        xpPerTick: 12.5,
        baseTickMs: 3500,
        successRate: 0.5,
        consumedItems: [{ id: 'iron_ore', quantity: 1 }],
        items: [{ id: 'iron_bar', quantity: 1 }],
        emoji: '⚙️',
    },
    {
        id: 'smelt_steel',
        name: 'Steel Bar',
        levelReq: 30,
        xpPerTick: 17.5,
        baseTickMs: 5000,
        successRate: 0.9,
        consumedItems: [
            { id: 'iron_ore', quantity: 1 },
            { id: 'coal', quantity: 2 },
        ],
        items: [{ id: 'steel_bar', quantity: 1 }],
        emoji: '🔩',
    },
    {
        id: 'smelt_gold',
        name: 'Gold Bar',
        levelReq: 40,
        xpPerTick: 22.5,
        baseTickMs: 4500,
        successRate: 1,
        consumedItems: [{ id: 'gold_ore', quantity: 1 }],
        items: [{ id: 'gold_bar', quantity: 1 }],
        emoji: '🟡',
    },
    {
        id: 'smelt_mithril',
        name: 'Mithril Bar',
        levelReq: 50,
        xpPerTick: 30,
        baseTickMs: 6000,
        successRate: 0.9,
        consumedItems: [
            { id: 'mithril_ore', quantity: 1 },
            { id: 'coal', quantity: 1 },
        ],
        items: [{ id: 'mithril_bar', quantity: 1 }],
        emoji: '🔵',
    },
    {
        id: 'smelt_adamant',
        name: 'Adamant Bar',
        levelReq: 70,
        xpPerTick: 37.5,
        baseTickMs: 7000,
        successRate: 0.85,
        consumedItems: [
            { id: 'adamantite_ore', quantity: 1 },
            { id: 'coal', quantity: 2 },
        ],
        items: [{ id: 'adamant_bar', quantity: 1 }],
        emoji: '🟢',
    },
    {
        id: 'smelt_runite',
        name: 'Runite Bar',
        levelReq: 85,
        xpPerTick: 50,
        baseTickMs: 9000,
        successRate: 0.8,
        consumedItems: [
            { id: 'runite_ore', quantity: 1 },
            { id: 'coal', quantity: 3 },
        ],
        items: [{ id: 'runite_bar', quantity: 1 }],
        emoji: '🛸',
        requirement: { flags: ['knows_about_sneeze_cult'] },
    },
];
