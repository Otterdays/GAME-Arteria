/**
 * Shared skill metadata for Skills screen, QuickSwitchSidebar, GlobalActionTicker, etc.
 * [TRACE: ROADMAP U. Quick-Switch Sidebar]
 */

import { THEMES } from '@/constants/theme';

const palette = THEMES.dark;

export type SkillId =
    | 'mining'
    | 'logging'
    | 'fishing'
    | 'runecrafting'
    | 'harvesting'
    | 'scavenging'
    | 'cooking'
    | 'smithing'
    | 'forging'
    | 'crafting'
    | 'farming'
    | 'herblore'
    | 'agility'
    | 'thieving'
    | 'fletching'
    | 'tailoring'
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
    mining: { label: 'Mining', color: palette.skillMining, emoji: '⛏️' },
    logging: { label: 'Logging', color: palette.skillLogging, emoji: '🪓' },
    harvesting: { label: 'Harvesting', color: palette.skillHarvesting, emoji: '🪴' },
    scavenging: { label: 'Scavenging', color: palette.skillScavenging, emoji: '🏕️' },
    fishing: { label: 'Fishing', color: palette.skillFishing, emoji: '🎣' },
    runecrafting: { label: 'Runecrafting', color: '#9b59b6', emoji: '✨' },
    cooking: { label: 'Cooking', color: palette.skillCooking, emoji: '🍳' },
    smithing: { label: 'Smithing', color: palette.skillSmithing, emoji: '🔨' },
    forging: { label: 'Forging', color: palette.skillForging, emoji: '⚒️' },
    crafting: { label: 'Crafting', color: palette.skillCrafting, emoji: '✂️' },
    farming: { label: 'Farming', color: palette.skillFarming, emoji: '🌾' },
    herblore: { label: 'Herblore', color: palette.skillHerblore, emoji: '🧪' },
    agility: { label: 'Agility', color: palette.skillAgility, emoji: '🏃' },
    thieving: { label: 'Thieving', color: palette.skillThieving, emoji: '🎭' },
    fletching: { label: 'Fletching', color: palette.skillFletching, emoji: '🏹' },
    tailoring: { label: 'Tailoring', color: palette.skillTailoring, emoji: '🧵' },
    attack: { label: 'Attack', color: palette.skillAttack, emoji: '⚔️' },
    strength: { label: 'Strength', color: palette.skillStrength, emoji: '💪' },
    defence: { label: 'Defence', color: palette.skillDefence, emoji: '🛡️' },
    hitpoints: { label: 'Hitpoints', color: palette.skillHitpoints, emoji: '❤️' },
};

export const IMPLEMENTED_GATHERING_SKILLS: SkillId[] = [
    'mining',
    'logging',
    'fishing',
    'harvesting',
    'scavenging',
];

export const IMPLEMENTED_CRAFTING_SKILLS: SkillId[] = [
    'runecrafting',
    'smithing',
    'forging',
    'cooking',
    'herblore',
];

/** All skills with implemented screens (sidebar + main grid). */
export const IMPLEMENTED_SKILLS = new Set<SkillId>([
    ...IMPLEMENTED_GATHERING_SKILLS,
    ...IMPLEMENTED_CRAFTING_SKILLS,
]);
