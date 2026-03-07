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
    ActiveTask,
} from './types';
export {
    MINING_ACTIONS,
    LOGGING_ACTIONS,
    HARVESTING_ACTIONS,
    FISHING_ACTIONS,
    SCAVENGING_ACTIONS,
    ASTROLOGY_ACTIONS,
    SLAYER_MONSTERS,
    SUMMONING_POUCHES,
    COMPANIONS,
    createNewPlayer
} from './data';
export type { ActionDefinition } from './TickSystem';
export { meetsNarrativeRequirement, getQuestStepsToComplete } from './utils/narrative';
export type { Quest, QuestType, NarrativeRequirement, NarrativeReward } from './data/story';
