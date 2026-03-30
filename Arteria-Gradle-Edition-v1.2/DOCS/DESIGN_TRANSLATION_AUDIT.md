<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Design Translation Audit & Index — V1 to v1.2

This document indexes the **Content, Registries, and UI Elements** found in the V1 (React Native) monorepo that must be ported to v1.2 (Kotlin / Compose). It builds upon `MIGRATION_SPEC.md` to map exact file structures and audit data splits.

---

## 🚨 Critical Insight: The Data Split
In V1, content definition is **split and often incomplete** between the headless engine and presentation layer:
1.  **`packages/engine/src/data/`**: Holds core formula fields (XP, interval, curses). *Contains only a subset of skills (~9).*
2.  **`apps/mobile/constants/`**: Holds complete display metadata (Names, Emojis, Narrative Requirements). *Contains ALL 28+ skills and item maps.*

**Porting Rule:** When building the `:core` or `:app` Kotlin registries, always combine `engine/` actions with `constants/` display nodes, augmenting titles/icons from constants into the core item structures.

---

## 1. Content & Skill Data Index

Below is the verification status of all V1 Skills and their corresponding source files.

| Skill / Registry | Engine Logic (`packages/engine/src/data/`) | App Constants (`apps/mobile/constants/`) | UI Screen (`apps/mobile/app/skills/`) | V1.2 Port Status |
| :--- | :--- | :--- | :--- | :--- |
| **Mining** | `mining.ts` (8 nodes) | `mining.ts` (11 nodes - includes Essences) | `mining.tsx` | ⬜ Todo |
| **Woodcutting / Logging**| `logging.ts` | `logging.ts` | `logging.tsx` | ⬜ Todo |
| **Fishing** | `fishing.ts` | `fishing.ts` | `fishing.tsx` | ⬜ Todo |
| **Harvesting** | `harvesting.ts` | `harvesting.ts` | `harvesting.tsx` | ⬜ Todo |
| **Scavenging** | `scavenging.ts` | `scavenging.ts` | `scavenging.tsx` | ⬜ Todo |
| **Astrology** | `astrology.ts` | `astrology.ts` | `astrology.tsx` | ⬜ Todo |
| **Slayer** | `slayer.ts` | `slayer.ts` | `slayer.tsx` | ⬜ Todo |
| **Summoning** | `summoning.ts` | `summoning.ts` | `summoning.tsx` | ⬜ Todo |
| **Leadership** | `leadership.ts` | `leadership.ts` | `leadership.tsx` | ⬜ Todo |
| **Cooking** | ❌ missing | `cooking.ts` | `cooking.tsx` | ⬜ Todo |
| **Crafting** | ❌ missing | `crafting.ts` | `crafting.tsx` | ⬜ Todo |
| **Farming** | ❌ missing | `farming.ts` | `farming.tsx` | ⬜ Todo |
| **Firemaking** | ❌ missing | `firemaking.ts` | `firemaking.tsx` | ⬜ Todo |
| **Fletching**| ❌ missing | `fletching.ts` | `fletching.tsx` | ⬜ Todo |
| **Forging** | ❌ missing | `forging.ts` | `forging.tsx` | ⬜ Todo |
| **Herblore** | ❌ missing | `herblore.ts` | `herblore.tsx` | ⬜ Todo |
| **Runecrafting** | ❌ missing | `runecrafting.ts` | `runecrafting.tsx` | ⬜ Todo |
| **Smithing** | ❌ missing | `smithing.ts` | `smithing.tsx` | ⬜ Todo |
| **Sorcery** | ❌ missing | `sorcery.ts` | `sorcery.tsx` | ⬜ Todo |
| **Tailoring**| ❌ missing | `tailoring.ts` | `tailoring.tsx` | ⬜ Todo |
| **Thieving** | ❌ missing | `thieving.ts` | `thieving.tsx` | ⬜ Todo |
| **Wizardry** | ❌ missing | `wizardry.ts` | `wizardry.tsx` | ⬜ Todo |
| **Woodworking**| ❌ missing | `woodworking.ts` | `woodworking.tsx` | ⬜ Todo |
| **Agility** | ❌ missing | `agility.ts` | `agility.tsx` | ⬜ Todo |
| **Alchemy** | ❌ missing | `alchemy.ts` | `alchemy.tsx` | ⬜ Todo |
| **Exploration**| ❌ missing | `exploration.ts` | `exploration.tsx` | ⬜ Todo |
| **Resonance** | ❌ missing | `resonance.ts` | `resonance.tsx` | ⬜ Todo |

> 💡 **Observation:** Over 15 skills only exist in `apps/mobile/constants/` with display variables and recipes, meaning their full engine loop support might need building from scratch, or they rely purely on state slices that aren't isolated in the engine.

---

## 2. Global Registries & Systems

The following files control items, variables, and cross-cutting systems:

| Registry / System | V1 Layout (`apps/mobile/constants/` or `apps/mobile/store/`) | Purpose | Port target & Status |
| :--- | :--- | :--- | :--- |
| **Items Map** | `constants/items.ts` (52kb) | Master list of all items, type interfaces, prices, icons. | ⬜ Todo |
| **Mastery System** | `constants/mastery.ts` | Formulae & tables for level-up thresholds. | ⬜ Todo |
| **Enemies DB** | `constants/enemies.ts` | Monster combat tables (max HP, speed, drops). | ⬜ Todo |
| **Game State Slice** | `store/gameSlice.ts` | User inventory, skill levels, active nodes representation. | ⬜ ViewModel StateFlow |
| **Game Loop Hook** | `hooks/useGameLoop.ts` | Orchestrates realtime ticks and offline catches. | ⬜ Coroutine loop |

---

## 3. Screen Layout Audit (UX Items)

Ensure visual parity with the primary navigation elements:

| Screen / Feature | V1 File Location | Design Constraints |
| :--- | :--- | :--- |
| **Dashboard / Main** | `(tabs)/index.tsx` | Display character levels grid, current action status bar. |
| **Character Select** | `character-select.tsx` | Gradient account cards with Cinzel font and star backdrop. |
| **Skill View Templates** | `app/skills/*.tsx` | Action grid (items on row), progress bars (time to complete), unlock flags. |
| **Bank / Inventory** | `(tabs)/bank.tsx` | Multi-column grid interface, sorting, layout constraints for item actions. |
| **Story / Narrative Dialogues** | `packages/engine/src/data/quests.ts` | Narrative tree unlocks to prevent skipping gameplay phases. |

---

## 4. Immediate Checklist for Agents

1.  Combine **Mining Engine Data** and **App Metadata** in a unified Kotlin format (see `MIGRATION_SPEC.md`).
2.  Port **Items Registry** (`items.ts`) — prefer typed lists or JSON configuration bundle.
3.  Implement the first non-Android `:core` math calculation verification against ts code.
