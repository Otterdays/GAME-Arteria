/**
 * Arteria Theme — Dark-first color palette and design tokens.
 * Based on the Melvor Idle style guide (zhip-ai-styling.md).
 * [TRACE: DOCU/THEMING.md — Theme architecture]
 */

import { Platform } from 'react-native';

// ── Theme Architecture ─────────────────────────────────────
export type ThemeId = 'system' | 'dark' | 'light' | 'sepia' | 'midnight';

/** Theme options for Settings picker. [TRACE: DOCU/THEMING.md Phase 2] */
export const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'midnight', label: 'Midnight' },
];

export type PaletteShape = {
  bgApp: string;
  bgCard: string;
  bgCardHover: string;
  bgInput: string;
  glassBg: string;
  glassBorder: string;
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
  skillThieving: string;
  skillFletching: string;
  skillTailoring: string;
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
  glassBg: 'rgba(27, 30, 41, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',

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
  skillThieving: '#8e44ad',
  skillFletching: '#d35400',
  skillTailoring: '#e91e63',
  skillAttack: '#e74c3c',
  skillStrength: '#2ecc71',
  skillDefence: '#3498db',
  skillHitpoints: '#e74c3c',
};

/** Theme registry. [TRACE: DOCU/THEMING.md] */
export const THEMES: Record<Exclude<ThemeId, 'system'>, PaletteShape> = {
  dark: DARK_PALETTE,
  light: {
    ...DARK_PALETTE,
    bgApp: '#f5f6fa',
    bgCard: '#ffffff',
    bgCardHover: '#eef0f4',
    bgInput: '#e8e9ed',
    glassBg: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(0, 0, 0, 0.05)',
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
    glassBg: 'rgba(37, 34, 25, 0.8)',
    glassBorder: 'rgba(196, 155, 26, 0.15)',
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
  midnight: {
    ...DARK_PALETTE,
    bgApp: '#050508',
    bgCard: '#0d0d12',
    bgCardHover: '#14141d',
    bgInput: '#08080b',
    glassBg: 'rgba(13, 13, 18, 0.85)',
    glassBorder: 'rgba(139, 92, 246, 0.2)',
    accentPrimary: '#7c3aed', // Deeper purple
    accentHover: '#8b5cf6',
    accentDim: '#5b21b6',
    border: '#1a1a24',
    divider: '#12121a',
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

// ── Colors (Expo useThemeColor; dark uses DARK_PALETTE) ──
export const Colors = {
  light: {
    text: '#11181C',
    background: '#f5f6fa',
    tint: DARK_PALETTE.accentPrimary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: DARK_PALETTE.accentPrimary,
    card: '#ffffff',
    border: '#e0e0e0',
  },
  dark: {
    text: DARK_PALETTE.textPrimary,
    background: DARK_PALETTE.bgApp,
    tint: DARK_PALETTE.accentPrimary,
    icon: DARK_PALETTE.textSecondary,
    tabIconDefault: DARK_PALETTE.textDisabled,
    tabIconSelected: DARK_PALETTE.accentPrimary,
    card: DARK_PALETTE.bgCard,
    border: DARK_PALETTE.border,
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
  borderColor: DARK_PALETTE.border,
  borderRadius: Radius.md,
  // Subtle purple glow (website accent)
  shadowColor: DARK_PALETTE.accentWeb,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.18,
  shadowRadius: 10,
  elevation: 3,
} as const;

/**
 * Arteria Depth System — Layered shadow and surface presets.
 * Part of the Arteria-theme-engine (see TECHNICAL_USER_MANUAL.md).
 *
 * Usage:
 *   Subtle  → Skill box, stat pill, idle badges (barely floating)
 *   Medium  → Section cards, modals backs, settings rows (standard float)
 *   Elevated → Node/action cards, active states (lifted, attention-grabbing)
 *   Deep    → Modals, overlays, featured panels (dramatic lift)
 */

/** Subtle float — barely lifted off the surface. Good for pills and badges. */
export const ShadowSubtle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.12,
  shadowRadius: 3,
  elevation: 1,
} as const;

/** Standard card elevation — lifted enough to notice. */
export const ShadowMedium = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
} as const;

/** Elevated card — draws the eye. Node cards, active task cards. */
export const ShadowElevated = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.28,
  shadowRadius: 14,
  elevation: 8,
} as const;

/** Deep shadow — dramatic floating. Modals, feature panels. */
export const ShadowDeep = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 24,
  elevation: 12,
} as const;

/** Elevated card style with stronger presence than CardStyle. */
export const CardStyleElevated = {
  borderWidth: 1,
  borderColor: DARK_PALETTE.border,
  borderRadius: Radius.lg,
  ...ShadowElevated,
  shadowColor: DARK_PALETTE.accentWeb,
  shadowOpacity: 0.22,
} as const;

/** Raised (3D) button style — lighter top edge, darker bottom, soft lift shadow. */
export const ButtonRaisedStyle = {
  borderRadius: Radius.md,
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.12)',
  borderBottomWidth: 2,
  borderBottomColor: 'rgba(0,0,0,0.25)',
  ...ShadowMedium,
} as const;

/** Inset (recessed) surface — simulates inner shadow via top border darkening. */
export const InsetStyle = {
  borderRadius: Radius.md,
  borderWidth: 1,
  borderTopColor: 'rgba(0,0,0,0.3)',
  borderLeftColor: 'rgba(0,0,0,0.15)',
  borderRightColor: 'rgba(255,255,255,0.04)',
  borderBottomColor: 'rgba(255,255,255,0.06)',
} as const;

/** Header shadow — casts downward for section separation depth. */
export const HeaderShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
  zIndex: 1,
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
