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
        id: 'enemy_chicken',
        name: 'Chicken',
        levelReq: 1,
        xpPerKill: 8,
        slayerXpPerKill: 5,
        locations: ['Sunny Meadows Farm'],
    },
    {
        id: 'enemy_cow',
        name: 'Cow',
        levelReq: 1,
        xpPerKill: 15,
        slayerXpPerKill: 10,
        locations: ['Sunny Meadows Farm'],
    },
    {
        id: 'enemy_goblin',
        name: 'Goblin',
        levelReq: 5,
        xpPerKill: 25,
        slayerXpPerKill: 15,
        locations: ['Goblin House'],
    },
    {
        id: 'enemy_crawling_hand',
        name: 'Crawling Hand',
        levelReq: 10,
        xpPerKill: 35,
        slayerXpPerKill: 20,
        locations: ['Slayer Tower (B1)'],
    },
    {
        id: 'enemy_banshee',
        name: 'Banshee',
        levelReq: 15,
        xpPerKill: 60,
        slayerXpPerKill: 45,
        locations: ['Slayer Tower (B1)'],
    },
    {
        id: 'enemy_woodland_wolf',
        name: 'Woodland Wolf',
        levelReq: 20,
        xpPerKill: 50,
        slayerXpPerKill: 30,
        locations: ['Whispering Woods'],
    },
    {
        id: 'enemy_arctic_wolf',
        name: 'Arctic Wolf',
        levelReq: 35,
        xpPerKill: 120,
        slayerXpPerKill: 80,
        locations: ['Frostfall Mountain'],
    },
];

export interface SlayerShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: 'item' | 'upgrade';
}

export const SLAYER_SHOP_CATALOG: SlayerShopItem[] = [
    {
        id: 'broad_arrows',
        name: 'Broad Arrows',
        description: 'Specialized ammunition for piercing tough hides. (+15 arrows)',
        cost: 35,
        type: 'item',
    },
    {
        id: 'enchanted_gem',
        name: 'Enchanted Gem',
        description: 'Communicates with your Slayer Master from afar.',
        cost: 100,
        type: 'item',
    },
    {
        id: 'slayer_helmet',
        name: 'Slayer Helmet',
        description: 'Protective headgear for professional monster hunters. Huge stats.',
        cost: 400,
        type: 'item',
    },
    {
        id: 'extended_tasks',
        name: 'Extended Tasks',
        description: 'Receive larger monster bounties per task. (+25 kills)',
        cost: 150,
        type: 'upgrade',
    },
];
