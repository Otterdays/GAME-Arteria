# CHANGELOG

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

**Version restructure (2026-02-28):** Project versioning was consolidated so the current release is **v0.2.5**. Previous 0.3.x and 0.4.x entries were merged into 0.2.x to better reflect early-stage development. **Persistence & Pipeline** and **Deployment & Fixes** live in the **1.x.x** section (1.0.0 and 1.1.0). Content is preserved; only version numbers and grouping changed.

---

## [0.2.5] - 2026-02-28
### Added
- **Build & Release:** Smaller release APKs via ABI split (arm64-v8a, armeabi-v7a) and lean production mode. `2_Build_APK_Local.bat` sets `ARTERIA_LEAN_PROD=1` so Expo autolinking excludes dev-client native modules. Output: `app-arm64-v8a-release.apk` (~31 MB) and `app-armeabi-v7a-release.apk` (~25 MB). R8 minify and resource shrinking enabled in release.

### Changed
- **Local build script:** Prefers split APK paths; shows output folder and lean-mode messaging.

## [0.2.4] - 2026-02-28
### Added
- **Animated Number Primitive:** `AnimatedNumber.tsx` for smooth XP/Gold tickers. **BouncyButton** replacing static Touchables. **ActivePulseGlow** and tick-shake on resource completion (Mining, Logging).

## [0.2.3] - 2026-02-27
### Added
- **Logging Skill UI**, log items in `ITEM_META`, Logs filter in Bank/Shop. **Shop 50% sell** modifier for Barter. **Curse system** (Scavenging hook) in TickSystem. **Horizon System** (3-tier goal HUD), rare gems (Mining), mythic fish (Fishing), Seasonal Rotation (Logging). Patch Notes screen (Settings).

### Fixed
- Slot cap check in Bank. Local APK build (root index.js, gradlew). Bundling from monorepo root.

## [0.2.2] - 2026-02-26
### Added
- **Bank search + filters** (Ores/Bars/Other). **Train Toast**, pulsing tab glow, **Loot Vacuum**. **XP Bar Pulse**, **Haptic Heartbeat**, Inventory Full "!" (50 slot cap). **SmoothProgressBar** (60fps interpolation).

### Fixed
- GlobalActionTicker hooks, APK build (Metro resolution).

## [0.2.1] - 2026-02-26
### Added
- **Global Action Ticker** (root layout), **Header XP Dashboard**, **MaterialCommunityIcons** (pickaxe, sword-cross, etc.). Custom back navigation, edge-to-edge Android.

### Fixed
- Ticker visibility in sub-screens, node progress bars, gesture bar overlap.

## [0.2.0] - 2026-02-26
### Added
- **Pipeline & Gathering:** Core game loop (MMKV, tick loop, 24h offline), Mining skill (Copper–Cosmic), Phase 2.1 gathering data (Logging, Harvesting, Fishing, Scavenging), Skill Pillars, Total Level badge, XP [current/next], ticks-to-level, wipe save, XP/hr.

### Fixed
- State migration (woodcutting→logging). Level Up Toast, Android tab insets, skill card navigation. UI scaling, React Native Worklets crash.

## [1.1.0] - 2026-02-26
### Added
- **Deployment & Fixes:** Batch scripts (0_Start, Update_1–4 for Git push, EAS OTA, EAS Build). EXPO_GUIDE.md, MY_ADHD.md. EAS CLI via npx.

### Fixed
- **EXPO_ROUTER_APP_ROOT** — Babel/metro/index proxy for monorepo. Recovered screens after reset-project.

## [1.0.0] - 2026-02-26
### Added
- **Persistence & Pipeline:** Gradle 9.3.1, Android prebuild, dark Melvor-style palette (30+ tokens), bottom tabs (Skills, Combat, Bank, Shop, Settings). Skills screen (13 cards, XP bars, Train/Stop), Bank grid, Combat/Shop placeholders. Jest tests.

## [0.1.0] - 2026-02-26
### Added
- Initial project scaffold with Expo SDK 54, React Native 0.81.5, New Architecture enabled.
- npm workspaces monorepo: `apps/mobile` + `packages/engine`.
- `@arteria/engine` pure TypeScript game engine.
- Redux Toolkit store with `gameSlice`.
- Typed Redux hooks.
- Root layout wrapped in Redux Provider.
- Installed `react-native-mmkv`.
- Project documentation framework.
