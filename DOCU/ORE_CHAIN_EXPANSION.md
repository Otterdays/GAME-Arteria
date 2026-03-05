# Ore Chain Expansion — Mining / Smithing / Forging Depth

> **Purpose:** Add depth to the Ore Chain (Mining → Smithing → Forging). Options ordered by effort and impact.
> **Status:** §2.1–2.3 implemented (2026-03-05). §3+ remain design.
> **Last updated:** 2026-03-05

---

## 1. Current State

| Skill | Content | Gaps |
|-------|---------|------|
| **Mining** | 8 ore nodes (Copper→Runite), 3 essence nodes. **Gems:** Sapphire, Emerald, Ruby, Diamond (rare drops). | No pickaxe; no vein depletion; no fuel crossover. |
| **Smithing** | 7 smelt recipes (Bronze→Runite). Iron = 1 ore; Steel = 1 iron + 2 coal; Gold/Mithril/Adamant/Runite use coal. | No Logging fuel; no Scavenging recycling; no Heat Management. |
| **Forging** | 36 recipes: dagger, sword, half helmet, full helmet, platebody, shield × 6 tiers (Bronze→Runite). Runite story-gated. | No Equipment Quirks. |

---

## 2. Quick Wins (Low Effort)

### 2.1 Runite Forging Tier

**What:** Add Runite dagger, half helmet, full helmet (same pattern as Adamant).

| Recipe | Bars | Level | XP |
|--------|------|-------|-----|
| Runite Dagger | 1 runite_bar | 85 | 75 |
| Runite Half Helmet | 1 runite_bar | 86 | 75 |
| Runite Full Helmet | 2 runite_bar | 88 | 90 |

**Files:** `forging.ts`, `items.ts`. Gate by same narrative as Runite ore.

---

### 2.2 More Forging Equipment Types

**What:** Add swords (2 bars), platebody (3 bars), shield (2 bars) per tier. Expands variety without new systems.

| Type | Bars | Notes |
|------|------|-------|
| Sword | 2 | Main weapon; higher level req than dagger |
| Platebody | 3 | Body slot; highest bar cost |
| Shield | 2 | Off-hand; gates block in combat |

**Tiers:** Bronze→Runite. Level reqs: sword = dagger+2, platebody = full_helmet+5, shield = half_helmet+1.

---

### 2.3 Gems (Mining Rare Drops)

**What:** Low chance to find gems while mining ore nodes. Gems used later for jewelry, enchanting.

| Gem | Source | Chance | Use |
|-----|--------|--------|-----|
| Sapphire | Iron+ | 2% | Crafting (future) |
| Emerald | Coal+ | 1.5% | Crafting |
| Ruby | Mithril+ | 1% | Crafting |
| Diamond | Adamant+ | 0.5% | Crafting, Runite |

**Items:** Add `sapphire`, `emerald`, `ruby`, `diamond` to `items.ts` (type: `other` or new `gem`). `useGameLoop` applies chance on successful mining tick.

---

## 3. Medium Effort

### 3.1 Pickaxe Tiers

**What:** Equippable or "active" pickaxe. Higher tier = faster mining (lower `baseTickMs` or +% speed).

| Pickaxe | Bars | Mining Req | Effect |
|---------|------|------------|--------|
| Bronze | 2 bronze_bar | 1 | Base speed |
| Iron | 2 iron_bar | 15 | +10% speed |
| Steel | 2 steel_bar | 30 | +20% speed |
| Mithril | 2 mithril_bar | 50 | +30% speed |
| Adamant | 2 adamant_bar | 70 | +40% speed |
| Runite | 2 runite_bar | 85 | +50% speed |

**Implementation:** `player.equippedPickaxe` or `player.activePickaxeId`. `useGameLoop` reads it and applies `intervalMs = baseTickMs / (1 + speedBonus)`.

---

### 3.2 Furnace Fuel (Logging Crossover)

