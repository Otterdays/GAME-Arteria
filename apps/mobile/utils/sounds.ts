/**
 * Simple SFX: tink, thump, splash.
 * Play on tick complete (mining, logging, fishing, etc.).
 * Respects settings.sfxEnabled.
 * [TRACE: IMPROVEMENTS — Idle Soundscapes / SFX]
 */

import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';

const tinkSource = require('../assets/sounds/tink.wav');
const thumpSource = require('../assets/sounds/thump.wav');
const splashSource = require('../assets/sounds/splash.wav');

export type SfxType = 'tink' | 'thump' | 'splash';

/** Map skill/action to SFX type */
export function getSfxForSkill(skillId: string): SfxType {
  switch (skillId) {
    case 'mining':
    case 'smithing':
    case 'forging':
    case 'runecrafting':
      return 'tink';
    case 'logging':
    case 'cooking':
      return 'thump';
    case 'fishing':
      return 'splash';
    default:
      return 'tink';
  }
}

export function useSfx() {
  const sfxEnabled = useAppSelector((s) => s.game.player.settings?.sfxEnabled ?? true);
  const tinkPlayer = useAudioPlayer(tinkSource);
  const thumpPlayer = useAudioPlayer(thumpSource);
  const splashPlayer = useAudioPlayer(splashSource);

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
