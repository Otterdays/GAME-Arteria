/**
 * useInterpolatedProgress — Smooth progress between Redux updates.
 * Redux updates partialTickMs every 100ms; this interpolates at ~60fps
 * so the progress bar moves smoothly instead of in discrete jumps.
 */

import { useState, useEffect, useRef } from 'react';

export function useInterpolatedProgress(
  partialTickMs: number,
  intervalMs: number
): number {
  const [progress, setProgress] = useState(0);
  const lastRef = useRef({ partialTickMs: 0, timestamp: 0 });

  useEffect(() => {
    const now = Date.now();
    lastRef.current = { partialTickMs, timestamp: now };
    if (intervalMs <= 0) {
      setProgress(0);
      return;
    }
    setProgress(Math.min(100, (partialTickMs / intervalMs) * 100));
  }, [partialTickMs, intervalMs]);

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
