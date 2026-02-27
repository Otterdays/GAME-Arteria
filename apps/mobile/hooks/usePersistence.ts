/**
 * usePersistence — Auto-save and auto-load player state.
 *
 * - On mount: loads saved state from MMKV into Redux.
 * - Every 30s: saves current Redux state to MMKV.
 * - On app background: saves immediately.
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { savePlayerState, loadPlayerState, hasSave } from '@/store/persistence';

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
        // No save — start fresh
        dispatch(gameActions.newGame());
    }, []);

    // Auto-save every 30s
    useEffect(() => {
        if (!isLoaded) return;

        const intervalId = setInterval(() => {
            savePlayerState({ ...player, lastSaveTimestamp: Date.now() });
        }, AUTO_SAVE_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [isLoaded, player]);

    // Save on app background
    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                if (
                    appStateRef.current === 'active' &&
                    nextState.match(/inactive|background/)
                ) {
                    // Going to background — save immediately
                    savePlayerState({ ...player, lastSaveTimestamp: Date.now() });
                }
                appStateRef.current = nextState;
            }
        );

        return () => subscription.remove();
    }, [player]);
}
