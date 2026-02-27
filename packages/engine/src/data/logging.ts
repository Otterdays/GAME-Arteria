/**
 * Skill data definitions — logging actions.
 * These define what each tree produces, its XP rates, and requirements.
 */

import type { ActionDefinition } from '../TickSystem';

export const LOGGING_ACTIONS: ActionDefinition[] = [
    {
        id: 'normal_tree',
        skillId: 'logging',
        intervalMs: 3000,
        xpPerTick: 10,
        itemsPerTick: [{ id: 'normal_log', quantity: 1 }],
        levelRequired: 1,
        masteryXpPerTick: 1,
    },
    {
        id: 'oak_tree',
        skillId: 'logging',
        intervalMs: 4000,
        xpPerTick: 37.5,
        itemsPerTick: [{ id: 'oak_log', quantity: 1 }],
        levelRequired: 15,
        masteryXpPerTick: 2,
        successRate: 0.95,
    },
    {
        id: 'willow_tree',
        skillId: 'logging',
        intervalMs: 5000,
        xpPerTick: 67.5,
        itemsPerTick: [{ id: 'willow_log', quantity: 1 }],
        levelRequired: 30,
        masteryXpPerTick: 3,
        successRate: 0.9,
    },
    {
        id: 'teak_tree',
        skillId: 'logging',
        intervalMs: 6000,
        xpPerTick: 85,
        itemsPerTick: [{ id: 'teak_log', quantity: 1 }],
        levelRequired: 35,
        masteryXpPerTick: 4,
        successRate: 0.85,
    },
    {
        id: 'maple_tree',
        skillId: 'logging',
        intervalMs: 7000,
        xpPerTick: 100,
        itemsPerTick: [{ id: 'maple_log', quantity: 1 }],
        levelRequired: 45,
        masteryXpPerTick: 5,
        successRate: 0.8,
    },
    {
        id: 'mahogany_tree',
        skillId: 'logging',
        intervalMs: 8000,
        xpPerTick: 125,
        itemsPerTick: [{ id: 'mahogany_log', quantity: 1 }],
        levelRequired: 50,
        masteryXpPerTick: 6,
        successRate: 0.75,
    },
    {
        id: 'yew_tree',
        skillId: 'logging',
        intervalMs: 10000,
        xpPerTick: 175,
        itemsPerTick: [{ id: 'yew_log', quantity: 1 }],
        levelRequired: 60,
        masteryXpPerTick: 8,
        successRate: 0.7,
    },
    {
        id: 'magic_tree',
        skillId: 'logging',
        intervalMs: 15000,
        xpPerTick: 250,
        itemsPerTick: [{ id: 'magic_log', quantity: 1 }],
        levelRequired: 75,
        masteryXpPerTick: 10,
        successRate: 0.65,
    },
    {
        id: 'cosmic_tree',
        skillId: 'logging',
        intervalMs: 20000,
        xpPerTick: 500,
        itemsPerTick: [{ id: 'cosmic_wood', quantity: 1 }],
        levelRequired: 90,
        masteryXpPerTick: 15,
        successRate: 0.5,
    }
];
