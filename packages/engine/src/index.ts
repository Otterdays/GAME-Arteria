/**
 * @arteria/engine
 *
 * Pure TypeScript game engine for the Arteria AFK RPG.
 * Zero UI dependencies — this package handles all math,
 * tick calculations, XP curves, and offline progression.
 */

export { GameEngine } from './GameEngine';
export { XPTable } from './XPTable';
export { TickSystem } from './TickSystem';
export type {
    PlayerState,
    SkillState,
    InventoryItem,
    GameConfig,
    TickResult,
    OfflineReport,
} from './types';
export { MINING_ACTIONS, createNewPlayer } from './data';
export type { ActionDefinition } from './TickSystem';
