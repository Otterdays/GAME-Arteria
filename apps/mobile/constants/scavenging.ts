/**
 * Scavenging nodes — ruins, zones, cosmic debris.
 * [TRACE: ROADMAP Phase 2.1 — Scavenging]
 */

export interface ScavengingNode {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    masteryXp: number;
    items: { id: string; quantity: number }[];
    emoji: string;
}

export const SCAVENGING_NODES: ScavengingNode[] = [
    { id: 'surface_ruins', name: 'Surface Ruins', levelReq: 1, xpPerTick: 15, baseTickMs: 4000, successRate: 1, masteryXp: 1, items: [{ id: 'rusty_scrap', quantity: 1 }], emoji: '🏚️' },
    { id: 'buried_settlement', name: 'Buried Settlement', levelReq: 20, xpPerTick: 35, baseTickMs: 5000, successRate: 0.9, masteryXp: 2, items: [{ id: 'discarded_tech', quantity: 1 }], emoji: '⛏️' },
    { id: 'fey_outpost', name: 'Fey Outpost', levelReq: 40, xpPerTick: 75, baseTickMs: 6500, successRate: 0.8, masteryXp: 4, items: [{ id: 'fey_trinket', quantity: 1 }], emoji: '✨' },
    { id: 'skyward_debris', name: 'Skyward Debris', levelReq: 60, xpPerTick: 125, baseTickMs: 8000, successRate: 0.7, masteryXp: 6, items: [{ id: 'celestial_fragment', quantity: 1 }], emoji: '☄️' },
    { id: 'void_rupture', name: 'Void Rupture', levelReq: 80, xpPerTick: 200, baseTickMs: 12000, successRate: 0.6, masteryXp: 10, items: [{ id: 'voidmire_crystal', quantity: 1 }], emoji: '🕳️' },
];
