# SCRATCHPAD

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.
**Active Task:** Phase 2.2 — Horizon System & Unique Mechanics
**Current Focus:** v0.4.3 Bank & Juice shipped. Next: Horizon System or unique gathering mechanics.

## [2026-02-26] Bundling Fix — "Unable to resolve ../../App"
- **Symptom:** `Android Bundling failed … Unable to resolve "../../App" from "node_modules\expo\AppEntry.js"` when starting Expo from monorepo root.
- **Cause:** Running `npx expo start` from repo root (Arteria) made Metro use default `expo/AppEntry.js`, which expects a root `App` component; this project uses Expo Router with entry at `apps/mobile/index.js`.
- **Fix:** Root `package.json` now has `"main": "apps/mobile/index.js"`. When Expo runs from root, Metro uses that entry (expo-router) instead of AppEntry.js.
- **Recommendation:** Prefer running from `apps/mobile`: use `0_Start_Dev_Server.bat`, or `npm run mobile` from root, or `cd apps/mobile && npx expo start`.

## [2026-02-26] APK Build Fix
- **Root cause:** `2_Build_APK_Local.bat` ran `gradlew assembleRelease` from root `android/`, causing Metro to resolve `./index.js` from monorepo root (Arteria) instead of `apps/mobile`.
- **Fix:** Switched to `npx expo run:android --variant release` from `apps/mobile` so bundler uses correct project root.

## Active Sprint: v0.4.3 "Bank & Juice"
- [x] **Z. Bank Search + Filters:** Search bar, Ores/Bars/Other filters, shared items.ts.
- [x] **Train Toast:** "Mining: Iron Vein" on start (2s).
- [x] **X. Pulsing Tab Glow:** Skills/Bank tabs pulse gold; clear on visit.
- [x] **S. Loot Vacuum:** Icon flies to Bank tab on loot gain.

## History: v0.4.2 "QoL Polish"
- [x] **O. XP Bar Pulse:** ProgressBarWithPulse component; white glow on XP bar fill change (Skills, Mining); intensity bumped (opacity 1, 550ms).
- [x] **P. Haptic Heartbeat:** Light haptic when GlobalActionTicker progress resets (100% → 0%).
- [x] **V. Inventory Full Warning:** INVENTORY_SLOT_CAP (50); "!" on Bank tab; addItems respects cap; Bank header shows slots.
- [x] **Smooth Progress Bars:** useInterpolatedProgress + SmoothProgressBar; 60fps interpolation between Redux updates (GlobalActionTicker, Mining node bar).
- [x] **GlobalActionTicker Hooks Fix:** Moved useRef/useEffect before early return (Rules of Hooks).

## History: v0.4.1 "Immersion & Utility"
- [x] **Global Action Ticker:** Persistent progress bar + skill emoji visible on all screens.
- [x] **Header XP Pulse:** Integrated a real-time XP progress bar + level badge into the main Skills header.
- [x] **Universal Action Ticker:** Promoted ticker to root layout; stays visible inside specific skill screens.
- [x] **Bugfix (Heartbeat):** Fixed missing action progress bar in sub-screens + added node-local pulse.
- [x] **Documentation Sync:** Updated all core docs (SUMMARY, CHANGELOG, ARCHITECTURE, Thoughts) for v0.4.1.3.
- [x] **Android Edge-to-Edge:** Full translucent system bars + manual safe area handling for premium layout.
- [x] **RPG Icon Set:** Migrated to MaterialCommunityIcons for pickaxes, swords, and treasure chests.
- [x] **Navigation Update:** Immersive back buttons and full skill-card click-through.

