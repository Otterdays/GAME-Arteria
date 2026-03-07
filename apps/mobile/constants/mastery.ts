/**
 * Mastery system: earn 1 point per level-up per skill, spend on permanent buffs.
 * [TRACE: DOCU/ROADMAP Phase 3, SUMMARY — Mastery System]
 */

import type { SkillId } from '@/store/gameSlice';
import type { PlayerState } from '@/store/gameSlice';

// MASTERY_EXPANSION_GROUNDWORK: See DOCU/MASTER_DESIGN_DOC.md Chapter 6
// - Soft-capped infinite system: 1 point/level, max 10 per type, diminishing after 6
// - Mini-specs at level 25 (choose 1 of 3, permanent)
// - Full specs at level 50 (choose 1 of 3, permanent)
// - Synergies: 5 combos, 15+ planned
// - Hybrid prestige: Keep specs/mastery/items on transcend, XP curve flattened
// - Item mastery: Craft 100+/500+/1000+/5000+ for speed/yield/extra/perfect
// TODO: Future: Global Mastery Points (spend across all skills)
// TODO: Future: Full Mastery Trees (3 tiers, 9 nodes per skill)

export interface MasteryUpgradeDef {
    id: string;
    label: string;
    cost: number;
    maxLevel: number;
    /** Per level: e.g. 5 = +5% XP per level (max 5 levels = +25%). */
    xpPercentPerLevel: number;
    /** Per level: e.g. 3 = +3% yield per level. */
    yieldPercentPerLevel?: number;
    /** Per level: e.g. 4 = +4% speed (shorter ticks) per level. */
    speedPercentPerLevel?: number;
    /** Per level: % chance for double drop. */
    doubleDropPerLevel?: number;
    /** Per level: % reduction in burn/fail rate. */
    preservePerLevel?: number;
    /** Description for the tooltip. */
    desc?: string;
}

/** Upgrades available per skill. */
export const MASTERY_UPGRADES: Partial<Record<SkillId, MasteryUpgradeDef[]>> = {
    mining: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'double_ore', label: '+5% double ore', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 5, desc: 'Chance to mine 2× ore per tick' },
        { id: 'gem_finder', label: '+2% gem find', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 2, desc: 'Increased rare gem drop chance' },
    ],
    logging: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'double_log', label: '+5% double log', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 5, desc: 'Chance to chop 2× logs per tick' },
        { id: 'birds_nest', label: '+3% bird nest', cost: 3, maxLevel: 2, xpPercentPerLevel: 0, doubleDropPerLevel: 3, desc: 'Chance to find a bird nest with seeds' },
    ],
    fishing: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'double_fish', label: '+5% double fish', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 5, desc: 'Chance to catch 2× fish per tick' },
        { id: 'rare_catch', label: '+2% rare catch', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 2, desc: 'Small chance to hook a rarer fish' },
    ],
    runecrafting: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% runes', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'extra_rune', label: '+4% extra rune', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 4, desc: 'Chance for +1 bonus rune per batch' },
        { id: 'essence_saver', label: '+5% save essence', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, preservePerLevel: 5, desc: 'Chance to not consume essence' },
    ],
    smithing: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% bars', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'double_bar', label: '+5% double bar', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 5, desc: 'Chance to smelt 2× bars per tick' },
        { id: 'ore_saver', label: '+4% save ore', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, preservePerLevel: 4, desc: 'Chance to not consume ore' },
    ],
    forging: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% gear', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'double_craft', label: '+4% double craft', cost: 3, maxLevel: 2, xpPercentPerLevel: 0, doubleDropPerLevel: 4, desc: 'Chance to forge an extra piece' },
        { id: 'bar_saver', label: '+5% save bars', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, preservePerLevel: 5, desc: 'Chance to not consume bars' },
    ],
    cooking: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% food', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'burn_guard', label: '+6% burn guard', cost: 2, maxLevel: 5, xpPercentPerLevel: 0, preservePerLevel: 6, desc: 'Reduces chance of burning food' },
        { id: 'double_cook', label: '+4% double cook', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 4, desc: 'Chance to cook 2× food per tick' },
    ],
    harvesting: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'double_harvest', label: '+5% double', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 5, desc: 'Chance to harvest 2× per tick' },
        { id: 'seed_finder', label: '+3% find seeds', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 3, desc: 'Chance to find bonus seeds' },
    ],
    scavenging: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'double_scavenge', label: '+5% double loot', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 5, desc: 'Chance to find 2× materials' },
        { id: 'rare_find', label: '+2% rare find', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 2, desc: 'Chance to find rare artifacts' },
    ],
    herblore: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% potions', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
        { id: 'herb_saver', label: '+5% save herbs', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, preservePerLevel: 5, desc: 'Chance to not consume herbs' },
        { id: 'double_brew', label: '+4% double brew', cost: 3, maxLevel: 3, xpPercentPerLevel: 0, doubleDropPerLevel: 4, desc: 'Chance to brew 2× potions' },
    ],
};

/// Mastery soft cap: Max 10 points per upgrade type, diminishing after 6
const MASTERY_SOFT_CAP = 6;
const MASTERY_MAX_LEVEL = 10;
const BASE_BONUS_PER_LEVEL = 15; // % bonus per level first 6
const SOFT_CAP_BONUS_PER_LEVEL = 8; // % bonus per level 7-10 (diminished)

