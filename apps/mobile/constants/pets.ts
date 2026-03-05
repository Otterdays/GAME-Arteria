import { SkillId } from '@/store/gameSlice';

export interface PetMeta {
    id: string;
    name: string;
    description: string;
    skillId: SkillId;
    /** Base chance to drop per successful action tick */
    dropChanceBase: number;
    emoji: string;
}

export const SKILL_PETS: Record<string, PetMeta> = {
    pet_rocky: {
        id: 'pet_rocky',
        name: 'Rocky',
        description: 'A small, weirdly smooth rock. (Mining Pet)',
        skillId: 'mining',
        dropChanceBase: 0.0001, // 1 in 10,000
        emoji: '🪨',
    },
    pet_timber: {
        id: 'pet_timber',
        name: 'Timber',
        description: 'A tiny sapling that yells "Timber!". (Logging Pet)',
        skillId: 'logging',
        dropChanceBase: 0.0001,
        emoji: '🪵',
    },
    pet_bubbles: {
        id: 'pet_bubbles',
        name: 'Bubbles',
        description: 'A fish that floats in the air. (Fishing Pet)',
        skillId: 'fishing',
        dropChanceBase: 0.0001,
        emoji: '🫧',
    },
    pet_void: {
        id: 'pet_void',
        name: 'Voidling',
        description: 'A wisp of cosmic energy. (Runecrafting Pet)',
        skillId: 'runecrafting',
        dropChanceBase: 0.0001,
        emoji: '🌌',
    },
    pet_sparks: {
        id: 'pet_sparks',
        name: 'Sparks',
        description: 'A tiny, harmless flame. (Smithing Pet)',
        skillId: 'smithing',
        dropChanceBase: 0.0001,
        emoji: '🔥',
    },
    pet_chef: {
        id: 'pet_chef',
        name: 'Lil Chef',
        description: 'A rat with a chef hat. Wait a minute... (Cooking Pet)',
        skillId: 'cooking',
        dropChanceBase: 0.0001,
        emoji: '🐀',
    },
    pet_anvil: {
        id: 'pet_anvil',
        name: 'Clank',
        description: 'A very dense, miniature anvil. (Forging Pet)',
        skillId: 'forging',
        dropChanceBase: 0.0001,
        emoji: '🔨',
    },
    pet_brew: {
        id: 'pet_brew',
        name: 'Fizz',
        description: 'A tiny cauldron that follows you around. (Herblore Pet)',
        skillId: 'herblore',
        dropChanceBase: 0.0001,
        emoji: '🧪',
    },
};

export const ALL_PET_IDS = Object.keys(SKILL_PETS);
