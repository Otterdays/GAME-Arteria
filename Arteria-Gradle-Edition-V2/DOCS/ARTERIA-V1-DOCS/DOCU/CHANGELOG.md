# CHANGELOG

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When adding a new release entry here, also update:** `UpdateBoard.tsx`, `index.html` §Changelog, `patchHistory.ts`, `app.json` version.

## [0.7.0] - 2026-03-22 — "Timelines & Alchemy"
### Added
- **Android Studio onboarding doc:** `DOCU/ANDROID_STUDIO_ONBOARDING.md` — explains why `apps/mobile/android` is absent after clone, `expo prebuild`, and opening `apps/mobile/android` (not `android/app`) in Android Studio. Linked from `SUMMARY.md` and `EXPO_GUIDE.md` §8.
- **Anchor Timeline Selection System:** Multi-slot character account system designed to isolate play sessions. Includes a dedicated `character-select.tsx` landing zone and upgraded multi-tenant save handling powered by the new anchor-based storage module.
- **Alchemy Skill Activated:** Added to `IMPLEMENTED_CRAFTING_SKILLS` and `SKILL_NAV_ORDER` indices for fully supported interface navigation and skill calculations.

### Security
- **Dependency Audit Suite:** Created `Audit_Deps.bat` and `DOCU/DEP_AUDIT_SUITE.md` to standardize dependency audits for AI agents and engineers.
- **Vulnerability Patch:** Patched 2 high severity vulnerabilities (`flatted`, `svgo`) via automated npm audit resolutions. SBOM has been updated.

### Fixed
- **Type Mismatch (`useGameLoop.ts`):** Added `'resonance'` to engine `SkillId` union to align with `gameSlice` PlayerState.
- **Path Resolution (`apps/mobile/tsconfig.json`):** Corrected `extends` path from `expo/tsconfig.base` to `../../node_modules/expo/tsconfig.base` for absolute monorepo pathing.
- **Phantom Type Safety:** Added `"types": []` to prevent auto-resolving missing `@types/hammerjs`.
- **Gradle Version Freeze:** Downgraded Gradle back from `9.0.0` to `8.13` to preserve `@react-native/gradle-plugin` API compatibility with `JavaVendorSpec`.

## [0.6.3] - 2026-03-22 — "The Queue"
### Added
- **Crafting Queue System:** You can now queue up multiple consecutive skilling or crafting actions. `useGameLoop.ts` has been supercharged with a robust `processQueueDelta` engine that securely processes multiple ticks inside an offline/background catch-up.
- **Crafting Queue UI Hub:** Added a Glassmorphic sticky queue manager featuring real-time timers, Estimated Time to Completion (ETC), and individual cancel buttons. Integrated persistently across crafting and artisan screens.
- **Offline Combat Record:** The While You Were Away (WYWA) report has been updated to capture and display enemies defeated off-screen.

## [0.6.2] - 2026-03-13 — "The Profile"
### Added
- **Profile screen:** Local-first account hub (Settings → Character → Profile). Identity (display name, patron, pet, total level, title), progress snapshot (gold, Lumina, combat stats, first/last played), rewards & entitlements (login streak, XP boost, expansions), quick actions (edit nickname, Pets, Expansions, Patch notes). Optional `selectedTitle` on `PlayerState` for displayed title; `setSelectedTitle` action.

