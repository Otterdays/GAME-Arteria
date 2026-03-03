/**
 * Idle Soundscapes — ambient audio loops per skill screen (e.g. forge clinking, waves).
 * When settings.idleSoundscapesEnabled is true, skill screens can use this hook to
 * start/stop the appropriate loop. Stub: no audio yet; ready for expo-av or similar.
 * [TRACE: ROADMAP Juice Backlog — Idle Soundscapes]
 */

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export type SoundscapeId = 'mining' | 'logging' | 'fishing' | 'runecrafting' | 'none';

export function useIdleSoundscape(soundscapeId: SoundscapeId) {
    const enabled = useAppSelector(
        (s) => s.game.player.settings?.idleSoundscapesEnabled ?? false
    );

    useEffect(() => {
        if (!enabled || soundscapeId === 'none') return;
        // TODO: Load and play loop for soundscapeId (e.g. expo-av Audio.Sound).
        // Suggested: mining = pickaxe clinks, logging = birds, fishing = waves, runecrafting = hum.
        return () => {
            // TODO: Stop and unload sound when leaving screen.
        };
    }, [enabled, soundscapeId]);
}
