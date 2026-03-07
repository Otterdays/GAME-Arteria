# Arteria — Crafting & Skills Audit & Feature Planning

> **Purpose:** Structured planning doc. Fill in content details in each section before coding.
> **Source:** Gemini audit + IMPROVEMENTS/ROADMAP synthesis. Last updated: 2026-03-05
> **Note:** MASTER_DESIGN_DOC.md v2.0 now contains the canonical expanded design (7 Parts, 20 Chapters). This doc serves as implementation checklist.

---

## 0. Master Design Reference

**MASTER_DESIGN_DOC.md v2.0 — The Expanded Cosmos** now includes:
- **Part II:** Advanced Mastery, Prestige, The Absurdity System (Chaos Theory)
- **Part III:** World State & Corruption, Seasonal Calendar (4 events)
- **Part V:** Housing & Sanctum, Companion Stories, Chronicle System
- **Part VI:** Consumption Economy (Three Stomachs, Restaurant)
- **Part VII:** Full 4-Act narrative, Technical architecture

*This doc (gemini_notes.md) tracks implementation status against those designs.*

---

## 1. Implementation Status (Audit Snapshot)

| Pillar | Implemented | Unimplemented / Planned |
|--------|-------------|-------------------------|
| **Gathering** | Mining, Logging, Fishing, Harvesting, Scavenging | Thieving |
| **Crafting** | Smithing, Forging, Cooking, Runecrafting, Herblore | Crafting, Alchemy, Tailoring, Fletching |
| **Support** | Mastery, Pets | Agility, Farming, Leadership (Companions), Construction |

> **SKILLS_ARCHITECTURE.md** — Full pre-implementation design for Farming, Agility, Thieving, Crafting. Use `ComingSoonBadge` (red = planned, green = in progress) on Skills grid, Location screens, Explore, Combat.

---

## 2. Core Mechanics (Reference)

- **Tick-based engine:** `@arteria/engine` (TickSystem, GameEngine). Ticks = discrete actions → XP + items.
- **Offline progression:** Simulated ticks from elapsed time; 24h cap (F2P) / 7d (Patron).
- **Dependency loops:** Ore → Bars → Equipment; Fish → Food; Herbs + Vial → Potions.
- **Mastery:** Permanent buffs via points from level-ups.

---

## 3. Improvement Opportunities (Technical & UX)

| Area | Issue | Pre-implementation notes |
|------|-------|---------------------------|
| **Engine consolidation** | `useGameLoop.ts` inlines engine math; no `@arteria/engine` import | [ ] Decide: migrate to package import or keep inline? |
| **Crafting queue** | Phase 3.1 not implemented; 8h queue planned | See §6.1 |
| **Resource discovery** | Bank "Used in" exists; no "Go to Recipe" shortcut | [ ] Target skill screen? Deep link path? |
| **Heat management** | Smithing active mechanic (tap to keep heat) planned | [ ] Design: green zone size, multiplier, minigame UX. See ORE_CHAIN_EXPANSION.md §4.1 |

---

## 4. Feature Options — Quick Wins (Low Effort)

### 4.1 More nodes/recipes

| Option | Content details (fill before coding) |
|--------|--------------------------------------|
| **Mining nodes** | [ ] Node IDs, names, levelReq, xpPerTick, baseTickMs, successRate, items, emoji |
| **Logging nodes** | [ ] Same fields |
| **Fishing spots** | [ ] Same fields |
| **Harvesting nodes** | [ ] Same fields |
| **Scavenging nodes** | [ ] Same fields |
| **Cooking recipes** | [ ] consumedItems, items, levelReq, xpPerTick, baseTickMs, successRate, emoji |
| **Herblore recipes** | [ ] Same fields |
| **Smithing recipes** | [ ] Same fields |
| **Forging recipes** | [ ] Same fields |

### 4.2 More daily quest templates

| Option | Content details |
|--------|-----------------|
| **Gather objectives** | [ ] Item IDs, quantities, gold/Lumina rewards |
| **Cook objectives** | [ ] Recipe IDs, quantities |
| **Brew objectives** | [ ] Potion IDs, quantities |
| **Other types** | [ ] Describe: _______________ |

