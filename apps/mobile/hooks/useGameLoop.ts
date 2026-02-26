/**
 * useGameLoop — Drives the real-time idle progression.
 *
 * Runs a setInterval that processes ticks via the engine
 * and dispatches results to Redux. Also handles offline
 * catch-up when the app resumes from background.
 */

import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';

// ── Inline engine math (mirrors @arteria/engine) ──
// We inline the XP + tick logic here so we don't need
// workspace linking yet. This will be replaced with
// a direct import from @arteria/engine once the monorepo
// linking is configured for Metro.

const XP_TABLE: number[] = [];
(function buildTable() {
    XP_TABLE.push(0);
    let cum = 0;
    for (let lvl = 1; lvl < 99; lvl++) {
        cum += Math.floor(lvl + 300 * Math.pow(2, lvl / 7)) / 4;
        XP_TABLE.push(Math.floor(cum));
    }
})();

function levelForXP(xp: number): number {
    for (let lvl = 99; lvl >= 1; lvl--) {
        if (xp >= XP_TABLE[lvl - 1]) return lvl;
    }
    return 1;
}

// ── Action definitions (mining only for now) ──
interface ActionDef {
    xpPerTick: number;
    items: { id: string; quantity: number }[];
    successRate: number;
    masteryXp: number;
}

const ACTION_DEFS: Record<string, ActionDef> = {
    copper_ore: {
        xpPerTick: 17.5,
        items: [{ id: 'copper_ore', quantity: 1 }],
        successRate: 1,
        masteryXp: 2,
    },
    tin_ore: {
        xpPerTick: 17.5,
        items: [{ id: 'tin_ore', quantity: 1 }],
        successRate: 1,
        masteryXp: 2,
    },
    iron_ore: {
        xpPerTick: 35,
        items: [{ id: 'iron_ore', quantity: 1 }],
        successRate: 0.95,
        masteryXp: 3,
    },
    coal_ore: {
        xpPerTick: 50,
        items: [{ id: 'coal', quantity: 1 }],
        successRate: 0.9,
        masteryXp: 4,
    },
    gold_ore: {
        xpPerTick: 65,
        items: [{ id: 'gold_ore', quantity: 1 }],
        successRate: 0.85,
        masteryXp: 5,
    },
    mithril_ore: {
        xpPerTick: 80,
        items: [{ id: 'mithril_ore', quantity: 1 }],
        successRate: 0.8,
        masteryXp: 6,
    },
    adamantite_ore: {
        xpPerTick: 95,
        items: [{ id: 'adamantite_ore', quantity: 1 }],
        successRate: 0.75,
        masteryXp: 7,
    },
    runite_ore: {
        xpPerTick: 125,
        items: [{ id: 'runite_ore', quantity: 1 }],
        successRate: 0.7,
        masteryXp: 10,
    },
};

const TICK_INTERVAL_MS = 100; // Process check every 100ms for smooth progress

export function useGameLoop() {
    const dispatch = useAppDispatch();
    const activeTask = useAppSelector((s) => s.game.player.activeTask);
    const lastTickRef = useRef<number>(Date.now());
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);

    // Process a delta of time
    const processDelta = useCallback(
        (deltaMs: number) => {
            if (!activeTask) return;

            const action = ACTION_DEFS[activeTask.actionId];
            if (!action) return;

            const interval = activeTask.intervalMs;
            const partialMs = (activeTask.partialTickMs || 0) + deltaMs;
            const fullTicks = Math.floor(partialMs / interval);
            const leftover = partialMs - fullTicks * interval;

            // Update partial tick progress
            dispatch(gameActions.updatePartialTick(leftover));

            if (fullTicks <= 0) return;

            // Roll for success on each tick
            let successfulTicks = 0;
            for (let i = 0; i < fullTicks; i++) {
                if (Math.random() <= action.successRate) {
                    successfulTicks++;
                }
            }

            if (successfulTicks > 0 && activeTask.skillId) {
                const skillId = activeTask.skillId as SkillId;
                const totalXP = action.xpPerTick * successfulTicks;

                // We need current XP to compute new level — read from store via ref
                // For simplicity, dispatch and let the slice handle it
                dispatch(
                    gameActions.applyXP({
                        skillId,
                        xp: totalXP,
                    })
                );

                // Add items
                const items = action.items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity * successfulTicks,
                }));
                dispatch(gameActions.addItems(items));
            }
        },
        [activeTask, dispatch]
    );

    // Main game loop interval
    useEffect(() => {
        if (!activeTask) return;

        lastTickRef.current = Date.now();

        const intervalId = setInterval(() => {
            const now = Date.now();
            const delta = now - lastTickRef.current;
            lastTickRef.current = now;
            processDelta(delta);
        }, TICK_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [activeTask, processDelta]);

    // Handle app going to background / foreground
    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                if (
                    appStateRef.current.match(/inactive|background/) &&
                    nextState === 'active'
                ) {
                    // App came back to foreground — process offline time
                    const now = Date.now();
                    const offlineDelta = now - lastTickRef.current;
                    if (offlineDelta > 1000) {
                        // Only process if >1s has passed
                        processDelta(offlineDelta);
                    }
                    lastTickRef.current = now;
                }
                appStateRef.current = nextState;
            }
        );

        return () => subscription.remove();
    }, [processDelta]);
}
