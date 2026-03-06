/**
 * ComingSoonBadge — Red (planned) or green (in progress) badge for unimplemented content.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md §6]
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, Radius, type PaletteShape } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export interface ComingSoonBadgeProps {
  /** true = green "In progress", false = red "Coming soon" */
  inProgress?: boolean;
  /** Optional compact label override */
  label?: string;
  /** Optional size: 'sm' | 'md' */
  size?: 'sm' | 'md';
}

export function ComingSoonBadge({
  inProgress = false,
  label,
  size = 'sm',
}: ComingSoonBadgeProps) {
  const { palette } = useTheme();
  const text = label ?? (inProgress ? 'In progress' : 'Coming soon');
  const styles = useMemo(() => createStyles(palette, inProgress, size), [palette, inProgress, size]);

  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

function createStyles(palette: PaletteShape, inProgress: boolean, size: 'sm' | 'md') {
  const bg = inProgress ? palette.green + '28' : palette.red + '28';
  const border = inProgress ? palette.green + '88' : palette.red + '88';
  const dotColor = inProgress ? palette.green : palette.red;
  const textColor = inProgress ? palette.green : palette.red;
  const padH = size === 'sm' ? Spacing.sm : Spacing.md;
  const padV = size === 'sm' ? 3 : 5;
  const fontSize = size === 'sm' ? FontSize.xs : FontSize.sm;
  const dotSize = size === 'sm' ? 6 : 7;

  return StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      alignSelf: 'center',
      backgroundColor: bg,
      paddingHorizontal: padH,
      paddingVertical: padV,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: border,
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
    },
    dot: {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: dotColor,
    },
    text: {
      fontSize,
      fontWeight: '700',
      color: textColor,
      letterSpacing: 0.4,
    },
  });
}
