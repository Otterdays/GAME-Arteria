import { SkillId } from '../types';

export interface SummoningPouch {
    id: string;
    name: string;
    levelReq: number;
    xpPerPouch: number;
    ingredients: { id: string; quantity: number }[];
    emoji: string;
}

export const SUMMONING_POUCHES: SummoningPouch[] = [
    {
        id: 'spirit_wolf_pouch',
        name: 'Spirit Wolf Pouch',
        levelReq: 1,
        xpPerPouch: 5,
        ingredients: [
            { id: 'spirit_pouch', quantity: 1 },
            { id: 'spirit_shard', quantity: 7 },
            { id: 'wolf_bones', quantity: 1 },
        ],
        emoji: '🐺',
    },
    {
        id: 'dreadfowl_pouch',
        name: 'Dreadfowl Pouch',
        levelReq: 4,
        xpPerPouch: 10,
        ingredients: [
            { id: 'spirit_pouch', quantity: 1 },
            { id: 'spirit_shard', quantity: 12 },
            { id: 'feathers', quantity: 1 },
        ],
        emoji: '🐔',
    },
    {
        id: 'bull_heifer_pouch',
        name: 'Bull Heifer Pouch',
        levelReq: 10,
        xpPerPouch: 25,
        ingredients: [
            { id: 'spirit_pouch', quantity: 1 },
            { id: 'spirit_shard', quantity: 18 },
            { id: 'raw_beef', quantity: 1 },
        ],
        emoji: '🐮',
    },
];
