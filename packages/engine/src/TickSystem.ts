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
    /** Unique Mechanic: Chance (0-1) per tick to find a rare bonus item (found in Fishing, Mining) */
    rareChance?: number;
    /** Unique Mechanic: Bonus items to award if rareChance succeeds */
    rareItems?: InventoryItem[];
    /** Unique Mechanic: Yield multiplier (1.0 = base, 1.2 = +20% yield) used for Seasonal Rotation */
    yieldMultiplier?: number;
    /** Unique Mechanic: Chance (0-1) per item to drop as a "Cursed" variant (found in Scavenging) */
    curseChance?: number;
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
        let rareItemCount = 0;
        let curseItemProcs = 0;

        for (let i = 0; i < fullTicks; i++) {
            if (rng() <= successRate) {
                successfulTicks++;
                // Check for rare item drop (Unique Mechanic)
                if (action.rareChance && action.rareItems && rng() <= action.rareChance) {
                    rareItemCount++;
                }

                if (action.curseChance && rng() <= action.curseChance) {
                    curseItemProcs++;
                }
            }
        }

        result.ticksProcessed = fullTicks;

        if (successfulTicks > 0) {
            if (action.skillId) {
                result.xpGained[action.skillId] =
                    (result.xpGained[action.skillId] || 0) + action.xpPerTick * successfulTicks;
            }

            // Aggregate base items
            const multiplier = action.yieldMultiplier ?? 1;
            for (const item of action.itemsPerTick) {
                let quantityToGiveNormal = Math.floor(item.quantity * successfulTicks * multiplier);

                // If the curse mechanic triggered, convert some normal output to cursed output
                if (curseItemProcs > 0 && quantityToGiveNormal > 0) {
                    const quantityToCurse = Math.min(Math.floor(item.quantity * curseItemProcs * multiplier), quantityToGiveNormal);

                    if (quantityToCurse > 0) {
                        quantityToGiveNormal -= quantityToCurse;

                        const cursedId = `cursed_${item.id}`;
                        const existingCursed = result.itemsGained.find((i) => i.id === cursedId);
                        if (existingCursed) {
                            existingCursed.quantity += quantityToCurse;
                        } else {
                            result.itemsGained.push({
                                id: cursedId,
                                quantity: quantityToCurse,
                            });
                        }
                    }
                }

                if (quantityToGiveNormal > 0) {
                    const existingNormal = result.itemsGained.find((i) => i.id === item.id);
                    if (existingNormal) {
                        existingNormal.quantity += quantityToGiveNormal;
                    } else {
                        result.itemsGained.push({
                            id: item.id,
                            quantity: quantityToGiveNormal,
                        });
                    }
                }
            }

            // Aggregate rare items (Unique Mechanic: Mythic Fish / Gems)
            if (rareItemCount > 0 && action.rareItems) {
                for (const item of action.rareItems) {
                    const existing = result.itemsGained.find((i) => i.id === item.id);
                    if (existing) {
                        existing.quantity += item.quantity * rareItemCount;
                    } else {
                        result.itemsGained.push({
                            id: item.id,
                            quantity: item.quantity * rareItemCount,
                        });
                    }
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