## [0.6.1] - 2026-03-13 — "The Forge & The Bow"
### Added
- **Skill Capes Complete:** Added 10 missing skill capes (thieving, firemaking, exploration, wizardry, sorcery, resonance, farming, fletching, tailoring). All 27 implemented skills now have purchasable capes at Lv 99.
- **SKILL_CAPES.md:** Master reference document for the Skill Cape system — registry, vendor, cost, shop logic, future passive perks.
- **New Skill: Fletching:** Logs + feathers + bars → arrows and bows. 7 recipes (shafts, bronze/iron/steel arrows, oak shortbow, willow longbow). Mastery: XP, yield, speed, log saver. Feathers and cloth added to shop.
- **New Skill: Tailoring:** Cloth → gloves, cap, shoes, vest. 4 recipes. Mastery: XP, yield, speed, cloth saver. Cloth added to shop.
- **EquipSlot expansion:** Added `hands` and `cape` slots for cloth gloves and skill capes.
### Changed
- **Crafting UI Redesign v2.0:** Complete visual overhaul from category-card layout to **Radial Mastery** design. Circular recipe wheel with tier-based node positioning, center orb with XP ring, bottom detail panel. Competes with Woodworking workbench paradigm. Documented in `UI_REVISION_CRAFTING_v2.md`.
### Documentation
- **UI_REVISION_CRAFTING_v2.md:** Design doc for Crafting radial UI — rationale, layout, component breakdown.
- **FLETCHING_TAILORING.md:** Status updated to implemented.

