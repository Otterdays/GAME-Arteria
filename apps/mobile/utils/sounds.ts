/**
 * Simple SFX: tink, thump, splash.
 * Play on tick complete (mining, logging, fishing, etc.).
 * Respects settings.sfxEnabled.
 * [TRACE: IMPROVEMENTS — Idle Soundscapes / SFX]
 */

import { useCallback, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

// expo-audio native module may be absent in Expo Go; stub when unavailable
let useAudioPlayerImpl: ((src: number) => { seekTo: (ms: number) => void; play: () => void }) | null = null;
try {
    useAudioPlayerImpl = require('expo-audio').useAudioPlayer;
} catch {
    useAudioPlayerImpl = null;
}

const tinkSource = require('../assets/sounds/tink.wav');
const thumpSource = require('../assets/sounds/thump.wav');
const splashSource = require('../assets/sounds/splash.wav');

function useStubPlayer() {
    return useMemo(() => ({ seekTo: () => {}, play: () => {} }), []);
}

export type SfxType = 'tink' | 'thump' | 'splash';

/** Map skill/action to SFX type */
export function getSfxForSkill(skillId: string): SfxType {
  switch (skillId) {
    case 'mining':
    case 'smithing':
    case 'forging':
    case 'runecrafting':
    case 'herblore':
    case 'woodworking':
    case 'crafting':
      return 'tink';
    case 'logging':
    case 'cooking':
    case 'harvesting':
    case 'scavenging':
      return 'thump';
    case 'fishing':
      return 'splash';
    default:
      return 'tink';
  }
}

export function useSfx() {
  const sfxEnabled = useAppSelector((s) => s.game.player.settings?.sfxEnabled ?? true);
  const tinkPlayer = useAudioPlayerImpl ? useAudioPlayerImpl(tinkSource) : useStubPlayer();
  const thumpPlayer = useAudioPlayerImpl ? useAudioPlayerImpl(thumpSource) : useStubPlayer();
  const splashPlayer = useAudioPlayerImpl ? useAudioPlayerImpl(splashSource) : useStubPlayer();

  const playTink = useCallback(() => {
    if (!sfxEnabled) return;
    try {
      tinkPlayer.seekTo(0);
      tinkPlayer.play();
    } catch {
      // ignore
    }
  }, [sfxEnabled, tinkPlayer]);

  const playThump = useCallback(() => {
    if (!sfxEnabled) return;
    try {
      thumpPlayer.seekTo(0);
      thumpPlayer.play();
    } catch {
      // ignore
    }
  }, [sfxEnabled, thumpPlayer]);

  const playSplash = useCallback(() => {
    if (!sfxEnabled) return;
    try {
      splashPlayer.seekTo(0);
      splashPlayer.play();
    } catch {
      // ignore
    }
  }, [sfxEnabled, splashPlayer]);

  const playForSkill = useCallback(
    (skillId: string) => {
      const type = getSfxForSkill(skillId);
      if (type === 'tink') playTink();
      else if (type === 'thump') playThump();
      else playSplash();
    },
    [playTink, playThump, playSplash]
  );

  return { playTink, playThump, playSplash, playForSkill };
}
