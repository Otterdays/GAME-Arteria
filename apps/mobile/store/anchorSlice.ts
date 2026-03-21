// [TRACE: DOCU/SCRATCHPAD.md — Anchor Timeline Selection v0.7.0]
/**
 * anchorSlice — manages the global Anchor manifest in Redux.
 *
 * The manifest is the global registry of all character saves.
 * It is kept separate from gameSlice so:
 *  - the selection screen can read it without loading a full PlayerState
 *  - switching characters never pollutes the in-game player state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AnchorManifest, AnchorMeta } from './persistence';

interface AnchorState {
    manifest: AnchorManifest | null;
    isManifestLoaded: boolean;
}

const initialState: AnchorState = {
    manifest: null,
    isManifestLoaded: false,
};

export const anchorSlice = createSlice({
    name: 'anchor',
    initialState,
    reducers: {
        /** Hydrate the manifest from MMKV (called once on boot). */
        loadManifestAction(state, action: PayloadAction<AnchorManifest | null>) {
            state.manifest = action.payload;
            state.isManifestLoaded = true;
        },

        /** Set which anchor is currently "active" (in-game). */
        setActiveAnchorId(state, action: PayloadAction<string | null>) {
            if (!state.manifest) {
                state.manifest = { activeAnchorId: action.payload, anchors: [], version: 1 };
            } else {
                state.manifest.activeAnchorId = action.payload;
            }
        },

        /** Add a new anchor meta to the manifest, or update an existing one. */
        upsertAnchorMeta(state, action: PayloadAction<AnchorMeta>) {
            if (!state.manifest) {
                state.manifest = {
                    activeAnchorId: action.payload.id,
                    anchors: [action.payload],
                    version: 1,
                };
                return;
            }
            const idx = state.manifest.anchors.findIndex(a => a.id === action.payload.id);
            if (idx >= 0) {
                state.manifest.anchors[idx] = action.payload;
            } else {
                state.manifest.anchors.push(action.payload);
            }
        },

        /** Remove an anchor from the manifest (after its save data has been deleted). */
        removeAnchorMeta(state, action: PayloadAction<string>) {
            if (!state.manifest) return;
            state.manifest.anchors = state.manifest.anchors.filter(a => a.id !== action.payload);
            // If the deleted anchor was active, clear active selection
            if (state.manifest.activeAnchorId === action.payload) {
                state.manifest.activeAnchorId = null;
            }
        },
    },
});

export const anchorActions = anchorSlice.actions;
