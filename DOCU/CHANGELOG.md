# CHANGELOG

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When adding a new release entry here, also update:** `UpdateBoard.tsx`, `index.html` §Changelog, `patchHistory.ts`, `app.json` version.

**Version restructure (2026-03-03):** 0.2.8–0.2.11 consolidated into **v0.3.0** "The Big Update". Theme Engine, Quick-Switch Sidebar, Random Events, and 0.2.7 content (Fishing, Runecrafting, etc.) now under 0.3.0.

**Version restructure (2026-02-28):** Project versioning was consolidated so the current release is **v0.2.5**. Previous 0.3.x and 0.4.x entries were merged into 0.2.x to better reflect early-stage development. **Persistence & Pipeline** and **Deployment & Fixes** live in the **1.x.x** section (1.0.0 and 1.1.0). Content is preserved; only version numbers and grouping changed.

---

## [Unreleased]
### Added
- (Future content.)

---

## [0.5.0] - 2026-03-05 — "Big Weeds Update"

> Consolidates 0.4.1–0.4.4 plus World Exploration, Lumina Shop, Mastery expansion, Bank OSRS redesign, design doc v2.0, and new NPCs.

### Added
- **Harvesting & Scavenging (0.4.3):** 7 harvest nodes (wheat → void cap), 5 scavenge nodes (surface ruins → void rupture). Quick-Switch, thump SFX.
- **Herblore (0.4.4):** 7 potion recipes (herb + empty vial → potion). Buy vials from Nick. Bank Potions filter. Pet Fizz.
- **Bank OSRS-style redesign:** Main tab + up to 6 custom tabs. Tab bar row, type-filter row. Tab icon = first item in tab. Long-press item → "Create new tab with this item". Remember last tab (`lastBankTab`). 50 F2P / 100 Patron slot cap. Migration: >6 tabs truncated to 6.
- **World Exploration:** Explore tab = World Map. 6 locations (Crownlands, Frostvale, Whispering Woods, Fey Markets, Scorched Reach, Skyward Peaks). Tap to travel. Location screen with NPCs, Shop, Quests. Unlock: always, quest, level, calendar (Frostvale December), event.
- **Lumina Shop:** Reroll Daily Quests (5 Lumina, 2/day), XP Boost 1h (15 Lumina, +25% XP). Shop Buy tab shows Lumina items.
- **Mastery expansion:** Yield +3%/level (max 3) and Speed +4%/level (max 3) for all 10 skills (now includes harvesting, scavenging, herblore). Settings → Mastery: Gathering/Crafting pillars, skill cards, Spend/Max.
- **MasteryBadges on skill screens:** Active mastery bonuses (📖 XP, 📦 yield, ⚡ speed) displayed as compact gold badges in the skill header. Only show purchased upgrades. All 10 skill screens wired.
- **Expanded daily quests:** Template pool grown from 14 to 30 — now includes iron/steel bars (smithing), raw herring/trout (fishing), cooked salmon (cooking), bronze/iron daggers (forging), wheat/cabbage/tomato/snape grass (harvesting), rusty scrap/discarded tech/fey trinket (scavenging), minor healing potions/strength elixirs (herblore).
- **Daily quest tracking:** All-time `totalDailyQuestsCompleted` counter shown on Quests screen. Each claim logged to Activity Log (📅 type).
- **New NPCs:** Bianca the Herbalist, Kate the Traveler. Quests tab "NPCs in Town" with Talk. MASTER_DESIGN_DOC v2.0 (7 Parts, 20 Chapters) for design reference.
- **Skills architecture:** `DOCU/SKILLS_ARCHITECTURE.md` — pre-implementation design for Farming, Agility, Thieving, Crafting. Patches, courses, targets, recipes. Implementation order: Agility → Thieving → Crafting → Farming.
- **ComingSoonBadge:** Red (planned) or green (in progress) badge. Wired to Skills grid (unimplemented skills), Location screens, Explore (locked locations), Combat. Toggle via `SKILLS_IN_PROGRESS` / `FEATURES_IN_PROGRESS` in `constants/comingSoon.ts`.
- **Thieving skill:** Added to `SkillId`, `SKILL_META` (🎭), theme. Shows on Skills grid with ComingSoonBadge until implemented.
- **Runite forging tier:** Dagger, sword, half helmet, full helmet, platebody, shield. Narrative-gated (`knows_about_sneeze_cult`). Forging screen shows Story badge when locked.
- **More forging equipment:** Sword (2 bars), platebody (3 bars), shield (2 bars) for Bronze, Iron, Steel, Mithril, Adamant. All tiers now have 6 equipment types.
- **Gems (mining rare drops):** Sapphire (Iron+ 2%), Emerald (Coal+ 1.5%), Ruby (Mithril+ 1%), Diamond (Adamant+ 0.5%). Per successful mining tick on ore nodes only. Bank → Other filter. Per ORE_CHAIN_EXPANSION.md §2.3.

