/**
 * Patch History — Full changelog from CHANGELOG.md.
 * [TRACE: DOCU/CHANGELOG.md] Keep in sync when shipping new versions.
 * Version restructure: project uses 0.2.x; current release is 0.2.5.
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
    version: '0.2.5',
    date: '2026-02-28',
    added: [
      'Release build: Smaller APKs via ABI split (arm64 + armv7) and lean production mode (dev-client excluded).',
      'Local build script sets ARTERIA_LEAN_PROD=1; output: app-arm64-v8a-release.apk (~31 MB), app-armeabi-v7a-release.apk (~25 MB).',
    ],
  },
  {
    version: '0.2.4',
    date: '2026-02-28',
    added: [
      'AnimatedNumber: Smooth XP and Gold tickers. BouncyButton across Skills and nodes. ActivePulseGlow and tick shake (Mining, Logging).',
    ],
  },
  {
    version: '0.2.3',
    date: '2026-02-27',
    added: [
      'Logging skill UI, log items, Logs filter. Shop 50% sell modifier. Curse system (TickSystem). Horizon (3-tier goal HUD), rare gems, mythic fish, Seasonal Rotation. Patch Notes screen.',
    ],
    fixed: ['Slot cap in Bank. Local APK build. Monorepo bundling.'],
  },
  {
    version: '0.2.2',
    date: '2026-02-26',
    added: [
      'Bank search + filters. Train Toast, pulsing tab glow, Loot Vacuum. XP Bar Pulse, Haptic Heartbeat, Inventory Full "!". SmoothProgressBar (60fps).',
    ],
    fixed: ['GlobalActionTicker hooks. APK build.'],
  },
  {
    version: '0.2.1',
    date: '2026-02-26',
    added: [
      'Global Action Ticker, Header XP Dashboard, MaterialCommunityIcons. Custom back nav, edge-to-edge Android.',
    ],
    fixed: ['Ticker in sub-screens. Node progress bars. Gesture bar overlap.'],
  },
  {
    version: '0.2.0',
    date: '2026-02-26',
    added: [
      'Pipeline: Gradle 9.3, prebuild, Melvor palette, tabs (Skills, Bank, Shop, Combat, Settings). Batch scripts, EXPO_GUIDE. Core loop, Mining (Copper–Cosmic). Gathering data, Skill Pillars, Total Level, XP [current/next], ticks-to-level, wipe save, XP/hr.',
    ],
    fixed: [
      'EXPO_ROUTER_APP_ROOT. EAS CLI. State migration. Level Up Toast. Tab insets. Worklets crash.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-02-26',
    added: [
      'Initial scaffold: Expo SDK 54, monorepo (apps/mobile + packages/engine), @arteria/engine, Redux, MMKV, dark theme, 5 tab screens.',
    ],
  },
];
