/**
 * Creates a fresh player state with all skills at level 1.
 */

import type { PlayerState, SkillId, SkillState } from '../types';

const ALL_SKILLS: SkillId[] = [
    'mining',
    'logging',
    'harvesting',
    'scavenging',
    'fishing',
    'cooking',
    'smithing',
    'crafting',
    'farming',
    'herblore',
    'agility',
    'attack',
    'strength',
    'defence',
    'hitpoints',
];

function makeSkill(id: SkillId, startXP: number = 0): SkillState {
    return {
        id,
        xp: startXP,
        level: startXP > 0 ? 1 : 1, // Will be recalculated by XPTable
        mastery: {},
    };
}

export function createNewPlayer(name: string = 'Adventurer'): PlayerState {
    const skills = {} as Record<SkillId, SkillState>;
    for (const skillId of ALL_SKILLS) {
        // Hitpoints starts at level 10 (1,154 XP) like classic RPGs
        if (skillId === 'hitpoints') {
            skills[skillId] = makeSkill(skillId, 1154);
            skills[skillId].level = 10;
        } else {
            skills[skillId] = makeSkill(skillId);
        }
    }

    return {
        name,
        skills,
        inventory: [],
        equipment: {},
        gold: 0,
        combatStats: {
            maxHitpoints: 100,
            currentHitpoints: 100,
            attackSpeed: 2400,
            maxHit: 1,
            accuracy: 1,
            meleeDefence: 1,
            rangedDefence: 1,
            magicDefence: 1,
        },
        activeTask: null,
        lastSaveTimestamp: Date.now(),
    };
}
