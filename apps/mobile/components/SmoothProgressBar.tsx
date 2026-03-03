/**
 * SmoothProgressBar — Renders a progress bar with interpolated fill.
 * Uses useInterpolatedProgress to avoid jumpy 100ms Redux update steps.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useInterpolatedProgress } from '@/hooks/useInterpolatedProgress';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

interface SmoothProgressBarProps {
  partialTickMs: number;
  intervalMs: number;
  fillColor?: string;
  style?: ViewStyle;
}

export function SmoothProgressBar({
  partialTickMs,
  intervalMs,
  fillColor,
  style,
}: SmoothProgressBarProps) {
  const { palette } = useTheme();
  const progress = useInterpolatedProgress(partialTickMs, intervalMs);
  const color = fillColor ?? palette.accentPrimary;

  return (
    <View style={[styles.bg, { backgroundColor: palette.bgApp }, style]}>
      <View style={[styles.fill, { width: `${Math.min(100, progress)}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});