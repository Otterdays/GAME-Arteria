/**
 * MMKV-based game save/load persistence.
 *
 * Saves the entire Redux player state as JSON to MMKV.
 * MMKV is synchronous and extremely fast (~30x faster than AsyncStorage),
 * which is critical for an idle game that saves frequently.
 */

import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'arteria-save' });

const SAVE_KEY = 'player_state';

/**
 * Save the player state to MMKV.
 * Call this periodically (e.g. every 30s) and on app background.
 */
export function savePlayerState(playerState: unknown): void {
    try {
        const json = JSON.stringify(playerState);
        storage.set(SAVE_KEY, json);
    } catch (e) {
        console.error('[Save] Failed to save player state:', e);
    }
}

/**
 * Load the player state from MMKV.
 * Returns null if no save exists.
 */
export function loadPlayerState<T>(): T | null {
    try {
        const json = storage.getString(SAVE_KEY);
        if (!json) return null;
        return JSON.parse(json) as T;
    } catch (e) {
        console.error('[Save] Failed to load player state:', e);
        return null;
    }
}

/**
 * Delete the saved player state.
 */
export function deleteSave(): void {
    storage.remove(SAVE_KEY);
}

/**
 * Check if a save file exists.
 */
export function hasSave(): boolean {
    return storage.contains(SAVE_KEY);
}
