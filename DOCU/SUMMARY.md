# SUMMARY

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When implementing new features, ALWAYS update:** (1) **Update Board** (`apps/mobile/components/UpdateBoard.tsx`) — in-app changelog modal; (2) **Website** (`index.html` §Changelog); (3) **patchHistory.ts** — Patch Notes screen; (4) **CHANGELOG.md**; (5) **app.json** version. See SCRATCHPAD §Versioning.

**Project:** Arteria — The AFK RPG

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
| **CHANGELOG.md** | Version history (Keep a Changelog format). |
| **FUTURE_NOTES.md** | Research & forward planning (SDK 55 migration, MMKV, game loop patterns). |
| **PEOPLE_TO_ADD.md** | Names for future inclusion in the game (NPCs, credits, companions, etc.) — reference only. |
| **My_Thoughts.md** | Decisions & rationale (e.g. EAS build times, Fast Refresh). |
| **STACK_ASSESSMENT.md** | Current architecture snapshot, versions, and future dependencies. |
| **SBOM.md** | Security Bill of Materials — packages, versions, update tracking. |
| **EXPO_GUIDE.md** | Expo/EAS workflow, CNG, when to build vs OTA, monorepo config. |
| **MY_ADHD.md** | Quick Q&A for deployment and testing. |
| **zhipu-ai.md** | Baseline feature sheet for Melvor-like core engine, skills, combat, economy. |
| **IMPROVEMENTS.md** | Systems audit + prioritized UX/GUI/feature improvements (quick wins, polish, larger features). |
| **STYLE_GUIDE.md** | Project conventions: trace tags, limits, naming, touch targets, theming (useTheme + migration pattern). |
| **THEMING.md** | Theme architecture: PaletteShape, THEMES registry, ThemeContext, migration path. |
| **zhip-ai-styling.md** | UI/UX style guide (Melvor-like): layout, colors, components, screens. |
| **tools/info_scraper/** | Web scraper with GUI — fetch URLs, save content. See `tools/info_scraper/README.md`. |
| **debugs/** | Issue tracking (e.g. `audit-2026-02-26.md`). |
| **README.md** (root) | User-facing project intro; links to DOCS. |
| **tests/README.md** | Test suite structure, commands (test, test:coverage, test:engine, test:suite), 80% coverage target. |
| **apps/mobile/README.md** | Expo app quick start (boilerplate). |

*Doc updates: add to top; never delete. Refresh stale sections when touching a doc. **Always be documenting** — keeps AI and humans in sync during creative work.*

**Styling & theme docs:** STYLE_GUIDE (§7 Theming, §9 Tokens), THEMING.md (architecture, migration pattern), zhip-ai-styling.md (visual/UX reference).

**Version scheme:** 0.x.x. Current **0.4.1** "The Anchor Man" (Cooking, Bestiary stub, Goblin, main character). Post-0.4.1: polish, bestiary groundwork, docs viewer, companion Leadership unlocks, SFX (tink/thump/splash), Test sound in Settings (2026-03-04–05).

**Dev/Prod coexistence:** `2_Build_APK_Local.bat` → Arteria (prod). `1_Run_Local_Android_Build.bat` → Arteria-dev, so both can be installed. `app.config.js` reads `ARTERIA_LEAN_PROD`; batch scripts run prebuild when switching modes. See EXPO_GUIDE §5b, STYLE_GUIDE §7. Restructured from 0.4.x on 2026-02-28 so versioning reflects early-stage development. See CHANGELOG.md.

**Post-0.4.1 (2026-03-04–05):** **SFX:** expo-audio, generated tink/thump/splash WAVs (`scripts/generate-sounds.js`), `utils/sounds.ts` (`useSfx`, `playForSkill`), play on skill tick via `useGameLoop` `onTickComplete`; Settings → Audio "Test sound" row. **Docs viewer:** index.html Docs nav opens in-page modal (marked.js, sidebar: Summary, Roadmap, Architecture, etc.). **Companions:** COMPANIONS.md; Leadership-based unlocks (Barnaby 20, Yvette 35, Reginald 50); companion leveling design. **Polish:** Bank "Used in", Combat teaser, idle cap notification fix (cancel on mount when active). **Bestiary groundwork:** EnemyDrop/Location/CombatStats; Goblin/Slime/Wolf. **Login bonus UX:** Banner reward text; FeedbackToast on claim.

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
- **Phase 1 Complete:** Engine, native pipeline, save/load, real-time loop, offline catchup.
- **v0.4.0 QoL + Daily & Lumina:** Daily quests (3/day, reset midnight, Claim gold/Lumina). Detailed Stats tab (gathered by type, play time). Custom bank tabs (+ Tabs, assign from item detail). Sell All Junk (configurable junk, button in Bank). Login bonus (7-day streak, banner on Skills, Settings section). Lumina currency (Bank/Shop/Settings; day 7 bonus).
- **v0.3.0 UX + Quest + Mastery:** Bank sort/empty state, Shop Buy 25/50/Max. Quests: real completion (rewards when all steps done); **quest step auto-complete** (engine completionRequirements + getQuestStepsToComplete; app dispatches completeQuestStep). **Mastery:** 1 pt/level-up, spend in Settings → Mastery for +% XP buffs.
- **v0.2.6 (Lore Expansion):** Branching NPC dialogue, universal quest ledger, narrative gating for skilling nodes.
- **v0.2.5 (Build & Release):** Smaller APKs (ABI split, lean prod). AnimatedNumber, BouncyButton, ActivePulseGlow, tick shake.
- **v0.2.4 (Premium UI):** AnimatedNumber, BouncyButton, ActivePulseGlow, tick shake.
- **v0.2.3 (Horizon & Logging):** Logging UI, Shop 50% sell, Curse system, Horizon HUD, rare gems, mythic fish, Seasonal Rotation, Patch Notes.
- **v0.2.2 (Juice):** Bank search/filters, Train Toast, pulsing tab glow, Loot Vacuum, XP Bar Pulse, Haptic Heartbeat, SmoothProgressBar.
- **v0.2.1 (Immersion):** Global Action Ticker, Header XP dashboard, MaterialCommunityIcons, edge-to-edge.
- **v0.2.0 (Pipeline & Gathering):** Gradle, prebuild, Melvor palette, core loop, Mining, Skill Pillars, Total Level, XP tracking.

**Next Steps (Phase 3–4):**
- Finalize gathering pillar balancing and drop tables.
- Combat system alpha: loadouts, weapon stats, health/damage infrastructure (see ROADMAP Phase 4). Combat deferred to later.

