/**
 * Arteria Theme — Dark-first color palette and design tokens.
 * Based on the Melvor Idle style guide (zhip-ai-styling.md).
 * [TRACE: DOCU/THEMING.md — Theme architecture]
 */

import { Platform } from 'react-native';

// ── Theme Architecture ─────────────────────────────────────
export type ThemeId = 'system' | 'dark' | 'light' | 'sepia';

/** Theme options for Settings picker. [TRACE: DOCU/THEMING.md Phase 2] */
export const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
    { id: 'system', label: 'System' },
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
    { id: 'sepia', label: 'Sepia' },
];

export type PaletteShape = {
  bgApp: string;
  bgCard: string;
  bgCardHover: string;
  bgInput: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textMuted: string;
  accentPrimary: string;
  accentHover: string;
  accentDim: string;
  accentWeb: string;
  borderGlow: string;
  gold: string;
  goldDim: string;
  green: string;
  greenDim: string;
  red: string;
  redDim: string;
  border: string;
  divider: string;
  purple: string;
  white: string;
  black: string;
  transparent: string;
  skillMining: string;
  skillLogging: string;
  skillHarvesting: string;
  skillScavenging: string;
  skillFishing: string;
  skillCooking: string;
  skillSmithing: string;
  skillForging: string;
  skillCrafting: string;
  skillFarming: string;
  skillHerblore: string;
  skillAgility: string;
  skillAttack: string;
  skillStrength: string;
  skillDefence: string;
  skillHitpoints: string;
};

// ── Core Palette (from design spec) ─────────────────────────
const DARK_PALETTE: PaletteShape = {
  // Backgrounds
  bgApp: '#0f111a',
  bgCard: '#1b1e29',
  bgCardHover: '#232636',
  bgInput: '#161825',

  // Text
  textPrimary: '#e8e9ed',
  textSecondary: '#8b8fa3',
  textDisabled: '#5a5e6b',
  textMuted: '#6c7085',

  // Accent (blue — primary for interactive)
  accentPrimary: '#4a90e2',
  accentHover: '#6aa3f5',
  accentDim: '#3a6db5',

  // Website alignment (subtle purple/gold)
  accentWeb: '#8b5cf6',
  borderGlow: 'rgba(139, 92, 246, 0.35)',
  gold: '#f59e0b',
  goldDim: '#c49b1a',

  // Positive / XP / Success
  green: '#4caf50',
  greenDim: '#2e7d32',

  // Danger / Low HP
  red: '#f44336',
  redDim: '#c62828',

  // Borders / Dividers
  border: '#2b2f3d',
  divider: '#252837',

  // Misc
  purple: '#9b59b6',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Skill Colors (for progress bars & icons)
  skillMining: '#b87333',     // copper/bronze
  skillLogging: '#6d9b3a',
  skillHarvesting: '#f1c40f',
  skillScavenging: '#808e9b',
  skillFishing: '#4a90e2',
  skillCooking: '#e67e22',
  skillSmithing: '#95a5a6',
  skillForging: '#c0392b',
  skillCrafting: '#9b59b6',
  skillFarming: '#27ae60',
  skillHerblore: '#2ecc71',
  skillAgility: '#3498db',
  skillAttack: '#e74c3c',
  skillStrength: '#2ecc71',
  skillDefence: '#3498db',
  skillHitpoints: '#e74c3c',
};

/** Backward compat: default dark palette. Prefer useTheme().palette for new code. */
export const Palette = DARK_PALETTE;

/** Theme registry. [TRACE: DOCU/THEMING.md] */
export const THEMES: Record<Exclude<ThemeId, 'system'>, PaletteShape> = {
  dark: DARK_PALETTE,
  light: {
    ...DARK_PALETTE,
    bgApp: '#f5f6fa',
    bgCard: '#ffffff',
    bgCardHover: '#eef0f4',
    bgInput: '#e8e9ed',
    textPrimary: '#11181c',
    textSecondary: '#5a5e6b',
    textDisabled: '#8b8fa3',
    textMuted: '#6c7085',
    border: '#e0e0e0',
    divider: '#e8e9ed',
  },
  sepia: {
    ...DARK_PALETTE,
    bgApp: '#1a1814',
    bgCard: '#252219',
    bgCardHover: '#2e2a22',
    bgInput: '#1f1c18',
    textPrimary: '#e8e4dc',
    textSecondary: '#9a958a',
    textDisabled: '#6c685e',
    textMuted: '#7a756b',
    accentPrimary: '#c49b1a',
    accentHover: '#d4ab2a',
    accentDim: '#a08015',
    accentWeb: '#b8860b',
    borderGlow: 'rgba(184, 134, 11, 0.35)',
    border: '#3d382e',
    divider: '#322e26',
  },
};

/** Build React Navigation theme from palette. [TRACE: DOCU/THEMING.md §6] */
export function paletteToNavigationTheme(palette: PaletteShape) {
  const hex = palette.bgApp.replace('#', '').padEnd(6, '0').slice(0, 6);
  const r = parseInt(hex.slice(0, 2), 16) || 0;
  const g = parseInt(hex.slice(2, 4), 16) || 0;
  const b = parseInt(hex.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isDark = luminance < 0.5;
  return {
    dark: isDark,
    colors: {
      primary: palette.accentPrimary,
      background: palette.bgApp,
      card: palette.bgCard,
      text: palette.textPrimary,
      border: palette.border,
      notification: palette.accentPrimary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '600' as const },
      heavy: { fontFamily: 'System', fontWeight: '700' as const },
    },
  };
}

// ── Colors (dark-only for now, matching the idle RPG standard) ──
export const Colors = {
  light: {
    text: '#11181C',
    background: '#f5f6fa',
    tint: Palette.accentPrimary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: Palette.accentPrimary,
    card: '#ffffff',
    border: '#e0e0e0',
  },
  dark: {
    text: Palette.textPrimary,
    background: Palette.bgApp,
    tint: Palette.accentPrimary,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textDisabled,
    tabIconSelected: Palette.accentPrimary,
    card: Palette.bgCard,
    border: Palette.border,
  },
};

// ── Spacing Scale ───────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

// ── Border Radius ───────────────────────────────────────────
export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ── Font Sizes ──────────────────────────────────────────────
export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 32,
} as const;

// ── Card styling (website-aligned border/glow) ────────────────
export const CardStyle = {
  borderWidth: 1,
  borderColor: Palette.border,
  borderRadius: Radius.md,
  // Subtle purple glow (website accent)
  shadowColor: Palette.accentWeb,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 3,
} as const;

// ── Fonts ───────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "normal",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Cinzel (loaded via useFonts in root layout)
export const FontCinzel = 'Cinzel_400Regular';
export const FontCinzelBold = 'Cinzel_700Bold';
