// [TRACE: DOCU/SCRATCHPAD.md — Anchor Timeline Selection v0.7.0]
/**
 * MMKV-based multi-slot save persistence for Arteria.
 *
 * Each "Anchor" (character) is stored independently:
 *   - `arteria_manifest`  :  JSON AnchorManifest (global registry)
 *   - `anchor_[id]`       :  JSON PlayerState for that anchor
 *
 * Legacy single-key saves (`player_state`) are migrated on first load
 * to slot `v0migration`; the old key is deleted afterward.
 */

import { createMMKV } from 'react-native-mmkv';
import { logger } from '@/utils/logger';

const storage = createMMKV({ id: 'arteria-save' });

// ─── Keys ──────────────────────────────────────────────────────────────────

const MANIFEST_KEY = 'arteria_manifest';
const LEGACY_KEY   = 'player_state';      // Pre-v0.7 single-slot key
const LEGACY_MIGRATION_ID = 'v0migration';

const anchorKey = (id: string) => `anchor_${id}`;

// ─── Types ─────────────────────────────────────────────────────────────────

/** Summary record stored in the manifest for each character slot. */
export interface AnchorMeta {
    id: string;
    /** Display name chosen by the player at creation. */
    name: string;
    /** Cosmic affinity chosen at creation. */
    affinityId: AffinityId;
    /** Sum of all skill levels. */
    totalLevel: number;
    /** Unix ms of last save. */
    lastSavedAt: number;
    /** Emoji of the skill the anchor was training when last saved. */
    activeSkillEmoji?: string;
    /** Patron status (drives slot capacity labeling). */
    isPatron: boolean;
}

/** Affinity chosen at Anchor creation — cosmetic + minor starting buff. */
export type AffinityId = 'luminar' | 'voidmire' | 'balanced';

/** Global manifest — persists across all character lives. */
export interface AnchorManifest {
    /** The id of the anchor currently loaded in-game. null = none selected. */
    activeAnchorId: string | null;
    anchors: AnchorMeta[];
    /** Manifest schema version — bump when breaking changes occur. */
    version: 1;
}

// ─── Manifest helpers ──────────────────────────────────────────────────────

/**
 * Load the global manifest from MMKV.
 * Returns null if no manifest exists yet (fresh install before any migration).
 */
export function loadManifest(): AnchorManifest | null {
    try {
        const json = storage.getString(MANIFEST_KEY);
        if (!json) return null;
        return JSON.parse(json) as AnchorManifest;
    } catch (e) {
        logger.error('Persistence', 'Failed to load manifest:', e);
        return null;
    }
}

/** Persist the manifest back to MMKV. */
export function saveManifest(manifest: AnchorManifest): void {
    try {
        storage.set(MANIFEST_KEY, JSON.stringify(manifest));
    } catch (e) {
        logger.error('Persistence', 'Failed to save manifest:', e);
    }
}

// ─── Anchor state helpers ──────────────────────────────────────────────────

/** Load a character's full PlayerState by anchor id. Returns null if missing. */
export function loadAnchorState<T>(id: string): T | null {
    try {
        const json = storage.getString(anchorKey(id));
        if (!json) return null;
        return JSON.parse(json) as T;
    } catch (e) {
        logger.error('Persistence', `Failed to load anchor ${id}:`, e);
        return null;
    }
}

/** Save a character's full PlayerState by anchor id. */
export function saveAnchorState(id: string, state: unknown): void {
    try {
        storage.set(anchorKey(id), JSON.stringify(state));
    } catch (e) {
        logger.error('Persistence', `Failed to save anchor ${id}:`, e);
    }
}

/** Permanently delete an anchor's save data. */
export function deleteAnchorState(id: string): void {
    storage.delete(anchorKey(id));
}

// ─── Legacy migration ──────────────────────────────────────────────────────

/**
 * If a legacy single-slot save exists (`player_state` key), migrate it to
 * the multi-slot format under id `v0migration` and return the resulting
 * manifest so the caller can dispatch the loaded state.
 *
 * Returns the manifest if migration was performed, null if no legacy save.
 */
export function migrateV0Save(): AnchorManifest | null {
    if (!storage.contains(LEGACY_KEY)) return null;

    try {
        const rawJson = storage.getString(LEGACY_KEY);
        if (!rawJson) return null;

        const saved = JSON.parse(rawJson);

        // Copy to the new anchor key
        storage.set(anchorKey(LEGACY_MIGRATION_ID), rawJson);
        // Remove the legacy key
        storage.delete(LEGACY_KEY);

        // Derive a best-effort meta from the saved state
        const name: string = saved?.name || 'The Anchor';
        const skills = saved?.skills ?? {};
        let totalLevel = 0;
        for (const sk of Object.values(skills) as Array<{ level?: number }>) {
            totalLevel += sk.level ?? 1;
        }

        const meta: AnchorMeta = {
            id: LEGACY_MIGRATION_ID,
            name,
            affinityId: 'balanced',
            totalLevel,
            lastSavedAt: saved?.lastSaveTimestamp ?? Date.now(),
            isPatron: saved?.settings?.isPatron ?? false,
        };

        const manifest: AnchorManifest = {
            activeAnchorId: LEGACY_MIGRATION_ID,
            anchors: [meta],
            version: 1,
        };

        saveManifest(manifest);
        logger.info('Persistence', 'Migrated v0 save to anchor slot', { id: LEGACY_MIGRATION_ID });
        return manifest;
    } catch (e) {
        logger.error('Persistence', 'Failed to migrate v0 save:', e);
        return null;
    }
}

// ─── Legacy shims (keep old callers building while we refactor usePersistence) ─

/** @deprecated Use saveAnchorState(activeId, state) instead. */
export function savePlayerState(state: unknown): void {
    saveAnchorState('_legacy_shim', state);
}

/** @deprecated Use loadAnchorState(id) instead. */
export function loadPlayerState<T>(): T | null {
    return loadAnchorState<T>('_legacy_shim');
}

/** @deprecated */
export function deleteSave(): void {
    storage.delete(anchorKey('_legacy_shim'));
}

/** Check if an old pre-v0.7 save needs migrating. */
export function hasLegacySave(): boolean {
    return storage.contains(LEGACY_KEY);
}

/** @deprecated Use loadManifest() instead. */
export function hasSave(): boolean {
    return storage.contains(MANIFEST_KEY) || storage.contains(LEGACY_KEY);
}
