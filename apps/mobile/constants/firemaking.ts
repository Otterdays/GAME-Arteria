/**
 * Firemaking — Burn logs for XP.
 * [TRACE: ROADMAP Artisan; simple tick-based skill]
 */

export interface FiremakingBurn {
    id: string;
    name: string;
    logId: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    emoji: string;
}

export const FIREMAKING_BURNS: FiremakingBurn[] = [
    { id: 'burn_normal_log', name: 'Normal Log', logId: 'normal_log', levelReq: 1, xpPerTick: 15, baseTickMs: 2500, successRate: 1, emoji: '🔥' },
    { id: 'burn_oak_log', name: 'Oak Log', logId: 'oak_log', levelReq: 15, xpPerTick: 37.5, baseTickMs: 3000, successRate: 1, emoji: '🔥' },
    { id: 'burn_willow_log', name: 'Willow Log', logId: 'willow_log', levelReq: 30, xpPerTick: 67.5, baseTickMs: 3500, successRate: 0.98, emoji: '🔥' },
    { id: 'burn_teak_log', name: 'Teak Log', logId: 'teak_log', levelReq: 35, xpPerTick: 85, baseTickMs: 4000, successRate: 0.95, emoji: '🔥' },
    { id: 'burn_maple_log', name: 'Maple Log', logId: 'maple_log', levelReq: 45, xpPerTick: 100, baseTickMs: 4500, successRate: 0.92, emoji: '🔥' },
    { id: 'burn_mahogany_log', name: 'Mahogany Log', logId: 'mahogany_log', levelReq: 50, xpPerTick: 125, baseTickMs: 5000, successRate: 0.9, emoji: '🔥' },
    { id: 'burn_yew_log', name: 'Yew Log', logId: 'yew_log', levelReq: 60, xpPerTick: 175, baseTickMs: 6000, successRate: 0.88, emoji: '🔥' },
    { id: 'burn_magic_log', name: 'Magic Log', logId: 'magic_log', levelReq: 75, xpPerTick: 250, baseTickMs: 7500, successRate: 0.85, emoji: '🔥' },
    { id: 'burn_cosmic_wood', name: 'Cosmic Wood', logId: 'cosmic_wood', levelReq: 90, xpPerTick: 500, baseTickMs: 10000, successRate: 0.8, emoji: '🔥' },
];
