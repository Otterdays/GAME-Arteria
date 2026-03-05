# Fletching & Tailoring — Future Implementation

> **Purpose:** Design doc for two planned crafting skills. Wood-based ranged gear (Fletching) and cloth-based armour (Tailoring).
> **Status:** Planned. Add to Skills grid with ComingSoonBadge (red). See MASTER_DESIGN_DOC §2.
> **Last updated:** 2026-03-05

---

## 1. Fletching

### 1.1 Overview

| Aspect | Design |
|--------|--------|
| **Pillar** | Crafting |
| **Core loop** | Logs → arrow shafts, bow parts; shafts + feathers + tips → arrows; parts → bows |
| **Crossover** | Logging (logs), Smithing (metal tips), Scavenging (feathers?), Mining (gems for enchanted arrows) |

### 1.2 Outputs

| Category | Examples |
|----------|----------|
| **Arrow shafts** | Logs → shafts (per wood tier: normal, oak, willow, etc.) |
| **Arrows** | Shafts + feathers + metal tip → bronze arrows, iron arrows, steel arrows, etc. |
| **Bow parts** | Logs → bow staves, string (from fibers?) |
| **Bows** | Stave + string → shortbow, longbow, composite bow (per wood tier) |
| **Crossbow parts** | Higher level; metal + wood |

### 1.3 Data Structures (draft)

```ts
interface FletchingRecipe {
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

### 1.4 Integration

- **Bank filter:** "Arrows", "Bows" or fold into "Equipment"
- **Stats:** "Arrows fletched", "Bows crafted"
- **Daily quests:** "Fletch X bronze arrows", "Craft Y oak shortbow"
- **Combat:** Ranged skill consumes arrows; bows equip in weapon slot
- **Mastery:** xp_bonus, yield_bonus, speed_bonus

---

## 2. Tailoring

### 2.1 Overview

| Aspect | Design |
|--------|--------|
| **Pillar** | Crafting |
| **Core loop** | Cloth/fiber → gloves, hats, shoes, boots, robes, etc. |
| **Crossover** | Harvesting (flax, cotton?), Scavenging (cloth scraps), Farming (future fiber crops) |

### 2.2 Outputs

| Slot | Examples |
|------|----------|
| **Hands** | Cloth gloves, leather gloves, reinforced gloves |
| **Head** | Cloth cap, wool hat, mage hood |
| **Feet** | Cloth shoes, leather boots, reinforced boots |
| **Body** | Cloth robe, leather vest (alternative to forged platebody for mages) |
| **Legs** | Cloth leggings, leather chaps |

### 2.3 Tiers (draft)

| Tier | Material | Level range |
|------|----------|-------------|
| Cloth | Cotton, linen | 1–20 |
| Leather | Leather scraps (Scavenging?) | 15–40 |
| Reinforced | Cloth + leather | 35–60 |
| Silk | Silk (Fey Markets?) | 50–75 |
| Void-touched | Void fibers | 70+ |

### 2.4 Data Structures (draft)

```ts
interface TailoringRecipe {
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

### 2.5 Integration

- **Bank filter:** "Cloth" or "Tailored" (type: equipment with subtype)
- **Stats:** "Items tailored"
- **Daily quests:** "Craft X cloth gloves", "Tailor Y leather boots"
- **Combat:** Light armour alternative to forged plate; mage/agility builds
- **Mastery:** xp_bonus, yield_bonus, speed_bonus

---

## 3. Implementation Order

| Order | Skill | Rationale |
|-------|-------|-----------|
| 1 | **Fletching** | Feeds Ranged combat; reuses Logging + Smithing; arrows are consumable (recurring demand) |
| 2 | **Tailoring** | Adds cloth armour path; needs fiber source (Harvesting expansion or Scavenging) |

---

## 4. Skill Icons (App)

- **Fletching:** 🏹 (bow and arrow)
- **Tailoring:** 🧵 (thread/spool)
- **Theme colors:** Fletching #d35400 (orange), Tailoring #e91e63 (pink)
- **ComingSoonBadge:** Red (planned) until implementation starts