### 4.3 More random events

| Option | Content details |
|--------|-----------------|
| **New event type** | [ ] id, name, description, trigger chance, cooldown |
| **Reward / effect** | [ ] XP bonus? Item? Gold? Flag? |
| **Toast / modal** | [ ] Copy Blibbertooth pattern? Custom UI? |

### 4.4 More pets

| Option | Content details |
|--------|-----------------|
| **Skill** | [ ] skillId (harvesting, scavenging, herblore, etc.) |
| **Pet** | [ ] id, name, description, emoji, dropChanceBase |

### 4.5 More enemies (bestiary)

| Option | Content details |
|--------|-----------------|
| **Enemy** | [ ] id, name, assetPath, combat stats |
| **Locations** | [ ] zone IDs for "Found in" |
| **Drops** | [ ] itemId, chance, quantity |

### 4.6 Bank sort

| Option | Content details |
|--------|-----------------|
| **Sort keys** | [ ] Name, Quantity, Value — any others? |
| **UI** | [ ] Dropdown? Segmented control? Default sort? |

---

## 5. Feature Options — Medium Effort

### 5.1 Idle soundscapes

| Option | Content details |
|--------|-----------------|
| **Per-skill loops** | [ ] mining: ____, logging: ____, fishing: ____, etc. |
| **Asset source** | [ ] Generate? License? File paths? |
| **Volume / mix** | [ ] Relative to SFX? User control? |

### 5.2 Food consumption

| Option | Content details |
|--------|-----------------|
| **HP system** | [ ] maxHp formula? currentHp init? |
| **Heal amounts** | [ ] Per food item: itemId → hpRestored |
| **Consume UI** | [ ] Bank item detail "Consume"? Combat slot? |
| **Buffs (optional)** | [ ] itemId → { xpBonus, yieldBonus, duration } |

### 5.3 Equipment slots

| Option | Content details |
|--------|-----------------|
| **Slots** | [ ] weapon, helmet, shield, …? |
| **Equip UI** | [ ] Bank "Equip"? Settings? Combat tab? |
| **Stat display** | [ ] Attack, Defence — formula from items? |
| **Item eligibility** | [ ] Which equipment IDs per slot? |

### 5.4 Recipe browser / "Go to Recipe"

| Option | Content details |
|--------|-----------------|
| **Trigger** | [ ] Bank item detail button? Inline link? |
| **Destination** | [ ] Skill screen + scroll to recipe? Modal? |
| **Recipe lookup** | [ ] Map itemId → { skillId, actionId } |

### 5.5 Radiant quests

| Option | Content details |
|--------|-----------------|
| **Template** | [ ] "Bring Nick 10 copper" — itemId, qty, reward |
| **Cooldown** | [ ] Time between offers? |
| **Reset logic** | [ ] Same as daily? Separate? |

---

## 6. Feature Options — Larger (New Systems)

### 6.1 Crafting queue (Phase 3.1)

| Option | Content details |
|--------|-----------------|
| **Queue state** | [ ] `queuedActions: { actionId, skillId, qty, progress }[]`? |
| **Max queue time** | [ ] 8h as per roadmap? Configurable? |
| **Input reservation** | [ ] Reserve on queue start? Refund on cancel? |
| **Output grant** | [ ] On each item complete? Batch? |
| **Offline processing** | [ ] processOffline drains queue? |
| **UI** | [ ] Queue list, progress bars, cancel — where? (Skill screen? Bank? New tab?) |

### 6.2 Combat alpha (Phase 4)

| Option | Content details |
|--------|-----------------|
| **Loadouts** | [ ] Reuse equipment slots? Separate combat loadout? |
| **Auto-combat** | [ ] Resolve in processOffline? Efficiency %? |
| **Enemy selection** | [ ] Player picks zone? Auto-pick first available? |
| **Combat report** | [ ] Extend WYWA? New modal? Fields: kills, loot, XP? |
| **HP / flee** | [ ] Flee at X% HP? Potion auto-use threshold? |

