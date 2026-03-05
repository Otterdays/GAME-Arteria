# Current Improvements — Expand With What We Have

> **Purpose:** Expansion opportunities that build on existing systems. No new pillars or major architecture — extend what's already wired.
> **Last reviewed:** 2026-03-05

---

## 1. Systems We Can Extend

| System | Current State | Expansion Surface |
|--------|---------------|-------------------|
| **Skills** | 8 implemented (Mining, Logging, Fishing, Runecrafting, Smithing, Forging, Cooking). Node/recipe pattern in `useGameLoop` + `ACTION_DEFS`. | Add nodes, recipes, or new skills using same pattern. |
| **Pets** | 7 pets, rare drops per skill tick, Pets screen, active emoji. | More pets, pet abilities, pet XP/levels, cosmetic variants. |
| **Mastery** | 1 pt/level-up, spend in Settings → Mastery. XP (+5%/level), yield (+3%/level), speed (+4%/level, max 3) for all 8 skills. Pillar grouping, skill cards. | New upgrade types. |
| **Random Events** | Blibbertooth, Cosmic Sneeze, Genie, Treasure Chest, Lucky Strike, Goblin Peek. Per-tick roll, cooldown. | New event types, Dialogue randoms (reuse DialogueOverlay), Hazard events (tick modifiers). |
| **Daily Quests** | 3/day, reset midnight, gold + Lumina rewards. Step auto-complete. | More quest templates, radiant/repeatable, Lumina-only rewards. |
| **Lumina** | Earned: login day 7, daily quests. Lumina Shop: Reroll Daily (5✨, 2/day), XP Boost 1h (15✨). Displayed: Bank, Shop, Settings. | More Lumina items (cosmetics, rerolls). |
| **Bestiary** | Goblin/Slime/Wolf data, "Enemies Spotted", "Found in". seenEnemies, goblin_peek. | More enemies, drop tables, "First spotted" timestamps, combat prep. |
| **Bank** | Search, filters, custom tabs, Sell All Junk, sort, "Used in". | Recipe browser link, bulk actions, tab presets. |
| **Idle Soundscapes** | Toggle + stub hook on all 7 skill screens. expo-audio in use for SFX. | Implement ambient loops per skill (forge, waves, birds) via useIdleSoundscape. |
| **Food** | 10 cooked items, Cooking skill. No consumption yet. | Food buffs (XP, yield, speed), consume in combat/skilling. |
| **Equipment** | 15 forged items (daggers, helmets). No equip system. | Equip slots, stat bonuses, combat readiness. |

---

## 2. Quick Expansions (Low Effort)

### 2.1 More Content, Same Patterns

- **More Mining/Logging/Fishing nodes** — Add entries to `MINING_NODES`, `LOGGING_NODES`, `FISHING_SPOTS`. No new systems.
- **More Cooking recipes** — Add to `COOKING_RECIPES`. Same consumedItems/items pattern.
- **More Smithing/Forging recipes** — Add to `SMELTING_RECIPES`, `FORGING_RECIPES`.
- **More Runecrafting altars** — Add to `RUNE_ALTARS`. Same essence→rune flow.
- **More daily quest templates** — Add to `generateDailyQuests` / quest pool. Same claim flow.
- **More random events** — Add type to `RANDOM_EVENT_TYPES`, handle in `useGameLoop` switch. Reuse FeedbackToast.
- **More pets** — Add to `SKILL_PETS`. Drop logic already generic.
- **More mastery upgrades** — Add to `MASTERY_UPGRADES` per skill. `getMasteryXpMultiplier` already applies.
- **More enemies** — Add to `ENEMIES`. Bestiary UI already iterates.

### 2.2 UI Polish (Existing Hooks)

- **Idle Soundscapes** — `useIdleSoundscape` is wired; implement loop playback per `soundscapeId` (expo-audio). Settings toggle already exists.
- **Lumina Shop** — ✅ Done: Reroll Daily Quests (5 Lumina, 2/day), XP Boost 1h (15 Lumina). Shop Buy tab.
- **Bank "Used in"** — Already done. Optional: link to skill screen or recipe detail.
- **Combat "Found in"** — Already shows when `locations` defined. Add locations to Slime/Wolf.

