# SUMMARY

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When implementing new features, ALWAYS update:** (1) **Update Board** (`apps/mobile/components/UpdateBoard.tsx`) — in-app changelog modal; (2) **Website** (`index.html` §Changelog); (3) **patchHistory.ts** — Patch Notes screen; (4) **CHANGELOG.md**; (5) **app.json** version. See SCRATCHPAD §Versioning.

**Project:** Arteria — The AFK RPG

---

## 📚 Source of Truth

All design, philosophy, and architectural decisions flow from two primary documents:

- **[TRUTH_DOCTRINE.md](TRUTH_DOCTRINE.md)** — The ultimate source of truth. Core philosophy, behavioral protocols, and developer mandates for both humans and AI.
- **[MASTER_DESIGN_DOC.md](MASTER_DESIGN_DOC.md)** — Complete game design document. Full skills, systems, mechanics, lore, and monetization strategy.

These two documents are the authoritative references. All other docs supplement them.

---

## 📚 Documentation Index (All Docs)

| Doc | Purpose |
|-----|---------|
| **SUMMARY.md** | This file — project status, quick links, doc index. |
| **ROADMAP.md** | Phased feature roadmap (Phases 0–9+). Do not delete items; only append or mark done. |
| **ARCHITECTURE.md** | Tech stack, monorepo layout, data flow, offline progression, Babel/Metro notes. |
| **MASTER_DESIGN_DOC.md** | Full game design (Aetheria: world, skills, combat, economy, narrative, monetization). |
| **COMPANIONS.md** | Wandering Souls: roster, roles (Auto-Gather, Auto-Craft, Combat), traits, Leadership gates, companion leveling (levels like player for skilling/crafting/collecting). |
| **SCRATCHPAD.md** | Active task, history, next steps, blockers. Compact at 500 lines. |
| **TECHNICAL_USER_MANUAL.md** | Comprehensive engine taxonomy and technical subsystems guide. |
| **CHANGELOG.md** | Running version history. (Keep a Changelog format). |
| **FUTURE_NOTES.md** | Research & forward planning (SDK 55 migration, MMKV, game loop patterns). |
| **PEOPLE_TO_ADD.md** | Names for future inclusion in the game (NPCs, credits, companions, etc.) — reference only. |
| **My_Thoughts.md** | Decisions & rationale (e.g. EAS build times, Fast Refresh). |
| **STACK_ASSESSMENT.md** | Current architecture snapshot, versions, and future dependencies. |
| **SBOM.md** | Security Bill of Materials — packages, versions, update tracking. |
| **EXPO_GUIDE.md** | Expo/EAS workflow, CNG, when to build vs OTA, monorepo config. |
| **MY_ADHD.md** | Quick Q&A for deployment and testing. |
| **zhipu-ai.md** | Baseline feature sheet for Melvor-like core engine, skills, combat, economy. |
| **IMPROVEMENTS.md** | Systems audit + prioritized UX/GUI/feature improvements (quick wins, polish, larger features). |
| **CURRENT_IMPROVEMENTS.md** | Expansion opportunities using existing systems — what to add next without new architecture. |
| **CLICKER_DESIGN.md** | Clicker (Resonance) design: layout, styling, tech, direction, crossover (§1–6). §7: broaden/deepen ideas (world state, seasonal, chaos, companions, chronicle, minigame framework, accessibility, economy) with source refs. See MASTER_DESIGN_DOC §1.3. |
| **WORLD_EXPLORATION.md** | Explorative world design for Arteria — idle-friendly locations (Frostvale, Fey Markets, etc.), instant travel, seasonal unlocks. |
| **SKILLS_ARCHITECTURE.md** | Pre-implementation design for Farming, Agility, Thieving, Crafting. Patches, courses, targets, recipes. Implementation order. |
| **ORE_CHAIN_EXPANSION.md** | Depth options for Mining/Smithing/Forging: Runite forging, weapon types (dagger, shortsword, longsword, scimitar, 2H Longblade), gems, pickaxes, fuel crossover, scrap recycling, Heat Management, Quirks. |
| **FLETCHING_TAILORING.md** | Future skills: Fletching (arrows, bows from logs) and Tailoring (gloves, hats, shoes, boots from cloth). Implementation order, data structures, crossover. |
| **MASTER_DESIGN_DOC.md** | **v2.0 — The Expanded Cosmos.** Comprehensive GDD organized in 7 Parts, 21 Chapters. **New Chapter 2: Skills Overview** — complete encyclopedia of 10 implemented + 7 coming soon + 8+ planned skills with detailed descriptions, crossover connections, and pets. New systems: Absurdity/Chaos Theory, World State/Corruption, Prestige/Transcendence, Housing/Sanctum, Chronicle System, Three Stomach consumption, Equipment Quirks.
| **STYLE_GUIDE.md** | Project conventions: trace tags, limits, naming, touch targets, theming (useTheme + migration pattern). |
| **THEMING.md** | Theme architecture: PaletteShape, THEMES registry, ThemeContext, migration path. |
| **zhip-ai-styling.md** | UI/UX style guide (Melvor-like): layout, colors, components, screens. |
| **tools/info_scraper/** | Web scraper with GUI — fetch URLs, save content. See `tools/info_scraper/README.md`. |
| **debugs/** | Issue tracking (e.g. `audit-2026-02-26.md`). |
| **README.md** (root) | User-facing project intro; links to DOCS. |
| **tests/README.md** | Test suite structure, commands (test, test:coverage, test:engine, test:suite), 80% coverage target. |
| **apps/mobile/README.md** | Expo app quick start (boilerplate). |

*Doc updates: add to top; never delete. Refresh stale sections when touching a doc. **Always be documenting** — keeps AI and humans in sync during creative work.*

**Styling & theme docs:** STYLE_GUIDE (§7 Theming, §9 Tokens), THEMING.md (architecture, migration path), zhip-ai-styling.md (visual/UX reference).

**Version scheme:** 0.x.x. Current **0.6.0** "The Ascended Master". Post-0.6.0: Companion AI behavior, Slayer shop, Summoning special moves.

**v0.6.0 (2026-03-08) — The Ascended Master:**
- **Stability Patch**: Resolved a critical ReferenceError where `TextInput` was not imported in the skills panel search bar.
- **Magic Hub Dashboard**: Redesigned home screen featuring magical portal buttons and a centralized game overview.
- **Thieving Skill**: Implement pickpocketing and stall looting mechanics with failure/stun risk.
- **New Skill: Agility**: Run 6 obstacle courses for passive bonuses.
- **Skill Capes**: Mastery Skill Cape shop (Lv. 99 only).
- **Skills Page QoL**: Pillar grouping, inline progress bars, mastery level badges, and magical search bar.
- **The Chronicles**: Native in-app changelog viewer to see total project history.
- **Slayer & Summoning**: Task assignment via Master Mark and 5 binding pouches (Wolf, Dreadfowl, Bull, Spider, Badger).
- **Companion System**: Hiring system for Barnaby and Garry the Guard.
- **Crafting**: Leather armour and jewelry (rings/amulets).
- **UI & Navigation**: Skills grid relocated to a dedicated tab to make room for the Hub dashboard.

**Play Store build (2026-03-05):** Run `4_Build_Play_Store_Cloud.bat` for AAB output. No phone or local SDK required — builds in EAS cloud. See EXPO_GUIDE §4a.

**v0.5.3 (2026-03-06) — The Legion & The Soul:** **New Skills Implementation:** Added- **Slayer & Summoning (0.5.3):** Groundwork for combat tasks and familiar binding.
- **Complete Skill Registry (0.5.3):** Added all 34 planned skills to the engine and UI.
- **Level-Up Toast Fix:** Sticky notifications resolved. **Slayer:** Task assignment via "Master Mark" NPC dialogue, new enemies (Crawling Hand, Banshee), Slayer Coins. **Summoning:** 5 binding pouches (Wolf, Dreadfowl, Bull, Spider, Badger), integrated supplies shop, "Elder Spirit-Speaker" dialogue. **Companions:** Hiring system for Barnaby and Garry the Guard; new early-game companion Garry. **UI Fix:** Refactored Level Up Toast to prevent stuck notifications.

**v0.5.2 (2026-03-06) — The Celestial Expansion:** **New Skill: Astrology:** Fully implemented Astrology skill screen with 4 constellations (Deedree, The Anchor Eternal, The Void Fish, The Lumina Tree). **New Items:** Stardust, Golden Stardust, and Meteorite. Integrated Astrology into the core game loop with XP, ticks, and mastery progression. **UI/UX:** Fixed critical linting errors and unified skill navigation for Astrology.

**v0.5.1 (2026-03-06) — THE 0.5.1 extended update directors cut remix - alpha:** **Technical User Manual:** Formalized the documentation of the Arteria program stack. Defined the 11 core engines (Arteria-game-engine, Arteria-tick-orchestrator, etc.) and provided a technical taxonomy. **Premium Theme & Achievement:** Added Midnight theme, Achievement expansion (16 total), new gameplay toggles (Haptics, Shake, Floating XP). **UI Enhancements:** Unified skill header navigation with alphabetical cycling. "Enhanced!" UI badges for icon-based skills (Mining, Logging). Stats screen overhaul ("The Tome of Records"). Bank OSRS redesign. **Skills Expanded:** Harvesting, Scavenging, Herblore, Forging, Runecrafting. **Combat Alpha:** Fully playable loop with prayers and bestiary. **Infinite Equipment Refining:** Merge 10 identical equipment items into scaled +1 variants with dynamic stats.

**Post-0.4.2 (2026-03-05):** **OTA Pipeline Hardened:** `expo-updates` explicit plugin with `checkAutomatically: ON_LAUNCH`. `runtimeVersion` switched from static `"1.0.0"` to version-matched `"0.4.2"` (static string required for EAS bare workflow). ABI splits config plugin (`plugins/withAbiSplits.js`) survives `expo prebuild --clean`. `proguard-android-optimize.txt` for full R8. `versionName` synced to `0.4.2`. Settings → About: "Check for Updates" row with status/error/restart. `Rollback_OTA.bat` for emergency rollbacks. **⚠️ Rebuild APK required** to bake in new runtimeVersion + config plugin. **Skill Pets:** 7 pets with rare drops, Pets screen, active emoji. **SpecialMessageModal:** Premium animated modal; fixed `useNativeDriver` conflict (outer-native/inner-JS split). **UI Polish:** Resolved Cooking crash (missing Radius), Bank filter pill stretching, and missing tab icons.

**v0.4.1 (2026-03-03) — The Anchor Man:** Main character & nickname (The Anchor, NameEntryModal, Settings → Character). Goblin first random enemy + GoblinPeekModal. **Cooking** skill (10 fish→cooked recipes). **Bestiary stub** (Combat tab Enemies Spotted). Bank fix (ScrollView).

**v0.4.0 (2026-03-03) — Daily, Stats & Lumina:** Daily quests (3/day, reset midnight, Claim gold/Lumina). Stats tab (gathered by type, play time). Custom bank tabs (+ Tabs, assign from item detail). Sell All Junk (configurable). Login bonus (7-day streak, banner on Skills). Lumina currency (Bank/Shop/Settings; day 7 bonus). Shop Lumina stub.

**v0.3.0 (2026-03-03) — The Big Update:** Theme Engine (picker, tab bar, headers, StatusBar). Quick-Switch Sidebar. Smithing (smelting) + Forging (bars → equipment). Random Events (Blibbertooth, Cosmic Sneeze, Genie, Treasure Chest, Lucky Strike). All consolidated from 0.2.8–0.2.11.

**v0.2.7 (2026-03-03) — big update:** Fishing and Runecrafting skills; action consumption in the game loop; Bank filters for fish/runes; new Mining essence veins. Settings: **Confirm Task Switch**, **Battery Saver**, **Horizon HUD** (toggle to hide the 3 goal cards under XP bar), **Notifications** (Level Up, Task Complete, **Idle Cap Reached** with local scheduling), **Idle Soundscapes** (stub hook). **Easter egg** "Don't Push This" (1,000 presses → title "The Stubborn"). All persisted.

**Quest expansion (2026-03-03):** Many RuneScape-inspired quests added (17 new quests across Act 1 and Act 2). Quest model extended with `questType` and `difficulty`; Available list gated by narrative requirements; difficulty badges on cards.

**v0.2.6 (2026-03-02):** The Lore Expansion. Branching NPC dialogue, global DialogueOverlay, Universal Quests Ledger Tab. Narrative gating implemented for Skilling nodes and Dialogue choices. Glassmorphism added to website.

**v0.2.5 (2026-02-28):** Build & Release. Smaller release APKs.

**Build (2026-02-27):** EAS hit account concurrency limit (builds queue). **Use local APK build:** `2_Build_APK_Local.bat` from repo root. Release now outputs split APKs: `app-arm64-v8a-release.apk` (~31 MB) and `app-armeabi-v7a-release.apk` (~25 MB) in `apps\mobile\android\app\build\outputs\apk\release\`. Prefer arm64 for modern phones. Script also sets `ARTERIA_LEAN_PROD=1` to exclude Expo dev-client native modules during release autolinking. See EXPO_GUIDE §4b.

**Entry point (2026-02-26):** If you start the dev server from the repo root, root `package.json` now has `"main": "apps/mobile/index.js"` so Metro uses Expo Router instead of the default AppEntry (which expected a root `App`). Prefer running from `apps/mobile` (e.g. `0_Start_Dev_Server.bat` or `npm run mobile`).

**Local APK build (2026-02-27):** `2_Build_APK_Local.bat` produces release APKs without a connected device. Uses `gradlew assembleRelease` from `apps\mobile\android`. Root `index.js` redirects Metro (which resolves from Arteria) to `apps/mobile/index.js`. Output folder: `apps\mobile\android\app\build\outputs\apk\release\` with split APKs (`app-arm64-v8a-release.apk`, `app-armeabi-v7a-release.apk`).

**Platform:** Modern Android (React Native via Expo SDK 54)
**Timeline Base:** February 26, 2026

**Overview:**
A math-heavy, passive progression RPG without real-time action gameplay. The core loops rely heavily on state management, background calculation of offline progress, and optimizing "Ticks" for skills and combat. Inspired by Melvor Idle.

**Main character (2026-03-03):** The protagonist is "The Anchor" (canonical name). On first start, player sets a nickname (or skips to use canonical). Settings → Character: change nickname. Skills header: "Welcome, {displayName}". `constants/character.ts`, `NameEntryModal`, `getDisplayName()`.

**Main character & nickname (2026-03-03):** Protagonist is "The Anchor" (canonical name). On first start, NameEntryModal prompts for nickname (what friends call you); Skip uses canonical. Settings → Character: change nickname. Skills header: "Welcome, [displayName]". `constants/character.ts`, `getDisplayName()`.

**First random enemy (2026-03-03):** Goblin — new "Goblin Peek" random event during skilling (toast + activity log). **GoblinPeekModal** shows goblin SVG artwork when event fires; react-native-svg + transformer. Asset: `goblin_1.svg` (root + `apps/mobile/assets/images/`). `constants/enemies.ts` defines Goblin as first enemy for future Phase 4 combat/bestiary. **Bank fix:** Missing ScrollView import caused crash; fixed.

**Where we can go from here (quests & skills):**
- **More quests:** Act III story quests; radiant/repeatable quests (e.g. "Bring Nick 10 copper" on cooldown). Reuse existing step auto-complete and hand-in flow.
- **More skills:** Data + UI for **Cooking** (fish/meat → food, healing/boosts), **Harvesting** (gather herbs/plants), **Scavenging** (random loot tables). ROADMAP already lists these; implement in same pattern as Mining/Logging/Fishing (nodes, ticks, bank).
- **Crafting queue / Alchemy:** Phase 3 items; cross-skill dependencies. Combat deferred until core skilling/quest loop is rich.

**Current Status (Phase 2.3 — Lore & Progression):**
- **v0.4.2 Skill Pets & OTA Polish:** Rare skilling companions (Rocky, Timber, etc.), Pets screen, active pet emoji. Integrated `expo-updates` + fixed OTA batch pipeline (CI/LeanProd). Premium `SpecialMessageModal`. Fixed Cooking crash & Bank UI bugs.
- **v0.4.1 The Anchor Man:** Cooking skill (10 fish), Goblin first enemy, nickname system (NameEntryModal).
- **v0.4.0 QoL + Daily & Lumina:** Daily quests, Stats tab, custom bank tabs, Sell All Junk, Login bonus, Lumina.
- **v0.3.0 UX + Quest + Mastery:** Bank sort/empty state, Shop Buy 25/50/Max. Quests: real completion (rewards when all steps done); **quest step auto-complete** (engine completionRequirements + getQuestStepsToComplete; app dispatches completeQuestStep). **Mastery:** 1 pt/level-up, spend in Settings → Mastery for +% XP buffs.
- **v0.2.6 (Lore Expansion):** Branching NPC dialogue, universal quest ledger, narrative gating for skilling nodes.
- **v0.2.5 (Build & Release):** Smaller APKs (ABI split, lean prod). AnimatedNumber, BouncyButton, ActivePulseGlow, tick shake.
- **v0.2.4 (Premium UI):** AnimatedNumber, BouncyButton, ActivePulseGlow, tick shake.
- **v0.2.3 (Horizon & Logging):** Logging UI, Shop 50% sell, Curse system, Horizon HUD, rare gems, mythic fish, Seasonal Rotation, Patch Notes.
- **v0.2.2 (Juice):** Bank search/filters, Train Toast, pulsing tab glow, Loot Vacuum, XP Bar Pulse, Haptic Heartbeat, SmoothProgressBar.
- **v0.2.1 (Immersion):** Global Action Ticker, Header XP dashboard, MaterialCommunityIcons, edge-to-edge.
- **v0.2.0 (Pipeline & Gathering):** Gradle, prebuild, Melvor palette, core loop, Mining, Skill Pillars, Total Level, XP tracking.

**Next Steps (Phase 4+):**
- **Combat System Alpha (Live ✅):** Auto-battler tick loop, combat UI (HP bars, attack timers, combat log, flee), zone selection, 7 enemies, equipment system verified. Working end-to-end.
- **Polish:** Food eating during combat (potion/food hotbar), auto-flee at HP threshold, "While You Were Away" combat report, loot popup/toast.
- **Enemy Scaling:** Ensure enemies calculate attack/defense equivalent to player logic. Add enemy attack speed variation.
- **Dungeons & Factions:** Dungeon modes (Delves, Expeditions), enemy factions, boss encounters.


