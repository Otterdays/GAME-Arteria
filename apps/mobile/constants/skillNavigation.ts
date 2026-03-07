export type SkillId =
    | 'astrology'
    | 'cooking'
    | 'fishing'
    | 'forging'
    | 'harvesting'
    | 'herblore'
    | 'logging'
    | 'mining'
    | 'runecrafting'
    | 'scavenging'
    | 'smithing'
    | 'leadership'
    | 'summoning'
    | 'slayer';

export const SKILL_NAV_ORDER: SkillId[] = [
    'astrology',
    'cooking',
    'fishing',
    'forging',
    'harvesting',
    'herblore',
    'leadership',
    'logging',
    'mining',
    'runecrafting',
    'scavenging',
    'slayer',
    'smithing',
    'summoning',
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
