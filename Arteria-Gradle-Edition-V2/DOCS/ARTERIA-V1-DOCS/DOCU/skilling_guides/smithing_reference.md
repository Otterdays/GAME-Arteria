# Smithing & Forging Internal Reference Guide

> **Inspirations:** Old School RuneScape, Terraria, Skyrim, Path of Exile.
> **Theme:** Traditional medieval fantasy metallurgy that seamlessly scales into cosmic, celestial, and void-tech materials, fitting Arteria's unique aesthetic.
> **Purpose:** Blueprint for expanding Arteria's Smithing (Furnace) and Forging (Anvil) systems, ensuring a vast, satisfying progression curve.

---

## 1. Smelting Progression (Ore to Bars)
*Smelting converts raw planetary and cosmic ores into workable ingots. As temperatures and metal complexity increase, players must transition from using Coal to celestial catalysts like Lumina or Dark Matter.*

| Bar Tier | Level | Primary Ore | Secondary / Catalyst | Theme / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Bronze** | 1 | 1x Copper | 1x Tin | The mundane beginning. |
| **Iron** | 15 | 1x Iron | - | *50% failure rate*. Teaches the player about risk and equipment mitigation. |
| **Silver** | 20 | 1x Silver | - | Highly conductive. Used for early arcane foci and jewellery. |
| **Steel** | 30 | 1x Iron | 2x Coal | The staple of early combat and industrial machinery. |
| **Gold** | 40 | 1x Gold | - | High value. Exceptional XP scaling if proper gauntlets are worn. |
| **Electrum** | 45 | 1x Gold | 1x Silver | An alloy. The baseline for high-end crafting rings and amulets. |
| **Mithril** | 50 | 1x Mithril | 4x Coal | Lightweight, bluish tint. Traditional fantasy staple. |
| **Orichalcum**| 60 | 1x Orichalcum | 1x Copper, 4x Coal | A dense, red-gold alloy from ancient ruins. Great for heavy tank gear. |
| **Adamant** | 70 | 1x Adamantite | 6x Coal | Incredibly dense, dark green metal. |
| **Meteoric** | 75 | 1x Meteorite | 1x Iron, 6x Coal | *The bridge to the cosmos.* Magnetic, used for compasses and early astrolabes. |
| **Runite** | 85 | 1x Runite | 8x Coal | Cyan tinted, naturally infused with planetary leylines. |
| **Aetherium** | 90 | 1x Aether Ore | 1x Lumina | Almost weightless, glowing white. The coal requirement is replaced by Lumina. |
| **Void-Iron** | 95 | 1x Void Fragment | 1x Iron, 2x Dark Matter | Absorbs light. High failure rate (collapses into singularities) without mastery. |
| **Starmetal** | 99 | 1x Fallen Star | 1x Runite, 5x Lumina | The ultimate celestial alloy. Pulses with cosmic energy. |

---

## 2. Forging Progression (Bars to Items)
*Bars are hammered, folded, and shaped into tools, weapons, and cosmic apparatuses. Experience scales linearly based on the number of bars required.*

### 1-Bar Items (Fast XP & Resource Sinks)
*Primarily used for quick leveling, basic tools, or mass-produced consumables that feed into other skills.*
- **Tools:** Dagger, Axe, Pickaxe, Mace, Sickle.
- **Consumables (Yields 10-15 per bar):** Nails, Arrowtips, Dart Tips, Throwing Knives. 
- **Components:** Crossbow Limbs, Cog-wheels, Copper Wire, Rivets *(Crucial for future Engineering/Construction expansions).*
- **Arcane:** Foci bases, Wand handles.

### 2-Bar Items (Standard Adventurer Gear)
*The bread and butter of player progression.*
- **Weapons:** Scimitar, Longsword, Claws, Rapier.
- **Armour:** Full Helmet, Square Shield.
- **Cosmic:** Astrolabe Casing, Lens Frames, Lumina Lanterns.

### 3-Bar Items (Heavy & Complex)
*High material cost for heavy-duty combat and specialized machinery.*
- **Weapons:** Warhammer, Battleaxe, Two-handed Longblade, Halberd.
- **Armour:** Chainbody, Kiteshield, Platelegs, Plateskirt.
- **Cosmic:** Void-Engine Core, Leyline Conduits.

### 5-Bar Items (Masterworks)
*The pinnacle of a tier. Requires massive resource investment.*
- **Armour:** Platebody, Tower Shield.
- **Constructs:** Ship Keels, Void-Drill Heads, Celestial Telescope Mounts.

---

## 3. Synergistic Tools & Equipment
*Equippable gear and unlockables that alter the Smithing loop. These serve as excellent goals for Arteria's Mastery system or rare drops.*

| Item | Effect / Mechanics |
| :--- | :--- |
| **Resonance Hammer** | Equippable tool. Emits a hum that slightly increases XP when forging celestial metals (Level 75+). |
| **Ring of Forging** | Grants 100% success rate when smelting Iron (bypassing the 50% fail rate). |
| **Thermal Gauntlets** | Required to handle super-heated (Meteoric) or absolute-zero (Void-Iron) metals without taking damage. |
| **Goldsmith Gauntlets** | Drastically increases the base XP from smelting Gold/Electrum. |
| **Smiths' Uniform** | Each piece gives a 20% chance to speed up anvil actions by 1 tick (up to 100% with full set). Maps perfectly to Arteria's **Speed Mastery**. |
| **Dust Pouch / Coal Bag** | Expands inventory capacity specifically for Coal or Lumina, effectively doubling how many bars you can smelt per bank trip. |
| **Multi-Moulds** | Allows casting 2x or 4x consumables (cannonballs, nails) simultaneously. Maps to Arteria's **Yield Mastery**. |

---

## 4. Notable Mechanics & Game-Design Takeaways

1. **The "Batch" Sink:** By making utility items (Nails, Wire, Screws) yield in batches of 10-15 per bar, you create a massive, continuous sink for metal bars. Players will need *thousands* of nails for Construction, ensuring low-tier metals like Bronze and Iron remain highly relevant in the late game.
2. **Exponential Fuel Scaling:** Earthly metals require increasingly more Coal (Mithril=4, Rune=8). This prevents Coal from becoming obsolete. When transitioning to Cosmic metals (Level 90+), the fuel shifts to *Lumina* and *Dark Matter*, creating an endgame sink for the game's premium currencies/resources.
3. **Alloy Crafting:** Rather than just Ore + Fuel = Bar, alloys like Electrum (Gold + Silver) and Meteoric (Meteorite + Iron) require blending multiple base materials. This weaves the tiers together and adds complexity to the crafting chains.
4. **Volatile Metals:** Iron introduces a 50% failure rate to teach risk. This mechanic returns at Level 95 with Void-Iron, which has a chance to "collapse into a useless singularity" unless the player has unlocked specific Masteries or wears Thermal Gauntlets.