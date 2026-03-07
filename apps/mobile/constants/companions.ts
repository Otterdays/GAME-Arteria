export interface CompanionDef {
    id: string;
    name: string;
    levelReq: number;
    baseLeadershipXp: number;
    description: string;
    trait: string;
    emoji: string;
}

export const COMPANIONS: CompanionDef[] = [
    {
        id: 'garry',
        name: 'Garry the Guard',
        levelReq: 10,
        baseLeadershipXp: 200,
        description: 'A retired town guard who misses his old post beside the cabbage patch.',
        trait: 'Eternal Vigilance: +10% max HP, but refuses to move more than 5 feet.',
        emoji: '💂',
    },
    {
        id: 'barnaby',
        name: 'Barnaby the Uncertain',
        levelReq: 20,
        baseLeadershipXp: 500,
        description: 'A cheerful warrior with a slight hesitation problem.',
        trait: 'Confused Strike: Deals 2x damage, but 50% chance to hit himself.',
        emoji: '🛡️',
    },
    {
        id: 'yvette',
        name: 'Scholar Yvette',
        levelReq: 35,
        baseLeadershipXp: 1500,
        description: 'A brilliant researcher who likes to test things at speed.',
        trait: 'Rapid Research: +30% crafting speed, 5% chance to explode (partial refund).',
        emoji: '🧪',
    },
    {
        id: 'reginald',
        name: 'Sir Reginald Pomp',
        levelReq: 50,
        baseLeadershipXp: 5000,
        description: 'A high-born knight who finds commerce beneath him.',
        trait: 'Noble Disposal: Auto-sells junk items. Delivers long speeches about them.',
        emoji: '👑',
    },
];
