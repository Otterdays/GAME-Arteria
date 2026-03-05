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
  const bg = inProgress ? palette.green + '22' : palette.red + '22';
  const border = inProgress ? palette.green + '66' : palette.red + '66';
  const dotColor = inProgress ? palette.green : palette.red;
  const textColor = inProgress ? palette.green : palette.red;
  const padH = size === 'sm' ? Spacing.xs : Spacing.sm;
  const padV = size === 'sm' ? 2 : 4;
  const fontSize = size === 'sm' ? FontSize.xs : FontSize.sm;

  return StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      alignSelf: 'flex-start',
      backgroundColor: bg,
      paddingHorizontal: padH,
      paddingVertical: padV,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: border,
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: dotColor,
    },
    text: {
      fontSize,
      fontWeight: '600',
      color: textColor,
      letterSpacing: 0.3,
    },
  });
}
