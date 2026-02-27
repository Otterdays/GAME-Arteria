# CHANGELOG

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

## [0.4.5] - 2026-02-27
### Added
- **Horizon System:** A 3-tier goal HUD (Immediate / Session / Grind) at the top of the Skills screen for persistent micro-goal tracking.
- **Unique Gathering Mechanics:**
    - **Mining:** Added rare gem drop logic (1% chance for Uncut Sapphire from Copper/Tin).
    - **Fishing:** Added mythic fish drop logic (0.5% chance for Golden Carp from Bait fishing).
    - **Logging:** Implemented **Seasonal Rotation** (1.5x yield on even weeks, 1.0x on odd weeks).
- **Premium HUD Styling:** Integrated `expo-linear-gradient` and glassmorphism for the Horizon system.
- **Palette Expansion:** Added `purple` to the core design tokens.

### Fixed
- **ReferenceError:** Resolved potential `GlobalActionTicker` reference error by cleaning up unused imports and ensuring proper export patterns.

## [0.4.4] - 2026-02-26
### Added
- **Patch Notes Screen:** Full changelog from v0.1.0 to present, accessible from Settings → Patch Notes.

### Fixed
- **Bundling from monorepo root:** Resolved "Unable to resolve '../../App' from node_modules/expo/AppEntry.js" by adding `"main": "apps/mobile/index.js"` to root `package.json`, so Expo uses the Expo Router entry when started from the repo root.

## [0.4.3] - 2026-02-26
### Added
- **Z. Bank Search + Filters:** Real-time search bar and type filters (All / Ores / Bars / Other). Shared `constants/items.ts` with ItemMeta.
- **Train Toast:** "Mining: Iron Vein" confirmation when starting a skill action (2s non-blocking).
- **X. Pulsing Tab Glow:** Skills tab pulses gold on level-up, Bank tab on loot; clears when visited.
- **S. Loot Vacuum:** Item icon flies from center toward Bank tab when gaining loot.

## [0.4.2] - 2026-02-26
### Added
- **O. XP Bar Pulse:** Subtle glow animation when XP bar fill moves (Skills screen, Mining header).
- **P. Haptic Heartbeat:** Light haptic pulse when action progress bar reaches 100% and resets (GlobalActionTicker).
- **V. Inventory Full Warning:** "!" badge on Bank tab when inventory is full; slot cap (50) enforced; Bank header shows "X / 50 slots — Full!".
- **Smooth Progress Bars:** `useInterpolatedProgress` hook + `SmoothProgressBar` component; interpolates at ~60fps between 100ms Redux updates to eliminate jumpy progress.

### Changed
- **XP Bar Pulse Glow:** Increased intensity — white overlay at full opacity, 550ms duration (was 0.6 opacity, 400ms).

### Fixed
- **APK Build:** `2_Build_APK_Local.bat` now runs `npx expo run:android --variant release` from `apps/mobile` to fix "Unable to resolve module ./index.js" (Metro was resolving from monorepo root).
- **GlobalActionTicker Hooks:** Moved `useRef`/`useEffect` before early return to fix "Rendered more hooks than during the previous render".

## [0.4.1] - 2026-02-26
### Added
- **Global Action Ticker:** A persistent, minimal progress bar tracking active tasks across ALL screens. Promoted to root layout for universal visibility.
- **Header XP Dashboard:** Integrated real-time XP [current/next] tracking and level badges into the Skills header.
- **RPG Icon Overhaul:** Switched `IconSymbol` to use `MaterialCommunityIcons`. Mapped thematic symbols: `pickaxe`, `sword-cross`, `treasure-chest`, `script-text`.
- **Custom Back Navigation:** Immersive, theme-aligned back buttons in skill screens (Mining).

### Fixed
- **Action 'Heartbeat' Visibility:** Fixed a bug where action progress was missing in sub-screens (Mining) by promoting the ticker to the root layout and adding adaptive tab-bar offsets.
- **Node-level Feedback:** Added localized progress bars to Mining nodes for immediate rhythmic feedback.
- **Android "Full Immersion" Layout:** Enabled edge-to-edge rendering with translucent Status and Navigation bars.
- **Android Overlay Mess:** Resolved double-padding issues by moving to manual inset padding via `useSafeAreaInsets`.
- **Gesture Bar Overlap:** Adjusted Tab Bar height and padding for Android gesture handle clearance.

## [0.4.0] - 2026-02-26
### Added
- **Phase 2.1 — Gathering Skills Foundation:** Added Data definitions for Logging, Harvesting, Fishing, and Scavenging.
- **Skill Pillars:** Reorganized Skills screen into logical groups: Gathering, Combat, Crafting, Support.
- **Total Level Badge:** Shows current sum of all levels in the header.
- **XP [current/next] Display:** XP cards now show exact progress toward the next level.
- **Ticks-to-level:** Mining nodes now display an estimated number of actions until level up.
- **Wipe Save Data:** Added a developer/debugger tool in Settings to reset progress.
- **XP/hr Stat:** Real-time XP efficiency tracking for active nodes.

