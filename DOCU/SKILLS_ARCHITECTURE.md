# Skills Architecture — Farming, Agility, Thieving, Crafting

> **Purpose:** Pre-implementation design for four upcoming skills. Fill in content details before coding.
> **Status:** Architecting. Use `ComingSoonBadge` (red = planned, green = in progress) on UI.
> **Last updated:** 2026-03-05

---

## 1. Farming

### 1.1 Overview

| Aspect | Design |
|--------|--------|
| **Pillar** | Support (feeds Herblore, Cooking, economy) |
| **Core loop** | Plant seeds → wait (growth timer) → harvest crops |
| **Outputs** | Same herbs/crops as Harvesting (wheat, cabbage, tomato, etc.) — Farming is *cultivated* source; Harvesting is *wild* source |

### 1.2 Patches

| Option | Content details |
|--------|-----------------|
| **Patch count** | 3–5 fixed patches (e.g. Crownlands Farm, Frostvale Greenhouse) |
| **Patch types** | All-purpose (any crop) or crop-specific (wheat-only, herb-only) |
| **Location** | Per-patch: `locationId` from `constants/locations.ts` — Crownlands, Frostvale, etc. |

### 1.3 Seeds & Growth

| Option | Content details |
|--------|-----------------|
| **Seed items** | `wheat_seed`, `cabbage_seed`, `tomato_seed`, … — buy from Nick or drops |
| **Growth stages** | 3–5 stages (planted → growing → ready). Real-time or in-game ticks? |
| **Duration** | Per crop: e.g. wheat 5 min, void_cap 30 min. Config: `growthTicks` or `growthMs` |
| **Harvest** | Same as Harvesting skill? **No** — Farming has its own XP curve; harvest grants Farming XP + items |

### 1.4 Data Structures (draft)

```ts
interface FarmingPatch {
  id: string;
  name: string;
  locationId: string;
  levelReq: number;
  cropType?: 'all' | 'herb' | 'grain'; // optional restriction
}

interface FarmingCrop {
  id: string;
  seedId: string;
  outputId: string;
  outputQty: number;
  levelReq: number;
  growthMs: number; // or growthTicks
  xpPerHarvest: number;
  emoji: string;
}
```

### 1.5 Integration

- **Bank filter:** Add "Seeds" or fold into "Other"
- **Stats:** "Crops harvested"
- **Daily quests:** "Harvest X wheat", "Plant Y seeds"
- **Mastery:** xp_bonus, yield_bonus (more crops per harvest), speed_bonus (faster growth)

---

## 2. Agility

### 2.1 Overview

| Aspect | Design |
|--------|--------|
| **Pillar** | Support |
| **Core loop** | Run courses (obstacle laps) — XP only, no items |
| **Unlocks** | Shortcuts (travel), passive bonuses (e.g. +1% global speed per course tier) |

### 2.2 Courses

| Option | Content details |
|--------|-----------------|
| **Structure** | Same as gathering nodes: `id`, `name`, `levelReq`, `xpPerTick`, `baseTickMs`, `successRate` |
| **No items** | Courses produce XP only; no consumedItems, no items array |
| **Count** | 6–8 courses from low (Crownlands Rooftops) to high (Void Rift) |

### 2.3 Course List (draft)

| id | name | levelReq | xpPerTick | baseTickMs | successRate |
|----|------|----------|-----------|------------|-------------|
| crownlands_rooftops | Crownlands Rooftops | 1 | 8 | 4000 | 1 |
| forest_stumps | Forest Stump Run | 10 | 18 | 4500 | 0.95 |
| docks_balance | Docks Balance Beam | 25 | 35 | 5000 | 0.9 |
| fey_ring | Fey Ring Leap | 45 | 60 | 6000 | 0.85 |
| scorched_ledge | Scorched Ledge | 65 | 95 | 7000 | 0.8 |
| void_rift | Void Rift Traverse | 85 | 140 | 8500 | 0.7 |

### 2.4 Unlocks (Phase 2)

- **Shortcuts:** Reduce travel time between locations (e.g. Crownlands → Forest)
- **Passive:** +0.5% global action speed per course mastered (max 3%)

### 2.5 Integration

- **Bank:** No new filters (no items)
- **Stats:** "Laps completed" or "Agility XP"
- **Daily quests:** "Complete X laps at Crownlands Rooftops"
- **Mastery:** xp_bonus, speed_bonus (faster laps)

---

## 3. Thieving

### 3.1 Overview

| Aspect | Design |
|--------|--------|
| **Pillar** | Gathering (alternative economy) |
| **Core loop** | Pickpocket NPCs or loot stalls → gold, items, chance of failure/stun |
| **Risk** | Success rate < 1; failure = no loot, possible stun (skip N ticks) |

