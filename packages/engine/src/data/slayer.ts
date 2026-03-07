import { SkillId } from '../types';

export interface SlayerMonster {
    id: string;
    name: string;
    levelReq: number;
    xpPerKill: number;
    slayerXpPerKill: number;
    locations: string[];
}

export const SLAYER_MONSTERS: SlayerMonster[] = [
    {
        id: 'chicken',
        name: 'Chicken',
        levelReq: 1,
        xpPerKill: 8,
        slayerXpPerKill: 5,
        locations: ['sunny_meadows_farm'],
    },
    {
        id: 'cow',
        name: 'Cow',
        levelReq: 1,
        xpPerKill: 15,
        slayerXpPerKill: 10,
        locations: ['sunny_meadows_farm'],
    },
    {
        id: 'goblin',
        name: 'Goblin',
        levelReq: 5,
        xpPerKill: 25,
        slayerXpPerKill: 15,
        locations: ['goblin_house'],
    },
    {
        id: 'woodland_wolf',
        name: 'Woodland Wolf',
        levelReq: 15,
        xpPerKill: 50,
        slayerXpPerKill: 30,
        locations: ['whispering_woods_forest'],
    },
    {
        id: 'arctic_wolf',
        name: 'Arctic Wolf',
        levelReq: 35,
        xpPerKill: 120,
        slayerXpPerKill: 80,
        locations: ['frostfall_mountain'],
    },
];