---

## 3. Medium Expansions (Reuse Existing Systems)

### 3.1 Harvesting & Scavenging (Data + UI)

- **Harvesting** — Define `HARVESTING_NODES` (herbs, fibers). Register in `ACTION_DEFS`. Add `app/skills/harvesting.tsx` (copy Mining/Logging pattern). Add to `IMPLEMENTED_SKILLS`. Seasonal rotation already in engine.
- **Scavenging** — Define `SCAVENGING_ZONES` (ruins, caches). Curse chance mechanic already designed. Same node pattern.

### 3.2 Food Consumption

- **Consume food** — Add `consumeFood(itemId)` action. Track `currentHp` / `maxHp` in player (stub for combat). Food restores HP. No combat needed yet — can gate behind "rest" or future combat.
- **Food buffs** — Add `activeFoodBuff` to player: `{ itemId, expiresAt, xpBonus, yieldBonus }`. Apply in `useGameLoop` / `getMasteryXpMultiplier`-style path.

### 3.3 Equipment Slots (Combat Prep)

- **Equip UI** — Add `equipped` to player: `{ weapon?, helmet?, ... }`. Bank item detail: "Equip" for equipment type. Simple list in Settings or Combat.
- **Stat display** — Show Attack/Defence from equipped items. Combat math can use later.

### 3.4 More Mastery Types

- **Yield bonus** — ✅ Done: All 8 skills have yield_bonus (+3%/level, max 3). getMasteryYieldMultiplier in useGameLoop.
- **Speed bonus** — ✅ Done: All 8 skills have speed_bonus (+4%/level, max 3) = up to +12% faster ticks. getMasterySpeedMultiplier in useGameLoop processDelta.

### 3.5 Quest & Narrative

- **Radiant quests** — "Bring Nick 10 copper" on cooldown. Reuse daily quest structure, different reset.
- **More story quests** — Add to `ALL_QUESTS`. Step auto-complete and completion flow already work.

---

## 4. Larger Expansions (Current Systems + New Glue)

### 4.1 Crafting Queue

- **Queue state** — `queuedActions: { actionId, qty, progress }[]`. Reserve inputs on queue, grant outputs on complete.
- **Offline processing** — Extend `processOffline` to drain queue over elapsed time.
- **UI** — Queue list, progress bars, cancel. Reuse existing action defs.

### 4.2 Combat Alpha

- **Loadouts** — Reuse equipment slots. Select weapon/armour for combat.
- **Auto-combat** — Resolve fights in `processOffline` using enemy combat stats. Drops from `EnemyDrop`.
- **Combat report** — Extend WhileYouWereAway-style modal for kills, loot, XP.

### 4.3 Companions (Phase 5)

- **Roster data** — Barnaby, Yvette, Reginald. Leadership gates (20/35/50).
- **Assign task** — Reuse `activeTask` pattern; companion has own `activeTask`.
- **Companion XP** — Same XP curve, separate `companionSkills` in state.

---

## 5. Doc / Code Hygiene

- **Quest engine import** — `quests.tsx` uses relative path to `packages/engine/src/data/quests`. Add `@arteria/engine` export or alias.
- **ACTION_DEFS** — Centralize in engine package or shared module so new skills don't require `useGameLoop` edits.

---

## 6. Suggested Priority (Expand First)

1. **Idle Soundscapes** — Hook exists; implement loops. High immersion, low risk.
2. ~~**Lumina Shop (1–2 items)**~~ — ✅ Done: Reroll Daily, XP Boost 1h.
3. **Harvesting skill** — Full skill using existing pattern. New item types (herbs).
4. **More mastery upgrades** — Yield/speed for other skills. Reuses mastery UI.
5. **Food consumption + buffs** — Food exists; add consume + temporary buff. Prep for combat.

---

*Use this doc with IMPROVEMENTS.md and ROADMAP.md for sprint planning. Append new ideas; do not delete.*
