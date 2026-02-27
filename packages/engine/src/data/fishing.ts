/**
 * Skill data definitions — fishing actions.
 * These define what each fish produces, its XP rates, and requirements.
 */

import type { ActionDefinition } from '../TickSystem';

export const FISHING_ACTIONS: ActionDefinition[] = [
    {
        id: 'net_fishing',
        skillId: 'fishing',
        intervalMs: 3000,
        xpPerTick: 10,
        itemsPerTick: [{ id: 'raw_shrimp', quantity: 1 }],
        levelRequired: 1,
        masteryXpPerTick: 1,
    },
    {
        id: 'bait_fishing_sardine',
        skillId: 'fishing',
        intervalMs: 4000,
        xpPerTick: 20,
        itemsPerTick: [{ id: 'raw_sardine', quantity: 1 }],
        levelRequired: 5,
        masteryXpPerTick: 1,
        successRate: 0.95,
    },
    {
        id: 'bait_fishing_herring',
        skillId: 'fishing',
        intervalMs: 4500,
        xpPerTick: 30,
        itemsPerTick: [{ id: 'raw_herring', quantity: 1 }],
        levelRequired: 10,
        masteryXpPerTick: 2,
        successRate: 0.9,
    },
    {
        id: 'fly_fishing_trout',
        skillId: 'fishing',
        intervalMs: 5000,
        xpPerTick: 50,
        itemsPerTick: [{ id: 'raw_trout', quantity: 1 }],
        levelRequired: 20,
        masteryXpPerTick: 2,
        successRate: 0.85,
    },
    {
        id: 'fly_fishing_salmon',
        skillId: 'fishing',
        intervalMs: 6000,
        xpPerTick: 70,
        itemsPerTick: [{ id: 'raw_salmon', quantity: 1 }],
        levelRequired: 30,
        masteryXpPerTick: 3,
        successRate: 0.8,
    },
    {
        id: 'cage_fishing_lobster',
        skillId: 'fishing',
        intervalMs: 7000,
        xpPerTick: 90,
        itemsPerTick: [{ id: 'raw_lobster', quantity: 1 }],
        levelRequired: 40,
        masteryXpPerTick: 4,
        successRate: 0.75,
    },
    {
        id: 'harpoon_swordfish',
        skillId: 'fishing',
        intervalMs: 8000,
        xpPerTick: 100,
        itemsPerTick: [{ id: 'raw_swordfish', quantity: 1 }],
        levelRequired: 50,
        masteryXpPerTick: 5,
        successRate: 0.7,
    },
    {
        id: 'harpoon_shark',
        skillId: 'fishing',
        intervalMs: 10000,
        xpPerTick: 110,
        itemsPerTick: [{ id: 'raw_shark', quantity: 1 }],
        levelRequired: 76,
        masteryXpPerTick: 7,
        successRate: 0.65,
    },
    {
        id: 'cosmic_ray',
        skillId: 'fishing',
        intervalMs: 15000,
        xpPerTick: 200,
        itemsPerTick: [{ id: 'raw_cosmic_ray', quantity: 1 }],
        levelRequired: 90,
        masteryXpPerTick: 10,
        successRate: 0.5,
    }
];