## [0.6.0] - 2026-03-08 — "The Ascended Master"
### Added
- **Magic Hub Dashboard**: Redesigned home screen featuring magical portal buttons and a centralized game overview.
- **Thieving Skill**: Implement pickpocketing and stall looting mechanics with failure/stun risk.
- **The Chronicles**: Native in-app changelog viewer to see total project history.
- **Skills Page QoL**: Pillar grouping, inline progress bars, mastery level badges, and a new search bar.
- **Skill Capes**: Upon reaching Level 99 in a skill, you can now purchase a Mastery Skill Cape from the Ascended Master located directly in the Shop tab (99,000 gp each).
- **New Skill: Agility**: Run 6 obstacle courses (from Crownlands Rooftops to the Void Rift Traverse) to gain XP and passive buffs.
- **New Skill: Slayer**: Initial implementation with task assignment via "Master Mark" NPC.
- **New Skill: Summoning**: Bind nature spirits with charms and shards. Added 5 initial pouches (Wolf, Dreadfowl, Bull, Spider, Badger).
- **Summoning Shop**: Integrated supplies shop into the skill screen for convenience.
- **Companion System**: Hire wandering souls like Barnaby and Garry the Guard through the dialogue system.
- **New Enemies**: Crawling Hand (Lv. 5) and Banshee (Lv. 15) added to the world meta.
- **The Agora Shop Revamp**: Completely redesigned the merchant interface with premium glassmorphism, golden accents, and better item grouping.
- **New Skill: Crafting**: Full implementation of the Crafting skill. Turn raw leather hides into sturdy leather armour, or combine gold bars with rare gems from mining to forge powerful rings and amulets.
- **New Skill: Farming**: Patch-based real-time growth. Plant seeds in 3 patches (Crownlands Farm, Frostvale Greenhouse), wait for crops to grow, then harvest. 7 crops (wheat → void cap). Seeds from shop; Bank Seeds filter; stats tracking.
- **New Skill: Firemaking**: Burn logs for XP. 9 burn types from Normal Log to Cosmic Wood. Consumes logs from inventory; higher-tier logs grant more XP. Mastery: XP bonus, speed, log saver.
- **New Skill: Woodworking**: Turn logs into furniture, shields, and staves. Flagship workbench-style UI with category rail (Furniture, Combat, Utility), recipe cards with input/output slots, and sticky action dock. 5 recipes: Pine Stool, Maple Dining Table, Training Staff, Willow Shield, Barrel. Mastery: XP, yield, speed, log saver.
- **New Skill: Exploration**: Support skill for surveying and discovery. 6 expeditions (Crownlands Paths → Skyward Ascent) tied to world regions; train for XP and discovery items (survey notes, trail rations, ancient map scrap, fey compass, volcanic chart, peak star map). Explore tab shows Exploration level and "Train Exploration to survey tougher regions"; level-gated locations (e.g. Scorched Reach, Skyward Peaks) now require Exploration level. Mastery: XP, speed, yield, rare find.
- **New Skill: Wizardry**: Cosmic support skill. Study nodes (Basic Scroll Reading, Tome of the Void, Celestial Almanac) for XP only. No items consumed. Mastery: XP, speed.
- **New Skill: Sorcery**: Cosmic magic skill. Cast spells (Lumina Spark, Voidmire Bolt, Astral Storm) - consume runes per tick for XP. Craft runes at Runecrafting first. Auto-stop when out of runes. Mastery: XP, speed, rune saver.
- **Resonance level unlocks**: Multi-Pulse (Lv 20) — multi-finger tap (2–4) scales momentum/XP; Soul Cranking (Lv 60) — long-press Heavy Pulse (+20% Momentum, 40 XP, costs 5 Anchor Energy). Anchor Energy: new resource (0–50 cap), earned 1/min from non-Resonance skilling.
- **Dynamic Coming Soon UI**: Added an interactive "Coming Soon" skill lock screen for unimplemented skills.
- **Enhanced Skill Pages**: Slayer, Summoning, and Resonance have been upgraded to the "Enhanced!" UI style with navigation arrows, integrated XP bars, and gold level badges.
- **Resonance Unified**: Relocated Resonance skill into the standard `skills/` directory to resolve routing conflicts and enable consistent navigation.
- **New Expansions System**: Built the framework for future expansions. Patron's Pack is now retroactively Exp. 1.
- **Expansions Menu**: Added a dedicated Expansions page to the Settings tab to preview and manage unlocked expansions.
### Changed
- **Smooth Progress Bars**: Optimized interpolation logic to fix flickering/stuttering during active tasks.
- Relocated the Skills grid to its own navigation tab to make room for the Hub portal.
### Fixed
- **Stability Patch**: Resolved a critical ReferenceError where `TextInput` was not imported in the skills panel search bar.
- **Dependency Guard**: Improved import safety across primary navigation tabs.
- **Level Up Toast Fix**: Completely refactored the toast notification system to prevent "stuck" toasts.
- **Quick Switch Scroll**: Fixed a major bug where the quick switch panel would not scroll due to Flex conflicts.
- **Descriptive Typos**: Corrected various typos in labels and skill cards.
- **Astrology Navigation**: Fixed a critical routing bug where the right-arrow on Astrology led to an unmatched route.
- **Ticker Shifting**: Corrected the GlobalActionTicker position to intelligently shift down when the tab bar is hidden.
- **Random Events In-Game Only**: Random events (Blibbertooth, Genie, Goblin Peek, etc.) now only trigger during real-time play, not when opening the app or resuming from background.
- **WYWA Offline XP Fix**: While You Were Away modal now applies XP, items, and gold when the user taps "Collect & Continue" instead of during offline calculation. Ensures offline gains are always applied correctly.
### Documentation
- **Doc audit (2026-03-07):** Refreshed ARCHITECTURE (Universal UI: skill node screens), TECHNICAL_USER_MANUAL (§12a Arteria-skill-node-screens), SUMMARY (version 0.6.0 retained note), MASTER_DESIGN_DOC (implementation note). Version intentionally held at 0.6.0.
- **CLICKER_CHECKLIST.md**: New live checklist for Resonance clicker features — implemented (Multi-Pulse, Soul Cranking, Anchor Energy, Kinetic Feedback, Perfect Stability) vs planned (Aether, offline decay, companion relay, etc.).
- **Skill Workbench UI Direction**: Documented the next-gen artisan screen paradigm in SKILLS_ARCHITECTURE §0, ARCHITECTURE (Universal UI Components), TECHNICAL_USER_MANUAL (Arteria-skill-workbench-ui), and SUMMARY. Design principles: active-task storytelling, input/output clarity, one-tap affordance, sticky primary action, category scanning. Reusable components: SkillHeroHeader, SkillCategoryRail, RecipeWorkbenchCard, StickyTaskDock. Woodworking is the flagship; Crafting, Firemaking, Herblore can migrate.
- **CLICKER_DESIGN.md**: Added §7 "Broaden & Deepen Ideas (Sourced)" — world-state/corruption, seasonal pulse modes, Chaos Theory crossover, companion relay, Chronicle/Timekeeper framing, shared active-play minigame framework, accessibility/feedback, economy guardrails; all subsections cite source docs. References expanded and renumbered to §8.

