/**
 * Arteria Theme — Dark-first color palette and design tokens.
 * Based on the Melvor Idle style guide (zhip-ai-styling.md).
 */

import { Platform } from 'react-native';

// ── Core Palette (from design spec) ─────────────────────────
export const Palette = {
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

  // Accent (blue)
  accentPrimary: '#4a90e2',
  accentHover: '#6aa3f5',
  accentDim: '#3a6db5',

  // Positive / XP / Success
  green: '#4caf50',
  greenDim: '#2e7d32',

  // Warning / Gold / Currency
  gold: '#ffca28',
  goldDim: '#c49b1a',

  // Danger / Low HP
  red: '#f44336',
  redDim: '#c62828',

  // Borders / Dividers
  border: '#2b2f3d',
  divider: '#252837',

  // Misc
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
  skillCrafting: '#9b59b6',
  skillFarming: '#27ae60',
  skillHerblore: '#2ecc71',
  skillAgility: '#3498db',
  skillAttack: '#e74c3c',
  skillStrength: '#2ecc71',
  skillDefence: '#3498db',
  skillHitpoints: '#e74c3c',
} as const;

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
