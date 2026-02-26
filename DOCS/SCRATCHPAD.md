# SCRATCHPAD
**Active Task:** Phase 2 UI — in progress
**Current Focus:** Screens built, Gradle 9 configured, ready for live testing.

## History (Compacted)
- Planning phase complete, implementation plan approved.
- Phase 1 complete: Engine package, Redux store, Expo SDK 54 scaffold.

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
- [x] **Deleted `android/` directory** to fully adopt Expo's Continuous Native Generation (CNG) model.
- [x] Configured EAS (`eas.json`) in preparation for cloud development builds.
- [x] Installed `expo-dev-client` to support MMKV and Native modules in a custom dev build.
- [x] Created batch scripts (Update_1-4) and updated `EXPO_GUIDE.md` for team update procedures.
- [x] Created `MY_ADHD.md` for quick reference on deploying updates.



## Next Up
- [ ] Run an EAS build to generate the APK `eas build -p android --profile development`
- [ ] Wire real-time tick loop (setInterval → engine.processRealtime → Redux dispatch)
- [ ] Implement MMKV save/load persistence
- [ ] Build a Gradle debug APK to validate the 9.3.1 build chain
- [ ] Add skill detail screens (mine-specific ores within mining)

*Keep updates concise. Do not delete history, only compact.*
