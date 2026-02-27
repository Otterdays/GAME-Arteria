/**
 * TickSystem — handles discrete action tick processing.
 *
 * The game works on a tick model: each action (mining, fishing, etc.)
 * has an interval. Every interval, one "tick" fires, producing
 * XP, items, or combat results.
 *
 * This module is responsible for:
 *   - Taking a time delta (ms) and determining how many ticks occurred
 *   - Carrying forward partial tick progress
 *   - Producing a TickResult with XP and items gained
 */

import type { ActiveTask, TickResult, SkillId, InventoryItem } from './types';

/** Definition of what a single tick produces for a skill action */
export interface ActionDefinition {
    id: string;
    skillId: SkillId;
    /** ms per tick */
    intervalMs: number;
    /** XP awarded per successful tick */
    xpPerTick: number;
    /** Items produced per tick */
    itemsPerTick: InventoryItem[];
    /** Required skill level to perform */
    levelRequired: number;
    /** Mastery XP per tick */
    masteryXpPerTick: number;
    /** Optional success rate 0–1 (1 = always succeeds) */
    successRate?: number;
}

export const TickSystem = {
    /**
     * Process a time delta against an active task.
     * Returns the result of all ticks that fired within the delta,
     * and updates the task's partialTickMs for carryover.
     *
     * @param deltaMs - elapsed time in milliseconds
     * @param task - the player's currently active task (mutated in place for partialTickMs)
     * @param action - the definition of what this action produces
     * @param rng - optional RNG function (0–1) for success rolls, defaults to Math.random
     */
    processDelta(
        deltaMs: number,
        task: ActiveTask,
        action: ActionDefinition,
        rng: () => number = Math.random
    ): TickResult {
        const result: TickResult = {
            xpGained: {} as Record<SkillId, number>,
            itemsGained: [],
            masteryGained: {},
            ticksProcessed: 0,
        };

        // Add the delta to any leftover partial tick
        let totalMs = task.partialTickMs + deltaMs;
        const interval = action.intervalMs;

        // How many full ticks fit?
        const fullTicks = Math.floor(totalMs / interval);
        task.partialTickMs = totalMs - fullTicks * interval;

        if (fullTicks <= 0) return result;

        const successRate = action.successRate ?? 1;

        // Process each tick
        let successfulTicks = 0;
        for (let i = 0; i < fullTicks; i++) {
            if (rng() <= successRate) {
                successfulTicks++;
            }
        }

        result.ticksProcessed = fullTicks;

        if (successfulTicks > 0) {
            if (action.skillId) {
                result.xpGained[action.skillId] =
                    (result.xpGained[action.skillId] || 0) + action.xpPerTick * successfulTicks;
            }

            // Aggregate items
            for (const item of action.itemsPerTick) {
                const existing = result.itemsGained.find((i) => i.id === item.id);
                if (existing) {
                    existing.quantity += item.quantity * successfulTicks;
                } else {
                    result.itemsGained.push({
                        id: item.id,
                        quantity: item.quantity * successfulTicks,
                    });
                }
            }

            // Mastery
            if (action.masteryXpPerTick > 0) {
                result.masteryGained[action.id] =
                    (result.masteryGained[action.id] || 0) + action.masteryXpPerTick * successfulTicks;
            }
        }

        return result;
    },
};
