/**
 * usePersistence — Auto-save and auto-load player state.
 *
 * - On mount: loads saved state from MMKV into Redux.
 * - Every 30s: saves current Redux state to MMKV.
 * - On app background: saves immediately and schedules "Idle cap reached" notification if enabled.
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { savePlayerState, loadPlayerState, hasSave } from '@/store/persistence';
import { scheduleIdleCapReachedIfEnabled, cancelIdleCapNotification } from '@/utils/notifications';

const AUTO_SAVE_INTERVAL_MS = 30_000; // 30 seconds

export function usePersistence() {
    const dispatch = useAppDispatch();
    const player = useAppSelector((s) => s.game.player);
    const isLoaded = useAppSelector((s) => s.game.isLoaded);
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);

    // Load on mount
    useEffect(() => {
        if (hasSave()) {
            const saved = loadPlayerState<typeof player>();
            if (saved) {
                dispatch(gameActions.loadPlayer(saved));
                return;
            }
        }
        // No save — show nickname entry before starting
        dispatch(gameActions.setAwaitingNameEntry(true));
    }, []);

    // Cancel idle-cap notification on mount when app is active (cold start or return).
    // Fix: Previously we only canceled on background→active transition; cold start skips
    // that, so a stale notification from a prior session could still fire.
    useEffect(() => {
        if (AppState.currentState === 'active') {
            cancelIdleCapNotification().catch(() => {});
        }
    }, []);

    // Auto-save every 30s
    useEffect(() => {
        if (!isLoaded) return;

        const intervalId = setInterval(() => {
            savePlayerState({ ...player, lastSaveTimestamp: Date.now() });
        }, AUTO_SAVE_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [isLoaded, player]);

    // Save on app background + schedule idle-cap notification
    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                if (
                    appStateRef.current === 'active' &&
                    nextState.match(/inactive|background/)
                ) {
                    const now = Date.now();
                    const stateToSave = { ...player, lastSaveTimestamp: now };
                    savePlayerState(stateToSave);
                    const enabled = player.settings?.notifyIdleCapReached ?? true;
                    scheduleIdleCapReachedIfEnabled(
                        now,
                        player.settings?.isPatron ?? false,
                        enabled
                    ).catch(() => {});
                } else if (
                    appStateRef.current.match(/inactive|background/) &&
                    nextState === 'active'
                ) {
                    cancelIdleCapNotification().catch(() => {});
                }
                appStateRef.current = nextState;
            }
        );

        return () => subscription.remove();
    }, [player]);
}