### Fixed
- **State Migration (woodcutting -> logging):** Added `migratePlayer` bridge in Redux to prevent crashes on old save files after skill rename.
- **Level Up Toast:** Fixed a bug where toasts would get stuck or dismiss prematurely due to re-render loops.
- **Android Tab Bar Insets:** Fixed overlap between bottom tabs and the Android gesture navigation bar.
- **Skill Card Navigation:** Tapping anywhere on a skill card now correctly navigates into the skill detail page.


### Added
- **Phase 1.1 Complete (Core Game Loop):** Fixed MMKV v4 native C++ module initialization. Integrated the foreground tick loop (`setInterval`) and offline catchup logic (F2P 24-hour cap) with React Native `AppState` and Redux.
- **Local Native Pipeline:** Established an `npx expo run:android` build script bypassing EAS concurrency limits.
- **Expo SDK 55** — Upgraded from SDK 54: expo ~55.0.0, react 19.2.4, react-native 0.83.2; expo-* packages aligned to SDK 55; `newArchEnabled` removed from app.json (New Arch only in SDK 55).
- **Test suite folder** — Root `tests/` with `unit/engine/` (API tests for XPTable, TickSystem, GameEngine), `integration/`, `e2e/` placeholders. Root `npm test` runs Jest multi-project (packages/engine + tests). Retained all existing engine tests; 25 tests pass. See `tests/README.md`.

### Fixed
- **UI Scaling:** Minimized the active task indicator and train buttons on the Skills card to fit better on standard mobile screen widths.
- **React Native Worklets Crash:** Fixed native Babel plugin version mismatch (0.7.2 vs 0.7.4) that was causing React `<Provider>` to fail to render.

### Fixed
- **EAS CLI not found** — Batch scripts `Update_2_EAS_OTA_Update.bat`, `Update_3_EAS_Build_Android_Dev.bat`, and `Update_4_EAS_Build_Android_Prod.bat` now invoke `npx eas-cli` instead of `eas`, so no global EAS install is required.

## [0.3.0] - 2026-02-26
### Added
- Batch scripts for deployment workflows:
  - `0_Start_Dev_Server.bat` — Starts Metro dev server with cache clear.
  - `Update_1_Git_Push.bat` — Git commit and push with message prompt.
  - `Update_2_EAS_OTA_Update.bat` — Over-the-air update to players.
  - `Update_3_EAS_Build_Android_Dev.bat` — EAS development build.
  - `Update_4_EAS_Build_Android_Prod.bat` — EAS production build with safety prompt.
- `DOCS/EXPO_GUIDE.md` — Comprehensive Expo/EAS workflow documentation.
- `DOCS/MY_ADHD.md` — Quick-reference Q&A for deployment.

### Fixed
- **EXPO_ROUTER_APP_ROOT crash** — Root cause: monorepo hoisting caused Babel to skip Expo Router's env injection.
  - Added `babel.config.js` at monorepo root with `babel-preset-expo` (installed at root via `--legacy-peer-deps`).
  - Added `babel.config.js` in `apps/mobile/`.
  - Added `apps/mobile/index.js` entry proxy (replaced `"main": "expo-router/entry"` with `"main": "index.js"`).
  - Added `apps/mobile/metro.config.js` with monorepo `watchFolders` and `nodeModulesPaths`.
  - Pinned `expo-router@~6.0.23` in root `package.json` (was `*` which resolved to SDK 55's `55.0.2`).
- Recovered all screens/components/hooks after accidental `reset-project` wipe (via `git restore`).

## [0.2.0] - 2026-02-26
### Added
- **Gradle 9.3.1** — Upgraded from 8.14.3 to latest stable (Jan 29, 2026).
  - Configuration cache enabled (`org.gradle.configuration-cache=true`).
  - Build cache enabled (`org.gradle.caching=true`).
  - JVM heap bumped to 4GB.
  - Requires Java 17+; verified running on Java 21.
- Android prebuild generated via `npx expo prebuild --platform android`.
- Dark-mode theme palette matching the Melvor Idle style guide:
  - `Palette` object with 30+ colors including per-skill accent colors.
  - `Spacing`, `Radius`, `FontSize` design token scales.
- Bottom tab navigation: Skills, Combat, Bank, Shop, Settings.
- Skills screen (13 skill cards, XP progress bars, Train/Stop buttons, connected to Redux).
- Bank screen (inventory grid, gold badge, connected to Redux).
- Combat + Shop placeholder screens.
- Settings screen (gameplay toggles, notification toggles, version info).

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
