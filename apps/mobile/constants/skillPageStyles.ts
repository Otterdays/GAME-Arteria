/**
 * Shared skill page styles: level badge (Cinzel, gold glow), glass-style node/recipe cards.
 * [TRACE: DOCU/zhip-ai-styling.md — Melvor-like UI]
 * Part of Arteria-theme-engine depth system (see TECHNICAL_USER_MANUAL.md).
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Radius, FontSize, FontCinzelBold, ShadowElevated, ShadowSubtle, InsetStyle } from './theme';
import type { PaletteShape } from './theme';

/** Glass gradient colors for node/recipe cards (dark, subtle) */
export function getGlassCardGradientColors(palette: PaletteShape): readonly [string, string] {
  return [
    `${palette.bgCard}ee`,
    `${palette.bgCardHover}dd`,
  ] as const;
}

/** Level badge styles: Cinzel, goldish, soft glow, depth shadow */
export function getLevelBadgeStyles(palette: PaletteShape, skillColor: string) {
  return {
    levelBadge: {
      backgroundColor: skillColor + '28',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: Radius.full,
      marginBottom: 8,
      borderWidth: 0.5,
      borderColor: skillColor + '99',
      shadowColor: palette.gold,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 2,
    } as ViewStyle,
    levelBadgeText: {
      fontFamily: FontCinzelBold,
      color: palette.gold,
      fontWeight: 'bold' as const,
      fontSize: FontSize.sm,
      textShadowColor: palette.gold,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 6,
    } as TextStyle,
  };
}

/** Base node/recipe card: drop shadow for floating depth, overflow for gradient */
export function getNodeCardBaseStyles(palette: PaletteShape): {
  nodeCard: ViewStyle;
  nodeCardLocked: ViewStyle;
} {
  return {
    nodeCard: {
      borderRadius: Radius.lg,
      padding: 16,
      borderWidth: 0.5,
      borderColor: palette.border + 'cc',
      overflow: 'hidden' as const,
      position: 'relative' as const,
      // Depth: soft floating shadow beneath the card
      ...ShadowElevated,
      shadowColor: palette.black,
      shadowOpacity: 0.22,
    },
    nodeCardLocked: {
      backgroundColor: palette.bgApp,
      borderColor: 'transparent',
      // Locked cards sit flat — no shadow
      shadowOpacity: 0,
      elevation: 0,
    },
  };
}

/** Inset stat pill: slightly recessed feel for stat containers inside node cards. */
export function getStatPillInsetStyles(palette: PaletteShape): {
  statPillInset: ViewStyle;
} {
  return {
    statPillInset: {
      flex: 1,
      backgroundColor: palette.bgApp,
      padding: 8,
      alignItems: 'center' as const,
      // Inset depth: darker top border simulates inner shadow
      ...InsetStyle,
      borderRadius: Radius.md,
      borderTopColor: `${palette.black}40`,
      borderLeftColor: `${palette.black}20`,
      borderRightColor: `${palette.white}06`,
      borderBottomColor: `${palette.white}08`,
    },
  };
}
