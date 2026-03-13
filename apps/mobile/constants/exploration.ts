/**
 * Exploration skill — Survey routes, chart regions, discover opportunities.
 * [TRACE: DOCU/WORLD_EXPLORATION.md, exploration grand plan]
 */

export type ExplorationCategory = 'survey' | 'scout' | 'chart';

export interface ExplorationExpedition {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    items: { id: string; quantity: number }[];
    emoji: string;
    locationId: string;
    category: ExplorationCategory;
    description: string;
    discoveryHint: string;
}

export const EXPLORATION_EXPEDITIONS: ExplorationExpedition[] = [
    {
        id: 'crownlands_paths',
        name: 'Crownlands Paths',
        levelReq: 1,
        xpPerTick: 12,
        baseTickMs: 4000,
        successRate: 1,
        items: [{ id: 'survey_notes', quantity: 1 }],
        emoji: '🏰',
        locationId: 'crownlands',
        category: 'survey',
        description: 'Map the streets and byways of the hub.',
        discoveryHint: 'Survey notes',
    },
    {
        id: 'frostvale_scouting',
        name: 'Frostvale Scouting',
        levelReq: 10,
        xpPerTick: 22,
        baseTickMs: 4500,
        successRate: 0.98,
        items: [{ id: 'trail_rations', quantity: 1 }],
        emoji: '🎄',
        locationId: 'frostvale',
        category: 'scout',
        description: 'Scout snow routes and Voidmas trails.',
        discoveryHint: 'Trail rations',
    },
    {
        id: 'whispering_woods_trail',
        name: 'Whispering Woods Trail',
        levelReq: 25,
        xpPerTick: 38,
        baseTickMs: 5000,
        successRate: 0.95,
        items: [{ id: 'ancient_map_scrap', quantity: 1 }],
        emoji: '🌲',
        locationId: 'whispering_woods',
        category: 'chart',
        description: 'Chart the shifting paths of the enchanted forest.',
        discoveryHint: 'Ancient map scrap',
    },
    {
        id: 'fey_market_signs',
        name: 'Fey Market Signs',
        levelReq: 40,
        xpPerTick: 58,
        baseTickMs: 5500,
        successRate: 0.92,
        items: [{ id: 'fey_compass', quantity: 1 }],
        emoji: '✨',
        locationId: 'fey_markets',
        category: 'scout',
        description: 'Decode planar markers when the veil thins.',
        discoveryHint: 'Fey compass',
    },
    {
        id: 'scorched_reach_mapping',
        name: 'Scorched Reach Mapping',
        levelReq: 55,
        xpPerTick: 78,
        baseTickMs: 6000,
        successRate: 0.88,
        items: [{ id: 'volcanic_chart', quantity: 1 }],
        emoji: '🌋',
        locationId: 'scorched_reach',
        category: 'chart',
        description: 'Map volcanic terrain and Voidmire pools.',
        discoveryHint: 'Volcanic chart',
    },
    {
        id: 'skyward_ascent',
        name: 'Skyward Ascent',
        levelReq: 70,
        xpPerTick: 105,
        baseTickMs: 7000,
        successRate: 0.82,
        items: [{ id: 'peak_star_map', quantity: 1 }],
        emoji: '⛰️',
        locationId: 'skyward_peaks',
        category: 'chart',
        description: 'Survey the peaks that touch the Celestial Spires.',
        discoveryHint: 'Peak star map',
    },
];

export function getExpeditionById(id: string): ExplorationExpedition | undefined {
    return EXPLORATION_EXPEDITIONS.find((e) => e.id === id);
}
