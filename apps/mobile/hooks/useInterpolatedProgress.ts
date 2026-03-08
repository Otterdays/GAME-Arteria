/**
 * useInterpolatedProgress — Smooth progress between Redux updates.
 * Redux updates partialTickMs every 100ms; this interpolates at ~60fps
 * so the progress bar moves smoothly instead of in discrete jumps.
 *
 * Only the RAF loop updates progress; the sync effect just updates lastRef.
 * This avoids competing setState calls that caused jumpiness.
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useInterpolatedProgress(
  partialTickMs: number,
  intervalMs: number
): Animated.Value {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (intervalMs <= 0) {
      progressAnim.setValue(0);
      return;
    }

    const startPct = (partialTickMs / intervalMs) * 100;
    const endPct = 100;
    const remainingMs = Math.max(0, intervalMs - partialTickMs);

    progressAnim.setValue(startPct);

    // Animate to 100% over the remaining interval length (smooth linear)
    Animated.timing(progressAnim, {
      toValue: endPct,
      duration: remainingMs,
      easing: Easing.linear,
      useNativeDriver: false, // width/interpolations cannot easily be native
    }).start();
  }, [partialTickMs, intervalMs, progressAnim]);

  return progressAnim;
}
