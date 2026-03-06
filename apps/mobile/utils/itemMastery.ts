/**
 * Item mastery: Track crafting count and unlock mastery tiers.
 * MASTERY_EXPANSION_GROUNDWORK: See DOCU/MASTER_DESIGN_DOC.md Chapter 6.6
 * - Craft 100→speed I, 500→yield II, 1000→extra III, 5000→perfect IV
 */

import type { PlayerState } from '@/store/gameSlice';

// Mastery thresholds and bonuses
const MASTERY_THRESHOLDS = [0, 100, 500, 1000, 5000]; // tiers 0-4
const MASTERY_BONUS_SPEED = [0, 0.05]; // +5% speed at tier I
const MASTERY_BONUS_YIELD = [0, 0, 0.1, 0.15, 0.25]; // +10% II, +15% III, +25% IV
const MASTERY_BONUS_EXTRA_CHANCE = [0, 0, 0, 0.15]; // +15% extra at tier III
const MASTERY_BONUS_PERFECT_CHANCE = [0, 0, 0, 0, 0.25]; // +25% perfect at tier IV

/**
 * Initialize or update item mastery stats when crafting.
 * Returns true if tier increased, false otherwise.
 */
export function updateCrafted(
    player: PlayerState,
    itemId: string,
    crafted: number,
): boolean {
    if (!player.itemMastery) {
        player.itemMastery = {};
    }

    const stats = player.itemMastery[itemId] ?? {
        totalCrafted: 0,
        masteryTier: 0,
        isPerfect: false,
    };

    stats.totalCrafted += crafted;
    const newTier = calculateMasteryTier(stats.totalCrafted);
    const tierIncreased = newTier > stats.masteryTier;
    stats.masteryTier = newTier;
    stats.isPerfect = newTier >= 4 && Math.random() < MASTERY_BONUS_PERFECT_CHANCE[newTier];

    player.itemMastery[itemId] = stats;
    return tierIncreased;
}

/**
 * Calculate mastery tier from total crafted count.
 */
export function calculateMasteryTier(totalCrafted: number): number {
    let tier = 0;
    for (let i = 1; i < MASTERY_THRESHOLDS.length; i++) {
        if (totalCrafted >= MASTERY_THRESHOLDS[i]) {
            tier = i;
        }
    }
    return tier;
}

/**
 * Get craft speed multiplier for an item.
 */
export function getItemSpeedMultiplier(
    player: PlayerState,
    itemId: string,
): number {
    const stats = player.itemMastery?.[itemId];
    if (!stats) return 1;
    return 1 + MASTERY_BONUS_SPEED[stats.masteryTier] ?? 0;
}

/**
 * Get yield multiplier for an item.
 */
export function getItemYieldMultiplier(
    player: PlayerState,
    itemId: string,
): number {
    const stats = player.itemMastery?.[itemId];
    if (!stats) return 1;
    return 1 + (MASTERY_BONUS_YIELD[stats.masteryTier] ?? 0);
}

/**
 * Check if extra item chance is unlocked (tier III+).
 */
export function hasExtraChance(player: PlayerState, itemId: string): boolean {
    const stats = player.itemMastery?.[itemId];
    return stats ? stats.masteryTier >= 3 : false;
}

/**
 * Get extra item chance (e.g., 0.15 for tier III).
 */
export function getExtraChance(player: PlayerState, itemId: string): number {
    const stats = player.itemMastery?.[itemId];
    if (!stats) return 0;
    return MASTERY_BONUS_EXTRA_CHANCE[stats.masteryTier] ?? 0;
}

/**
 * Check if perfect version chance is unlocked (tier IV only).
 */
export function hasPerfectChance(player: PlayerState, itemId: string): boolean {
    const stats = player.itemMastery?.[itemId];
    return stats ? stats.masteryTier >= 4 : false;
}

/**
 * Get perfect version chance (e.g., 0.25 for tier IV).
 */
export function getPerfectChance(player: PlayerState, itemId: string): number {
    const stats = player.itemMastery?.[itemId];
    if (!stats) return 0;
    return MASTERY_BONUS_PERFECT_CHANCE[stats.masteryTier] ?? 0;
}