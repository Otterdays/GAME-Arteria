# CHANGELOG

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When adding a new release entry here, also update:** `UpdateBoard.tsx`, `index.html` §Changelog, `patchHistory.ts`, `app.json` version.

**Version restructure (2026-02-28):** Project versioning was consolidated so the current release is **v0.2.5**. Previous 0.3.x and 0.4.x entries were merged into 0.2.x to better reflect early-stage development. **Persistence & Pipeline** and **Deployment & Fixes** live in the **1.x.x** section (1.0.0 and 1.1.0). Content is preserved; only version numbers and grouping changed.

---

## [Unreleased]
### Added
- (Reserved for future features.)

---

## [0.2.9] - 2026-03-03
### Added
- **Quick-Switch Sidebar:** Floating pill trigger on the left edge when in a skill screen. Tap to slide open a drawer and jump between Mining, Logging, Fishing, Runecrafting without returning to the Skills tab. Active skill highlighted in gold. Glassmorphic panel with skill-specific colors, smooth Reanimated slide. Shared `constants/skills.ts` for SKILL_META and IMPLEMENTED_SKILLS.

---

## [0.2.8] - 2026-03-03
### Added
- **Random Events:** Per-tick roll during skilling (~0.5% base chance, 60-tick cooldown). **Blibbertooth's Blessing:** Bonus XP (level × 5) to active skill. **Cosmic Sneeze:** Doubles next item haul. **Genie's Gift:** Bonus XP (level × 10) to a random trained skill. **Treasure Chest:** Gold reward scaling with level. **Lucky Strike:** Double XP for this tick. Groundwork for dialogue randoms, skill guardians (FUTURE_NOTES.md).
- **Random Events State:** `player.randomEvents` (lastTriggeredAt, ticksSinceLastEvent, completedCount) for frequency tuning and future expansion.
- **AI Versioning Reminder:** Doc heads (SUMMARY, SCRATCHPAD, ROADMAP, CHANGELOG, ARCHITECTURE, FUTURE_NOTES) now include prominent reminder to update Update Board, website, patchHistory, and app.json when implementing features.

---

## [0.2.7] - 2026-03-03
### Added
- **Fishing Skill:** Fully implemented the Fishing skill with 10 spots ranging from Shrimp (Lv. 1) to Cosmic Jellyfish (Lv. 90). Features a "vertical bob" animation and area-grouped UI.
- **Runecrafting Skill:** Introduced a two-stage production skill. Players must mine Rune Essence, Pure Essence, or Cosmic Shards to bind them at one of 14 localized altars.
- **Improved Game Loop:** Extended the internal `ActionDef` system to support `consumedItems`. The game loop now automatically checks for required inputs (like essence), consumes them before awarding XP/loot, and stops the task if the player runs out of stock.
- **Bank Expansion:** Added "Fish" and "Runes" filter tabs to the Bank for better organization.
- **New Mining Nodes:** Added Rune Essence, Pure Essence, and Cosmic Shard veins to the Mining skill.
- **Type Safety:** Updated engine types and mobile state definitions to support the new skills and items, ensuring full cross-monorepo synchronization.
- **Confirm Task Switch (Settings → Gameplay):** When enabled, starting a different skill/task while one is already active shows a confirmation dialog ("Switch task?") before switching. Implemented via `useRequestStartTask` hook; all gathering skill screens use it.
- **Battery Saver (Settings → Gameplay):** When enabled, after 5 minutes with no touch the app shows a true-black dim overlay to reduce battery use; any touch dismisses it. Persisted with save; interval check every 30s.
- **Easter egg "Don't Push This":** Button in Settings → Easter Egg. Press 1,000 times to unlock the title "The Stubborn". Count and unlocked titles persisted with save.
- **Notifications (wired):** Level Up Alerts, Task Complete, and **Idle Cap Reached** toggles in Settings → Notifications; all persisted. **Idle Cap Reached** schedules a local notification when the app goes to background (lastSaveTimestamp + 24h or 7d); notification fires when offline progress cap is full. Uses expo-notifications; cancelled when app returns to foreground.
- **Idle Soundscapes:** New Settings → Audio toggle. Stub hook `useIdleSoundscape(soundscapeId)` for skill screens to plug in ambient loops (mining, logging, fishing, runecrafting); ready for expo-av or similar.
- **Horizon HUD toggle (Settings → Gameplay):** Option to hide the 3 goal cards (Immediate / Session / Grind) under the skill XP progress on the Skills screen. Toggle off to hide.
- **Runecrafting requirements indicator:** Badge row on each altar card shows Lv. X, essence/batch, and Story lock when applicable.

### Changed
- **Settings screen:** All new toggles wired to Redux and persisted (Confirm Task Switch, Battery Saver, notification toggles, Idle Soundscapes). New Easter Egg section.
- **Update Board:** In-app changelog modal renamed from "Updates Modal" to **Update Board**; pops when `lastSeenVersion !== currentVersion` (app.json). Component `UpdateBoard.tsx`; update hardcoded changelog there when bumping versions.

## [0.2.6] - 2026-03-02
### Added
- **Lore Expansion:** Engineered a complete `DialogueOverlay` modal reading from Redux. NPCs now have branching dialogue trees (`data/dialogues.ts`) with options that trigger narrative flags or start / progress quests.
- **Narrative Gating:** Created `meetsNarrativeRequirement` utility in engine. Connected to dialogue options to hide/disable choices. Connected to `MiningScreen` to hide Runite Vein until the `knows_about_sneeze_cult` flag is received from Nick.
- **Quest System:** Created a new `QuestsScreen` tab reading from the unified `ALL_QUESTS` engine data. Automatically sorts Active, Completed, and Available quests natively.
- **Website Aesthetic:** Overhauled `index.html` moving to premium Glassmorphism cards with dynamic backdrop-blur, capturing the true vibe of the game.

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
