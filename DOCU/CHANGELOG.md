# CHANGELOG

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When adding a new release entry here, also update:** `UpdateBoard.tsx`, `index.html` §Changelog, `patchHistory.ts`, `app.json` version.

## [0.5.1] - 2026-03-06 — "THE 0.5.1 extended update directors cut remix - alpha"

> Consolidates updates 0.4.3 through 0.5.x. A massive update introducing World Exploration, Lumina Shop, Mastery expansion, Bank OSRS redesign, Combat Alpha, Prayer, Harvesting, Scavenging, Herblore, new NPCs, Technical formalization, and premium themes.

### Added
- **Architectural Tome:** Created `DOCU/TECHNICAL_USER_MANUAL.md` with full engine taxonomy.
- **Midnight Theme:** Deep-black premium theme optimized for OLED screens with purple accents.
- **Achievement Expansion:** Added 6 new reactive achievements (Head Chef, Potion Master, Sneeze Cultist, Tome of Knowledge, Void Walker, Death Defier). Total: 16.
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

### Fixed
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
