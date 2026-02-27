/**
 * Patch History — Full changelog from CHANGELOG.md.
 * [TRACE: DOCU/CHANGELOG.md] Keep in sync when shipping new versions.
 */

export interface PatchEntry {
  version: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
}

export const PATCH_HISTORY: PatchEntry[] = [
  {
    version: '0.4.5',
    date: '2026-02-27',
    added: [
      'Horizon System: 3-tier goal HUD (Immediate / Session / Grind) for persistent tracking.',
      'Unique Mechanics: Rare gem drops (Mining), Mythic fish (Fishing), and Seasonal Rotation (Logging).',
      'Premium HUD Styling: Glassmorphism and gradients for the new goal tracking system.',
      'Palette Expansion: Added purple accent to core design tokens.',
    ],
    fixed: [
      'APK Build: Fixed "No device found" error by using direct Gradle assembly.',
      'GlobalActionTicker: Cleaned up unused imports to prevent reference errors.',
    ],
  },
  {
    version: '0.4.4',
    date: '2026-02-26',
    added: ['Patch Notes Screen: Full changelog from v0.1.0, accessible from Settings.'],
  },
  {
    version: '0.4.3',
    date: '2026-02-26',
    added: [
      'Z. Bank Search + Filters: Real-time search bar and type filters (All / Ores / Bars / Other).',
      'Train Toast: "Mining: Iron Vein" confirmation when starting a skill action.',
      'X. Pulsing Tab Glow: Skills tab pulses gold on level-up, Bank tab on loot.',
      'S. Loot Vacuum: Item icon flies from center toward Bank tab when gaining loot.',
    ],
  },
  {
    version: '0.4.2',
    date: '2026-02-26',
    added: [
      'O. XP Bar Pulse: Subtle glow when XP bar fill moves.',
      'P. Haptic Heartbeat: Light haptic when action progress bar reaches 100%.',
      'V. Inventory Full Warning: "!" on Bank tab when full; 50-slot cap.',
      'Smooth Progress Bars: 60fps interpolation between Redux updates.',
    ],
    changed: ['XP Bar Pulse Glow: Increased intensity (white overlay, 550ms).'],
    fixed: [
      'APK Build: Metro resolves from apps/mobile correctly.',
      'GlobalActionTicker Hooks: Rules of Hooks compliance.',
    ],
  },
  {
    version: '0.4.1',
    date: '2026-02-26',
    added: [
      'Global Action Ticker: Persistent progress bar across all screens.',
      'Header XP Dashboard: Real-time XP tracking in Skills header.',
      'RPG Icon Overhaul: MaterialCommunityIcons (pickaxe, sword-cross, etc.).',
      'Custom Back Navigation: Theme-aligned back buttons.',
    ],
    fixed: [
      "Action 'Heartbeat' Visibility: Progress bar in sub-screens.",
      'Node-level Feedback: Localized progress bars on Mining nodes.',
      'Android Full Immersion: Edge-to-edge, translucent bars.',
      'Gesture Bar Overlap: Tab bar clearance.',
    ],
  },
  {
    version: '0.4.0',
    date: '2026-02-26',
    added: [
      'Phase 2.1 — Gathering Skills: Logging, Harvesting, Fishing, Scavenging data.',
      'Skill Pillars: Grouped by Gathering / Combat / Crafting / Support.',
      'Total Level Badge: Sum of all levels in header.',
      'XP [current/next] Display: Exact progress toward next level.',
      'Ticks-to-level: Estimated actions until level up.',
      'Wipe Save Data: Developer tool in Settings.',
      'XP/hr Stat: Real-time efficiency tracking.',
    ],
    fixed: [
      'State Migration: woodcutting → logging for old saves.',
      'Level Up Toast: Re-render loop fix.',
      'Android Tab Bar Insets: Overlap fix.',
      'Skill Card Navigation: Full-card tap-through.',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-02-26',
    added: [
      'Batch scripts: 0_Start, Update_1-4 for deployment.',
      'EXPO_GUIDE.md, MY_ADHD.md documentation.',
    ],
    fixed: [
      'EXPO_ROUTER_APP_ROOT crash: Babel, metro, index.js proxy.',
      'Recovered screens after reset-project wipe.',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-02-26',
    added: [
      'Gradle 9.3.1, Android prebuild.',
      'Dark Melvor theme: Palette, Spacing, Radius, FontSize.',
      'Bottom tab navigation: Skills, Combat, Bank, Shop, Settings.',
      'Skills screen: 13 skill cards, XP bars, Train/Stop.',
      'Bank screen: Inventory grid, gold badge.',
      'Combat + Shop placeholders, Settings toggles.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-02-26',
    added: [
      'Initial scaffold: Expo SDK 54, React Native 0.81.5.',
      'Monorepo: apps/mobile + packages/engine.',
      '@arteria/engine game engine.',
      'Redux Toolkit, MMKV persistence.',
      'Project documentation framework.',
    ],
  },
];
