/**
 * Sorcery skill — Raw mana channeling. Consume runes to cast spells for XP.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md §11, sorcery wizardry plan]
 */

export interface SorcerySpell {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: { id: string; quantity: number }[];
    emoji: string;
    description: string;
}

export const SORCERY_SPELLS: SorcerySpell[] = [
    {
        id: 'lumina_spark',
        name: 'Lumina Spark',
        levelReq: 1,
        xpPerTick: 18,
        baseTickMs: 3500,
        successRate: 1,
        consumedItems: [
            { id: 'air_rune', quantity: 1 },
            { id: 'mind_rune', quantity: 1 },
        ],
        emoji: '✨',
        description: 'Basic light damage spell.',
    },
    {
        id: 'voidmire_bolt',
        name: 'Voidmire Bolt',
        levelReq: 20,
        xpPerTick: 55,
        baseTickMs: 5000,
        successRate: 0.96,
        consumedItems: [
            { id: 'chaos_rune', quantity: 1 },
            { id: 'death_rune', quantity: 1 },
        ],
        emoji: '🕳️',
        description: 'High damage, chance to Glitch enemy.',
    },
    {
        id: 'astral_storm',
        name: 'Astral Storm',
        levelReq: 70,
        xpPerTick: 120,
        baseTickMs: 8000,
        successRate: 0.9,
        consumedItems: [
            { id: 'cosmic_rune', quantity: 2 },
            { id: 'law_rune', quantity: 1 },
        ],
        emoji: '☄️',
        description: 'Multi-target reality tear.',
    },
];

export function getSpellById(id: string): SorcerySpell | undefined {
    return SORCERY_SPELLS.find((s) => s.id === id);
}
