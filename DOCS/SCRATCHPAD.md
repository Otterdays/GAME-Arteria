# SCRATCHPAD
**Active Task:** Phase 2 UI — Monorepo metro/babel fix complete, dev server confirmed running.
**Current Focus:** Ready to wire game loop and test on device.

## History (Compacted)
- Planning phase complete, implementation plan approved.
- Phase 1 complete: Engine package, Redux store, Expo SDK 54 scaffold.
- Phase 2 UI: All screens built, Gradle 9 configured, EAS configured.
- Monorepo crash (`EXPO_ROUTER_APP_ROOT`) debugged and resolved (root babel, index.js proxy, pinned expo-router).
- All files recovered after accidental reset-project wipe (git restore).
- Batch scripts created (0_Start, Update_1-4). Docs updated (EXPO_GUIDE, MY_ADHD, SBOM, CHANGELOG, ARCHITECTURE, SUMMARY).

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

## Next Up
- [ ] Confirm all 5 tabs load on device (scan QR code from dev server)
- [ ] Wire real-time tick loop (setInterval → engine.processRealtime → Redux dispatch)
- [ ] Implement MMKV save/load persistence
- [ ] Add skill detail screens (mine-specific ores within mining)

*Keep updates concise. Do not delete history, only compact.*
