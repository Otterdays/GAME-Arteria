/**
 * Skill data definitions — scavenging actions.
 * These define what each ruin produces, its XP rates, and requirements.
 */

import type { ActionDefinition } from '../TickSystem';

export const SCAVENGING_ACTIONS: ActionDefinition[] = [
    {
        id: 'surface_ruins',
        skillId: 'scavenging',
        intervalMs: 4000,
        xpPerTick: 15,
        itemsPerTick: [{ id: 'rusty_scrap', quantity: 1 }],
        levelRequired: 1,
        masteryXpPerTick: 1,
    },
    {
        id: 'buried_settlement',
        skillId: 'scavenging',
        intervalMs: 5000,
        xpPerTick: 35,
        itemsPerTick: [{ id: 'discarded_tech', quantity: 1 }],
        levelRequired: 20,
        masteryXpPerTick: 2,
        successRate: 0.9,
    },
    {
        id: 'fey_outpost',
        skillId: 'scavenging',
        intervalMs: 6500,
        xpPerTick: 75,
        itemsPerTick: [{ id: 'fey_trinket', quantity: 1 }],
        levelRequired: 40,
        masteryXpPerTick: 4,
        successRate: 0.8,
    },
    {
        id: 'skyward_debris',
        skillId: 'scavenging',
        intervalMs: 8000,
        xpPerTick: 125,
        itemsPerTick: [{ id: 'celestial_fragment', quantity: 1 }],
        levelRequired: 60,
        masteryXpPerTick: 6,
        successRate: 0.7,
    },
    {
        id: 'void_rupture',
        skillId: 'scavenging',
        intervalMs: 12000,
        xpPerTick: 200,
        itemsPerTick: [{ id: 'voidmire_crystal', quantity: 1 }],
        levelRequired: 80,
        masteryXpPerTick: 10,
        successRate: 0.6,
    }
];