### 6.3 Companions (Phase 5)

| Option | Content details |
|--------|-----------------|
| **Roster** | [ ] Barnaby, Yvette, Reginald — stats, traits, unlock (Leadership 20/35/50) |
| **Task assignment** | [ ] Reuse activeTask? Companion has own activeTask? |
| **Companion XP** | [ ] Same XP curve? Separate companionSkills? |
| **Auto-gather/craft** | [ ] Which skills? Same nodes/recipes as player? |

---

## 7. New Skills (Same Pattern as Herblore)

### 7.1 Crafting

| Option | Content details |
|--------|-----------------|
| **Recipes** | [ ] e.g. logs + bars → arrows, bags. List: inputs, outputs, levelReq, xpPerTick, etc. |
| **Item types** | [ ] New types? (arrow, bag, …) |
| **Bank filter** | [ ] Add "Crafted" or similar? |

### 7.2 Farming

| Option | Content details |
|--------|-----------------|
| **Patches** | [ ] How many? Fixed locations? |
| **Seeds** | [ ] Item IDs, source (shop? drops?) |
| **Growth timers** | [ ] Real-time? In-game ticks? Duration per stage? |
| **Harvest** | [ ] Same as Harvesting skill? Separate? |

### 7.3 Agility

| Option | Content details |
|--------|-----------------|
| **Courses** | [ ] id, name, levelReq, xpPerTick, baseTickMs, successRate — no items |
| **Unlocks** | [ ] Shortcuts? Passive bonuses? |

---

## 8. Priority Recommendation (from audit)

> **Focus next:** Crafting Queue Architecture (Phase 3.1). Most requested in roadmap; fundamentally changes processing skill UX.

| Order | Feature | Rationale |
|-------|---------|-----------|
| 1 | Crafting queue | High impact, roadmap priority |
| 2 | Recipe browser / "Go to Recipe" | Quick UX win, closes discovery loop |
| 3 | Engine consolidation | Maintainability |
| 4 | Combat alpha | Phase 4 milestone |
| 5 | Companions | Phase 5 milestone |

---

## 9. Bank OSRS-fication — UX Analysis & Improvement Plan

> **Goal:** Bank feels like OSRS — main tab, limited custom tabs (6 max), slot cap (100), clearer hierarchy.

### 9.1 Current State

| Aspect | Current | Notes |
|--------|---------|-------|
| **Slot cap** | 50 F2P, 100 Patron | Per unique item type. Stacks unlimited. |
| **Main view** | "All" filter | First in FILTER_OPTIONS; no dedicated "main tab" concept. |
| **Custom tabs** | Unlimited | User creates via "+ Tabs"; each has name, emoji, itemIds. |
| **Filter row** | All + type filters + custom tabs + "+ Tabs" | Single horizontal scroll; type filters and custom tabs mixed. |
| **Tab assignment** | Item detail → "Add to tab" | Toggle per custom tab. |
| **Sort** | Name, Qty, Value | Above grid. |
| **Search** | Text input | Filters by label. |

### 9.2 OSRS Reference

| OSRS | Arteria target |
|------|----------------|
| Main tab = "All" (always first) | Main tab = default view; cannot delete. |
| Up to 9 additional tabs (10 total) | 1 main + 6 custom = **7 tabs max**. |
| Tab headers show first item icon | [ ] Option: tab icon = first item emoji, or custom emoji? |
| Drag item to "New tab" to create | [ ] Keep "+ Tabs" modal? Or drag-to-create? |
| Tabs are separate from type filters | Split: **Tabs** (main + custom) vs **Filters** (within tab). |

### 9.3 Proposed Structure

