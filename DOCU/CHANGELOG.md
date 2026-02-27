# CHANGELOG

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

## [Unreleased]
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
