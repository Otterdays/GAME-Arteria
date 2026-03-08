/**
 * SmoothProgressBar — Renders a progress bar with interpolated fill.
 * Uses useInterpolatedProgress to avoid jumpy 100ms Redux update steps.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { useInterpolatedProgress } from '@/hooks/useInterpolatedProgress';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector } from '@/store/hooks';

interface SmoothProgressBarProps {
  partialTickMs?: number; // Deprecated, automatically reads from Redux now
  intervalMs?: number; // Deprecated
  fillColor?: string;
  style?: ViewStyle;
}

export function SmoothProgressBar({
  fillColor,
  style,
}: SmoothProgressBarProps) {
  const { palette } = useTheme();
  const partialTickMs = useAppSelector(s => s.game.player.activeTask?.partialTickMs ?? 0);
  const intervalMs = useAppSelector(s => s.game.player.activeTask?.intervalMs ?? 0);
  
  const progressAnim = useInterpolatedProgress(partialTickMs, intervalMs);
  const color = fillColor ?? palette.accentPrimary;

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.bg, { backgroundColor: palette.bgApp }, style]}>
      <Animated.View style={[styles.fill, { width: widthInterpolated, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});