## History (Compacted)
- **[2026-02-26] v0.4.1 — Immersion Update:** Integrated `GlobalActionTicker` for real-time background task visibility. Refactored `index.tsx` and `mining.tsx` to handle Android view insets manually (edge-to-edge). Upgraded `IconSymbol` to use `MaterialCommunityIcons` with RPG mappings (`pickaxe`, `sword-cross`, `treasure-chest`).
- **[2026-02-26] QoL E-M + Bugfixes (v0.4.0):** (E) Added ticks-to-level estimates in Mining. (J) Fixed LevelUpToast re-render loop/timer bug. (K) Fixed Android bottom nav bar overlap using safe area insets. (L) Upgraded XP display to "current / goal" format. (M) Enabled full-card navigation on Skills screen. Implemented "wipe save" debug tool. Updated all project docs.
- **[2026-02-26] QoL A/B/C — Skills Screen Polish:** Rewrote `index.tsx`. (A) Skills now grouped into 4 pillars: Gathering, Combat, Crafting, Support with divider headers. (B) "Total Lv. X" badge in gold shown under the "Skills" title. (C) Unimplemented skills show a greyed-out locked card with "Phase 2 ›" badge instead of jarring Alert popup. Also added `migratePlayer()` to `gameSlice.ts` to prevent `xp of undefined` crash when loading old saves after skill renames.
- **[2026-02-26] Phase 2.1 — Gathering Skill Data Definitions:** Created `logging.ts`, `harvesting.ts`, `fishing.ts`, `scavenging.ts` in `packages/engine/src/data/`. Renamed `woodcutting` → `logging` across entire codebase (`types.ts`, `gameSlice.ts`, `playerFactory.ts`, `theme.ts`, `index.tsx`, `LevelUpToast.tsx`, `WhileYouWereAway.tsx`). Added `skillLogging`, `skillHarvesting`, `skillScavenging` colour tokens. Exported all new action arrays from `engine/src/index.ts`. Engine tests: 10/10 passing (0 regressions). Unique mechanics (Seasonal Rotation, Mythic fish, Curse Chance) left as open sub-tasks in ROADMAP.md.
- **[2026-02-26] Website overhaul + doc corrections:** Updated `index.html` with 4 new sections (World & Lore with 6 Valdoria regions + 4 factions, Companions with Barnaby/Yvette/Reginald cards, "A Day in Arteria" timeline, CSS floating particles). Added missing skills (Research, Celestial Binding). Fixed stale roadmap (Phase 1.2→1.5 marked done, Phase 2 now current). Fixed hero badge to "Phase 1 Complete". Updated nav links. Fixed SUMMARY.md, ROADMAP.md current target, ARCHITECTURE.md tech stack (SDK 54→55, EAS→local builds).
- **[2026-02-26] Concept art section removed from docs site:** Section (Gallery/Concept Art + art-grid styles) removed from `docs/index.html` — doesn’t work on GitHub Pages (asset paths/behavior). Nav had no #art link; no other references.
- **[2026-02-26] GitHub Pages fix:** Added `docs/` folder (lowercase) with landing page (`index.html` + `assets/`) and `.nojekyll` to bypass Jekyll. GitHub Pages expects `docs` (Linux is case-sensitive); `.nojekyll` serves static HTML without Jekyll processing. Push to trigger redeploy.
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
> 3. **Patch History:** Update `apps/mobile/constants/patchHistory.ts` when shipping a new version — it powers the "Patch Notes" screen in Settings (full changelog from v0.1.0).
> 4. **Never Delete Documentation:** As stated by the user rules and warnings, always compact and append, do not delete existing context.

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
- [x] Mining skill screen: ore veins, Train button, XP bar, tooltips, locks, highlight
- [x] MMKV save/load round-trip confirmed on device
- [x] Phase 1.3: Bank & Inventory UI — 4-col grid, item detail modal, filter stub, worth estimate
- [x] Phase 1.4: "While You Were Away" offline catchup modal (XP + items + cap warning)
- [x] Phase 1.5: UI Polish — haptics on mine/stop, level-up toast, accessibility labels

## Current Target
→ **Phase 1 Complete! Engine, background loop, UI, Bank, offline catchup are all wired up.**
→ **Next step: Combat System & Skill Progression Balancing (Phase 2)**
- **[2026-02-26] EAS Concurrency Limit:** Hit custom dev client build limits on Expo cloud. Swapped testing pipeline to pure local Android builds (`npx expo run:android`) using local machine Gradle architecture via `1_Run_Local_Android_Build.bat`.

> Full phased plan in `DOCS/ROADMAP.md`

*Keep updates concise. Do not delete history, only compact.*
