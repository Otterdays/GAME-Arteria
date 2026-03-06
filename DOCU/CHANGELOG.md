# CHANGELOG

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When adding a new release entry here, also update:** `UpdateBoard.tsx`, `index.html` §Changelog, `patchHistory.ts`, `app.json` version.

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
