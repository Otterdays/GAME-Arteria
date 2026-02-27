# SCRATCHPAD

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.
**Active Task:** Phase 1.2 — Mining Skill (Foundation)
**Current Focus:** Building the active Mining UI, ore drop rates, and mapping actions to our working background tick loop.

## History (Compacted)
- **[2026-02-26] SDK 55 + test suite:** Upgraded to Expo SDK 55 (React 19.2.4, RN 0.83.2). Created root `tests/` folder: `unit/engine/` (API tests for XPTable, TickSystem, GameEngine), `integration/`, `e2e/` placeholders. Root `npm test` runs both `packages/engine` and `tests/` (Jest multi-project). Retained all existing engine tests; 25 tests pass.
- **[2026-02-26] Research session:** Researched SDK 55 migration, MMKV v4 best practices, idle game loop patterns. Created `DOCS/FUTURE_NOTES.md`. Updated `ARCHITECTURE.md` with SDK 55 warning, autolinking tip, and Offline Progression Architecture section.
- Planning phase complete, implementation plan approved.
- Phase 1 complete: Engine package, Redux store, Expo SDK 54 scaffold.
- Phase 2 UI: All screens built, Gradle 9 configured, EAS configured.
- Monorepo crash (`EXPO_ROUTER_APP_ROOT`) debugged and resolved (root babel, index.js proxy, pinned expo-router).
- All files recovered after accidental reset-project wipe (git restore).
- Batch scripts created (0_Start, Update_1-4). Docs updated (EXPO_GUIDE, MY_ADHD, SBOM, CHANGELOG, ARCHITECTURE, SUMMARY).

## Documentation & AI Developer Guidelines
> **For future standard AI assistants:**
> 1. **Dev Logging:** ALWAYS use the `logger.ts` wrapper (`import { logger } from '@/utils/logger'`). Log format is `logger.info('Module', 'Message', {data})`. Do not use naked `console.log`.
> 2. **Versioning & Updates Modal:** When shipping a new feature phase, bump the version in `apps/mobile/app.json`. The user sees an automatic changelog modal upon relaunch! Update the hardcoded text inside `apps/mobile/components/UpdatesModal.tsx` for whatever features you just built.
> 3. **Never Delete Documentation:** As stated by the user rules and warnings, always compact and append, do not delete existing context.

## Phase 2 Progress
- [x] Upgraded Gradle wrapper from 8.14.3 → **9.3.1** (Jan 2026 release)
- [x] Enabled config cache + build cache in gradle.properties
- [x] JVM args bumped to 4GB
- [x] Android prebuild generated (`npx expo prebuild --platform android`)
- [x] Dark-mode theme with full Melvor palette (Palette, Spacing, Radius, FontSize)
- [x] Bottom tab navigation: Skills, Combat, Bank, Shop, Settings
- [x] Skills screen — 13 skill cards with emoji, XP bars, Train/Stop buttons
- [x] Bank screen — inventory grid + gold badge, connected to Redux
- [x] Combat, Shop — placeholder "Coming Soon" screens
- [x] Settings screen — gameplay toggles, notification toggles, version
- [x] Lint passes (0 errors, 0 warnings)
- [x] **Deleted `android/` directory** to fully adopt Expo CNG model.
- [x] Configured EAS (`eas.json`) for cloud development builds.
- [x] Installed `expo-dev-client` for MMKV and native modules.
- [x] Created batch scripts (0_Start, Update_1-4) and deployment docs.
- [x] Created `MY_ADHD.md` for quick reference.
- [x] Fixed `EXPO_ROUTER_APP_ROOT` crash (root babel, index.js proxy, metro monorepo config).
- [x] Pinned `expo-router@~6.0.23`, installed `babel-preset-expo` at root.
- [x] Restored all screens/components/hooks after accidental reset wipe.
- [x] EAS Development Build completed — APK ready for phone install.
- [x] Dev server confirmed booting cleanly (QR code up, no crashes).
- [x] Full SBOM update with exact installed versions from `npm ls`.
- [x] All docs updated: SBOM, CHANGELOG (v0.3.0), SUMMARY, ARCHITECTURE, EXPO_GUIDE, SCRATCHPAD.

## Next Up (Phase 1 — Core Loop)
- [x] `AppState` listener → save to MMKV on background, load on foreground
- [x] Foreground tick loop (`setInterval` ~100ms → `engine.processRealtime` → dispatch)
- [x] Offline calc on app open (`engine.processOffline`) + 24h cap
- [ ] "Welcome Back" summary modal
- [ ] Mining skill screen: ore veins, Train button, XP bar, drops to Bank
- [ ] MMKV save/load round-trip confirmed on device

## Blocker Log
- **[2026-02-26] EAS Concurrency Limit:** Hit custom dev client build limits on Expo cloud. Swapped testing pipeline to pure local Android builds (`npx expo run:android`) using local machine Gradle architecture via `1_Run_Local_Android_Build.bat`.

> Full phased plan in `DOCS/ROADMAP.md`

*Keep updates concise. Do not delete history, only compact.*
