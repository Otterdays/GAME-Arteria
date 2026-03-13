/**
 * Wizardry skill — Academic study of magic. Research tomes and scrolls for XP.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md §12, sorcery wizardry plan]
 */

export interface WizardryStudy {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    emoji: string;
    description: string;
}

export const WIZARDRY_STUDIES: WizardryStudy[] = [
    {
        id: 'basic_scroll',
        name: 'Basic Scroll Reading',
        levelReq: 1,
        xpPerTick: 15,
        baseTickMs: 4000,
        successRate: 1,
        emoji: '📜',
        description: 'Study foundational magical notation.',
    },
    {
        id: 'tome_of_void',
        name: 'Tome of the Void',
        levelReq: 25,
        xpPerTick: 45,
        baseTickMs: 5500,
        successRate: 0.98,
        emoji: '📕',
        description: 'Decode void-touched manuscripts.',
    },
    {
        id: 'celestial_almanac',
        name: 'Celestial Almanac',
        levelReq: 50,
        xpPerTick: 85,
        baseTickMs: 7000,
        successRate: 0.95,
        emoji: '📘',
        description: 'Study constellations for magic synergy.',
    },
];

export function getStudyById(id: string): WizardryStudy | undefined {
    return WIZARDRY_STUDIES.find((s) => s.id === id);
}
