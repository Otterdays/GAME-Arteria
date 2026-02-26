# CHANGELOG

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