### Changed
- Bank: two-row layout (tabs then filters). Custom tabs capped at 6. `addCustomBankTab` / `addCustomBankTabWithItem` enforce limit; `setLastBankTab` persists selection.
- Daily quest rotation: 30 templates across all 10 skills (was 14 across 5).

---

## [0.4.4] - 2026-03-05 — "Herblore"
### Added
- **Herblore skill:** 7 potion recipes (herb + empty vial → potion). Minor Healing, Strength Elixir, Agility Tonic, Defence Brew, XP Boost, Nature's Blessing, Void Resistance. `constants/herblore.ts`, `app/skills/herblore.tsx`.
- **Empty vials:** Buy from Nick's Shop (15 gp). Required for all herblore recipes.
- **Potions:** New item type `potion`. Bank Potions filter. Stats "Potions brewed".
- **Herblore pet:** Fizz — a tiny cauldron. Rare drop while brewing.

### Changed
- `IMPLEMENTED_CRAFTING_SKILLS` now includes herblore.
- Quick-Switch Sidebar includes Herblore.

---

## [0.4.3] - 2026-03-05 — "Harvesting & Scavenging"
### Added
- **Harvesting skill:** 7 nodes (Wheat Field → Void Caps). Gather wheat, cabbage, tomato, sweetcorn, strawberry, snape_grass, void_cap_mushroom. `constants/harvesting.ts`, `app/skills/harvesting.tsx`.
- **Scavenging skill:** 5 nodes (Surface Ruins → Void Rupture). Loot rusty_scrap, discarded_tech, fey_trinket, celestial_fragment, voidmire_crystal. `constants/scavenging.ts`, `app/skills/scavenging.tsx`.
- Both skills in Quick-Switch Sidebar. Thump SFX on tick. Idle soundscapes wired.

### Changed
- `IMPLEMENTED_GATHERING_SKILLS` now includes harvesting and scavenging.
- GlobalActionTicker emoji aligned with SKILL_META (🪴 harvesting, 🏕️ scavenging).

---

## [0.4.2] - 2026-03-05 — "Skill Pets & Polish"
### Added
- **Skill Pets:** Rare companions found while skilling! Each skill has a unique pet (e.g. Rocky for Mining, Timber for Logging) with a low drop chance in `useGameLoop`. Triggers a "lucky" toast and adds to activity log.
- **Pets Screen & Equipping:** New screen (Settings → Pets) to view unlocked pets and equip them. Active pet emoji appears next to player name on Skills screen.
- **Special Message Modal:** Premium animated popup for special announcements (title, body, emoji, CTA). Features spring entry, bouncing emoji, and shimmer border glow. Used for the "🧪 OTA Update Works!" test.
- **OTA Update Pipeline:** Integrated `expo-updates` into the native APK. Updated `Update_2_EAS_OTA_Update.bat` with `CI=1`, `ARTERIA_LEAN_PROD=1`, and `--platform android` to handle headless Metro bundling and correct package name resolution for prod APKs.
- **OTA Hotfix Strategy:** Established a reliable "Wait-Close-Reopen" flow for delivering JS fixes to a crashing app via background `expo-updates` downloads while the error screen is active.
- **OTA Pipeline Hardening:** Added `expo-updates` to plugins array (`checkAutomatically: ON_LAUNCH`). Switched `runtimeVersion` from static `"1.0.0"` to version-matched `"0.4.2"` (EAS bare workflow requires static strings). Created `plugins/withAbiSplits.js` config plugin to auto-inject ABI splits into build.gradle (survives `expo prebuild --clean`). Added `fallbackToCacheTimeout: 0` to prevent launch blocking. Created `Rollback_OTA.bat` for emergency rollbacks.
- **Check for Updates (Settings):** New "Check for Updates" row in Settings → About. Uses `expo-updates` API with full status feedback (checking, downloading, ready, up to date, error, dev mode) and a restart prompt when an update is downloaded.

