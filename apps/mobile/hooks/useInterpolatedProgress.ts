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
  const lastTickRef = useRef(-1);

  useEffect(() => {
    if (intervalMs <= 0) {
      progressAnim.setValue(0);
      lastTickRef.current = -1;
      return;
    }

    const wentBackward = partialTickMs < lastTickRef.current;
    const drift = Math.abs(partialTickMs - lastTickRef.current);

    // If it's a normal 100ms sequential tick, let the existing animation continue doing its smooth interpolation to 100%.
    // Only restart the animation if we went backward (new tick), jumped significantly (app lag/backgrounded), or first render.
    if (lastTickRef.current !== -1 && !wentBackward && drift < 500) {
      lastTickRef.current = partialTickMs;
      return;
    }

    lastTickRef.current = partialTickMs;

    const startPct = (partialTickMs / intervalMs) * 100;
    const endPct = 100;
    const remainingMs = Math.max(0, intervalMs - partialTickMs);

    progressAnim.stopAnimation();
    progressAnim.setValue(startPct);

    Animated.timing(progressAnim, {
      toValue: endPct,
      duration: remainingMs,
      easing: Easing.linear,
      useNativeDriver: false, // width/interpolations cannot easily be native
    }).start();
  }, [partialTickMs, intervalMs, progressAnim]);

  return progressAnim;
}
