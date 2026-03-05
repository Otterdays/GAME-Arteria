/**
 * Mastery system: earn 1 point per level-up per skill, spend on permanent buffs.
 * [TRACE: DOCU/ROADMAP Phase 3, SUMMARY — Mastery System]
 */

import type { SkillId } from '@/store/gameSlice';
import type { PlayerState } from '@/store/gameSlice';

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
}

/** Upgrades available per skill. */
export const MASTERY_UPGRADES: Partial<Record<SkillId, MasteryUpgradeDef[]>> = {
    mining: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    logging: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    fishing: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    runecrafting: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% runes', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    smithing: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% bars', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    forging: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% gear', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    cooking: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% food', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    harvesting: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    scavenging: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
    herblore: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% potions', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, yieldPercentPerLevel: 3 },
        { id: 'speed_bonus', label: '+4% speed', cost: 2, maxLevel: 3, xpPercentPerLevel: 0, speedPercentPerLevel: 4 },
    ],
};

/** Returns XP multiplier from mastery (e.g. 1.05 for 5% bonus). */
export function getMasteryXpMultiplier(player: PlayerState, skillId: SkillId): number {
    const spent = player.masterySpent?.[skillId];
    const upgrades = MASTERY_UPGRADES[skillId];
    if (!spent || !upgrades) return 1;
    let percent = 0;
    for (const u of upgrades) {
        const level = spent[u.id] ?? 0;
        percent += level * u.xpPercentPerLevel;
    }
    return 1 + percent / 100;
}

/** Returns yield multiplier from mastery (e.g. 1.03 for 3% bonus). */
export function getMasteryYieldMultiplier(player: PlayerState, skillId: SkillId): number {
    const spent = player.masterySpent?.[skillId];
    const upgrades = MASTERY_UPGRADES[skillId];
    if (!spent || !upgrades) return 1;
    let percent = 0;
    for (const u of upgrades) {
        const level = spent[u.id] ?? 0;
        percent += level * (u.yieldPercentPerLevel ?? 0);
    }
    return 1 + percent / 100;
}

/** Returns speed multiplier from mastery (e.g. 1.12 for 12% faster ticks). */
export function getMasterySpeedMultiplier(player: PlayerState, skillId: SkillId): number {
    const spent = player.masterySpent?.[skillId];
    const upgrades = MASTERY_UPGRADES[skillId];
    if (!spent || !upgrades) return 1;
    let percent = 0;
    for (const u of upgrades) {
        const level = spent[u.id] ?? 0;
        percent += level * (u.speedPercentPerLevel ?? 0);
    }
    return 1 + percent / 100;
}
