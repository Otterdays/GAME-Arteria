# Mining Internal Reference Guide

> **Inspirations:** Old School RuneScape, Melvor Idle, Terraria, Deep Rock Galactic.
> **Theme:** Traditional earth-bound excavation that pierces through the planetary crust and eventually into deep-space asteroids and cosmic rifts.
> **Purpose:** Blueprint for Arteria's Mining system, acting as the foundational gatherer for Smithing, Forging, Jewelcrafting, and Engineering.

---

## 1. Rock & Ore Progression
*Mining is the act of striking mineral veins with a pickaxe to extract raw ores. Early nodes yield standard terrestrial metals, while late-game nodes delve into celestial and void-infused minerals.*

| Ore Tier | Level | Primary Output | Secondary Drops | Theme / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Copper Vein** | 1 | Copper Ore | Uncut Geodes | Soft, orange-red metal. Yields very quickly. |
| **Tin Vein** | 1 | Tin Ore | Uncut Geodes | Soft, silvery metal. Yields very quickly. |
| **Iron Vein** | 15 | Iron Ore | Uncut Geodes | Dense, grey stone. Core component of early-mid game. |
| **Silver Vein** | 20 | Silver Ore | Sapphires, Emeralds | Shiny, conductive. First step into Jewelcrafting. |
| **Coal Rock** | 30 | Coal | Diamonds | Essential fuel source. Massive quantities needed for all higher-tier smelting. |
| **Gold Vein** | 40 | Gold Ore | Rubies, Diamonds | Soft, highly valuable. Primary material for high-end amulets/rings. |
| **Mithril Vein** | 50 | Mithril Ore | Runite Fragments | Deep blue veins found in lower cavern levels. |
| **Orichalcum Deposit**| 60 | Orichalcum Ore | Ancient Fossils | Red-gold deposits found near ancient ruins or deep magma vents. |
| **Adamantite Rock**| 70 | Adamantite Ore | Runite Fragments | Dark green, incredibly hard rock. Requires high-tier pickaxes. |
| **Meteorite Crater** | 75 | Meteorite | Stardust | Found on the surface or near impact zones. Highly magnetic. |
| **Runite Golem/Vein**| 85 | Runite Ore | Aether Shards | Cyan glowing rocks. Sometimes requires defeating/mining a Golem first. |
| **Aether Crystal** | 90 | Aether Ore | Lumina | Almost weightless, glowing white nodes found in celestial rifts. |
| **Void Fracture** | 95 | Void Fragment | Dark Matter | Black, light-absorbing anomalies. Highly volatile to mine. |
| **Fallen Star** | 99 | Fallen Star | Celestial Dust | Massive community/idle events. Takes a long time to mine but yields the ultimate ore. |

---

## 2. Tools & Equipment Synergies
*Gear that alters the Mining loop. Essential goals for Mastery upgrades or rare drops.*

| Tool / Item | Effect / Mechanics |
| :--- | :--- |
| **Pickaxes** | Base tools (Bronze -> Iron -> Steel -> Mithril -> Rune -> Dragon -> Celestial). Higher tiers mine significantly faster and are required to pierce harder rocks (e.g., Rune Pickaxe needed for Runite). |
| **Infernal / Smoldering Pickaxe** | *Synergy:* Has a % chance to instantly smelt the ore upon mining it, granting Smithing XP and placing a Bar in the inventory instead of Ore. |
| **Prospector's Outfit** | *Miner's Set.* Each piece grants a 20% chance to mine an ore 1-tick faster (up to 100% with full set). Maps to Arteria's **Speed Mastery**. |
| **Mining Helmet / Lumina Lantern** | Allows mining in "Deep Dark" zones (like Void Fractures) without suffering severe speed penalties or taking damage. |
| **Gem Bag / Coal Bag** | Vastly expands inventory capacity for specific secondary drops, allowing longer idle sessions. |
| **Glimmering Geodes** | *Random Drop Mechanic:* Rocks occasionally drop geodes. These can be cracked open at an Anvil/Jeweler's bench for gems (Sapphire, Ruby, Diamond) or rare cosmic dust. |

---

## 3. Notable Mechanics & Game-Design Takeaways

1. **The "Coal" Bottleneck:** In OSRS and Melvor, lower-tier ores (Bronze/Iron) become obsolete, but *Coal* remains relevant forever because it scales exponentially in smelting recipes (Mithril requires 4 Coal, Rune requires 8). Arteria should ensure Coal rocks are highly active idle targets until the player reaches the cosmic tiers (where Lumina takes over).
2. **Gem Rocks & Secondary Drops:** Mining shouldn't just be about metal. Rocks should have a small % chance to drop uncut gems or geodes. This provides the primary resource input for a future *Jewelcrafting/Crafting* skill.
3. **Rock Depletion vs. Infinite Idle:**
   *   *Traditional:* A rock depletes, yielding 1 ore, and the player must wait for it to respawn.
   *   *Idle Approach (Melvor/Arteria):* Rocks have infinite health, but the "swing time" (interval) determines the ore yield rate.
4. **Shooting Stars / Meteorites:** A fantastic idle mechanic. A massive node spawns randomly (or via a daily event) that takes *hours* to mine down, rewarding the player with massive XP and unique cosmic dust (Stardust) used for high-end shop purchases.
5. **Living Rocks / Golems:** High-tier nodes (like Runite or Void) could occasionally spawn a rock golem that must be defeated before the node can be mined, briefly pausing the idle skilling loop or requiring a base combat level.