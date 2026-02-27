import { TickSystem, ActionDefinition } from '../TickSystem';
import type { ActiveTask } from '../types';

describe('TickSystem', () => {
    const mockAction: ActionDefinition = {
        id: 'test_action',
        skillId: 'mining',
        intervalMs: 1000,
        xpPerTick: 10,
        itemsPerTick: [{ id: 'test_item', quantity: 1 }],
        levelRequired: 1,
        masteryXpPerTick: 5,
        successRate: 1,
    };

    it('processes exactly one tick when delta matches interval', () => {
        const task: ActiveTask = {
            type: 'skilling',
            skillId: 'mining',
            actionId: 'test_action',
            intervalMs: 1000,
            partialTickMs: 0,
        };

        const result = TickSystem.processDelta(1000, task, mockAction);

        expect(result.ticksProcessed).toBe(1);
        expect(result.xpGained['mining']).toBe(10);
        expect(result.itemsGained[0].quantity).toBe(1);
        expect(result.masteryGained['test_action']).toBe(5);
        expect(task.partialTickMs).toBe(0); // No leftover
    });

    it('carries over partial ticks correctly', () => {
        const task: ActiveTask = {
            type: 'skilling',
            skillId: 'mining',
            actionId: 'test_action',
            intervalMs: 1000,
            partialTickMs: 0,
        };

        const result1 = TickSystem.processDelta(1500, task, mockAction);

        expect(result1.ticksProcessed).toBe(1);
        expect(task.partialTickMs).toBe(500); // 500ms carried over

        // Process another 500ms, should trigger the next tick
        const result2 = TickSystem.processDelta(500, task, mockAction);

        expect(result2.ticksProcessed).toBe(1);
        expect(task.partialTickMs).toBe(0); // Leftover consumed
    });

    it('processes multiple ticks in a single large delta (offline simulation)', () => {
        const task: ActiveTask = {
            type: 'skilling',
            skillId: 'mining',
            actionId: 'test_action',
            intervalMs: 1000,
            partialTickMs: 0,
        };

        const result = TickSystem.processDelta(10000, task, mockAction);

        expect(result.ticksProcessed).toBe(10);
        expect(result.xpGained['mining']).toBe(100);
        expect(result.itemsGained[0].quantity).toBe(10);
        expect(result.masteryGained['test_action']).toBe(50);
        expect(task.partialTickMs).toBe(0);
    });

    it('respects success rate RNG', () => {
        const task: ActiveTask = {
            type: 'skilling',
            skillId: 'mining',
            actionId: 'test_action',
            intervalMs: 1000,
            partialTickMs: 0,
        };

        const riskyAction: ActionDefinition = {
            ...mockAction,
            successRate: 0.5,
        };

        // Inject an RNG that always fails
        const alwaysFailRNG = () => 0.9;

        const result = TickSystem.processDelta(10000, task, riskyAction, alwaysFailRNG);

        expect(result.ticksProcessed).toBe(10); // 10 ticks firing...
        expect(result.xpGained['mining']).toBeUndefined(); // but no XP gained
        expect(result.itemsGained.length).toBe(0); // and no items gained
    });
});
