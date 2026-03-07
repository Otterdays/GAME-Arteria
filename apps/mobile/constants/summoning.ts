export interface SummoningPouch {
    id: string;
    name: string;
    levelReq: number;
    xpPerPouch: number;
    ingredients: { id: string; quantity: number }[];
    emoji: string;
    buff: {
        description: string;
        stat?: string;
        value?: number;
    };
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
        buff: { description: '+1 Max Hit', stat: 'maxHit', value: 1 },
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
        buff: { description: '+1 Magic Defense', stat: 'magicDefence', value: 1 },
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
        buff: { description: '+2 Melee Defense', stat: 'meleeDefence', value: 2 },
    },
    {
        id: 'spirit_spider_pouch',
        name: 'Spirit Spider Pouch',
        levelReq: 16,
        xpPerPouch: 45,
        ingredients: [
            { id: 'spirit_pouch', quantity: 1 },
            { id: 'spirit_shard', quantity: 24 },
            { id: 'rusty_scrap', quantity: 2 },
        ],
        emoji: '🕷️',
        buff: { description: '+5% Loot Chance' },
    },
    {
        id: 'honey_badger_pouch',
        name: 'Honey Badger Pouch',
        levelReq: 23,
        xpPerPouch: 75,
        ingredients: [
            { id: 'spirit_pouch', quantity: 1 },
            { id: 'spirit_shard', quantity: 38 },
            { id: 'honeycomb', quantity: 1 },
        ],
        emoji: '🦡',
        buff: { description: '+1 Mining Yield' },
    },
];