### 3.2 Targets

| Option | Content details |
|--------|-----------------|
| **NPCs** | Pickpocket: Guard, Nick, Bianca, Kate — each has `levelReq`, `successRate`, `lootTable` |
| **Stalls** | Loot stalls (e.g. Fruit Stall, Silk Stall) — same structure as nodes |
| **Loot** | Gold + chance of item (e.g. fruit, silk, rune essence) |

### 3.3 Data Structures (draft)

```ts
interface ThievingTarget {
  id: string;
  name: string;
  type: 'pickpocket' | 'stall';
  levelReq: number;
  xpPerTick: number;
  baseTickMs: number;
  successRate: number;
  lootGold: { min: number; max: number };
  lootItems?: { id: string; quantity: number; chance: number }[];
  emoji: string;
}
```

### 3.4 Failure / Stun

- **On fail:** No XP, no loot. Optional: `stunTicks` (e.g. 3 ticks = 12s) — task auto-pauses
- **Detection:** Roll `successRate` per tick; on fail, dispatch `thieving_fail` toast + optional stun

### 3.5 Integration

- **Bank filter:** "Stolen" or fold into existing (gold from thieving goes to player.gold)
- **Stats:** "Pickpockets", "Stalls looted"
- **Daily quests:** "Pickpocket X from Guard", "Loot Y fruit"
- **Mastery:** xp_bonus, yield_bonus (more gold/items), speed_bonus

---

## 4. Crafting

### 4.1 Overview

| Aspect | Design |
|--------|--------|
| **Pillar** | Crafting |
| **Core loop** | Logs + bars/cloth → arrows, bags, jewelry, etc. |
| **Cross-skill** | Consumes Logging (logs), Smithing (bars), Scavenging (cloth?), Herblore (optional reagents) |

### 4.2 Recipes (draft)

| Option | Content details |
|--------|-----------------|
| **Arrow fletching** | Logs → arrow shafts; shafts + feathers + tips → arrows |
| **Bags** | Cloth + leather → small/medium/large bag (bank slot expansion?) |
| **Jewelry** | Gold bar + gem → ring/necklace (cosmetic or stats) |
| **Simplified** | Start with 5–7 recipes: e.g. bronze arrows, iron arrows, oak shortbow, leather bag, silk bag |

### 4.3 Item Types

| Option | Content details |
|--------|-----------------|
| **New types** | `arrow`, `bow`, `bag`, `jewelry` |
| **Bank filter** | "Crafted" or "Arrows" / "Bags" / "Jewelry" |

### 4.4 Data Structures (draft)

```ts
interface CraftingRecipe {
  id: string;
  name: string;
  levelReq: number;
  xpPerTick: number;
  baseTickMs: number;
  successRate: number;
  consumedItems: { id: string; quantity: number }[];
  items: { id: string; quantity: number }[];
  emoji: string;
}
```

### 4.5 Integration

- **Bank filter:** "Crafted" or per-type
- **Stats:** "Items crafted"
- **Daily quests:** "Craft X bronze arrows", "Craft Y leather bags"
- **Mastery:** xp_bonus, yield_bonus, speed_bonus

---

## 5. Implementation Order (Suggested)

| Order | Skill | Rationale |
|-------|-------|-----------|
| 1 | **Agility** | Simplest — XP-only courses, no new items, no growth timers |
| 2 | **Thieving** | Adds risk/reward, reuses NPCs, new loot tables |
| 3 | **Crafting** | Cross-skill recipes, new item types, feeds combat (arrows) |
| 4 | **Farming** | Most complex — patches, seeds, growth timers, new subsystem |

---

## 6. ComingSoonBadge Usage

Use the shared `ComingSoonBadge` component:

- **`inProgress={true}`** → Green badge: "In progress"
- **`inProgress={false}`** → Red badge: "Coming soon"

Wire to: Skills grid (unimplemented skills), Location screens (NPCs/Shop/Quests stubs), Explore (locked locations), Combat (Phase 4 teaser).

---

## 7. Astrology (High Priority)

### 7.1 Overview
| Aspect | Design |
|--------|--------|
| **Pillar** | Support (Global Passive Buffs) |
| **Core loop** | Study constellations → gather Stardust → unlock passive buffs for all other skills |
| **Outputs** | XP, Stardust, Golden Stardust, Meteorites |

### 7.2 Constellations
- **Nodes/Constellations**: Deedree, The Anchor Eternal, The Void Fish, The Lumina Tree. 
- Higher levels unlock constellations that buff specific skill categories (e.g. Deedree buffs Gathering, Anchor Eternal buffs Global modifiers).

