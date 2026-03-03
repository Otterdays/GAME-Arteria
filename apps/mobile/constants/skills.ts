/**
 * Shared skill metadata for Skills screen, QuickSwitchSidebar, GlobalActionTicker, etc.
 * [TRACE: ROADMAP U. Quick-Switch Sidebar]
 */

import { Palette } from '@/constants/theme';

export type SkillId =
    | 'mining'
    | 'logging'
    | 'fishing'
    | 'runecrafting'
    | 'harvesting'
    | 'scavenging'
    | 'cooking'
    | 'smithing'
    | 'crafting'
    | 'farming'
    | 'herblore'
    | 'agility'
    | 'attack'
    | 'strength'
    | 'defence'
    | 'hitpoints';

export interface SkillMeta {
    label: string;
    color: string;
    emoji: string;
}

export const SKILL_META: Record<SkillId, SkillMeta> = {
    mining: { label: 'Mining', color: Palette.skillMining, emoji: '⛏️' },
    logging: { label: 'Logging', color: Palette.skillLogging, emoji: '🪓' },
    harvesting: { label: 'Harvesting', color: Palette.skillHarvesting, emoji: '🪴' },
    scavenging: { label: 'Scavenging', color: Palette.skillScavenging, emoji: '🏕️' },
    fishing: { label: 'Fishing', color: Palette.skillFishing, emoji: '🎣' },
    runecrafting: { label: 'Runecrafting', color: '#9b59b6', emoji: '✨' },
    cooking: { label: 'Cooking', color: Palette.skillCooking, emoji: '🍳' },
    smithing: { label: 'Smithing', color: Palette.skillSmithing, emoji: '🔨' },
    crafting: { label: 'Crafting', color: Palette.skillCrafting, emoji: '✂️' },
    farming: { label: 'Farming', color: Palette.skillFarming, emoji: '🌾' },
    herblore: { label: 'Herblore', color: Palette.skillHerblore, emoji: '🧪' },
    agility: { label: 'Agility', color: Palette.skillAgility, emoji: '🏃' },
    attack: { label: 'Attack', color: Palette.skillAttack, emoji: '⚔️' },
    strength: { label: 'Strength', color: Palette.skillStrength, emoji: '💪' },
    defence: { label: 'Defence', color: Palette.skillDefence, emoji: '🛡️' },
    hitpoints: { label: 'Hitpoints', color: Palette.skillHitpoints, emoji: '❤️' },
};

export const IMPLEMENTED_GATHERING_SKILLS: SkillId[] = [
    'mining',
    'logging',
    'fishing',
    'runecrafting',
];

export const IMPLEMENTED_SKILLS = new Set<SkillId>(IMPLEMENTED_GATHERING_SKILLS);
