/**
 * API-level tests for GameEngine via @arteria/engine.
 */

import { GameEngine, createNewPlayer, MINING_ACTIONS } from '@arteria/engine';

describe('GameEngine (API)', () => {
    it('creates engine and registers actions', () => {
        const engine = new GameEngine();
        engine.registerActions(MINING_ACTIONS);
        expect(MINING_ACTIONS.length).toBeGreaterThan(0);
    });

    it('createNewPlayer returns valid state', () => {
        const player = createNewPlayer('Tester');
        expect(player.name).toBe('Tester');
        expect(player.skills.mining).toBeDefined();
        expect(player.skills.mining.xp).toBe(0);
        expect(player.skills.mining.level).toBe(1);
        expect(player.activeTask).toBeNull();
        expect(player.lastSaveTimestamp).toBeGreaterThan(0);
    });

    it('processOffline advances state', () => {
        const engine = new GameEngine();
        engine.registerActions(MINING_ACTIONS);
        const player = createNewPlayer('Offline');
        player.activeTask = {
            type: 'skilling',
            skillId: 'mining',
            actionId: MINING_ACTIONS[0].id,
            intervalMs: MINING_ACTIONS[0].intervalMs,
            partialTickMs: 0,
        };
        const past = Date.now() - 5000;
        player.lastSaveTimestamp = past;

        const report = engine.processOffline(player);

        expect(report.elapsedMs).toBeGreaterThanOrEqual(4000);
        expect(report.ticksProcessed).toBeGreaterThanOrEqual(0);
        expect(player.lastSaveTimestamp).toBeGreaterThan(past);
    });
});
