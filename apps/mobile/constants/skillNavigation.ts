import type { SkillId } from '@/store/gameSlice';

export type { SkillId };

export const SKILL_NAV_ORDER: SkillId[] = [
    'agility' /* a */,
    'alchemy',
    'astrology',
    'resonance',
    'exploration',
    'wizardry',
    'sorcery',
    'cooking' /* c */,
    'crafting',
    'farming' /* f */,
    'fletching',
    'firemaking',
    'tailoring',
    'woodworking',
    'fishing',
    'forging',
    'harvesting' /* h */,
    'herblore',
    'leadership' /* l */,
    'logging',
    'mining' /* m */,
    'runecrafting' /* r */,
    'scavenging' /* s */,
    'slayer',
    'smithing',
    'summoning',
    'thieving' /* t */,
];

export function getNextSkill(current: SkillId): SkillId {
    const idx = SKILL_NAV_ORDER.indexOf(current);
    const nextIdx = (idx + 1) % SKILL_NAV_ORDER.length;
    return SKILL_NAV_ORDER[nextIdx];
}

export function getPrevSkill(current: SkillId): SkillId {
    const idx = SKILL_NAV_ORDER.indexOf(current);
    const prevIdx = (idx - 1 + SKILL_NAV_ORDER.length) % SKILL_NAV_ORDER.length;
    return SKILL_NAV_ORDER[prevIdx];
}