**What:** Smithing consumes logs (or coal) as fuel. Coal remains primary; logs optional for early game.

| Recipe | Fuel Option A | Fuel Option B |
|--------|---------------|---------------|
| Bronze | 1 coal OR 2 normal_log | — |
| Iron | 2 coal OR 3 oak_log | — |
| Steel | 3 coal OR 4 oak_log | — |

**Crossover:** Logging → Smithing. Wood Chain feeds Ore Chain.

---

### 3.3 Scrap Recycling (Scavenging Crossover)

**What:** Smithing recipe: `rusty_scrap` + `coal` → salvage bar (e.g. `iron_bar` at 50% chance, or new `recycled_bar`).

| Recipe | Input | Output |
|--------|-------|--------|
| Recycle Scrap | 5 rusty_scrap + 1 coal | 1 iron_bar (70% success) |
| Recycle Tech | 3 discarded_tech + 2 coal | 1 steel_bar (50% success) |

**Crossover:** Scavenging → Smithing. Gives scrap a sink.

---

## 4. Larger (Design-Doc Planned)

### 4.1 Heat Management (Smithing)

**From MASTER_DESIGN_DOC:** Active play = tap to keep heat in green zone → 2× speed. Offline = standard rate.

**Design:** `furnaceHeat` 0–100. Decays over time; player taps to stoke. Green zone 40–60 = 2× multiplier. Requires active UI (slider or tap rhythm).

---

### 4.2 Equipment Quirks (Forging)

**From MASTER_DESIGN_DOC:** Forged items gain random "Cosmic Quirks" (e.g. "...of Talking to Squirrels").

**Design:** On forge success, roll `quirkId` from table. Store in `item.quirkId` or `player.equipmentQuirks[itemInstanceId]`. Quirks grant small stat bonuses + flavor. Cleansing skill removes; Chaos Theory enhances.

---

### 4.3 Vein Depletion (Mining)

**From MASTER_DESIGN_DOC:** Rich veins exhaust after heavy mining, respawn over time.

**Design:** Per-node `depletionTicks` or `remainingYield`. Mining consumes; at 0, node "depleted" for N real-time minutes. Forces rotation or patience.

---

### 4.4 Gold Jewelry (Smithing/Forging)

**What:** Gold bar → ring, necklace (cosmetic or small stat bonus). Different from combat gear.

| Recipe | Input | Output |
|--------|-------|--------|
| Gold Ring | 1 gold_bar | gold_ring |
| Gold Necklace | 2 gold_bar | gold_necklace |

**Use:** Ring/Amulet slots in combat; or sell for gp. Gems (from 2.3) could be added to rings for bonuses.

---

## 5. Implementation Order (Suggested)

| Order | Item | Effort | Impact |
|-------|------|--------|--------|
| 1 | Runite Forging | Low | Completes tier progression |
| 2 | Swords, Platebody, Shield | Low–Med | More equipment variety |
| 3 | Gems (mining drops) | Low | Future Crafting hook |
| 4 | Pickaxe tiers | Med | Clear progression, Forging sink for bars |
| 5 | Furnace fuel (logs) | Med | Wood Chain crossover |
| 6 | Scrap recycling | Med | Scavenging crossover |
| 7 | Gold jewelry | Med | Gold bar sink, slot preview |
| 8 | Heat Management | High | Active Smithing mechanic |
| 9 | Equipment Quirks | High | Combat depth, Chaos Theory hook |
| 10 | Vein Depletion | High | Mining depth, exploration pressure |

---

## 6. Cross-References

- **MASTER_DESIGN_DOC** §2.6.1 Ore Chain, §11.1 Cosmic Quirks, §6 Mining/Smithing Specializations
- **gemini_notes** §3 Heat management, §4.1 More nodes/recipes
- **Bank "Used in"** — extend `getUsedInSkills` for new item types (gem, pickaxe)
