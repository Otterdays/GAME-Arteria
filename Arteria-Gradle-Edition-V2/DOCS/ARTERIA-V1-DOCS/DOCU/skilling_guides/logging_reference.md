# Logging (Woodcutting) Internal Reference Guide

> **Inspirations:** Old School RuneScape, Melvor Idle, Curse of Aros, CherryTree.
> **Theme:** Traditional survival forestry scaling upwards into rare ancient woods, crystallized trees, and celestial timber.
> **Purpose:** Blueprint for expanding Arteria's Logging system, its mechanics, and ensuring strong interplay with Fletching, Firemaking, and Engineering.

---

## 1. Tree & Log Progression
*Players chop trees with axes to harvest logs. Lower tier trees chop very quickly but yield low XP. Higher tier trees take significantly longer but provide massive XP and highly valuable materials for late-game crafting.*

| Tree Tier | Level | Primary Output | Yield Speed | Theme / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Normal / Pine** | 1 | Pine Log | Very Fast | The mundane beginning. Common forest tree. |
| **Oak** | 15 | Oak Log | Fast | Sturdy and reliable. First milestone for serious construction. |
| **Apple / Fruit** | 20 | Applewood + Apples | Fast | Yields logs and occasional fruit for cooking. |
| **Willow** | 30 | Willow Log | Moderate | Fast XP scaling. Good for mid-tier bows. |
| **Teak** | 35 | Teak Log | Moderate | Tropical hardwood, excellent for shipbuilding (Sailing/Engineering). |
| **Maple** | 45 | Maple Log | Moderate-Slow | Dense wood with high energy yield for Firemaking. |
| **Mahogany** | 50 | Mahogany Log | Slow | Premium hardwood. Essential for high-end furniture/planks. |
| **Yew** | 60 | Yew Log | Slow | Ancient, flexible wood. The standard for high-level archery. |
| **Magic** | 75 | Magic Log | Very Slow | Shimmering, star-lit trees that hum with arcane power. Requires high-end axes. |
| **Redwood** | 90 | Redwood Log | Extremely Slow | Massive, ancient titans. Great for sheer XP and massive construction projects. |
| **Corundum / Crystal**| 95 | Crystal Log | Extremely Slow | Glass-like trees found in crystalline caves. Used for arcane tuning. |
| **Aetherwood** | 99 | Aether Log | Cosmic/Variable| Ethereal, glowing trunks. Found in cosmic rifts. Requires cosmic axes. |

---

## 2. Tools & Equipment Synergies
*Gear that alters the Logging loop. Great goals for Mastery upgrades or rare drops.*

| Tool / Item | Effect / Mechanics |
| :--- | :--- |
| **Hatchets / Axes** | Base tools. Speed of logging scales linearly with the tier of the axe (Bronze -> Iron -> Steel -> Mithril -> Rune -> Cosmic/Aether). |
| **Infernal Axe / Flame-forged Axe** | *Synergy:* Has a % chance to instantly burn the log upon chopping, granting Firemaking XP instead of a log in the inventory. |
| **Nature's Sentinel Outfit** | *Lumberjack Set.* Each piece grants a 20% chance to chop 1-tick faster (up to 100% with full set). Maps to Arteria's **Speed Mastery**. |
| **Bird's Nests** | *Random Drop Mechanic:* Trees occasionally drop a nest. Nests can be opened to reveal rare Tree Seeds (for Farming), Jewellery/Rings, or Feathers (for Fletching). |
| **Geodes / Amber** | *Random Drop Mechanic:* Deep-rooted trees (Redwood, Crystal) can drop geodes containing rare gems or cosmic fragments. |

---

## 3. Notable Mechanics & Game-Design Takeaways

1. **Multi-Tree Cutting (Idle Synergy):** Inspired by *Melvor Idle*, unlocking specific Masteries or upgrading tools could allow the player to passively cut 2 or 3 trees simultaneously, mixing XP rates and log yields (e.g., cutting Pine for fast cheap logs while slowly chipping away at a Magic tree).
2. **Infinite Nodes vs. Depletion:** Traditional games (OSRS) use "Node HP" where a tree depletes and goes on cooldown. Idle games (Melvor/Arteria) often prefer infinite cutting. *Arteria approach:* Nodes are infinite, but random events (like "Falling Branch" or "Ent Attack") keep the player engaged.
3. **Plank Making (The Resource Sink):** Logs by themselves shouldn't just sit in the bank. They should be converted to *Planks* at a Sawmill or Engineering bench (Log + Coins + Nails = Plank). Planks are the primary sink for Construction/Shipbuilding.
4. **Fruit & Seed Drops:** Incorporating fruit trees (Apple, Cherry) bridges the gap between Logging, Cooking, and Farming, allowing passive gathering of secondary materials.