/**
 * Calculate effective bonus with diminishing returns.
 * - Levels 1-6: 15% per level
 * - Levels 7-10: 8% per level (soft cap)
 * Max total: 6*15 + 4*8 = 122% per upgrade type
 */
function diminishingBonus(level: number): number {
    if (level <= MASTERY_SOFT_CAP) {
        return level * BASE_BONUS_PER_LEVEL;
    }
    const baseBonus = MASTERY_SOFT_CAP * BASE_BONUS_PER_LEVEL;
    const extraLevels = level - MASTERY_SOFT_CAP;
    return baseBonus + extraLevels * SOFT_CAP_BONUS_PER_LEVEL;
}

/** Returns XP multiplier from mastery (e.g. 1.05 for 5% bonus) with soft caps. */
export function getMasteryXpMultiplier(player: PlayerState, skillId: SkillId): number {
    const spent = player.masterySpent?.[skillId];
    const upgrades = MASTERY_UPGRADES[skillId];
    if (!spent || !upgrades) return 1;
    let percent = 0;
    for (const u of upgrades) {
        const level = Math.min(spent[u.id] ?? 0, MASTERY_MAX_LEVEL);
        percent += (u.xpPercentPerLevel * level) / MASTERY_MAX_LEVEL;
    }
    return 1 + percent / 100;
}

/** Returns yield multiplier from mastery (e.g. 1.03 for 3% bonus) with soft caps. */
export function getMasteryYieldMultiplier(player: PlayerState, skillId: SkillId): number {
    const spent = player.masterySpent?.[skillId];
    const upgrades = MASTERY_UPGRADES[skillId];
    if (!spent || !upgrades) return 1;
    let percent = 0;
    for (const u of upgrades) {
        const level = Math.min(spent[u.id] ?? 0, MASTERY_MAX_LEVEL);
        const bonus = diminishingBonus(level);
        percent += (bonus * (u.yieldPercentPerLevel ?? 0)) / (BASE_BONUS_PER_LEVEL * MASTERY_MAX_LEVEL);
    }
    return 1 + percent / 100;
}

/** Returns speed multiplier from mastery (e.g. 1.12 for 12% faster ticks) with soft caps. */
export function getMasterySpeedMultiplier(player: PlayerState, skillId: SkillId): number {
    const spent = player.masterySpent?.[skillId];
    const upgrades = MASTERY_UPGRADES[skillId];
    if (!spent || !upgrades) return 1;
    let percent = 0;
    for (const u of upgrades) {
        const level = Math.min(spent[u.id] ?? 0, MASTERY_MAX_LEVEL);
        const bonus = diminishingBonus(level);
        percent += (bonus * (u.speedPercentPerLevel ?? 0)) / (BASE_BONUS_PER_LEVEL * MASTERY_MAX_LEVEL);
    }
    return 1 + percent / 100;
}

/** Returns the total double-drop chance (0–1) from all double-drop mastery upgrades for a skill. */
export function getMasteryDoubleDropChance(player: PlayerState, skillId: SkillId): number {
    const spent = player.masterySpent?.[skillId];
    const upgrades = MASTERY_UPGRADES[skillId];
    if (!spent || !upgrades) return 0;
    let percent = 0;
    for (const u of upgrades) {
        if (!u.doubleDropPerLevel) continue;
        const level = spent[u.id] ?? 0;
        percent += u.doubleDropPerLevel * level;
    }
    return Math.min(1, percent / 100);
}

/** Returns the total preserve/save chance (0–1) from all preserve mastery upgrades for a skill. */
export function getMasteryPreserveChance(player: PlayerState, skillId: SkillId): number {
    const spent = player.masterySpent?.[skillId];
    const upgrades = MASTERY_UPGRADES[skillId];
    if (!spent || !upgrades) return 0;
    let percent = 0;
    for (const u of upgrades) {
        if (!u.preservePerLevel) continue;
        const level = spent[u.id] ?? 0;
        percent += u.preservePerLevel * level;
    }
    return Math.min(1, percent / 100);
}

/** Returns the purchased level for a specific upgrade on a skill. */
export function getMasteryBonusLevel(player: PlayerState, skillId: SkillId, upgradeId: string): number {
    return player.masterySpent?.[skillId]?.[upgradeId] ?? 0;
}

/** 
 * Item Mastery: Bonuses based on total produced count.
 * T1: 100+ -> +5% speed
 * T2: 500+ -> +10% yield
 * T3: 2500+ -> +15% speed (total)
 * T4: 10000+ -> +20% yield (total)
 */
export function getItemMasteryTier(count: number): number {
    if (count >= 10000) return 4;
    if (count >= 2500) return 3;
    if (count >= 500) return 2;
    if (count >= 100) return 1;
    return 0;
}

export function getItemMasterySpeedBonus(count: number): number {
    const tier = getItemMasteryTier(count);
    if (tier >= 3) return 1.15;
    if (tier >= 1) return 1.05;
    return 1;
}

export function getItemMasteryYieldBonus(count: number): number {
    const tier = getItemMasteryTier(count);
    if (tier >= 4) return 1.20;
    if (tier >= 2) return 1.10;
    return 1;
}

export function getPerfectCookChance(player: PlayerState, itemId: string): number {
    const stats = player.itemMastery?.[itemId];
    const tier = stats ? getItemMasteryTier(stats.totalProduced) : 0;
    // 2% base + 2% per tier (Max 10%)
    return 0.02 + (tier * 0.02);
}