## [0.5.2] - 2026-03-06 — "The Celestial Expansion"
### Added
- **New Skill: Astrology:** Fully implemented Astrology skill screen with 4 constellations (Deedree, The Anchor Eternal, The Void Fish, The Lumina Tree).
- **Celestial Items:** Added `Stardust`, `Golden Stardust`, and `Meteorite` items with unique descriptions, values, and sprites.
- **Skill Progression Icons:** Integrated Astrology into the skill header progression bar with its own unique emoji icons.
- **Unified Navigation:** Included Astrology in the alphabetical skill cycling system.
- **Idle Soundscapes:** Registered 'astrology' soundscape for future audio implementation.
### Fixed
- **Type Safety:** Resolved critical TypeScript linting errors in `SkillBox` component and `useIdleSoundscape` hook.
- **Navigation Bounds:** Fixed out-of-bounds error in skill navigation when cycling from the first/last skills.
### Changed
- **Skill Metadata:** Updated all skill registries to promote Astrology from "Coming Soon" to "Active".

## [0.5.1] - 2026-03-06 — "THE 0.5.1 extended update directors cut remix - alpha"

> Consolidates updates 0.4.3 through 0.5.1. A massive update introducing World Exploration, Lumina Shop, Mastery expansion, Bank OSRS redesign, Combat Alpha, Prayer, Harvesting, Scavenging, Herblore, new NPCs, Technical formalization, and premium themes.

### Added
- **Architectural Tome:** Created `DOCU/TECHNICAL_USER_MANUAL.md` with full engine taxonomy (identifying bits like Arteria-game-engine, Arteria-tick-orchestrator, etc.).
- **Arteria Depth System:** Multi-layered shadow system (Subtle, Medium, Elevated, Deep), 3D raised buttons, inset stat pills, and header shadow casting for premium tactile depth.
- **Skill Progression Bar:** Each skill screen header now features a sleek horizontal icon strip. Node emojis glow with their skill colour when unlocked; locked nodes are dimmed and scaled down. Level indicator compressed inline with the title.
- **Midnight Theme:** Deep-black premium theme optimized for OLED screens with purple accents.
- **Achievement Expansion:** Added 6 new reactive achievements (Head Chef, Potion Master, Sneeze Cultist, Tome of Knowledge, Void Walker, Death Defier). Total: 16.
- **UI Enhancements:**
  - **Skill-to-Skill Navigation:** Added premium stylized chevron arrows to all 10 skill titles for alphabetical cycling between skills.
  - **"Enhanced!" Badges:** Absolute-positioned gold badges for Mining and Logging to highlight the icon-based UI.
