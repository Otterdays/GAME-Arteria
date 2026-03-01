# SCRATCHPAD

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.
**Active Task:** Hooking up Harvesting / Fishing / Scavenging UI screens to wrap up Phase 2 Gathering.

## [2026-02-28] Persistence & Deployment in 1.x.x
- **Changelog / website / in-app:** "Persistence & Pipeline" and "Deployment & Fixes" moved to **1.x.x** section: **v1.0.0** Persistence & Pipeline, **v1.1.0** Deployment & Fixes. CHANGELOG.md, patchHistory.ts, index.html (changelog + roadmap) updated. v0.2.0 is now "Pipeline & Gathering" only.

## [2026-02-28] Version restructure to 0.2.x
- **Rationale:** Project was at 0.4.8; restructured to 0.2.5 so versioning reflects early-stage development.
- **CHANGELOG.md:** Consolidated 0.3.x/0.4.x into 0.2.0–0.2.5. Added restructure note at top. Current release [0.2.5].
- **patchHistory.ts:** Replaced with 0.2.x entries (0.2.5 → 0.1.0). In-app Patch Notes now show 0.2.5 as latest.
- **index.html:** Hero badge and Latest Update v0.2.5; changelog and roadmap sections use v0.2.0–v0.2.5.
- **app.json, build.gradle, README.md:** Version set to 0.2.5. SUMMARY.md Current Status bullets updated to v0.2.x.

## [2026-02-27] Lean production build toggle (dev-client stripped)
- **New config:** Added `apps/mobile/app.config.js` with env-driven autolinking excludes for Expo dev-client native modules (`expo-dev-client`, `expo-dev-launcher`, `expo-dev-menu`, etc.) when `ARTERIA_LEAN_PROD=1`.
- **Local build script:** `2_Build_APK_Local.bat` now sets `ARTERIA_LEAN_PROD=1` before `gradlew assembleRelease`, so release APKs are built in lean mode by default.
- **Goal:** Keep dev workflow dependencies in repo while producing smaller production APK outputs.

## [2026-02-27] Local release APK now split by ABI
- **Size win confirmed:** `assembleRelease` now outputs split APKs instead of one universal APK. Current files: `app-arm64-v8a-release.apk` **31.23 MB** and `app-armeabi-v7a-release.apk` **25.15 MB** (down from ~93 MB universal).
- **Share target:** Prefer `app-arm64-v8a-release.apk` for modern Android phones.
- **Build script:** `2_Build_APK_Local.bat` updated to show split output folder and prefer arm64 APK path.

## [2026-02-27] Release APK size reduction
- **gradle.properties:** R8 minify + resource shrinking on for release; `reactNativeArchitectures` set to `armeabi-v7a,arm64-v8a` only (dropped x86/x86_64) so release APK is smaller. Rebuild with `2_Build_APK_Local.bat` to get a smaller APK.
- **proguard-rules.pro:** Added keep rules for React Native and Hermes so minification doesn't break the app.

