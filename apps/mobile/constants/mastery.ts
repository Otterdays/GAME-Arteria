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
}

/** Upgrades available per skill. Only gathering/crafting for now. */
export const MASTERY_UPGRADES: Partial<Record<SkillId, MasteryUpgradeDef[]>> = {
    mining: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
        { id: 'yield_bonus', label: '+3% yield', cost: 2, maxLevel: 3, xpPercentPerLevel: 0 },
    ],
    logging: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
    ],
    fishing: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
    ],
    runecrafting: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
    ],
    smithing: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
    ],
    forging: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
    ],
    cooking: [
        { id: 'xp_bonus', label: '+5% XP', cost: 1, maxLevel: 5, xpPercentPerLevel: 5 },
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