- **Gameplay Settings:** Added toggles for Haptics & Vibration, Screen Shake, and Floating XP.
- **Glassmorphism 2.0:** Improved theme tokens (`glassBg`, `glassBorder`) for glossy UI effects, applied to the Stats screen.
- 🛡️ **Coming Soon Skills**: Leadership, Adventure, Dungeon Dwelling, Construction added in Coming Soon mode with high-fidelity modals.
- **Quick-Switch Animations:** dynamic Quick-Switch Panel animations and toggle visibility logic.
- **Harvesting & Scavenging:** 7 harvest nodes, 5 scavenge nodes. Quick-Switch, thump SFX.
- **Herblore:** 7 potion recipes (herb + empty vial → potion). Buy vials from Nick. Bank Potions filter. Pet Fizz.
- **Bank OSRS-style redesign:** Main tab + up to 6 custom tabs. Tab bar row, type-filter row. Tab icon = first item in tab. Long-press item → "Create new tab with this item". Remember last tab.
- **World Exploration:** Explore tab = World Map. 6 locations. Tap to travel. Location screen with NPCs, Shop, Quests.
- **Lumina Shop:** Reroll Daily Quests (5 Lumina, 2/day), XP Boost 1h (15 Lumina, +25% XP). Shop Buy tab shows Lumina items.
- **Mastery expansion:** Yield +3%/level (max 3) and Speed +4%/level (max 3) for all 10 skills. Settings → Mastery: Gathering/Crafting pillars, skill cards, Spend/Max.
- **MasteryBadges:** Active mastery bonuses (📖 XP, 📦 yield, ⚡ speed) displayed as compact gold badges in the skill header.
- **Expanded daily quests:** Template pool grown from 14 to 30 templates across all 10 skills. All-time tracker on Quests screen.
- **New NPCs:** Bianca the Herbalist, Kate the Traveler. Quests tab "NPCs in Town" with Talk. 
- **ComingSoonBadge:** Red (planned) or green (in progress) badge.
- **Forging weapon expansion:** 5 weapon types per tier. 54 recipes total. Runite story-gated.
- **Combat Alpha Engine:** Full auto-battler loop, zones, enemies, and combat log. 
- **Prayer System:** 12 prayers, bone burying, combat drain.
- **Infinite Equipment Refining:** Players can now merge 10 identical equipment items into a `+1` variant directly from the Bank. Continually refine weapons and armor to infinite ranks, with dynamically scaling stats (+1 per rank) and exponentially increasing sell values.
- **Future Skills Added:** `Summoning`, `Astrology`, and `Slayer` have been added to the game's skill roster as "Coming Soon" with unique icons and colors.

### Fixed
- **Cooking Screen Bug:** Fixed `ReferenceError: Property 'getNextSkill' doesn't exist` when using navigation arrows.
- UI lints in `stats.tsx` and missing theme selectable options for Midnight.
- **Android boot loop (splash screen):** Resolved splash screen predrawing handoff loop.
- **APK build (Metro):** Identifier duplicate fixes and style ternary fixes.

### Changed
- **Mastery entry point:** Moved from Settings to the **Skills panel header** (📖 button).
- **Tab headers:** Statistics/Bank/Shop use Cinzel Bold.

---

## [0.4.2] - 2026-03-05
### Added
- **Skill Pets:** Rare companions found while skilling.
- **Tick SFX:** satisfy tinks/thumps/splashes per skill.
- **OTA Update Pipeline:** Integrated `expo-updates` and EAS update workflow.

---

## [0.4.1] - 2026-03-03
### Added
- **The Anchor Man:** Character naming and nickname system.
- **Goblin:** First random event enemy sightings.
- **Cooking:** raw fish → cooked food (10 recipes).

---

## [0.4.0] - 2026-03-03
### Added
- **Daily quests:** Radiant objectives reset at midnight.
- **Detailed stats:** play time and total gathered per type.
- **Custom bank tabs:** filter row includes custom tabs.
- **Sell All Junk:** Mark and sell junk items.

---

## [0.3.0] - 2026-03-03
### Added
- **Theme Engine:** Settings → Appearance picker.
- **Quick-Switch Sidebar:** Slide-in drawer for skill jumping.
- **Smithing & Forging:** Smelting bars and forging weapons.
- **Random Events:** 5 reactive events during tasks.
- **Mastery:** XP bonuses per skill.

---

## [0.2.7] - 2026-03-03
### Added
- **Fishing & Runecrafting:** Skill implementations.
- **Smart Game Loop:** Inventory consumption during tasks.
- **Confirm Task Switch & Battery Saver:** Gameplay settings.
- **Notifications:** Level ups and idle cap alerts.

---

## [0.2.6] - 2026-03-02
### Added
- **Dialogue Engine:** Branching NPC conversations.
- **Quest System:** Sorted Active/Complete/Available quests.

---

## [0.2.5] - 2026-02-28
### Added
- **Lean Production Builds:** ABI-split release APKs.

---

## [1.1.0] - 2026-02-26
### Added
- **Deployment Pipelines:** Batch scripts and EAS config.

---

## [1.0.0] - 2026-02-26
### Added
- **Core Persistence:** MMKV save system and Gradle 9 foundation.
