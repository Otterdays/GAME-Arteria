/**
 * Skill data definitions — harvesting actions.
 * These define what each plant produces, its XP rates, and requirements.
 */

import type { ActionDefinition } from '../TickSystem';

export const HARVESTING_ACTIONS: ActionDefinition[] = [
    {
        id: 'wheat_field',
        skillId: 'harvesting',
        intervalMs: 2500,
        xpPerTick: 12,
        itemsPerTick: [{ id: 'wheat', quantity: 1 }],
        levelRequired: 1,
        masteryXpPerTick: 1,
    },
    {
        id: 'cabbage_patch',
        skillId: 'harvesting',
        intervalMs: 3000,
        xpPerTick: 25,
        itemsPerTick: [{ id: 'cabbage', quantity: 1 }],
        levelRequired: 10,
        masteryXpPerTick: 2,
        successRate: 0.95,
    },
    {
        id: 'tomato_vine',
        skillId: 'harvesting',
        intervalMs: 3500,
        xpPerTick: 45,
        itemsPerTick: [{ id: 'tomato', quantity: 1 }],
        levelRequired: 20,
        masteryXpPerTick: 3,
        successRate: 0.9,
    },
    {
        id: 'sweetcorn_field',
        skillId: 'harvesting',
        intervalMs: 4000,
        xpPerTick: 65,
        itemsPerTick: [{ id: 'sweetcorn', quantity: 1 }],
        levelRequired: 35,
        masteryXpPerTick: 4,
        successRate: 0.85,
    },
    {
        id: 'strawberry_bush',
        skillId: 'harvesting',
        intervalMs: 5000,
        xpPerTick: 90,
        itemsPerTick: [{ id: 'strawberry', quantity: 1 }],
        levelRequired: 50,
        masteryXpPerTick: 5,
        successRate: 0.8,
    },
    {
        id: 'snape_grass',
        skillId: 'harvesting',
        intervalMs: 6000,
        xpPerTick: 130,
        itemsPerTick: [{ id: 'snape_grass', quantity: 1 }],
        levelRequired: 65,
        masteryXpPerTick: 6,
        successRate: 0.75,
    },
    {
        id: 'void_caps',
        skillId: 'harvesting',
        intervalMs: 8000,
        xpPerTick: 210,
        itemsPerTick: [{ id: 'void_cap_mushroom', quantity: 1 }],
        levelRequired: 80,
        masteryXpPerTick: 8,
        successRate: 0.65,
    },
];
