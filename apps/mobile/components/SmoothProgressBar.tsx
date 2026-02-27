/**
 * SmoothProgressBar — Renders a progress bar with interpolated fill.
 * Uses useInterpolatedProgress to avoid jumpy 100ms Redux update steps.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useInterpolatedProgress } from '@/hooks/useInterpolatedProgress';
import { Palette, Spacing } from '@/constants/theme';

interface SmoothProgressBarProps {
  partialTickMs: number;
  intervalMs: number;
  fillColor?: string;
  style?: ViewStyle;
}

export function SmoothProgressBar({
  partialTickMs,
  intervalMs,
  fillColor = Palette.accentPrimary,
  style,
}: SmoothProgressBarProps) {
  const progress = useInterpolatedProgress(partialTickMs, intervalMs);

  return (
    <View style={[styles.bg, style]}>
      <View style={[styles.fill, { width: `${Math.min(100, progress)}%`, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    height: 4,
    backgroundColor: Palette.bgApp,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});