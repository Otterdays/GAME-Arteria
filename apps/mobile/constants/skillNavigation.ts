export type SkillId =
    | 'agility'
    | 'astrology'
    | 'resonance'
    | 'cooking'
    | 'crafting'
    | 'fishing'
    | 'forging'
    | 'harvesting'
    | 'herblore'
    | 'logging'
    | 'mining'
    | 'runecrafting'
    | 'scavenging'
    | 'smithing'
    | 'thieving'
    | 'leadership'
    | 'summoning'
    | 'slayer';

export const SKILL_NAV_ORDER: SkillId[] = [
    'agility' /* a */,
    'astrology',
    'resonance',
    'cooking' /* c */,
    'crafting',
    'fishing' /* f */,
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
