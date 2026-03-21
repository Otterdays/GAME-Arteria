// [TRACE: DOCU/SCRATCHPAD.md — Anchor Timeline Selection v0.7.0]
/**
 * usePersistence — Boot-time save orchestration and auto-save loop.
 *
 * On mount:
 *  1. Try to migrate any pre-v0.7 `player_state` legacy save → slot `v0migration`.
 *  2. Load the manifest from MMKV → dispatch loadManifestAction.
 *  3. If manifest has an activeAnchorId → load that anchor's PlayerState → loadPlayer.
 *  4. If no active anchor → the selection screen handles creation / selection.
 *
 * During play:
 *  - Auto-saves the active anchor every 30s.
 *  - Saves immediately on app background + schedules idle-cap notification.
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { anchorActions } from '@/store/anchorSlice';
import {
    loadManifest,
    saveManifest,
    loadAnchorState,
    saveAnchorState,
    migrateV0Save,
    hasLegacySave,
    type AnchorMeta,
} from '@/store/persistence';
import { scheduleIdleCapReachedIfEnabled, cancelIdleCapNotification } from '@/utils/notifications';

const AUTO_SAVE_INTERVAL_MS = 30_000;

export function usePersistence() {
    const dispatch = useAppDispatch();
    const player   = useAppSelector((s) => s.game.player);
    const isLoaded = useAppSelector((s) => s.game.isLoaded);
    const manifest = useAppSelector((s) => s.anchor.manifest);
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);

    // ── Boot: migrate legacy save if present, then load manifest ──────────
    useEffect(() => {
        // 1. Legacy migration (pre-v0.7 single-slot save)
        if (hasLegacySave()) {
            const migratedManifest = migrateV0Save();
            if (migratedManifest) {
                dispatch(anchorActions.loadManifestAction(migratedManifest));
                // Load the migrated anchor state
                const saved = loadAnchorState<typeof player>(migratedManifest.activeAnchorId!);
                if (saved) {
                    dispatch(gameActions.loadPlayer(saved));
                    return;
                }
            }
        }

        // 2. Load manifest normally
        const manifest = loadManifest();
        dispatch(anchorActions.loadManifestAction(manifest));

        if (manifest?.activeAnchorId) {
            const saved = loadAnchorState<typeof player>(manifest.activeAnchorId);
            if (saved) {
                dispatch(gameActions.loadPlayer(saved));
                return;
            }
        }

        // 3. No active anchor — selection screen handles this (no awaitingNameEntry here)
    }, []);

    // ── Idle-cap notification cancel on cold start ────────────────────────
    useEffect(() => {
        if (AppState.currentState === 'active') {
            cancelIdleCapNotification().catch(() => {});
        }
    }, []);

    // ── Auto-save every 30s ───────────────────────────────────────────────
    useEffect(() => {
        if (!isLoaded || !manifest?.activeAnchorId) return;

        const anchorId = manifest.activeAnchorId;

        const intervalId = setInterval(() => {
            const stateToSave = { ...player, lastSaveTimestamp: Date.now() };
            saveAnchorState(anchorId, stateToSave);
            // Update manifest meta (totalLevel, lastSavedAt)
            const skills = player.skills ?? {};
            let totalLevel = 0;
            for (const sk of Object.values(skills) as Array<{ level?: number }>) {
                totalLevel += sk.level ?? 1;
            }
            const existing = manifest.anchors.find(a => a.id === anchorId);
            if (existing) {
                const updated: AnchorMeta = {
                    ...existing,
                    totalLevel,
                    lastSavedAt: Date.now(),
                    isPatron: player.settings?.isPatron ?? false,
                };
                dispatch(anchorActions.upsertAnchorMeta(updated));
                saveManifest({ ...manifest, anchors: manifest.anchors.map(a => a.id === anchorId ? updated : a) });
            }
        }, AUTO_SAVE_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [isLoaded, player, manifest]);

    // ── Save on background + idle-cap notification ────────────────────────
    useEffect(() => {
        const anchorId = manifest?.activeAnchorId ?? null;

        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                if (
                    appStateRef.current === 'active' &&
                    nextState.match(/inactive|background/) &&
                    anchorId &&
                    isLoaded
                ) {
                    const now = Date.now();
                    saveAnchorState(anchorId, { ...player, lastSaveTimestamp: now });
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
    }, [player, isLoaded, manifest]);
}
