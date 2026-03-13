/**
 * World locations for exploration. Idle-friendly: tap to travel, instant.
 * [TRACE: DOCU/WORLD_EXPLORATION.md]
 */

import type { PlayerState } from '@/store/gameSlice';

export type LocationUnlockType = 'always' | 'quest' | 'level' | 'calendar' | 'event';

export interface LocationDef {
    id: string;
    name: string;
    emoji: string;
    description: string;
    unlockType: LocationUnlockType;
    /** questId, level number, 'dec' for December, or eventId */
    unlockValue?: string | number;
    /** NPCs present (dialogue tree IDs or NPC ids). Empty = Coming soon. */
    npcIds: string[];
    /** Location-specific shop. null = Coming soon or none. */
    shopId: string | null;
    /** Location-specific quest IDs. Empty = Coming soon or none. */
    questIds: string[];
}

export const LOCATIONS: LocationDef[] = [
    {
        id: 'crownlands',
        name: 'Crownlands',
        emoji: '🏰',
        description: 'The central hub. Market, gates, and the heart of Valdoria.',
        unlockType: 'always',
        npcIds: ['guard', 'nick', 'bianca', 'kate'],
        shopId: 'nick_crownlands',
        questIds: [],
    },
    {
        id: 'frostvale',
        name: 'Frostvale',
        emoji: '🎄',
        description: 'Snow, lights, and Voidmas. The Void-Touched celebrate the solstice.',
        unlockType: 'calendar',
        unlockValue: 'dec',
        npcIds: [],
        shopId: null,
        questIds: [],
    },
    {
        id: 'whispering_woods',
        name: 'Whispering Woods',
        emoji: '🌲',
        description: 'Enchanted forest where the trees gossip and the paths shift.',
        unlockType: 'quest',
        unlockValue: 'knows_about_sneeze_cult',
        npcIds: [],
        shopId: null,
        questIds: [],
    },
    {
        id: 'fey_markets',
        name: 'Fey Markets',
        emoji: '✨',
        description: 'Planar crossover. Otherworldly traders appear when the veil thins.',
        unlockType: 'event',
        unlockValue: 'fey_market_weekend',
        npcIds: [],
        shopId: null,
        questIds: [],
    },
    {
        id: 'scorched_reach',
        name: 'Scorched Reach',
        emoji: '🌋',
        description: 'Volcanic region where Voidmire pools like cosmic ink.',
        unlockType: 'level',
        unlockValue: 40,
        npcIds: [],
        shopId: null,
        questIds: [],
    },
    {
        id: 'skyward_peaks',
        name: 'Skyward Peaks',
        emoji: '⛰️',
        description: 'Mountains touching the lower Celestial Spires. Paperwork required.',
        unlockType: 'level',
        unlockValue: 70,
        npcIds: [],
        shopId: null,
        questIds: [],
    },
];

/** Map NPC id to dialogue tree id for Crownlands. */
export const CROWNLANDS_NPC_MAP: Record<string, string> = {
    guard: 'dt_guard_intro',
    nick: 'dt_nick_shop',
    bianca: 'dt_bianca_herbalist',
    kate: 'dt_kate_traveler',
};

function isDecember(): boolean {
    return new Date().getMonth() === 11;
}

export function meetsLocationRequirement(player: PlayerState, loc: LocationDef): boolean {
    switch (loc.unlockType) {
        case 'always':
            return true;
        case 'quest':
            return (player.narrative?.flags ?? []).includes(String(loc.unlockValue));
        case 'level': {
            const reqLevel = typeof loc.unlockValue === 'number' ? loc.unlockValue : 1;
            const explorationLevel = player.skills?.exploration?.level ?? 0;
            return explorationLevel >= reqLevel;
        }
        case 'calendar':
            return loc.unlockValue === 'dec' ? isDecember() : true;
        case 'event':
            return false; // TODO: getActiveEvents() when event system exists
        default:
            return false;
    }
}

export function getLocationById(id: string): LocationDef | undefined {
    return LOCATIONS.find((l) => l.id === id);
}
