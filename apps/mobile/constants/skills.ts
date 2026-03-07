/**
 * Shared skill metadata for Skills screen, QuickSwitchSidebar, GlobalActionTicker, etc.
 * [TRACE: ROADMAP U. Quick-Switch Sidebar]
 * 
* MASTERY_EXPANSION_GROUNDWORK:
 * - TODO: Add miniSpecs array to skill definitions (3 mini-specs unlock at level 25)
 * - See DOCU/MASTER_DESIGN_DOC.md Chapter 6 for full mastery expansion design
 */

export interface MiniSpecDef {
    id: string;
    label: string;
    description: string;
}

// Mini-specs: 3 options per skill, chosen at level 25 (permanent)
// TODO: Move these to skill-specific files when UI component added
export const MINI_SPECS: Partial<Record<SkillId, MiniSpecDef[]>> = {
    mining: [
        { id: 'gem_seeker', label: 'Gem Seeker', description: '+gem chance' },
        { id: 'vein_hunter', label: 'Vein Hunter', description: 'Rich veins glow' },
        { id: 'rat_operative', label: 'Rat Operative', description: 'Vein depletes slower' },
    ],
    logging: [
        { id: 'diplomat', label: 'Diplomat', description: 'Higher yield' },
        { id: 'speed_chopper', label: 'Speed Chopper', description: 'Faster chopping' },
        { id: 'seasonal', label: 'Seasonal Forecaster', description: 'Event boost' },
    ],
    fishing: [
        { id: 'patient_angler', label: 'Patient Angler', description: 'Rare chance' },
        { id: 'quick_catcher', label: 'Quick Catcher', description: 'Speed boost' },
        { id: 'river_sage', label: 'River Sage', description: 'Quality fish' },
    ],
    smithing: [
        { id: 'efficient_smelter', label: 'Efficient Smelter', description: 'Fuel saved' },
        { id: 'purist', label: 'Purist', description: 'Bar quality' },
        { id: 'experimentalist', label: 'Experimentalist', description: 'Quirk chance' },
    ],
    forging: [
        { id: 'weapon_master', label: 'Weapon Master', description: 'Weapon stats' },
        { id: 'armorer', label: 'Armorer', description: 'Defensive focus' },
        { id: 'quirksmith', label: 'Quirksmith', description: 'Quirk frequency' },
    ],
    runecrafting: [
        { id: 'essence_saver', label: 'Essence Saver', description: 'Less waste' },
        { id: 'rune_weaver', label: 'Rune Weaver', description: 'Multi-rune' },
        { id: 'cosmic_aligned', label: 'Cosmic Aligned', description: 'Time bonus' },
    ],
    cooking: [
        { id: 'quick_chef', label: 'Quick Chef', description: 'Speed boost' },
        { id: 'gourmet', label: 'Gourmet', description: 'Buff duration' },
        { id: 'experimental', label: 'Experimental', description: 'Discovery chance' },
    ],
    herblore: [
        { id: 'herbalist', label: 'Herbalist', description: 'Higher yield' },
        { id: 'alchemist', label: 'Alchemist', description: 'Potency' },
        { id: 'bard', label: 'Bard', description: 'Effect flavor' },
    ],
    harvesting: [
        { id: 'seasonal_sense', label: 'Seasonal Sense', description: 'Rotation boost' },
        { id: 'yield_farmer', label: 'Yield Farmer', description: 'More quantity' },
        { id: 'botanist', label: 'Botanist', description: 'Quality plants' },
    ],
    scavenging: [
        { id: 'curse_finder', label: 'Curse Finder', description: 'Curse chance' },
        { id: 'rare_hunter', label: 'Rare Hunter', description: 'Rare loot' },
        { id: 'scrap_saver', label: 'Scrap Saver', description: 'Higher yield' },
    ],
};

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
    | 'construction'
    | 'leadership'
    | 'adventure'
    | 'dungeoneering'
    | 'astrology'
    | 'summoning'
    | 'slayer'
    | 'prayer'
    | 'attack'
    | 'strength'
    | 'defence'
    | 'hitpoints'
    | 'woodworking'
    | 'sorcery'
    | 'wizardry'
    | 'ranged'
    | 'alchemy'
    | 'exploration'
    | 'cleansing'
    | 'barter'
    | 'research'
    | 'chaostheory'
    | 'aetherweaving'
    | 'voidwalking'
    | 'celestialbinding'
    | 'chronomancy'
    | 'constitution'
    | 'firemaking'
    | 'magic';

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
    construction: { label: 'Construction', color: '#d35400', emoji: '🏗️' },
    leadership: { label: 'Leadership', color: '#f59e0b', emoji: '👑' },
    adventure: { label: 'Adventure', color: '#22c55e', emoji: '🧭' },
    dungeoneering: { label: 'Dungeon Dwelling', color: '#64748b', emoji: '🗝️' },
    astrology: { label: 'Astrology', color: '#6366f1', emoji: '🔭' },
    summoning: { label: 'Summoning', color: '#0ea5e9', emoji: '🔮' },
    slayer: { label: 'Slayer', color: '#dc2626', emoji: '💀' },
    prayer: { label: 'Prayer', color: '#eab308', emoji: '✨' },
    attack: { label: 'Attack', color: palette.skillAttack, emoji: '⚔️' },
    strength: { label: 'Strength', color: palette.skillStrength, emoji: '💪' },
    defence: { label: 'Defence', color: palette.skillDefence, emoji: '🛡️' },
    hitpoints: { label: 'Hitpoints', color: palette.skillHitpoints, emoji: '❤️' },
    woodworking: { label: 'Woodworking', color: palette.skillWoodworking, emoji: '🪵' },
    sorcery: { label: 'Sorcery', color: palette.skillSorcery, emoji: '🪄' },
    wizardry: { label: 'Wizardry', color: palette.skillWizardry, emoji: '🧙' },
    ranged: { label: 'Ranged', color: palette.skillRanged, emoji: '🏹' },
    alchemy: { label: 'Alchemy', color: palette.skillAlchemy, emoji: '⚗️' },
    exploration: { label: 'Exploration', color: palette.skillExploration, emoji: '🗺️' },
    cleansing: { label: 'Cleansing', color: palette.skillCleansing, emoji: '🧼' },
    barter: { label: 'Barter', color: palette.skillBarter, emoji: '💰' },
    research: { label: 'Research', color: palette.skillResearch, emoji: '📚' },
    chaostheory: { label: 'Chaos Theory', color: palette.skillChaostheory, emoji: '🎲' },
    aetherweaving: { label: 'Aether Weaving', color: palette.skillAetherweaving, emoji: '🌌' },
    voidwalking: { label: 'Void Walking', color: palette.skillVoidwalking, emoji: '👣' },
    celestialbinding: { label: 'Celestial Binding', color: palette.skillCelestialbinding, emoji: '⛓️' },
    chronomancy: { label: 'Chronomancy', color: palette.skillChronomancy, emoji: '⏳' },
    constitution: { label: 'Constitution', color: palette.skillConstitution, emoji: '🧬' },
    firemaking: { label: 'Firemaking', color: palette.skillFiremaking, emoji: '🔥' },
    magic: { label: 'Magic', color: palette.skillMagic, emoji: '🔮' },
};

export const IMPLEMENTED_GATHERING_SKILLS: SkillId[] = [
    'mining',
    'logging',
    'fishing',
    'harvesting',
    'scavenging',
    'astrology',
];

export const IMPLEMENTED_CRAFTING_SKILLS: SkillId[] = [
    'runecrafting',
    'smithing',
    'forging',
    'cooking',
    'herblore',
    'crafting',
];

export const IMPLEMENTED_SUPPORT_SKILLS: SkillId[] = [
    'agility',
];

export const IMPLEMENTED_SKILLS = new Set<SkillId>([
    ...IMPLEMENTED_GATHERING_SKILLS,
    ...IMPLEMENTED_CRAFTING_SKILLS,
    ...IMPLEMENTED_SUPPORT_SKILLS,
    'leadership',
    'summoning',
    'slayer',
]);