```
┌─────────────────────────────────────────────────────────┐
│ Bank                                    [Slots: 47/100] │
│ 💰 12,450 gp    ✨ 10 Lumina    [Sell All Junk]         │
├─────────────────────────────────────────────────────────┤
│ [Main] [Tab 1] [Tab 2] [Tab 3] ... [Tab 6] [+ Add]     │  ← Tab bar (max 7)
├─────────────────────────────────────────────────────────┤
│ [All] [Ores] [Bars] [Logs] [Fish] [Food] [Potions] ...  │  ← Filters (within tab)
├─────────────────────────────────────────────────────────┤
│ Sort: [Name] [Qty] [Value]                              │
├─────────────────────────────────────────────────────────┤
│ [Search...]                                             │
├─────────────────────────────────────────────────────────┤
│  [grid of items]                                        │
└─────────────────────────────────────────────────────────┘
```

**Hierarchy:**
1. **Tab** = Which subset of bank you're viewing. Main = everything. Custom = only items assigned to that tab.
2. **Filter** = Within current tab, filter by type (Ores, Bars, etc.) or search.
3. **Sort** = Order of items in grid.

### 9.4 Content Details (fill before coding)

| Option | Content details |
|--------|-----------------|
| **Slot cap** | [ ] Keep 50/100? Or 100 base for all? Patron gets 150? |
| **Main tab behavior** | [ ] Main = always "All" (no assignment). Or Main = first custom tab? |
| **Custom tab limit** | [ ] 6 (confirmed). Block "+ Add" when 6 exist. |
| **Tab bar UI** | [ ] Horizontal row? Pills? Icons only on mobile? |
| **Tab creation** | [ ] "+ Add" opens modal (name + emoji)? Or drag item to "New tab" zone? |
| **Tab icon** | [ ] Custom emoji only? Or auto = first item in tab? |
| **Migration** | [ ] Users with >6 custom tabs: keep first 6? Merge? Prompt to delete? |
| **Empty tab** | [ ] Show empty state "Assign items from item detail" or hide tab until items added? |

### 9.5 Systems Impact

| System | Change |
|--------|--------|
| **gameSlice** | Cap `customBankTabs.length` at 6 in `addCustomBankTab`. Migration for existing saves. |
| **constants/game.ts** | [ ] Adjust `INVENTORY_SLOT_CAP_*` if changing caps. |
| **bank.tsx** | Two-row layout: Tab bar (main + custom + add) | Filter row (type filters). Disable "+ Add" when 6 tabs. |
| **Manage tabs modal** | Show "Max 6 custom tabs" when at limit. |
| **Item detail** | "Add to tab" — only show tabs that exist; max 6. |

### 9.6 UX Improvements (beyond OSRS)

| Improvement | Description |
|-------------|-------------|
| **Tab bar prominence** | Tabs are primary nav; filters secondary. Visual weight: tabs > filters. |
| **Slot progress** | Show "47/100" with optional progress bar. Red when near cap. |
| **Quick filters in tab** | When tab selected, type filters still apply (e.g. "Ores" in "Smithing" tab). |
| **Tab reorder** | [ ] Drag to reorder tabs? Or fixed order (Main, 1–6)? |
| **Default tab on open** | [ ] Remember last tab? Or always Main? |
| **"Go to Recipe"** | Item detail → button to open skill screen (see §3). |

### 9.7 Bank Pre-implementation Checklist

- [x] Slot cap: 50 F2P, 100 Patron (unchanged)
- [x] Tab limit (6) confirmed; addCustomBankTab/addCustomBankTabWithItem enforce
- [x] Tab bar + filter row layout (two rows)
- [x] Migration: >6 tabs truncated to first 6 on load
- [x] lastBankTab persisted; restore on open
- [x] Tab icon = first item in tab (else custom emoji)
- [x] Long-press item → "Create new tab with this item"; + Add modal for empty tab

---

## 10. Pre-implementation Checklist (per feature)

Before coding any feature in this doc:

- [ ] Content details filled in (tables above)
- [ ] Item/recipe/node IDs defined if new
- [ ] UI placement decided
- [ ] Redux/state shape sketched (if new state)
- [ ] Docs to update: SCRATCHPAD, CHANGELOG, SUMMARY, patchHistory, UpdateBoard