### 7.3 Data Structures (draft)
```ts
interface AstrologyConstellation {
  id: string;
  name: string;
  levelReq: number;
  xpPerTick: number;
  baseTickMs: number;
  buffs: { targetSkillId: string; effect: string; maxPercentage: number }[];
  emoji: string;
}
```

---

## 8. Summoning

### 8.1 Overview
| Aspect | Design |
|--------|--------|
| **Pillar** | Advanced / Support |
| **Core loop** | Use collected items/charms → create Familiar pouches → equip for passive synergies |
| **Synergy** | Combines combat drops (charms) with gathered resources (ores, logs, fish) |

### 8.2 Familiars
- **Anchor Spirit**: Increases gem yield when mining.
- **Void Drake**: Fights alongside player, increasing max hit.
- **Lumina Wisp**: Intercepts failed cooking rolls to guarantee success.

---

## 9. Slayer

### 9.1 Overview
| Aspect | Design |
|--------|--------|
| **Pillar** | Combat / Advanced |
| **Core loop** | Receive specific monster bounty → kill X amount in combat → earn Slayer XP and Slayer Coins (for unique shops/upgrades) |
| **Requirement** | Integrates directly into the Phase 4 combat loop. Needs monster zones to be robust. |

### 9.2 Mechanics
- **Slayer Master**: NPC assigns tasks (e.g. "Kill 20 Woodland Wolves").
- **Task Streaks**: Bonus XP and coins for chaining tasks.
- **Unlocks**: High Slayer levels unlock exclusive gathering nodes or elite combat instances.

---

## 10. Woodworking

### 10.1 Overview
| Aspect | Design |
|--------|--------|
| **Pillar** | Crafting (The Wood Economy) |
| **Core loop** | Logs → Wood Items (Furniture, Shields, Staves) |
| **Interaction** | Feeds Construction and Combat (staves/shields) |

### 10.2 Recipes
| Level | Name | Ingredients | Utility |
|-------|------|-------------|---------|
| 1 | Pine Stool | Normal Log x2 | Housing item, low XP |
| 10 | Training Staff | Oak Log x1 | Combat weapon (magic) |
| 25 | Willow Shield | Willow Log x2 | Combat armour (defence) |
| 50 | Maple Dining Table | Maple Log x5 | High-tier housing, massive XP |

---

## 11. Sorcery (The Magic Pillar)

### 11.1 Overview
| Aspect | Design |
|--------|--------|
| **Pillar** | Combat / Magic |
| **Core loop** | Channel Mana + Runes → Offensive Spells |
| **Cost** | Drains Mana Points per cast + consumes Runes |

### 11.2 Spells (draft)
- **Lumina Spark (Lv 1)**: Basic light damage.
- **Voidmire Bolt (Lv 20)**: High damage, chance to "Glitched" enemy.
- **Astral Storm (Lv 70)**: Multi-target reality tear.

---

## 12. Wizardry (The Support Pillar)

### 12.1 Overview
| Aspect | Design |
|--------|--------|
| **Pillar** | Support / Magic |
| **Core loop** | Academic Study (Researching Toms/Scrolls) → Magic Passives |
| **Benefit** | Reduces Rune consumption, increases Mana Max, unlocks new spells for Sorcery |

### 12.2 Research Options
- **Basic Scroll Reading**: Low XP, first-time unlock for Sorcery.
- **Tome of the Void**: Requires Scavenged fragments. Unlocks high-tier Void spells.
- **Celestial Almanac**: Study constellations (Astrology synergy) for global magic speed.

---

## 13. Future / Planned Skills (Soft Registry)

The following skills are registered in the engine and UI as "Coming Soon" or "Planned". Full design documents pending.

| Skill | Pillar | Core Concept |
|-------|--------|--------------|
| **Ranged** | Combat | Bows, thrown weapons, and wind-reading mechanics. |
| **Alchemy** | Crafting | Volatile transmutations and advanced battle-concoctions. |
| **Exploration** | Support | Map uncovering and hidden dungeon discovery. |
| **Cleansing** | Support | Purifying cursed gear and healing world corruption. |
| **Barter** | Support | Economic manipulation and Black Market access. |
| **Research** | Support | Passive Knowledge Tree progression. |
| **Chaos Theory** | Support | Embracing randomness and Blibbertooth's whims. |
| **Aether Weaving** | Cosmic | Reality manipulation for late-game gear. |
| **Void Walking** | Cosmic | Trailing through reality tears for shortcuts. |
| **Celestial Binding** | Cosmic | Automation via angelic/spirit contracts. |
| **Chronomancy** | Cosmic | Time-dilation and offline efficiency boosts. |
| **Constitution** | Combat | Advanced health regeneration and status resistance. |
| **Firemaking** | Crafting/Support | Consuming logs for utility buffs and heat. |
| **Magic** | Combat/Support | Generic mastery over Sorcery and Wizardry. |
