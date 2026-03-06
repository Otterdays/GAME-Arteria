/**
 * Mastery synergy combos: combine skills 25+ each to unlock unique bonuses.
 * MASTERY_EXPANSION_GROUNDWORK: See DOCU/MASTER_DESIGN_DOC.md Chapter 6.4
 * - 5 combos now, 15+ planned
 */

import type { SkillId } from '@/store/gameSlice';
import type { PlayerState } from '@/store/gameSlice';

export interface SynergyDef {
    id: string;
    label: string;
    skills: [SkillId, SkillId];
    minLevel: number;
    description: string;
}

/** Mastery synergy combos available in the game. */
export const SYNERGY_DEFS: SynergyDef[] = [
    {
        id: 'ore_insight',
        label: 'Ore Insight',
        skills: ['mining', 'smithing'],
        minLevel: 25,
        description: 'Rich veins glow, higher vein depletion chance.',
    },
    {
        id: 'forest_father',
        label: 'Forest Father',
        skills: ['logging', 'forging'], // Note: Construction placeholder
        minLevel: 25,
        description: '10% faster construction projects (when implemented).',
    },
    {
        id: 'gourmet_brew',
        label: 'Gourmet Brew',
        skills: ['cooking', 'herblore'],
        minLevel: 25,
        description: 'Potions restore HP when consumed.',
    },
    {
        id: 'fresh_catch',
        label: 'Fresh Catch',
        skills: ['fishing', 'cooking'],
        minLevel: 25,
        description: '15% longer food buff duration.',
    },
    {
        id: 'scrap_knight',
        label: 'Scrap Knight',
        skills: ['scavenging', 'forging'],
        minLevel: 25,
        description: 'Forging uses recycled materials halved.',
    },
];

/** Check if synergy is unlocked based on skill levels and unlock status. */
export function isSynergyUnlocked(
    player: PlayerState,
    synergy: SynergyDef,
): boolean {
    return player.unlockedSynergies?.includes(synergy.id) ?? false;
}

/** Check if synergy is unlockable (skill levels met). */
export function canUnlockSynergy(
    player: PlayerState,
    synergy: SynergyDef,
): boolean {
    return (
        !isSynergyUnlocked(player, synergy) &&
        player.skills[synergy.skills[0]]?.level >= synergy.minLevel &&
        player.skills[synergy.skills[1]]?.level >= synergy.minLevel
    );
}

/** Get all currently unlockable synergies. */
export function getUnlockableSynergies(player: PlayerState): SynergyDef[] {
    return SYNERGY_DEFS.filter((s) => canUnlockSynergy(player, s));
}