### Fixed
- **Cooking Screen Crash:** Fixed `ReferenceError: Radius is not defined` by adding the missing `Radius` import from `@/constants/theme`.
- **Missing Tab Icons:** Added mappings for `book.pages.fill` (Quests) and `chart.bar.fill` (Stats) in `IconSymbol.tsx` to prevent default `help-circle` fallback.
- **Bank Filter Stretching:** Removed duplicate padding in `filterChipActive` and added `alignItems: 'center'` to `filterRow` to prevent vertical expansion/stretching of pills on tap.
- **SpecialMessageModal Animation Crash:** Resolved a `useNativeDriver` conflict. Split the animated container into two layers: an outer `Animated.View` for native transforms (scale/opacity) and an inner `Animated.View` for JS-driven color transitions (shimmer border).
- **Launch Crash:** Removed the hardcoded test message from `_layout.tsx` that was prematurely triggering the modal before full system initialization.
- **Idle cap notification:** Cancel now runs on app mount when active (cold start). Previously only ran on background→active transition.

### Changed
- **Sound Effects:** Wired real tink/thump/splash sounds to all skills via `useGameLoop`.
- **Docs viewer:** index.html Docs nav now fetches and renders DOCU/ folder markdown files.
- **Bestiary groundwork:** Enemy data structures and Goblin base stats for future combat.
- **Login bonus banner:** Now shows the exact reward before claiming.

---

## [0.4.1] - 2026-03-03 — "The Anchor Man"
### Added
- **Main character & nickname:** The protagonist is "The Anchor" (canonical name from lore). On first start (no save), `NameEntryModal` prompts for a nickname — what friends/NPCs will call the player. Skip uses canonical name. `constants/character.ts`: `PROTAGONIST_CANONICAL_NAME`, `getDisplayName()`. Settings → Character: change nickname. Skills header: "Welcome, {displayName}". `gameSlice`: `awaitingNameEntry`, `setAwaitingNameEntry`, `setPlayerName`.
- **Goblin — first random enemy:** New random event "Goblin Peek": a goblin peeks from the shadows during skilling, then scurries away (flavor only; combat not implemented). Uses `goblin_1.svg` asset. `constants/enemies.ts` defines Goblin as first enemy (id, name, assetPath); `constants/randomEvents.ts` adds `goblin_peek`; `useGameLoop` dispatches lucky toast + activity log. Asset copied to `apps/mobile/assets/images/goblin_1.svg` for future combat/bestiary UI.
- **Goblin Peek modal:** When `goblin_peek` fires, `GoblinPeekModal` shows goblin SVG artwork in a themed card; auto-dismisses after 3s or tap. `react-native-svg` + `react-native-svg-transformer`; metro.config.js updated; `svg.d.ts` for TS. `gameSlice`: `showGoblinPeek`, `setShowGoblinPeek`.
- **Cooking skill:** 10 recipes (raw fish → cooked food): Shrimp, Sardine, Herring, Trout, Salmon, Tuna, Lobster, Swordfish, Shark, Cosmic Jellyfish. `constants/cooking.ts`, `app/skills/cooking.tsx`. Bank Food filter. Daily quests: Cook Shrimp, Cook Trout. Stats: Food cooked.
- **Bestiary stub:** Combat tab "Enemies Spotted" section. `player.seenEnemies` tracks encountered foes; `recordEnemySeen` when `goblin_peek` fires. Ready for Phase 4 combat expansion.

### Fixed
- **Bank crash:** Missing `ScrollView` import in `bank.tsx` caused crash when opening Bank tab. Added `ScrollView` to react-native imports.

---

