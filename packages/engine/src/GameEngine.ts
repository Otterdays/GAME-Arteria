/**
 * GameEngine — top-level orchestrator.
 *
 * Manages the player state, processes offline progression,
 * and coordinates between the tick system and XP table.
 */

import { XPTable } from './XPTable';
import { TickSystem, ActionDefinition } from './TickSystem';
import type {
    PlayerState,
    SkillId,
    OfflineReport,
    GameConfig,
    ActiveTask,
} from './types';
import { DEFAULT_GAME_CONFIG } from './types';

export class GameEngine {
    private config: GameConfig;
    /** Registry of all known actions, keyed by actionId */
    private actionRegistry: Map<string, ActionDefinition> = new Map();

    constructor(config: Partial<GameConfig> = {}) {
        this.config = { ...DEFAULT_GAME_CONFIG, ...config };
    }

    /** Register an action definition so the engine knows how to process it. */
    registerAction(action: ActionDefinition): void {
        this.actionRegistry.set(action.id, action);
    }

    /** Register multiple actions at once. */
    registerActions(actions: ActionDefinition[]): void {
        for (const a of actions) this.registerAction(a);
    }

    /**
     * Calculate offline progression.
     *
     * Call this when the app opens. Pass the saved player state;
     * it will compute (now - lastSaveTimestamp) and simulate all ticks.
     *
     * @returns An OfflineReport summarizing what happened, and mutates playerState in place.
     */
    processOffline(playerState: PlayerState): OfflineReport {
        const now = Date.now();
        let elapsedMs = now - playerState.lastSaveTimestamp;

        // Clamp to max offline time
        if (elapsedMs > this.config.maxOfflineMs) {
            elapsedMs = this.config.maxOfflineMs;
        }

        const report: OfflineReport = {
            elapsedMs,
            ticksProcessed: 0,
            xpGained: {},
            itemsGained: [],
            levelsGained: {},
        };

        if (elapsedMs <= 0 || !playerState.activeTask) {
            playerState.lastSaveTimestamp = now;
            return report;
        }

        const task = playerState.activeTask;
        const baseAction = this.actionRegistry.get(task.actionId);

        if (!baseAction) {
            // Unknown action; just update timestamp
            playerState.lastSaveTimestamp = now;
            return report;
        }

        // Apply Seasonal Rotation for Logging (Unique Mechanic)
        const action = { ...baseAction };
        if (action.skillId === 'logging') {
            action.yieldMultiplier = this.getLoggingSeasonalMultiplier();
        }

        const tickResult = TickSystem.processDelta(elapsedMs, task, action);

        report.ticksProcessed = tickResult.ticksProcessed;

        // Apply XP gains
        for (const [skillId, xp] of Object.entries(tickResult.xpGained)) {
            const sid = skillId as SkillId;
            const skill = playerState.skills[sid];
            if (!skill) continue;

            const oldLevel = skill.level;
            skill.xp += xp;
            skill.level = XPTable.levelForXP(skill.xp);
            report.xpGained[sid] = xp;

            if (skill.level > oldLevel) {
                report.levelsGained[sid] = skill.level - oldLevel;
            }
        }

        // Apply mastery gains
        for (const [actionId, masteryXp] of Object.entries(tickResult.masteryGained)) {
            const skill = playerState.skills[action.skillId];
            if (skill) {
                skill.mastery[actionId] = (skill.mastery[actionId] || 0) + masteryXp;
            }
        }

        // Apply items to inventory
        for (const item of tickResult.itemsGained) {
            const existing = playerState.inventory.find((i) => i.id === item.id);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                playerState.inventory.push({ ...item });
            }
            report.itemsGained.push({ ...item });
        }

        playerState.lastSaveTimestamp = now;
        return report;
    }

    /**
     * Process a single real-time delta (for when the app is in the foreground).
     * Basically a thin wrapper around processOffline but uses a provided deltaMs
     * instead of computing from timestamps.
     */
    processRealtime(playerState: PlayerState, deltaMs: number): OfflineReport {
        if (!playerState.activeTask) {
            return {
                elapsedMs: deltaMs,
                ticksProcessed: 0,
                xpGained: {},
                itemsGained: [],
                levelsGained: {},
            };
        }

        const task = playerState.activeTask;
        const baseAction = this.actionRegistry.get(task.actionId);
        if (!baseAction) {
            return {
                elapsedMs: deltaMs,
                ticksProcessed: 0,
                xpGained: {},
                itemsGained: [],
                levelsGained: {},
            };
        }

        // Apply Seasonal Rotation for Logging (Unique Mechanic)
        const action = { ...baseAction };
        if (action.skillId === 'logging') {
            action.yieldMultiplier = this.getLoggingSeasonalMultiplier();
        }

        const tickResult = TickSystem.processDelta(deltaMs, task, action);

        // Apply XP
        for (const [skillId, xp] of Object.entries(tickResult.xpGained)) {
            const sid = skillId as SkillId;
            const skill = playerState.skills[sid];
            if (!skill) continue;
            skill.xp += xp;
            skill.level = XPTable.levelForXP(skill.xp);
        }

        // Apply items
        for (const item of tickResult.itemsGained) {
            const existing = playerState.inventory.find((i) => i.id === item.id);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                playerState.inventory.push({ ...item });
            }
        }

        return {
            elapsedMs: deltaMs,
            ticksProcessed: tickResult.ticksProcessed,
            xpGained: tickResult.xpGained,
            itemsGained: tickResult.itemsGained,
            levelsGained: {},
        };
    }

    /**
     * Start a task — sets the player's active task.
     */
    startTask(playerState: PlayerState, actionId: string): boolean {
        const action = this.actionRegistry.get(actionId);
        if (!action) return false;

        const skill = playerState.skills[action.skillId];
        if (!skill || skill.level < action.levelRequired) return false;

        playerState.activeTask = {
            type: 'skilling',
            skillId: action.skillId,
            actionId: action.id,
            intervalMs: action.intervalMs,
            partialTickMs: 0,
        };

        return true;
    }

    /**
     * Stop the current task.
     */
    stopTask(playerState: PlayerState): void {
        playerState.activeTask = null;
    }

    /** Get the config */
    getConfig(): Readonly<GameConfig> {
        return this.config;
    }

    /**
     * Unique Mechanic: Logging Seasonal Rotation
     * Returns a yield multiplier that changes weekly.
     */
    private getLoggingSeasonalMultiplier(): number {
        const now = Date.now();
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        const weekNumber = Math.floor(now / weekMs);

        // Return 1.5x on even weeks, 1.0x on odd weeks
        return (weekNumber % 2 === 0) ? 1.5 : 1.0;
    }
}
