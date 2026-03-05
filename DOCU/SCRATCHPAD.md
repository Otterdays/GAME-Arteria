# SCRATCHPAD

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When shipping new features, bump version and update:** `app.json` → `UpdateBoard.tsx` (in-app) → `index.html` (website §Changelog) → `patchHistory.ts` (Patch Notes) → `CHANGELOG.md`. See Documentation & AI Developer Guidelines below.

**Active Task:** v0.5.0 shipped. Weapon expansion, Fletching/Tailoring skills, Runite forging, gems done. Ready for APK rebuild.

## [2026-03-05] Weapon Expansion + Fletching & Tailoring
- **Forging weapons:** Replaced generic sword with 5 types: dagger (1 bar), shortsword (2), longsword (2), scimitar (2), 2H Longblade (3). All tiers Bronze→Runite. 54 recipes total (9 equipment × 6 tiers). Migration: `*_sword` → `*_shortsword` in inventory.
- **Fletching & Tailoring:** Added to SkillId, SKILL_META (🏹 #d35400, 🧵 #e91e63), ALL_SKILLS. Skills grid shows both with red ComingSoonBadge (planned). `DOCU/FLETCHING_TAILORING.md` — design for arrows/bows (logs) and gloves/hats/shoes/boots (cloth).
- **Daily quest:** Forge Bronze Shortswords template added.

## [2026-03-05] Runite Forging + Gems + Rare Mining Drops
- **Runite forging tier:** Dagger, shortsword, longsword, scimitar, 2H Longblade, half helmet, full helmet, platebody, shield. Gated by `knows_about_sneeze_cult` (same as runite ore). `constants/forging.ts`, `app/skills/forging.tsx` (meetsNarrativeRequirement).
- **Gems (mining rare drops):** Sapphire (Iron+ 2%), Emerald (Coal+ 1.5%), Ruby (Mithril+ 1%), Diamond (Adamant+ 0.5%). Per successful mining tick on ore nodes only (not essence). `useGameLoop.ts` gem roll logic; `items.ts` sapphire, emerald, ruby, diamond (type: other).
- **Docs:** ORE_CHAIN_EXPANSION.md §2.1–2.3 implemented. MASTER_DESIGN_DOC Forging section updated. Version remains 0.5.0.

## [2026-03-05] Skills Architecture + ComingSoonBadge
- **SKILLS_ARCHITECTURE.md:** Pre-implementation design for Farming (patches, seeds, growth), Agility (courses, XP-only), Thieving (pickpocket/stalls, risk), Crafting (arrows, bags, jewelry). Implementation order: Agility → Thieving → Crafting → Farming.
- **Thieving skill:** Added to SkillId, SKILL_META (🎭), theme (skillThieving #8e44ad), ALL_SKILLS. Migration auto-adds skills.thieving.
- **ComingSoonBadge:** `components/ComingSoonBadge.tsx` — red (planned) or green (in progress) badge with dot + label. `constants/comingSoon.ts`: SKILLS_IN_PROGRESS, FEATURES_IN_PROGRESS, LOCATION_TO_FEATURE.
- **Badge wiring:** Skills grid (unimplemented skills), Location screen (NPCs/Shop/Quests banners), Explore (locked locations), Combat (Phase 4). Add skill/feature IDs to *_IN_PROGRESS sets to flip to green.

## [2026-03-05] Mastery + Dailies + MasteryBadges
- **Mastery for new skills:** Added harvesting, scavenging, herblore to `MASTERY_UPGRADES` (xp_bonus, yield_bonus, speed_bonus). Settings → Mastery pillars now show all 10 skills.
- **Daily quest pool:** 14 → 30 templates. New: iron/steel bars, raw herring/trout, cooked salmon, bronze/iron daggers, wheat/cabbage/tomato/snape_grass, rusty_scrap/discarded_tech/fey_trinket, minor_healing/strength_elixir.
- **Daily quest logging:** `totalDailyQuestsCompleted` field in PlayerState (persisted, migrated). `completeDailyQuest` now increments counter and pushes `daily_quest_complete` entry to activityLog. Quests screen shows all-time count.
- **MasteryBadges component:** `components/MasteryBadges.tsx` — compact gold-tinted badge row (📖 XP, 📦 yield, ⚡ speed). Only renders when upgrades purchased. Added to all 10 skill screens (mining, logging, fishing, harvesting, scavenging, runecrafting, smithing, forging, cooking, herblore).
- **Activity log type:** Added `daily_quest_complete` to `ActivityLogType`. ActivityLogModal emoji map updated (📅).

## [2026-03-05] v0.5.0 "Big Weeds Update" — Version bump
- **Version:** app.json, build.gradle, runtimeVersion → 0.5.0.
- **CHANGELOG:** New [0.5.0] entry consolidating 0.4.1–0.4.4 + Bank OSRS, World Exploration, Lumina Shop, Mastery expansion, new NPCs.
- **Docs:** SUMMARY (version scheme, Post-0.5.0), patchHistory.ts (0.5.0 entry), UpdateBoard.tsx (0.5.0 subtitle + content), index.html (hero-badge, Latest section, changelog roadmap item).

## [2026-03-05] MASTER_DESIGN_DOC v2.0 — Full Consolidation
- **7 Parts, 20 Chapters:** Complete reorganization with clear structure.
- **Part I:** Foundations — World Bible, Character System (Anchor, Seriousness Meter)
- **Part II:** Progression — 25 Skills, Advanced Mastery (Specializations, Prestige, Transcendence), Absurdity System (Chaos Theory, Blibbertoth Blessings/Curses)
- **Part III:** World — Location System, World State & Corruption (0-100%), Seasonal Calendar (4 events)
- **Part IV:** Combat — Combat System, Equipment & Paper Doll (Quirks, Sets, Wardrobe)
- **Part V:** Social — Housing & Sanctum (Vibes), Companions (Stories, Board Game), Chronicle System (Tome, Timekeepers)
- **Part VI:** Economy — Consumption Economy (Three Stomachs, Restaurant), Monetization
- **Part VII:** Narrative — 4-Act Story, Technical, Future Expansion
- **8 Appendices (A-H) — Consolidated from satellite docs:**
  - **A:** Current Implementation Status & Expansion Surface (from CURRENT_IMPROVEMENTS, IMPROVEMENTS, gemini_notes)
  - **B:** Companion Deep Design — progression, roles, uncertainties (from COMPANIONS.md)
  - **C:** UI/UX Design Language — color palette, typography, component library, screen layouts, touch targets (from zhip-ai-styling, zhipu-ai, STYLE_GUIDE)
  - **D:** Bank OSRS-fication — UX analysis, tab/filter structure, checklist (from gemini_notes)
  - **E:** Random Events Deep Design — RuneScape inspiration, phased implementation (from FUTURE_NOTES)
  - **F:** Theming Architecture — semantic palette, ThemeContext, registry, usage pattern (from THEMING)
  - **G:** Technical Stack & Future Dependencies — current versions, engine architecture, game loop, MMKV, build pipelines, OTA protocol (from STACK_ASSESSMENT, FUTURE_NOTES, TRUTH_DOCTRINE)
  - **H:** Melvor Idle Reference Architecture — core engine patterns, stat/skill/combat/economy baselines (from zhipu-ai)
- **Doc now 1400+ lines:** Single source of truth for all game design.

## [2026-03-05] Bank OSRS-style Redesign
- **Tab bar:** Main (📦) + up to 6 custom tabs + "+ Add". Tab icon = first item in tab (else custom emoji).
- **Type filters:** Second row (All, Ores, Bars, …) filters within current tab.
- **50 cap:** Slot cap unchanged (50 F2P, 100 Patron). Max 6 custom tabs enforced in addCustomBankTab/addCustomBankTabWithItem.
- **Create tab:** "+ Add" modal for empty tab; long-press item → Alert "Create new tab with this item?" → addCustomBankTabWithItem. At 6 tabs, "+ Add" shows "Max" and is disabled.
- **Remember tab:** lastBankTab in player state; setLastBankTab on tab switch; restore on open (useEffect).
- **Migration:** customBankTabs.length > 6 → slice(0, 6). gemini_notes §9.

## [2026-03-05] World Exploration Groundwork
- **LOCATIONS:** `constants/locations.ts` — Crownlands, Frostvale, Whispering Woods, Fey Markets, Scorched Reach, Skyward Peaks. Unlock: always, quest, level, calendar, event.
- **Explore tab:** World Map with location cards. Tap to travel (instant). Locked locations show lock icon + reason.
- **Location screen:** `app/location/[id].tsx` — NPCs, Shop, Quests sections. Crownlands has real content; others show "Coming soon" banners.
- **meetsLocationRequirement:** Quest flags, total level, December (Frostvale), event (stub).

## [2026-03-05] New NPC + World Exploration Design
- **Kate the Traveler:** New NPC in Quests "NPCs in Town". Dialogue teases Frostvale (Christmas town), Voidmas, world regions. `dt_kate_traveler` in dialogues.ts.
- **WORLD_EXPLORATION.md:** New design doc for idle-friendly explorative world. Locations = instant travel (tap to go). Frostvale (Christmas), Fey Markets, Whispering Woods, etc. Explore tab = World Map. Phased implementation.

## [2026-03-05] New NPC — Bianca the Herbalist
- **Bianca:** Herbalist NPC with dialogue about potions, herbs, void caps. `dt_bianca_herbalist` in packages/engine/src/data/dialogues.ts.
- **NPCs in Town:** New section on Quests tab (Lore & Quests) listing Guard, Nick, Bianca. Each has 💬 Talk button. Replaces dev-only Guard access for prod users.
- **PEOPLE_TO_ADD:** Bianca assigned as Herbalist.

## [2026-03-05] Mastery Speed Bonus
- **speed_bonus:** +4% speed per level (max 3 = +12%) for Mining, Logging, Fishing, Runecrafting, Smithing, Forging, Cooking. `getMasterySpeedMultiplier` in mastery.ts; useGameLoop applies `interval = baseInterval / speedMult` in processDelta.
- **Idle feel:** Faster ticks = more progress per real-time. Spend mastery points for permanent speed boost per skill.

## [2026-03-05] Herblore (v0.4.4)
- **Herblore:** 7 recipes (herb + empty_vial → potion). Minor Healing, Strength Elixir, Agility Tonic, Defence Brew, XP Boost, Nature's Blessing, Void Resistance. `constants/herblore.ts`, `app/skills/herblore.tsx`.
- **Items:** empty_vial (shop), 7 potions. New ItemType `potion`. Bank Potions filter. Stats "Potions brewed".
- **Engine:** Registered in useGameLoop. Tink SFX. Quick-Switch Sidebar. Pet "Fizz" (herblore).

## [2026-03-05] Lumina Shop & Mastery
- **Lumina Shop:** `constants/luminaShop.ts` — Reroll Daily Quests (5 Lumina, 2/day), XP Boost 1h (15 Lumina). Shop Buy tab ListHeaderComponent shows purchasable items. Redux: spendLumina, incrementLuminaRerollsUsed, setXpBoostExpiresAt. applyXP applies +25% when xpBoostExpiresAt > now.
- **More Masteries:** yield_bonus (+3% yield) for all 8 skills (logging, fishing, runecrafting, smithing, forging, cooking). getMasteryYieldMultiplier in mastery.ts; useGameLoop applies to item quantities.
- **Mastery UI Polish:** Settings → Mastery: pillar grouping (Gathering / Crafting), skill cards with header (emoji, name, points badge), upgrade rows with level X/Y, Spend/Max button. masterySkillCard, masteryPointsBadge styles.

## [2026-03-05] Harvesting & Scavenging (v0.4.3)
- **Harvesting:** 7 nodes (wheat_field → void_caps). `constants/harvesting.ts`, `app/skills/harvesting.tsx`. Items: wheat, cabbage, tomato, sweetcorn, strawberry, snape_grass, void_cap_mushroom.
- **Scavenging:** 5 nodes (surface_ruins → void_rupture). `constants/scavenging.ts`, `app/skills/scavenging.tsx`. Items: rusty_scrap, discarded_tech, fey_trinket, celestial_fragment, voidmire_crystal.
- **Engine:** Registered in useGameLoop ACTION_DEFS. SFX (thump) for both. Quick-Switch Sidebar includes both via IMPLEMENTED_GATHERING_SKILLS.
- **Docs:** SCRATCHPAD, SUMMARY, CHANGELOG, patchHistory, UpdateBoard updated.

## [2026-03-05] OTA Pipeline Hardening
- **Review:** Full A-to-Z audit of OTA update pipeline. Identified 9 issues across critical/medium/low severity.
- **build.gradle:** Synced `versionName` from `0.4.1` → `0.4.2` to match app.json. Switched `proguard-android.txt` → `proguard-android-optimize.txt` for full R8 optimizations (method inlining, class merging, smaller APKs).
- **app.json (expo-updates plugin):** Added `expo-updates` to plugins array with `checkAutomatically: ON_LAUNCH`. Added `fallbackToCacheTimeout: 0` to updates config (don't block launch).
- **app.json (runtimeVersion):** Changed Android `runtimeVersion` from static `"1.0.0"` to `"0.4.2"` (static app version). EAS bare workflow doesn't support the `appVersion` policy, so we'll manually bump this string on native module changes to ensure OTA updates only reach devices running the same native code. **⚠️ Breaking:** Existing users on `runtimeVersion "1.0.0"` need a new APK to receive future OTA updates.
- **Config plugin (ABI splits):** Created `plugins/withAbiSplits.js` — Expo config plugin that injects `splits { abi { ... } }` into build.gradle during prebuild. Survives `expo prebuild --clean`. No more manual re-adding of ABI splits block.
- **Settings → Check for Updates:** New row in About section. Uses `expo-updates` API: `checkForUpdateAsync()` → `fetchUpdateAsync()` → `reloadAsync()`. Shows status (checking, downloading, up to date, error, dev mode). Full error handling. Spinner while loading.
- **Rollback_OTA.bat:** New batch script for emergency OTA rollbacks via `eas-cli update:rollback`. Includes fallback instructions (re-publish old commit).
- **⚠️ Next step:** Rebuild APK with `2_Build_APK_Local.bat` and redistribute to bake in the new runtimeVersion + ABI splits plugin + expo-updates plugin config.

## [2026-03-05] OTA Update & UI Polish (v0.4.2)
- **OTA Fixes:** Integrated `expo-updates`. Updated bat with `CI=1`, `ARTERIA_LEAN_PROD=1`.
- **Hotfix Delivery:** Established "Wait-Close-Reopen" drill for crashing apps.
- **SpecialMessageModal:** Fixed `useNativeDriver` conflict by splitting into outer (native) and inner (JS) Animated.Views.
- **Launch Crash:** Nulled out test message in `_layout.tsx` to stop modal firing during cold start.
- **Cooking Fix:** Added missing `Radius` import to stop 100% screen crash.
- **Bank Fixes:** Fixed filter pill stretching and missing tab icons (Quests/Stats).

## [2026-03-05] Skill Pets Implementation
- **Data:** Created `constants/pets.ts` defining 7 distinct pets with unique emojis, drop chances, and skill affinities. `SKILL_PETS` object is the core source of truth.
- **Engine State:** Updated `PlayerState` in `@arteria/engine` with an optional `pets` object containing `unlocked[]` and `activePetId`.
- **Game Loop:** Added rare drop logic inside `useGameLoop`'s success branch. Checks the `dropChanceBase` multiplied by `successfulTicks` to roll for a pet on each successful action. Dispatches `unlockPet` and a 'lucky' FeedbackToast + Activity Log if found.
- **Redux:** Added Redux reducers `unlockPet` and `setActivePet` in `gameSlice.ts`. Included `pets` field in migrations and fresh saves.
- **UI:** Added a "Pets" section to the Settings screen linking to the new `pets.tsx` screen. The Pets screen shows a grid of available pets (unlocked sorted first) with Equippable mechanics. The Skills screen header (`index.tsx`) now displays the active pet's emoji next to the player's name.

## [2026-03-05] SFX — real tink, thump, splash
- **expo-audio:** Added and configured in app.json. SBOM updated.
- **WAV assets:** `scripts/generate-sounds.js` generates tink (700Hz), thump (120Hz), splash (noise+tail) to `assets/sounds/*.wav`. Run: `node scripts/generate-sounds.js` from apps/mobile.
- **utils/sounds.ts:** `useSfx()` with `playTink`, `playThump`, `playSplash`, `playForSkill(skillId)`. Respects `settings.sfxEnabled`. Skill mapping: mining/smithing/forging/runecrafting → tink; logging/cooking → thump; fishing → splash.
- **useGameLoop:** Optional `onTickComplete(skillId)` callback; ref-stable via `onTickCompleteRef` so processDelta deps stay minimal.
- **_layout.tsx:** `useSfx()` + `useGameLoop({ onTickComplete: playForSkill })` so SFX play on each skill tick.
- **Settings → Audio:** "Test sound" row — tap to play tink, thump, splash in sequence. Verifies SFX without waiting for ticks.

## [2026-03-04] Haptics + Soundscapes
- **Haptics:** Skill pill tap (when implemented), Bank Sell 1/All/Junk + filter chips, Shop Buy + qty chips + Sell 1/All. Light/Medium per action.
- **Soundscapes:** useIdleSoundscape wired to all 7 skill screens (mining, logging, fishing, runecrafting, smithing, forging, cooking). SoundscapeId expanded. Hook still stub; Settings description "Coming soon."

## [2026-03-04] Polish batch (curiosity pass)
- **Bank item detail:** Added "Used in: Mining, Smithing" (etc.) per item type. IMPROVEMENTS #6 done.
- **Stale comments:** bank.tsx Phase 1.3 → current; index.tsx "Coming in Phase 2" → "Coming soon".
- **Combat teaser:** "Goblin spotted first. Loadouts, weapon stats, and more enemies coming soon."

## [2026-03-04] Idle cap notification fix
- **Bug:** 24h max collection reminder showed up even after user was in app multiple times.
- **Cause:** Cancel only ran on background→active transition. Cold start (app killed then reopened) starts in "active" — no transition, so stale notification from prior session was never canceled.
- **Fix:** usePersistence: cancel idle-cap notification on mount when AppState is active.

## [2026-03-04] COMPANIONS.md — independent companion doc
- **New doc:** DOCU/COMPANIONS.md consolidates all companion design. Includes user idea: companions gain levels like player, use for skilling/crafting/collecting. Companion skill levels gate node/recipe access; they level as they work.
- **SUMMARY:** Added COMPANIONS.md to doc index.

## [2026-03-04] Companion unlock: Leadership skill
- **Rationale:** "Level 20" was too vague—game has many skills, no single character level. Leadership (Support pillar) already gates companion count per design.
- **index.html:** Barnaby Leadership 20, Yvette Leadership 35, Reginald Leadership 50.
- **MASTER_DESIGN_DOC, ROADMAP:** Updated companion section and unlock teaser to use Leadership.

## [2026-03-04] README modernization
- **README.md:** Sleeker layout, flat badges, v0.4.1 content. Removed redundant NOTE; cleaner feature tables and quick start.

## [2026-03-04] Docs viewer on website
- **index.html:** Docs nav link opens in-page modal instead of external GitHub. Fetches markdown from raw.githubusercontent.com, renders with marked.js. Sidebar: Summary, Roadmap, Architecture, Changelog, Style Guide, Theming, Improvements, Scratchpad. "View all on GitHub" fallback. Responsive (mobile: horizontal doc pills). Escape / click-outside to close.

> **🤖 Doc discipline:** Always update docs when implementing. SCRATCHPAD, CHANGELOG, SUMMARY, IMPROVEMENTS, ROADMAP — keeps AI and humans in sync.

## [2026-03-04] Login bonus UX
- **Banner:** Shows reward in text — "Day 3 — Claim 300 gp!" or "Day 7 — Claim 500 gp + 10 Lumina!" (loginBonusRewardText from loginStatus.reward).
- **Toast on claim:** FeedbackToast (lucky type) — "Day X Login Bonus!" / "+300 gp" or "+500 gp + 10 Lumina". useFeedbackToast in index.tsx.

## [2026-03-04] Theming Phase 3 & 4 complete
- **Phase 3:** logging.tsx `Palette.green` → `palette.green`.
- **Phase 4:** Removed `Palette` export. theme.ts: Colors, CardStyle use DARK_PALETTE. ErrorBoundary: THEMES.dark. skills.ts: THEMES.dark. STYLE_GUIDE, THEMING.md updated.

## [2026-03-04] Polish + Bestiary groundwork
- **index.html:** Added Cooking system card to Latest section (10 recipes, Bank Food filter, daily quests).
- **Shop:** Added Food to SELL_FILTERS (cooked food sellable).
- **HorizonHUD:** Grind card "Lv. X → Lv. Y"; subtext "X/Y levels".
- **Bestiary groundwork:** constants/enemies.ts — EnemyDrop, EnemyLocation, EnemyCombatStats interfaces. Goblin: combat stats, drops (bronze_dagger 5%), locations (Crownlands). Placeholder enemies: Slime, Wolf (data only; not in random events yet). Combat tab: "Found in" shown when enemy has locations.
- **Docs:** SUMMARY, CHANGELOG (Unreleased), IMPROVEMENTS (Quick Wins marked done), ROADMAP (Phase 4.4 bestiary groundwork).

## [2026-03-04] v0.4.1 "The Anchor Man"
- **Cooking:** 10 recipes (raw fish → cooked food). constants/cooking.ts, app/skills/cooking.tsx. Bank Food filter. Daily quests Cook Shrimp, Cook Trout. Stats: Food cooked.
- **Bestiary stub:** player.seenEnemies, recordEnemySeen. Combat tab "Enemies Spotted" section. Goblin recorded when goblin_peek fires.
- **Version:** app.json 0.4.1, patchHistory, UpdateBoard, CHANGELOG, index.html, SUMMARY, IMPROVEMENTS, ROADMAP updated.

## [2026-03-04] QuickSwitchSidebar fluidity fix
- **Issue:** Pop-up skill sidebar clunky and laggy on open.
- **Fixes:** (1) Backdrop always mounted — opacity interpolated from translateX instead of conditional `{isOpen && <Pressable />}` to avoid mount/unmount lag. (2) `useLayoutEffect` + `withTiming(220ms)` instead of `useEffect` + `withSpring` — animation starts before paint, predictable timing. (3) `SkillRow` memoized, `handleSkillPress`/`closeSidebar` useCallback, stable `onNavigate` prop to reduce reconciliation.

## [2026-03-03] Main character & nickname
- **The Anchor:** Canonical protagonist name (constants/character.ts). Player chooses nickname on first start via NameEntryModal (no save → setAwaitingNameEntry; modal prompts, Continue/Skip). Skip = use canonical. player.name stores nickname; getDisplayName() for UI. Settings → Character: Nickname row + modal to change. Skills header: "Welcome, [displayName]". gameSlice: awaitingNameEntry, setAwaitingNameEntry, setPlayerName; loadPlayer/newGame clear awaitingNameEntry. migratePlayer: name ?? ''.

## [2026-03-03] Goblin — first random enemy
- **Bank fix:** Missing ScrollView import in bank.tsx caused crash on Bank tab open. Added ScrollView to imports.
- **Goblin Peek modal:** When goblin_peek fires, GoblinPeekModal shows goblin SVG artwork (goblin_1.svg) in a themed card; auto-dismisses after 3s or tap. react-native-svg + react-native-svg-transformer; metro.config.js updated; svg.d.ts for TS. gameSlice: showGoblinPeek, setShowGoblinPeek.
- **Goblin Peek random event:** New event in random event pool. Toast: "A Goblin!" / "It peeked from the shadows... then scurried away. Your first enemy sighting!" (lucky-style). Activity log + engine log. No combat; flavor only.
- **Enemy data:** `constants/enemies.ts` — EnemyMeta, ENEMY_GOBLIN (id: enemy_goblin, name: Goblin, assetPath: goblin_1.svg), ENEMIES registry. Ready for Phase 4 combat/bestiary.
- **Asset:** `goblin_1.svg` at repo root (user-added); copy in `apps/mobile/assets/images/goblin_1.svg` for app use when combat/bestiary UI is built.
- **Docs:** CHANGELOG Unreleased, SCRATCHPAD, SUMMARY, ROADMAP (Phase 4.4 note).

## [2026-03-03] Daily quests, Stats, Bank tabs, Junk, Login bonus, Lumina
- **Daily quests:** Radiant daily quests reset at midnight. `constants/dailyQuests.ts` (templates, generateDailyQuests, getNextMidnight). Quests screen: Daily section with 3 quests, progress (gather X item), Claim reward (gold + optional Lumina). Progress updated in addItems when matching itemId. gameSlice: setDailyQuests, completeDailyQuest.
- **Detailed stats:** New Stats tab. player.stats (byType, firstPlayedAt, lastPlayedAt). addItems increments stats.byType by item type. Stats screen shows play time and total gathered per type.
- **Custom bank tabs:** player.customBankTabs (id, name, emoji, itemIds). Bank: filter row includes custom tabs; "+ Tabs" opens Manage modal (add/delete tabs). Item detail: "Add to tab" toggles per custom tab. addCustomBankTab, removeCustomBankTab, assignItemToTab.
- **Sell All Junk:** player.junkItemIds (configurable). Item detail: "Mark as Junk" toggle. Bank header: "Sell All Junk" when any junk to sell; sellAllJunk reducer. toggleJunk reducer.
- **Login bonus:** 7-day escalating rewards (constants/loginBonus.ts). Skills screen: banner when can claim; Claim dispatches claimLoginBonus({ gold, lumina, day }). Settings → Login bonus & Lumina: streak and next reward; Lumina balance.
- **Lumina:** player.lumina. Displayed in Bank header, Shop header, Settings. addLumina reducer; day 7 login bonus grants 10 Lumina.

## [2026-03-03] Quest step auto-complete + Mastery
- **Quest steps (engine):** Steps in quests.ts have completionRequirements (itemsRequired, etc.). getQuestStepsToComplete(player, ALL_QUESTS) in narrative.ts; app useGameLoop effect runs it when player changes and dispatches completeQuestStep. All item/skill-gated steps have requirements.
- **Mastery:** masteryPoints (1 per level-up), masterySpent; constants/mastery.ts (MASTERY_UPGRADES, getMasteryXpMultiplier); applyXP uses multiplier; spendMastery reducer; Settings → Mastery section (MasterySection component).
- **Docs:** CHANGELOG, patchHistory, SUMMARY, IMPROVEMENTS updated.

## [2026-03-03] Quest completion (gameplay)
- **Quests screen:** "Complete" button only when all steps done (completedSteps.length === quest.steps.length). handleCompleteQuest: apply rewards (gold, XP per skill, setFlags, items) then dispatch completeQuest(questId). Dialogue already advances steps via onSelect.completeQuestStep in DialogueOverlay.
- **Docs:** CHANGELOG 0.3.0 (quest completion + UX batch), patchHistory 0.3.0, SUMMARY status and next steps, SCRATCHPAD active task.

## [2026-03-03] IMPROVEMENTS.md batch implemented
- **Bank:** Sort row (Name / Qty / Value). Empty state "Clear filter & search" when filter or search active. Item detail modal: recipe line removed; styles passed as prop to ItemDetailModal.
- **Shop:** Buy quantities 1, 5, 10, 25, 50 + Max (cap by gold). Sell filters already had Fish, Runes, Equipment.
- **Quests:** [DEV] Guard Intro button only when __DEV__.
- **HorizonHUD:** Grind card name "Lv. X → Y".
- **Skills index:** 2 columns when width < 360 (useWindowDimensions).
- **Combat:** Phase 4 teaser card (loadouts, weapon stats, first enemies).
- **Settings:** Idle Soundscapes description "coming soon". DOCU/IMPROVEMENTS.md updated with implemented list.

## [2026-03-03] APK size fix (2_Build_APK_Local.bat ~100 MB → ~25–30 MB per APK)
- **Cause:** gradle.properties had all 4 ABIs (armeabi-v7a, arm64-v8a, x86, x86_64) with no splits → one universal APK; minify/shrink were off.
- **Fix:** reactNativeArchitectures=armeabi-v7a,arm64-v8a only. app/build.gradle: splits { abi { enable true; include armeabi-v7a, arm64-v8a; universalApk false } }. gradle.properties: android.enableMinifyInReleaseBuilds=true, android.enableShrinkResourcesInReleaseBuilds=true.
- **Result:** Two APKs (app-arm64-v8a-release.apk ~30 MB, app-armeabi-v7a-release.apk ~25 MB). Batch file lists both; share arm64 for most devices. For x86_64 emulator use -PreactNativeArchitectures=x86_64 if needed.

## [2026-03-03] Smithing / Forging Split — Docs Verified
- **index.html:** Changelog §v0.3.0, Roadmap §v0.3.0, Latest section, systems-grid card, Forging skill pill. All updated with Smithing & Forging.
- **Smithing:** Kept as smelting only (ore → bars). constants/smithing.ts, app/skills/smithing.tsx. Unchanged.
- **Forging:** New skill. Bars → equipment (daggers, half helmets, full helmets). constants/forging.ts (15 recipes across Bronze, Iron, Steel, Mithril, Adamant). app/skills/forging.tsx with metal-tier grouping. ItemType 'equipment' + 15 equipment items in items.ts. useGameLoop ACTION_DEFS. gameSlice, skills.ts, engine types: 'forging' skill. QuickSwitchSidebar, HorizonHUD, Bank Equipment filter. palette.skillForging (#c0392b).

## [2026-03-03] Smithing & Activity Log
- **Smithing:** Smelting skill. constants/smithing.ts (7 recipes: Bronze→Runite). Bar items in items.ts. useGameLoop ACTION_DEFS. app/skills/smithing.tsx. IMPLEMENTED_CRAFTING_SKILLS, QuickSwitchSidebar.
- **Activity Log:** game.activityLog (max 50). pushActivityLog from random events, level-up (applyXP), skill_start (startTask). ActivityLogModal.tsx. 📜 button in Skills header. patchHistory, CHANGELOG updated.

## [2026-03-03] Theme Phase 3 — Final Batch Migrated
- **Migrated:** FeedbackToast, HorizonHUD, settings.tsx, patches.tsx, TabIconWithPulse, FloatingXpPop, GlobalActionTicker. All use useTheme() + useMemo + StyleSheet.create(palette). SettingsRow receives styles prop; createSettingsStyles(palette) helper.
- **Phase 3 complete:** All listed components migrated. ErrorBoundary (class) kept on Palette for crash fallback. constants/skills.ts still uses Palette for skill colors (would need palette passed into SKILL_META).

## [2026-03-03] Docs & Style Modernization
- **STYLE_GUIDE:** §7 Theming — migration pattern (useTheme + useMemo + StyleSheet.create), child styles prop. §9 Theme Tokens — table with palette vs static imports.
- **THEMING.md:** §7b Migration Pattern, Phase 3 migrated/remaining lists.
- **FUTURE_NOTES, ARCHITECTURE, SUMMARY:** Theme status and cross-refs updated.
- **zhip-ai-styling.md:** §4.1 — Arteria semantic tokens + THEMING.md reference.

## [2026-03-03] Theme Phase 3 — Component Migration (Continued)
- **Migrated:** mining.tsx, fishing.tsx, runecrafting.tsx, UpdateBoard, DialogueOverlay, WhileYouWereAway, SmoothProgressBar, patron.tsx. All use useTheme() + useMemo + StyleSheet.create(palette).
- **Remaining:** None (all migrated). ErrorBoundary (class) kept on Palette. THEMING.md updated.

## [2026-03-03] Version Consolidation 0.3.0
- **Consolidated:** 0.2.8–0.2.11 → 0.3.0 "The Big Update". app.json, patchHistory, CHANGELOG, UpdateBoard, SUMMARY, index.html, ROADMAP, FUTURE_NOTES, SCRATCHPAD updated. All content from 0.2.7 onwards now under 0.3.0.

## [2026-03-03] Theme Phase 3 — Nav + Tab Bar + StatusBar
- **Implemented:** paletteToNavigationTheme() in theme.ts — maps palette to React Navigation theme (colors + fonts). NavThemeWrapper + StatusBarFromTheme in _layout. AppThemeProvider wraps NavThemeWrapper; ThemeProvider receives palette-based theme. Tab layout uses useTheme().palette for tab bar colors. StatusBar style (light/dark) from theme luminance. THEMING.md §6, FUTURE_NOTES updated.

## [2026-03-03] Theme Picker (Phase 2)
- **Implemented:** Settings → Appearance → Theme picker. THEME_OPTIONS (System, Dark, Light, Sepia). Chips UI, setThemeId wired. Settings header + Appearance section use palette. Haptics on tap. (v0.3.0)

## [2026-03-03] Test Suite Modernization
- **Fixed:** playerFactory.ts missing `narrative` (PlayerState) — caused 3 suite tests to fail. Added narrative: { flags, activeQuests, completedQuests }.
- **Added:** `npm run test:coverage` — coverage for engine package. collectCoverageFrom, coverageDirectory in packages/engine/jest.config.js. coverage/ in .gitignore.
- **Updated:** tests/README.md — test:coverage, config layout, 80% target. Root jest verbose. tests/jest.config testPathIgnorePatterns .expo.
- **Docs/website:** index.html (stats 25, arteria-tests card: GameEngine, test:coverage, 7 suites), ARCHITECTURE, SUMMARY, ROADMAP, STACK_ASSESSMENT — test suite sections refreshed.

## [2026-03-03] Theming Architecture (Light)
- **Implemented:** DOCU/THEMING.md — theme shape, registry, context, persistence, migration. `theme.ts`: PaletteShape, ThemeId, THEMES (dark, light, sepia). ThemeContext + useTheme() — resolves palette from themeId/system. gameSlice: settings.themeId, setThemeId. AppThemeProvider in _layout. STYLE_GUIDE §7, FUTURE_NOTES, SUMMARY updated. No Settings UI yet (Phase 2).

## [2026-03-03] Dev/Prod App Identity
- **Implemented:** `2_Build_APK_Local.bat` → Arteria (prod), `com.anonymous.arteria`. `1_Run_Local_Android_Build.bat` → Arteria-dev, `com.anonymous.arteria.dev`. Both can coexist on same device. `app.config.js` reads `ARTERIA_LEAN_PROD`; batch scripts run `expo prebuild --clean` only when switching modes (tracked by `android/.arteria-build-mode`). EXPO_GUIDE §5b, STYLE_GUIDE §7, SUMMARY updated.

## [2026-03-03] Quick-Switch Sidebar
- **Implemented:** Floating pill on left edge when in skill screen. Tap opens slide-in drawer. Jump between Mining, Logging, Fishing, Runecrafting. Active skill gold highlight. Reanimated spring, LinearGradient, skill-specific colors. QuickSwitchContext + QuickSwitchProvider. Shared constants/skills.ts (SKILL_META, IMPLEMENTED_GATHERING_SKILLS). index.tsx now imports from shared constants. (v0.3.0)

## [2026-03-03] Random Events Expanded
- **Added 3 events:** Genie's Gift (level×10 XP to random trained skill), Treasure Chest (gold scaling with level), Lucky Strike (double XP this tick). Now 5 events total. Offline accumulator includes bonus XP for WYWA modal.
- **Groundwork:** `constants/randomEvents.ts` (RANDOM_EVENT_CHANCE_BASE, COOLDOWN, BLIBBERTOOTH_XP_MULTIPLIER, RANDOM_EVENT_TYPES). `player.randomEvents` in Redux (lastTriggeredAt, ticksSinceLastEvent, completedCount). `recordRandomEventTriggered` reducer. Migration for existing saves.
- Random Events MVP. AI versioning reminder in doc heads. (v0.3.0)

## [2026-03-03] Random Events Design Proposal
- **Source:** RuneScape wiki (runescape-wiki__w_Random_events.html) + DOCU (MASTER_DESIGN_DOC, My_Thoughts, ROADMAP).
- **FUTURE_NOTES.md:** New "Random Events — Design Proposal" section. RS inspiration (Gift Givers, Skill Guardians, Puzzles, Hazards). Arteria ideas: Blibbertooth Blessing, Cosmic Sneeze, Genie lamp (MVP); dialogue randoms (Mysterious Stranger, Nick's Cousin); skill guardians post-combat; hazard events. Phased rollout + technical hooks (per-tick roll, player.randomEvents state, offline cap).
- **ROADMAP.md:** New "Random Events" subsection under QoL with MVP, dialogue randoms, skill guardians, hazard events.

## [2026-03-03] Feedback Toast System & Theme Engine Docs
- **Feedback Toast:** Replaced system `Alert.alert()` with in-game stylized toasts for locked, no essence, level req. New `FeedbackToast.tsx`, `useFeedbackToast` hook, Redux `feedbackToastQueue` + `pushFeedbackToast`/`popFeedbackToast`. Variants: locked (red), warning (gold), error (red), info (blue). Mining, Logging, Fishing, Runecrafting screens now use `showFeedbackToast()`. Confirm Task Switch in `useRequestStartTask` still uses Alert (requires user choice).
- **Theme Engine (documented):** Added full implementation & refactor effort to FUTURE_NOTES.md. Covers ThemeContext, PALETTES.dark/light, useTheme(), Settings UI, MMKV persistence, ~30-file component migration scope. Estimated 11–14h total. Do not build yet.

## [2026-03-03] Info Scraper Tool
- **tools/info_scraper:** Standalone Playwright-based scraper with lightweight GUI. Express server (port 3847), single-page form: enter URL → Scrape → preview → Save to output/. Docs in tools/info_scraper/docs/.

## [2026-03-03] Settings Touch Fix & Runecrafting Requirements
- **Settings touch bug:** Whole row now pressable for toggle rows. Wrapped SettingsRow in Pressable when it has a Switch; Switch is display-only (pointerEvents="none" wrapper) so row press toggles. Fixes dead zones where only the Switch area responded.
- **Runecrafting requirements indicator:** Added reqBadges row on each altar card: Lv. X (✓ when met), essence emoji + N/batch, 📖 Story when narrative-locked. Styles: reqBadgeLocked, reqBadgeEmpty for out-of-essence.
- **STYLE_GUIDE.md:** Created with trace tags, line/function limits, comment prefixes, touch targets, requirements indicators, theme tokens.

## [2026-03-03] R8 Optimization Tuning (proguard-android-optimize.txt)
- **Context:** Reviewed [Enable app optimization with R8](https://developer.android.com/topic/performance/app-optimization/enable-app-optimization) and [Adopt optimizations incrementally](https://developer.android.com/topic/performance/app-optimization/adopt-optimizations-incrementally).
- **Current:** `apps/mobile/android/gradle.properties` already has `android.enableMinifyInReleaseBuilds=true` and `android.enableShrinkResourcesInReleaseBuilds=true` — R8 minification and resource shrinking are ON.
- **Fix applied:** Switched `proguard-android.txt` → `proguard-android-optimize.txt` in `apps/mobile/android/app/build.gradle`. The non-optimize file includes `-dontoptimize`, which disables method inlining, class merging, etc. The optimize file enables full R8 optimizations for smaller APKs and faster runtime.
- **If crashes occur:** Use incremental adoption: add `-dontobfuscate` and `-dontoptimize` to proguard-rules.pro temporarily, or `android.enableR8.fullMode=false` in gradle.properties. See Android docs for package-wide keep rules.

## [2026-03-03] Easter Egg, Notifications & Idle Soundscapes (in 0.2.7)
- **Don't Push This:** New "Easter Egg" section in Settings. Button "Don't Push This"; each press increments `player.dontPushCount`. At 1000 presses unlocks title "The Stubborn" (stored in `player.unlockedTitles`). Redux: `incrementDontPushCount`, `dontPushCount`, `unlockedTitles` in player state and migration.
- **Notifications:** Level Up Alerts, Task Complete, and **Idle Cap Reached** toggles wired to Redux (`notifyLevelUp`, `notifyTaskComplete`, `notifyIdleCapReached`). `utils/notifications.ts`: schedules local "Idle cap reached" when app goes to background (trigger = lastSaveTimestamp + capMs); cancels when app returns. `usePersistence` calls `scheduleIdleCapReachedIfEnabled` on background and `cancelIdleCapNotification` on foreground. expo-notifications already in package.json.
- **Idle Soundscapes:** New Settings → Audio toggle "Idle Soundscapes" (persisted `idleSoundscapesEnabled`). Stub hook `useIdleSoundscape(soundscapeId)` in `hooks/useIdleSoundscape.ts` for skill screens to plug in ambient loops (e.g. forge, waves) — no audio yet, ready for expo-av.
- **Version:** All updates kept in **0.2.7** (big update). CHANGELOG, patchHistory, SUMMARY, app.json set to 0.2.7.

## [2026-03-03] Settings: Confirm Task Switch & Battery Saver
- **Confirm Task Switch:** New setting in Settings → Gameplay. When enabled, starting a different task (e.g. switching from Mining to Logging) shows an Alert "Switch task?" before applying. Implemented via `useRequestStartTask` hook; Mining, Logging, Fishing, Runecrafting screens use it instead of dispatching `startTask` directly.
- **Battery Saver:** New setting in Settings → Gameplay. When enabled, after 5 minutes with no touch a true-black dim overlay is shown; any touch dismisses it. Implemented in `BatterySaver.tsx` (root layout wrapper), interval check every 30s, persisted in `player.settings.batterySaverEnabled`.
- **Redux:** `gameSlice` — added `confirmTaskSwitch` and `batterySaverEnabled` to settings type, `createFreshPlayer`, `migratePlayer`, and reducers `setConfirmTaskSwitch`, `setBatterySaverEnabled`. Exported `ActiveTask` for the hook.
- **Docs:** CHANGELOG, patchHistory, SUMMARY kept at v0.2.7 as current release; Confirm Task Switch & Battery Saver recorded under Unreleased.

## [2026-03-03] Quest Expansion (RuneScape-Inspired)
- **Quest model:** Extended `Quest` in `story.ts` with `questType` ('main' | 'radiant' | 'character') and `difficulty` ('novice' | 'intermediate' | 'experienced' | 'master').
- **Quest data:** Added 17 new quests in `packages/engine/src/data/quests.ts`. Act 1: A Merchant's Trust, First Catch, Wood for the Guard, Rune Awakening, Fish for the Guard, Logs for the Tavern, Ore Delivery, The Cursed Sample, Essence Runner, Nick's Shopping List, First Runes, Blibbertooth's Blessing, The Essence Run, Herring for the Tavern, Coal for the Smith. Act 2: Voices in the Void, Pure Essence, Gold Rush. All use existing skills, items, and flags.
- **QuestsScreen:** Available list now filtered by `meetsNarrativeRequirement(player, q.requirements)`. Added difficulty badges (novice/intermediate/experienced/master) on Available quest cards.
- **Engine exports:** `meetsNarrativeRequirement` and story types (`Quest`, `QuestType`, `NarrativeRequirement`, `NarrativeReward`) exported from `packages/engine/src/index.ts`.

## [2026-03-03] Android Build Fix (Toolchain + Bundling)
- **Status:** Resolved.
- **Fix 1 (Toolchain):** Forced `org.gradle.java.home` to JDK 21 in `gradle.properties` to fix missing `[JAVA_COMPILER]`.
- **Fix 2 (Bundling):** Corrected relative import paths desync in `DialogueOverlay.tsx` and constants. Depth was 4 dots (depth 4) in files only at depth 3.

## [2026-03-03] Runecrafting Skill — Full Implementation
- **constants/runecrafting.ts:** 14 RuneAltar data entries (Air → Void). Death altar requires `knows_about_sneeze_cult`, Soul/Void require `act3_unlocked`. Each altar defines `essenceType`, `essencePerBatch`, `runesPerBatch`, `outputRuneId`.
- **constants/mining.ts:** Added 3 new veins — Rune Essence (Lv1), Pure Essence (Lv30), Cosmic Shard Vein (Lv65, narrative-gated `act3_unlocked`).
- **constants/items.ts:** Added `'rune'` to `ItemType`. Registered 3 essence items + 14 rune items with flavour descriptions.
- **store/gameSlice.ts:** Added `'runecrafting'` to `SkillId` and `ALL_SKILLS`. Added `removeItems` reducer for consuming essence during crafting.
- **packages/engine/src/types.ts:** Added `'runecrafting'` to engine `SkillId` type to keep types in sync.
- **hooks/useGameLoop.ts:** Extended `ActionDef` with `consumedItems?: ...`. `processDelta` now clamps ticks to affordable batches, dispatches `removeItems`, and auto-stops the task when essence runs out. Added `inventoryRef` to avoid stale closures. Registered `RUNE_ALTARS` in `ACTION_DEFS`.
- **app/skills/runecrafting.tsx:** Full skill screen — essence stock display header, altar cards grouped by tier (Standard / Elemental / Cosmic), rune output preview badge, red "No Essence" state, narrative gating, purple flash on craft, smooth progress bar.
- **app/(tabs)/index.tsx:** Added `runecrafting` to `SKILL_META` and `IMPLEMENTED_SKILLS`.
- **app/(tabs)/bank.tsx:** Added Fish and Runes filter tabs.
- **NOTE:** Fishing screen (`app/skills/fishing.tsx`) also fully implemented this session.

**Active Task (previous):** Logging skill chopping bug fixed.

## [2026-03-03] Logging Skill — Chopping Broken Bug Fix
- **Root Cause:** `useGameLoop.ts` only registered `MINING_NODES` in `ACTION_DEFS`. When a logging action (e.g. `normal_tree`) tried to look up its node definition, `ACTION_DEFS[activeTask.actionId]` returned `undefined` and `processDelta` silently returned early — no XP, no items, nothing.
- **Fix:** Imported `LOGGING_NODES` from `@/constants/logging` and spread them alongside `MINING_NODES` into `ACTION_DEFS` via `[...MINING_NODES, ...LOGGING_NODES].forEach(...)`.
- **File changed:** `apps/mobile/hooks/useGameLoop.ts`
- **Note:** Any future skill (fishing, harvesting, etc.) must also be added to this `ACTION_DEFS` registration block when its screen is activated.

**Active Task (previous):** Architecting the story and quest system (Phase 6 pre-planning), identifying style and narrative structures based on STORYLINE.md and MASTER_DESIGN_DOC.md.

## [2026-03-02] Skills Screen Layout Refactor (RS Style)
- **Grid Layout:** Converted the `index.tsx` skills screen from a pillar-based list into a dense, 3-column grid layout inspired by RuneScape's skills interface.
- **Skill Box Design:** Each skill now renders as a compact gold-bordered box showing its icon, current level, and the maximum level (99).
- **Total Level Formatter:** Updated the "Total Lv." header to display as `current / max` (e.g., `120 / 1485`), calculating the `maxTotalLevel` by restricting each of the 15 skills to a maximum of 99.

## [2026-03-02] Narrative & Storyline Architecture
- **Focus:** Began breaking down `STORYLINE.md` and `MASTER_DESIGN_DOC.md` to design the technical architecture for the game's story system.
- **Data Models:** Created `packages/engine/src/data/story.ts` defining TypeScript interfaces for `Quest`, `DialogueNode`, `DialogueOption`, `NarrativeRequirement`, `NarrativeReward`, and `PlayerNarrativeState`. Added initial story data `data/quests.ts`.
- **Redux & Engine Integration:** Added `narrative` to `PlayerState` globally (`gameSlice.ts` and `types.ts`). Initialized `flags`, `activeQuests`, and `completedQuests` on fresh saves and built a backwards-compatible migration for existing local saves. Exposed RTK reducers for `setNarrativeFlag`, `startQuest`, `completeQuestStep`, and `completeQuest`.
- **Lore UI Layer:** Built a dedicated `QuestsScreen` in `app/(tabs)/quests.tsx`. This screen live-reads Redux `narrative` state against the unified `ALL_QUESTS` engine data and sorts them automatically into Available, Active, or Completed sections. Added a `💬 Talk` button to `shop.tsx` allowing players to natively converse with Nick using the engine. Mapped the screen into Expo Router in `_layout.tsx`.
- **Dialogue Engine:** Setup `activeDialogue: { treeId, nodeId }` inside `gameSlice.ts`. Engineered `components/DialogueOverlay.tsx` which sits globally in the `root _layout.tsx`, listening to the State. You can parse complex choice/branching dialogues now.
- **Narrative Gating:** Created `meetsNarrativeRequirement` utility in the engine. It parses flags, skills, inventory limits, and completed quests. Wired this into `MiningScreen` to conditionally lock `Runite Vein` (now requires knowing about the sneeze cult). Wired this into `DialogueOverlay` to grey out dialogue options the player does not meet the requirements for.
- **Act 1 Foundation:** Setup `data/dialogues.ts` and `data/quests.ts` with "The Cosmic Sneeze". Added a dev button on the Quests screen to launch the first branch.
- **Goal:** Implement the "Cosmic Comedy" tone and the Act I-IV structure into the game's Redux state, dialogue UI, and quest engine.
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
> 2. **Versioning & Update Board:** When shipping a new feature phase, bump the version in `apps/mobile/app.json`. The user sees the **Update Board** (in-app changelog modal) upon relaunch when `lastSeenVersion !== currentVersion`. Update the hardcoded changelog inside `apps/mobile/components/UpdateBoard.tsx` for whatever features you just built.
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