## [0.4.0] - 2026-03-03
### Added
- **Daily quests:** Radiant daily quests reset at midnight. Three random "gather X" objectives per day (from templates: ores, logs, fish, runes, bars). Quests screen has Daily section with progress and Claim (gold + optional Lumina). Progress auto-updates when items are added. `constants/dailyQuests.ts`, gameSlice `setDailyQuests` / `completeDailyQuest`.
- **Detailed stats screen:** New Stats tab. Tracks total items gathered by type (ore, log, fish, rune, bar, equipment, other), first/last play date, days since first play. `player.stats`; `addItems` increments by item type.
- **Custom bank tabs:** Create tabs (name + emoji) via "+ Tabs" in Bank; assign items from item detail "Add to tab". Filter row shows custom tabs. `player.customBankTabs`, reducers `addCustomBankTab`, `removeCustomBankTab`, `assignItemToTab`.
- **Sell All Junk:** Mark items as junk in item detail (configurable). "Sell All Junk" button in Bank header sells all junk (respects locked). `player.junkItemIds`, `toggleJunk`, `sellAllJunk`.
- **Login bonus:** 7-day escalating rewards (100–600 gp, day 7: 500 gp + 10 Lumina). Skills screen banner when claimable; Settings → Login bonus & Lumina shows streak and next reward.
- **Lumina currency UI:** Premium currency. Displayed in Bank header, Shop header, Settings. Day 7 login bonus grants 10 Lumina. Shop has "Lumina Shop — Coming soon" stub. `player.lumina`, `addLumina` reducer.

---

## [0.3.0] - 2026-03-03
### Added
- **Quest step auto-completion (engine):** Quest steps can have `completionRequirements` (items/skills/flags). Engine exports `getQuestStepsToComplete(player, quests)`; app runs it in `useGameLoop` when player state changes and dispatches `completeQuestStep` for each. All Act 1/2 quest steps that are item- or skill-gated have requirements in `packages/engine/src/data/quests.ts`.
- **Mastery system:** Earn 1 mastery point per level-up per skill. Spend in Settings → Mastery on permanent buffs (e.g. +5% XP per level, up to 5 levels). `player.masteryPoints`, `player.masterySpent`; `constants/mastery.ts` (MASTERY_UPGRADES, getMasteryXpMultiplier); applyXP multiplies by mastery before Patron. Reducer `spendMastery`.
- **Quest completion (gameplay):** Complete button on Quests screen only when all steps are done. On complete, rewards are applied: gold, XP per skill, narrative flags, and items. Dialogue can advance steps via `onSelect.completeQuestStep`; completing all steps allows hand-in for rewards.
- **Theme Engine:** Settings → Appearance → Theme picker (System, Dark, Light, Sepia). Tab bar, headers, and StatusBar follow selected theme. `paletteToNavigationTheme()`, NavThemeWrapper, StatusBarFromTheme. THEME_OPTIONS, THEMES registry (dark, light, sepia). Persisted with save.
- **Quick-Switch Sidebar:** Floating pill on left edge in skill screens. Slide-in drawer to jump Mining, Logging, Fishing, Runecrafting, Smithing, Forging. Active skill gold highlight. Shared `constants/skills.ts`.
- **Smithing:** Smelting skill. Ore → bars (Bronze, Iron, Steel, Gold, Mithril, Adamant, Runite). Consumes ore per tick; produces bars. Runite gated by narrative. `constants/smithing.ts`, `app/skills/smithing.tsx`.
- **Forging:** New skill. Bars → equipment (daggers, half helmets, full helmets). 15 recipes grouped by metal tier. `constants/forging.ts`, `app/skills/forging.tsx`. Bank Equipment filter.
- **Activity Log:** Skills screen 📜 button opens modal. Logs random events, level-ups, skill starts. Max 50 entries, session-based. `game.activityLog`, `ActivityLogModal.tsx`.
- **Random Events:** Per-tick roll (~0.5% base, 60-tick cooldown). Blibbertooth's Blessing, Cosmic Sneeze, Genie's Gift, Treasure Chest, Lucky Strike. `player.randomEvents` state. Groundwork for dialogue randoms, skill guardians.
- **AI Versioning Reminder:** Doc heads include reminder to update Update Board, website, patchHistory, CHANGELOG, app.json when implementing features.

### Changed (UX batch 2026-03-03)
- **Bank:** Sort row (Name / Qty / Value). Empty state shows "Clear filter & search" when filter or search returns no items. Item detail modal recipe line removed.
- **Shop:** Buy quantities 1, 5, 10, 25, 50 and Max (cap by gold). Sell filters include Fish, Runes, Equipment.
- **Quests:** [DEV] Guard Intro button only in `__DEV__`. Complete button is real: only when all steps done, applies rewards then completes quest.
- **HorizonHUD:** Grind card label "Lv. X → Y". **Skills:** 2 columns on narrow width (<360). **Combat:** Phase 4 teaser card. **Settings:** Idle Soundscapes description "coming soon".

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
