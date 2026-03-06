/**
 * Prayer definitions for the Prayer skill.
 * Each prayer has a level requirement, prayer point drain rate,
 * and combat bonuses it provides.
 * Inspired by OSRS-style prayer system.
 */

export interface PrayerDef {
    id: string;
    label: string;
    emoji: string;
    description: string;
    /** Minimum Prayer level required to use. */
    levelRequired: number;
    /** Prayer points drained per combat tick (100ms). */
    drainPerTick: number;
    /** Bonuses applied while this prayer is active. */
    bonuses: {
        attackPercent?: number;    // e.g. 0.05 = +5%
        strengthPercent?: number;  // e.g. 0.05 = +5%
        defencePercent?: number;   // e.g. 0.05 = +5%
        accuracyFlat?: number;     // flat accuracy bonus
        maxHitFlat?: number;       // flat max hit bonus
        damageReductionPercent?: number; // e.g. 0.10 = -10% incoming dmg
    };
}

export const PRAYERS: PrayerDef[] = [
    {
        id: 'thick_skin',
        label: 'Thick Skin',
        emoji: '🛡️',
        description: '+5% Defence',
        levelRequired: 1,
        drainPerTick: 0.3,
        bonuses: { defencePercent: 0.05 },
    },
    {
        id: 'burst_of_strength',
        label: 'Burst of Strength',
        emoji: '💪',
        description: '+5% Strength',
        levelRequired: 4,
        drainPerTick: 0.3,
        bonuses: { strengthPercent: 0.05 },
    },
    {
        id: 'clarity_of_thought',
        label: 'Clarity of Thought',
        emoji: '🎯',
        description: '+5% Accuracy',
        levelRequired: 7,
        drainPerTick: 0.3,
        bonuses: { attackPercent: 0.05 },
    },
    {
        id: 'rock_skin',
        label: 'Rock Skin',
        emoji: '🪨',
        description: '+10% Defence',
        levelRequired: 10,
        drainPerTick: 0.6,
        bonuses: { defencePercent: 0.10 },
    },
    {
        id: 'superhuman_strength',
        label: 'Superhuman Strength',
        emoji: '🔥',
        description: '+10% Strength',
        levelRequired: 13,
        drainPerTick: 0.6,
        bonuses: { strengthPercent: 0.10 },
    },
    {
        id: 'improved_reflexes',
        label: 'Improved Reflexes',
        emoji: '⚡',
        description: '+10% Accuracy',
        levelRequired: 16,
        drainPerTick: 0.6,
        bonuses: { attackPercent: 0.10 },
    },
    {
        id: 'steel_skin',
        label: 'Steel Skin',
        emoji: '🔩',
        description: '+15% Defence',
        levelRequired: 28,
        drainPerTick: 1.2,
        bonuses: { defencePercent: 0.15 },
    },
    {
        id: 'ultimate_strength',
        label: 'Ultimate Strength',
        emoji: '☄️',
        description: '+15% Strength',
        levelRequired: 31,
        drainPerTick: 1.2,
        bonuses: { strengthPercent: 0.15 },
    },
    {
        id: 'incredible_reflexes',
        label: 'Incredible Reflexes',
        emoji: '✨',
        description: '+15% Accuracy',
        levelRequired: 34,
        drainPerTick: 1.2,
        bonuses: { attackPercent: 0.15 },
    },
    {
        id: 'divine_shield',
        label: 'Divine Shield',
        emoji: '🌟',
        description: '10% damage reduction',
        levelRequired: 40,
        drainPerTick: 1.5,
        bonuses: { damageReductionPercent: 0.10 },
    },
    {
        id: 'wrath_of_ancients',
        label: 'Wrath of Ancients',
        emoji: '⚔️',
        description: '+20% Strength, +20% Accuracy',
        levelRequired: 52,
        drainPerTick: 2.0,
        bonuses: { strengthPercent: 0.20, attackPercent: 0.20 },
    },
    {
        id: 'aegis',
        label: 'Aegis',
        emoji: '🏛️',
        description: '+20% Defence, 15% damage reduction',
        levelRequired: 60,
        drainPerTick: 2.5,
        bonuses: { defencePercent: 0.20, damageReductionPercent: 0.15 },
    },
];

/** Lookup by id. */
export const PRAYER_MAP: Record<string, PrayerDef> = {};
for (const p of PRAYERS) {
    PRAYER_MAP[p.id] = p;
}
