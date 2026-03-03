/**
 * useInterpolatedProgress — Smooth progress between Redux updates.
 * Redux updates partialTickMs every 100ms; this interpolates at ~60fps
 * so the progress bar moves smoothly instead of in discrete jumps.
 *
 * Only the RAF loop updates progress; the sync effect just updates lastRef.
 * This avoids competing setState calls that caused jumpiness.
 */

import { useState, useEffect, useRef } from 'react';

export function useInterpolatedProgress(
  partialTickMs: number,
  intervalMs: number
): number {
  const [progress, setProgress] = useState(0);
  const lastRef = useRef({ partialTickMs: 0, timestamp: 0 });

  // Sync lastRef when Redux updates; do NOT setProgress here to avoid fighting with RAF
  useEffect(() => {
    const now = Date.now();
    lastRef.current = { partialTickMs, timestamp: now };
    if (intervalMs <= 0) {
      setProgress(0);
      return;
    }
  }, [partialTickMs, intervalMs]);

  // Single source of truth: RAF loop interpolates at ~60fps
  useEffect(() => {
    if (intervalMs <= 0) return;

    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const { partialTickMs: lastMs, timestamp } = lastRef.current;
      const elapsed = Date.now() - timestamp;
      const interpolatedMs = Math.min(lastMs + elapsed, intervalMs);
      const pct = (interpolatedMs / intervalMs) * 100;
      setProgress(pct);
      requestAnimationFrame(tick);
    };
    const rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [intervalMs]);

  return progress;
}