## [2026-02-27] EAS concurrency → local build
- **EAS build queued:** "Build concurrency limit reached for your account." Archive uploaded fine (11.2 MB after .easignore). Using **local build** for now: run `2_Build_APK_Local.bat` from repo root. APK output folder: `apps\mobile\android\app\build\outputs\apk\release\` (prefer `app-arm64-v8a-release.apk`). To add EAS concurrency later: https://expo.dev/accounts/afykirby/settings/billing.

## [2026-02-27] EAS Build archive size
- **.easignore added** at repo root to reduce upload size and time. EAS was reporting 1.0 GB archive; excludes DOCU/, debugs/, .git/, coverage/, .idea/, .vscode/, *.log, **/android/**/build/, **/.gradle/ on top of .gitignore. See https://expo.fyi/eas-build-archive. Re-run EAS build to see smaller archive.

## [2026-02-28] v0.2.4 / v0.2.5 Premium UI & Build
- **AnimatedNumber:** Implemented a new primitive `AnimatedNumber.tsx` that uses requestAnimationFrame and an ease-out exponential curve to spin up gold and XP values rather than janky snapping. Applied to Header XP, Bank total worth, and Shop player gold.
- **BouncyButton:** Built a reanimated tactile button wrapper `BouncyButton.tsx` that replaces `TouchableOpacity` for all interactable Skill/Node cards. Adds physics-based scaling and deep haptics.
- **ActivePulseGlow:** Created an infinitely breathing gradient/fill component that sits behind the active NodeCard, casting a subtle skill-colored shimmer.
- **Tick Shake Effect:** Added a very subtle X-axis animated translation to the Logging and Mining container layout. Providing a satisfying "thud/shake" when an action tick completes and resources are gathered.

## [2026-02-28] Mechanics Implementation & Logging UI
- **Curse Chance:** Implemented the `curseChance` loop in `TickSystem.processDelta`. Normal item output is partially converted into `cursed_{id}` equivalent based on RNG.
- **Cursed Ores:** Temporarily added `curseChance` of 10-25% to all Mining nodes so cursed ores can trigger for testing the mechanic. Registered all cursed ores into `ITEM_META` in `constants/items.ts`.
- **Nick's Shop:** Set the sell value of items when sold directly via the Shop to **50% of their base `sellValue`**. Lays the groundwork for the Barter skill. This is functionally completely separate from selling from the Bank directly at this time.
- **Logging Skill:** Built `logging.tsx` screen, extracted node UI metadata to `constants/logging.ts`. Registered all logs to `ITEM_META` and extended `ItemType`. Unlocked logging in `index.tsx`.
- **Bank/Shop Filters:** Added a 'Logs' filter button to both interfaces. Fixed missing `slotCap` definition in Bank.

## [2026-02-27] Patron's Pack — Premium Expansion
- **F2P offline cap:** 24h (OFFLINE_CAP_F2P_MS). **Patron:** 7 days (OFFLINE_CAP_PATRON_MS).
- **Constants:** `game.ts` — OFFLINE_CAP_F2P_MS, OFFLINE_CAP_PATRON_MS, INVENTORY_SLOT_CAP_F2P/PATRON, XP_BONUS_PATRON.
- **Redux:** `player.settings.isPatron`, `setPatron` reducer. `applyXP` ×1.2 when patron. `addItems`/`buyItem` slot cap 100 vs 50.
- **useGameLoop:** Dynamic offline cap (initial load + foreground handler) based on isPatron.
- **Purchase screen:** `app/patron.tsx` — benefits list, "Unlock Patron's Pack" mock button. Settings → Premium → Patron's Pack.
- **UI:** Patron badge next to Total Level on Skills header. WYWA cap banner: "Capped at 24h (F2P limit)" or "Capped at 7 days (Patron)".

## [2026-02-27] Gradle Daemon Cleanup
- **2_Build_APK_Local.bat:** Now runs `gradlew --stop` before `assembleRelease` to clear stale daemons (avoids "6 incompatible" buildup).
- **0_Stop_Gradle_Daemons.bat:** New script to manually stop Gradle daemons anytime (frees memory). Run from project root.
**Current Focus:** Nick's Shop (Gold Vendor) implemented: SHOP_CATALOG, buyItem, Shop screen with Buy/Sell tabs, Nick in header. APK at `apps\mobile\android\app\build\outputs\apk\release\app-release.apk`.

## [2026-02-27] People to Add in the Game (future reference)
- Names for future inclusion in the game: **Ryan**, **James**, **Mike**, **(Another) Ryan**, **Nick**, **Bianca**, **Remington**, **Kate**, **Mini**.
- Canonical list: **DOCU/PEOPLE_TO_ADD.md** — update there when adding/using names; decide context per name (NPC, credit, companion, etc.) when implementing.
- **Nick** assigned as **Merchant** — NPC vendor for the Shop screen (gold buy/sell). See PEOPLE_TO_ADD.md "Assigned roles" and zhipu-ai.md Shop System.
- **Nick's Shop implemented (2026-02-27):** ROADMAP 2.3. `SHOP_CATALOG` in `constants/items.ts` (copper/tin/iron/coal/gold_ore + buy prices). `gameSlice.buyItem` respects gold and slot cap. Shop screen: header "Nick — Merchant", Buy/Sell toggle, Buy list with qty 1/5/10 and Buy button, Sell list with filters (All/Ores/Bars/Other) and Sell 1/Sell All; locked items disabled on Sell tab.

## [2026-02-27] 5 Quick Wins from Docs
- **1. Error Boundary (ROADMAP Phase 0):** `ErrorBoundary` component wraps root layout; shows "Something went wrong" + Try Again on render crash.
- **2. Screen Shake (ROADMAP Q):** Gentle 4px shake on Mining screen when XP gains (tick complete). Animated sequence 200ms.
- **3. Accessibility (ROADMAP Phase 1.5):** Skill cards + Train buttons have `accessibilityRole` and `accessibilityLabel`. Mining nodes already had them.
- **4. Settings: Sound/Music (ROADMAP Phase 7.3):** SFX and BGM toggles in Settings → Audio. Persisted in player.settings. No-op for now.
- **5. Analytics Placeholder (ROADMAP Phase 1.5):** `logger.info('Analytics', 'skill_started', {...})` and `level_up` in gameSlice. Logger extended with 'Analytics' module.

## [2026-02-27] Yellow & Blue on Skills/Mining Screen — Source
- **Reported:** "Weird yellow and blue thinings" on the mining/Skills screen.
- **Source (recent, v0.2.3):** `HorizonHUD` — three gradient cards: **Immediate** (blue: accentPrimary→accentDim), **Session** (gold/yellow: gold→goldDim), **Grind** (purple). These sit below the header XP bar on the Skills screen.
- **Also:** Mining XP bar uses `Palette.skillMining` (#b87333, copper/orange); active skill card border uses `Palette.accentPrimary` (blue). Design spec (zhip-ai-styling.md §4.1) says "Positive → XP gains, progress bars" should use green (#4caf50), not skill-specific colors.
- **If adjusting:** Consider aligning XP bars with design spec (green) or toning Horizon gradients to match the dark theme.

## [2026-02-26] Bundling Fix — "Unable to resolve ../../App"
- **Symptom:** `Android Bundling failed … Unable to resolve "../../App" from "node_modules\expo\AppEntry.js"` when starting Expo from monorepo root.
- **Cause:** Running `npx expo start` from repo root (Arteria) made Metro use default `expo/AppEntry.js`, which expects a root `App` component; this project uses Expo Router with entry at `apps/mobile/index.js`.
- **Fix:** Root `package.json` now has `"main": "apps/mobile/index.js"`. When Expo runs from root, Metro uses that entry (expo-router) instead of AppEntry.js.
- **Recommendation:** Prefer running from `apps/mobile`: use `0_Start_Dev_Server.bat`, or `npm run mobile` from root, or `cd apps/mobile && npx expo start`.

## [2026-02-27] APK Build — What Was Wrong & How It Works Now
- **Problem:** `2_Build_APK_Local.bat` used `npx expo run:android --variant release`, which expects a connected device/emulator; with none, the build fails or misbehaves.
- **Fix (batch file):** Script now `cd`s to `apps\mobile\android` and runs `gradlew.bat assembleRelease`. Gradle runs the JS bundle via Expo (`bundleCommand = "export:embed"`) with project root `apps/mobile`, so no device is required. APK output: `apps\mobile\android\app\build\outputs\apk\release\app-release.apk`.
- **If you run Gradle manually in PowerShell:** (1) You must be in `apps\mobile\android` (where `gradlew.bat` lives). (2) PowerShell does not run scripts from the current directory unless you prefix them: use **`.\gradlew.bat assembleRelease`**, not `gradlew`. (3) Do not use `&&` in PowerShell (use `;` or separate commands). Prefer running `2_Build_APK_Local.bat` so CMD handles the path and invocation.
- **[2026-02-27] "Unable to resolve module ./index.js from C:\\...\\Arteria/.":** Metro resolves from repo root; RN Gradle plugin ignores `root`. `expo run:android --no-install` still requires a device. **Fix:** Created root `index.js` that `require("./apps/mobile/index.js")` so Metro finds ./index.js when resolving from Arteria. Batch file reverted to `gradlew assembleRelease` from apps\mobile\android (no device). **Result:** APK builds successfully without a connected device.

## Active Sprint: v0.2.2 "Bank & Juice"
- [x] **Z. Bank Search + Filters:** Search bar, Ores/Bars/Other filters, shared items.ts.
- [x] **Train Toast:** "Mining: Iron Vein" on start (2s).
- [x] **X. Pulsing Tab Glow:** Skills/Bank tabs pulse gold; clear on visit.
- [x] **S. Loot Vacuum:** Icon flies to Bank tab on loot gain.

## History: v0.2.2 "QoL Polish"
- [x] **O. XP Bar Pulse:** ProgressBarWithPulse component; white glow on XP bar fill change (Skills, Mining); intensity bumped (opacity 1, 550ms).
- [x] **P. Haptic Heartbeat:** Light haptic when GlobalActionTicker progress resets (100% → 0%).
- [x] **V. Inventory Full Warning:** INVENTORY_SLOT_CAP (50); "!" on Bank tab; addItems respects cap; Bank header shows slots.
- [x] **Smooth Progress Bars:** useInterpolatedProgress + SmoothProgressBar; 60fps interpolation between Redux updates (GlobalActionTicker, Mining node bar).
- [x] **GlobalActionTicker Hooks Fix:** Moved useRef/useEffect before early return (Rules of Hooks).

## History: v0.2.1 "Immersion & Utility"
- [x] **Global Action Ticker:** Persistent progress bar + skill emoji visible on all screens.
- [x] **Header XP Pulse:** Integrated a real-time XP progress bar + level badge into the main Skills header.
- [x] **Universal Action Ticker:** Promoted ticker to root layout; stays visible inside specific skill screens.
- [x] **Bugfix (Heartbeat):** Fixed missing action progress bar in sub-screens + added node-local pulse.
- [x] **Documentation Sync:** Updated all core docs (SUMMARY, CHANGELOG, ARCHITECTURE, Thoughts) for v0.2.1.
- [x] **Android Edge-to-Edge:** Full translucent system bars + manual safe area handling for premium layout.
- [x] **RPG Icon Set:** Migrated to MaterialCommunityIcons for pickaxes, swords, and treasure chests.
- [x] **Navigation Update:** Immersive back buttons and full skill-card click-through.

## History (Compacted)
- **[2026-02-26] v0.2.1 — Immersion Update:** Integrated `GlobalActionTicker` for real-time background task visibility. Refactored `index.tsx` and `mining.tsx` to handle Android view insets manually (edge-to-edge). Upgraded `IconSymbol` to use `MaterialCommunityIcons` with RPG mappings (`pickaxe`, `sword-cross`, `treasure-chest`).
- **[2026-02-26] QoL E-M + Bugfixes (v0.2.0):** (E) Added ticks-to-level estimates in Mining. (J) Fixed LevelUpToast re-render loop/timer bug. (K) Fixed Android bottom nav bar overlap using safe area insets. (L) Upgraded XP display to "current / goal" format. (M) Enabled full-card navigation on Skills screen. Implemented "wipe save" debug tool. Updated all project docs.
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
