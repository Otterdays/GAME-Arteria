# **AETHERIA: THE IDLE CHRONICLES**
## *Comprehensive Game Design Document*

> **Version 2.0 — Consolidated 2026-03-05**
> All design information from satellite docs (COMPANIONS, WORLD_EXPLORATION, CURRENT_IMPROVEMENTS, STACK_ASSESSMENT, zhip-ai-styling, zhipu-ai, gemini_notes, THEMING, FUTURE_NOTES) has been merged into this master document.
> Original design built with the help of Kimi K2.5.

**Document Version:** 2.0 — The Expanded Cosmos  
**Last Updated:** 2026-03-05  
**Status:** Major Expansion — New Systems & World Depth

---

# **TABLE OF CONTENTS**

## **PART I: FOUNDATIONS**
- **Chapter 1:** Executive Summary & Core Identity
- **Chapter 2:** The Skills Overview — 17 Skills & Counting (10 Implemented, 7 Coming Soon)
- **Chapter 3:** The World Bible — Valdoria & The Cosmos
- **Chapter 4:** Character System — The Anchor

## **PART II: PROGRESSION SYSTEMS**
- **Chapter 5:** The Skill Pillars Deep Dive (25 Skills)
- **Chapter 6:** Advanced Mastery & Prestige
- **Chapter 7:** The Absurdity System (Chaos Theory)

## **PART III: WORLD & EXPLORATION**
- **Chapter 8:** Location System — The Idle-Friendly World
- **Chapter 9:** World State & The Unraveling
- **Chapter 10:** The Seasonal Calendar

## **PART IV: COMBAT & EQUIPMENT**
- **Chapter 10:** Combat System — "The Encounter"
- **Chapter 11:** Equipment & The Paper Doll

## **PART V: SOCIAL & PERSONALIZATION**
- **Chapter 13:** Housing & The Sanctum
- **Chapter 14:** Companion System — Wandering Souls
- **Chapter 15:** The Chronicle System

## **PART VI: ECONOMY & MONETIZATION**
- **Chapter 16:** Currency Systems & The Lumina Shop
- **Chapter 17:** The Consumption Economy (Food & Potions)
- **Chapter 18:** Monetization & Retention Architecture

## **PART VII: NARRATIVE & TECHNICAL**
- **Chapter 19:** The Narrative System
- **Chapter 20:** Technical Architecture
- **Chapter 21:** Future Expansion Hooks

## **APPENDICES**
- **Appendix A:** Current Implementation Status & Expansion Surface
- **Appendix B:** Companion Deep Design
- **Appendix C:** UI/UX Design Language
- **Appendix D:** Bank OSRS-fication — UX Analysis
- **Appendix E:** Random Events — Deep Design
- **Appendix F:** Theming Architecture
- **Appendix G:** Technical Stack & Future Dependencies
- **Appendix H:** Melvor Idle Reference Architecture

---

# **PART I: FOUNDATIONS**

## **Chapter 1: Executive Summary & Core Identity**

### 1.1 The Vision

**Aetheria** is a cosmic fantasy idle RPG blending bright magical wonder with eldritch dark fantasy elements. Players progress through a single kingdom (Valdoria) while uncovering cosmic threats that bridge the material and astral planes. The game emphasizes **constant micro-goals**—ensuring players always have "one more thing" to achieve before logging off, whether that's a crafting queue finishing, a dungeon timer resetting, or a skill milestone unlocking new content.

**Core Loop:** Skill training → Resource gathering → Crafting/Combat → Exploration → Story unlocks → Repeat with new tools

### 1.2 What Makes Aetheria Different

1. **The Comedy-Cosmic Tone:** Most idle games are serious fantasy or pure comedy. Aetheria treats absurdity as a cosmic force—players save reality by accepting that existence is inherently ridiculous.

2. **The Anchor Identity:** You're not a chosen hero; you're a cosmic accident with a job to do. This justifies both the idle mechanics (you're so heavy you just... stay places) and the progression (you're literally becoming more grounded).

3. **The "Blibbertooth Factor":** Random blessings and curses that are mechanically interesting, not just flavor.

4. **Crossover Economy:** Unlike Melvor's modular skills, Aetheria forces interaction—crafting a sword requires Mining, Smithing, Woodcutting, and maybe Cleansing if the ore was cursed.

5. **The "Just One More" UI:** Every screen shows three things: what you accomplished (dopamine), what you can do now (engagement), and what's coming soon (retention).

---

## **Chapter 2: The Skills Overview — 17 Skills & Counting**
> **Current Status:** 10 Skills Implemented | 7 Skills Coming Soon | 8+ Planned
> 
> This chapter provides the complete skill landscape. For detailed mechanics of implemented skills, see their sections below. For the full 25-skill deep dive, see Chapter 5.

> **Current Status:** 10 Skills Implemented | 7 Skills Coming Soon | 8 Planned for Future

Aetheria's skill system is the core of progression. Skills are organized into **Pillars** — logical groupings that help players understand the ecosystem. Each skill has unique mechanics, mastery paths, and interacts with other skills in the crossover economy.

---

### **2.1 Skill Status Board**

| Pillar | Implemented ✅ | Coming Soon 🚧 | Planned 🔮 |
|--------|---------------|----------------|------------|
| **Gathering** | Mining, Logging, Fishing, Harvesting, Scavenging | — | — |
| **Crafting** | Runecrafting, Smithing, Forging, Cooking, Herblore | Crafting, Farming | Tailoring, Alchemy, Fletching, Construction |
| **Combat** | — | Attack, Strength, Defence, Hitpoints | Ranged, Magic, Constitution |
| **Support** | — | Agility | Exploration, Cleansing, Barter, Leadership, Research, Chaos Theory |
| **Cosmic** | — | — | Aether Weaving, Void Walking, Celestial Binding, Chronomancy |

**Total:** 17 defined (10 live, 7 in development) + 8 planned cosmic/endgame

---

### **2.2 Gathering Pillar — The Foundation (5 Skills) ✅**

These skills gather raw materials from the world. All 5 are **fully implemented** with screens, nodes, and progression.

#### **⛏️ Mining — "The Bedrock"**
> *"Strike the earth. The deeper you go, the stranger the ore becomes."*

- **Core Mechanic:** **Vein Depletion** — Rich veins exhaust after heavy mining and respawn over time. Forces exploration or patience.
- **Nodes:** Copper (Lv 1), Tin, Iron, Coal, Gold, Mithril, Adamant, Runite (Lv 85)
- **Mastery Bonuses:** +5% XP, +3% yield, +4% speed per level
- **SFX:** Tink (expo-audio) on each successful tick
- **Crossover:** Ore → Smithing (smelt to bars); essence → Runecrafting. *Part of **Ore Chain** (Mining → Smithing → Forging).*
- **Pet:** Rocky — rare drop from mining nodes

#### **🪓 Logging — "The Whispering Cut"**
> *"Trees gossip. Higher levels learn to ask nicely for better yields."*

- **Core Mechanic:** **Diplomacy Factor** — Higher levels unlock "asking nicely" for bonus yields without fighting the tree
- **Nodes:** Normal Trees, Oak, Willow, Maple, Yew, Magic Trees
- **Seasonal Rotation:** Certain trees only available specific real-world weeks
- **Mastery Bonuses:** +5% XP, +3% yield, +4% speed per level
- **SFX:** Thump on tick
- **Crossover:** Logs → Smithing (fuel), Construction (housing), Fletching (bows). *Part of **Wood Chain** (Logging ↔ Firemaking, planned).*
- **Pet:** Timber — rare drop from logging

#### **🎣 Fishing — "The Patient Reel"**
> *"The One That Got Away is real. And it knows your name."*

- **Core Mechanic:** **Mythic Fish** — Rare "mythic" catches requiring specific bait combinations discovered through experimentation
- **Spots:** Shrimp, Sardine, Herring, Trout, Salmon, Tuna, Lobster, Swordfish, Shark, Cosmic Jellyfish
- **Void-Fishing:** Late-game spots in reality tears for void-scaled fish
- **Mastery Bonuses:** +5% XP, +3% yield, +4% speed per level
- **SFX:** Splash on tick
- **Crossover:** Raw fish → Cooking (food for HP/combat buffs). *Part of **Food Chain** (Fishing → Cooking).*
- **Pet:** Bubbles — rare drop from fishing

#### **🪴 Harvesting — "The Green Touch"**
> *"Wheat, cabbage, void caps — if it grows, I've poked it."* — Bianca

- **Core Mechanic:** **Seasonal Rotation** — Different herbs available based on real-world week
- **Nodes:** Wheat Field, Cabbage Patch, Tomato Grove, Sweetcorn, Strawberry, Snape Grass, Void Caps
- **Key Resource:** Void Cap Mushroom — required for Void Resistance potions
- **Mastery Bonuses:** +5% XP, +3% yield, +4% speed per level
- **SFX:** Thump on tick
- **Crossover:** Herbs → Herblore (potions), Cooking (ingredients), Farming (seeds). *Part of **Herb Chain** (Harvesting → Herblore).*
- **Pet:** Sprout — rare drop from harvesting

#### **🏕️ Scavenging — "The Lucky Find"**
> *"One person's cosmic debris is another person's treasure."*

- **Core Mechanic:** **Curse Chance** — Higher-level areas have cursed items requiring Cleansing skill to purify
- **Nodes:** Surface Ruins, Buried Settlement, Fey Outpost, Skyward Debris, Void Rupture
- **Resources:** Rusty Scrap, Discarded Tech, Fey Trinket, Celestial Fragment, Voidmire Crystal
- **Mastery Bonuses:** +5% XP, +3% yield, +4% speed per level
- **SFX:** Thump on tick
- **Crossover:** Scrap → Smithing (recycling), Tech → Research (unlocks), Fragments → Runecrafting (powerful runes)
- **Pet:** Scrapper — rare drop from scavenging

---

### **2.3 Crafting Pillar — The Engine (5 Skills Live, 2 Coming Soon, 3 Planned)**

Transform raw materials into useful items. The crossover hub of the economy.

#### **✨ Runecrafting — "The Sacred Geometry"**
> *"Shape the magic. Essence becomes rune, rune becomes power."*

- **Core Mechanic:** **Cosmic Alignment** — Some enchantments only possible during specific real-world times ("Lunar Weave" at night)
- **Altars:** Air, Mind, Water, Earth, Fire, Body, Cosmic, Chaos, Nature, Law, Death, Blood, Void
- **Process:** Consume essence → Produce runes (used for magic/enchanting)
- **Mastery Bonuses:** +5% XP, +3% runes, +4% speed per level
- **SFX:** Tink on tick
- **Crossover:** Runes → Magic skill (spellcasting), Equipment enchanting. *Part of **Rune Chain** (Mining essence → Runecrafting).*
- **Pet:** Runebound — rare drop from runecrafting

#### **🔨 Smithing — "The Forge's Heat"**
> *"Ore becomes bar, bar becomes blade. Temperature is everything."*

- **Core Mechanic:** **Heat Management** — Active play allows temperature optimization (2x speed when in green zone). Offline uses standard rate.
- **Recipes:** Bronze, Iron, Steel, Mithril, Adamant, Runite bars (smelting ore)
- **Specializations (Lv 50):** Deep Delver → Armorsmith → Artificer path for magical equipment
- **Mastery Bonuses:** +5% XP, +3% bars, +4% speed per level
- **SFX:** Tink on tick
- **Crossover:** Bars → Forging (equipment), Construction (nails), Crafting (arrowheads). *Part of **Ore Chain** (Mining → Smithing → Forging).*
- **Pet:** Ember — rare drop from smithing

#### **⚒️ Forging — "The Hammer's Song"**
> *"Give form to metal. Daggers, blades, helmets, the tools of survival."*

- **Core Mechanic:** **Pattern Mastery** — Active mini-game for perfect temperature/timing (quality bonus). Offline produces standard quality.
- **Weapons:** Dagger (1 bar), Shortsword (2), Longsword (2), Scimitar (2), 2H Longblade (3). Per tier Bronze → Runite.
- **Armour:** Half helmet, full helmet, platebody, shield. Runite tier narrative-gated.
- **Equipment Quirks:** Forged items gain random "Cosmic Quirks" (e.g., "...of Talking to Squirrels")
- **Mastery Bonuses:** +5% XP, +3% gear, +4% speed per level
- **SFX:** Tink on tick
- **Crossover:** Bars (from Smithing) → Equipment (for Combat). *Part of **Ore Chain** (Mining → Smithing → Forging).*
- **Pet:** Anvil — rare drop from forging

#### **🍳 Cooking — "The Hearth"**
> *"Raw fish becomes feast. Seasoning is the secret."*

- **Core Mechanic:** **Taste Testing** — Active play allows adjusting seasoning for optimal buff duration. Offline gives standard duration.
- **Recipes:** Shrimp, Sardine, Herring, Trout, Salmon, Tuna, Lobster, Swordfish, Shark, Cosmic Jellyfish
- **Food Buffs:** Hearty (+HP), Brain Food (+XP), Lucky Charms (+drops), Speed Snacks (+action speed)
- **Mastery Bonuses:** +5% XP, +3% food, +4% speed per level
- **SFX:** Thump on tick
- **Crossover:** Raw fish (from Fishing) → Cooked food (for Combat buffs), Gourmet Alchemy synergy with Herblore. *Part of **Food Chain** (Fishing → Cooking).*
- **Pet:** Chef — rare drop from cooking

#### **🧪 Herblore — "The Cauldron's Secret"**
> *"Herb + Vial = Power. Don't ask how I know about void caps."* — Bianca

- **Core Mechanic:** **Recipe Discovery** — Some potions require experimentation to discover; hints hidden in NPC dialogue
- **Recipes:** Minor Healing, Strength Elixir, Agility Tonic, Defence Brew, XP Boost, Nature's Blessing, Void Resistance
- **Key Ingredient:** Empty Vial (purchased from Nick) + Herb (from Harvesting)
- **Mastery Bonuses:** +5% XP, +3% yield, +4% speed per level
- **SFX:** Tink on tick
- **Crossover:** Herbs (Harvesting) + Vials (Shop) → Potions (buffs/combat). *Part of **Herb Chain** (Harvesting → Herblore).*
- **Pet:** Fizz — rare drop from herblore (tiny cauldron)

---

### **2.4 Coming Soon — The Road Ahead (7 Skills)**

These skills are defined in code but not yet fully implemented with screens and mechanics.

| Skill | Pillar | Status | Core Mechanic Preview |
|-------|--------|--------|----------------------|
| **Crafting** 🔜 | Crafting | 🚧 Planned | General crafting: arrows, bags, jewelry. The "miscellaneous" creator. |
| **Farming** 🔜 | Crafting | 🚧 Planned | Patches with growth timers. Seeds → Crops over real-time hours. Housing garden visual. |
| **Attack** 🔜 | Combat | 🚧 Planned | Melee accuracy/power. Weapon specialization branches. |
| **Strength** 🔜 | Combat | 🚧 Planned | Carry weight, melee damage, mining power. Gates equipment tiers. |
| **Defence** 🔜 | Combat | 🚧 Planned | Damage reduction, blocking. Active: Perfect block timing. |
| **Hitpoints** 🔜 | Combat | 🚧 Planned | Health pool, healing rate. Gates content (need 50 HP for Void-Toxic zones). |
| **Agility** 🔜 | Support | 🚧 Planned | Courses with shortcuts. Unlocks movement bonuses, obstacle traversing. |

---

### **2.5 Planned for Future — The Cosmos Awaits (8+ Skills)**

These skills are planned in design documents but not yet coded. They represent the full 25-skill vision.

**Crafting Expansion:**
- **Fletching** — Logs → arrow shafts, bow parts; shafts + feathers + metal tips → arrows; bows. Feeds Ranged. *See DOCU/FLETCHING_TAILORING.md.*
- **Tailoring** — Cloth/fiber → gloves, hats, shoes, boots, robes. Light armour alternative to forged plate. *See DOCU/FLETCHING_TAILORING.md.*
- **Alchemy** — Potions, bombs, transmutations. Volatility: catch unstable reactions.
- **Construction** — Player housing, guild halls. Blueprint system requiring multiple skills.

**Combat Expansion:**
- **Ranged** — Bows, thrown weapons. Wind Reading environmental factor.
- **Magic** — Spellcasting (Luminar/Voidmire/Balanced). Spell Weaving for hybrid effects.
- **Constitution** — Health, healing, disease resistance. Gates content.

**Support Pillar:**
- **Exploration** — Map uncovering, fast travel points, hidden dungeons.
- **Cleansing** — Purify cursed items, heal Unraveling zones. Essential for endgame.
- **Barter** — Shop prices, Black Market access.
- **Leadership** — Companion buffs, guild bonuses. Gates companion count.
- **Research** — Unlock recipes, lore, enemy weaknesses. Knowledge Tree.
- **Chaos Theory** — Embrace randomness. The "Seriousness" management skill.

**Cosmic Pillar (Endgame):**
- **Aether Weaving** — Manipulate reality for legendary crafting (requires 3 skills at 80).
- **Void Walking** — Short-range teleportation, access hidden areas.
- **Celestial Binding** — Summon angelic assistants for automation.
- **Chronomancy** — Speed up skill training, reset daily limits once/week.

---

### **2.6 The Crossover Economy — How Skills Interact**

Aetheria's skills are **intentionally interdependent**. Unlike modular idle games, you cannot max one skill in isolation:

```
Mining ──┬──► Smithing ───┬──► Forging ───► Combat Equipment
         │                │
         │                └──► Construction (housing)
         │
         └──► Runecrafting ───► Magic/Enchanting

Fishing ──► Cooking ───┬──► Combat Buffs
                       │
Harvesting ──► Herblore ┘

Logging ───┬──► Smithing (fuel)
            ├──► Construction (housing materials)
            └──► Fletching (bow materials) [coming soon]
```

#### **2.6.1 Labeled Skill Chains — Explicit Associations**

Skills are grouped into **chains** — linear or branching flows where one skill feeds another. Use these labels in docs, Bank "Used in", and UI tooltips.

| Chain | Skills | Flow | Notes |
|-------|--------|------|-------|
| **Ore Chain** | Mining → Smithing → Forging | Ore → Bars → Equipment | Core metal economy. Runite gated by narrative. |
| **Rune Chain** | Mining (essence) → Runecrafting | Essence → Runes | Runes feed Magic, enchanting. |
| **Food Chain** | Fishing → Cooking | Raw fish → Cooked food | Food for Combat buffs, HP. |
| **Herb Chain** | Harvesting → Herblore | Herbs + Vial → Potions | Potions for buffs, combat. |
| **Wood Chain** *(planned)* | Logging ↔ Firemaking | Logs ↔ Ash/Heat | Firemaking consumes logs; may fuel Smithing, Cooking. |
| **Life Chain** *(planned)* | Fishing ↔ Farming ↔ Cooking | Fish + Crops → Food | Farming produces crops; Cooking uses both. |
| **Craft Chain** *(planned)* | Logging + Smithing → Crafting | Logs + Bars → Arrows, Bags | Crafting is the misc hub. |

**Future crossovers:** Woodcutting (Logging) ↔ Firemaking; Fishing ↔ Farming ↔ Cooking; Scavenging → Crafting (cloth, junk); Thieving → Gold/items (no skill input).

**The Accidental Progression Loop:**
1. Log in to craft a sword
2. Realize you need more iron ore
3. Start Mining
4. Pickaxe breaks
5. Start Smithing to repair it
6. Need more coal for smelting
7. Back to Mining...

This creates the "Runescape-like" satisfaction of planning long-term goals.

---

## **Chapter 3: The World Bible — Valdoria & The Cosmos**

### 2.1 The Dual Nature of Reality

Aetheria exists in a state of cosmic tension. The **Luminar** (bright magical energy) flows from the Celestial Spires above, while the **Voidmire** (dark cosmic essence) seeps from cracks in reality. These forces aren't good vs. evil—they're necessary opposites, like breathing in and out.

**The Great Joke:** The universe was created when the Primordial Trickster, **Blibbertooth the Unserious**, sneezed during a formal divine ceremony. Creation was accidental, which explains why magic sometimes behaves unpredictably and why chickens exist.

### 2.2 Valdoria: The Anchor Kingdom

A peninsula kingdom roughly the size of Ireland, surrounded by the **Shimmering Sea**. Valdoria contains:

| Region | Theme | Key Feature |
|--------|-------|-------------|
| **The Crownlands** | Central hub, market | Player home, NPCs in Town |
| **The Whispering Woods** | Enchanted forest | Sentient trees that gossip |
| **The Scorched Reach** | Volcanic wasteland | Voidmire pools, danger |
| **The Skyward Peaks** | Mountains | Touch lower Celestial Spires |
| **The Sunken Archives** | Underground ruins | Previous civilizations |
| **The Fey Markets** | Planar crossover | Otherworldly traders |
| **Frostvale** | Christmas town | Voidmas festival, snow |

### 2.3 The Unraveling — World Threat

Patches of reality where Luminar and Voidmire are out of balance, creating "Glitch Zones" where physics behave oddly:
- Gravity reversing
- NPCs speaking in palindromes
- Loot drops being literal drops from the sky
- Time dilation (ticks take longer/shorter)

### 2.4 Major Factions

1. **The Order of the Balanced Scale:** Stoic knights maintaining cosmic equilibrium. Grandmaster is a sentient suit of armor with no body inside.

2. **The Void-Touched Collective:** Not evil—just people who've embraced Voidmire energy. They throw excellent parties but speak in echoes. Led by **Lady Mirthless**.

3. **The Celestial Bureaucracy:** Angels obsessed with paperwork. **Archangel File-Not-Found** is a major NPC.

4. **The Accidental Cult of Blibbertooth:** Religious group treating cosmic absurdity as sacred. Temples are comedy clubs. High Priest **Gigglesworth**.

---

## **Chapter 4: Character System — The Anchor**

### 3.1 The Protagonist

Players are an **Anchor**—someone whose soul is unusually heavy in the cosmic sense:
- Immune to the Unraveling's chaotic effects
- Can harness both Luminar and Voidmire without exploding
- Attracts bizarre coincidences (justification for RNG)

### 3.2 Character Creation

- **Ancestry:** Human, Elf (time-dilated), Dwarf (cosmic miners), Fey-Touched (partially unreal), Void-Blooded (slightly translucent)
- **Starting Affinity:** Luminar (defensive), Voidmire (offensive), or Balanced (flexible)
- **Cosmic Quirk:** Random comedic trait (e.g., "Attracts sentient furniture")

### 3.3 The Seriousness Meter (New System)

A hidden stat tracking how "sensible" the player behaves:

| Behavior | Effect on Seriousness |
|----------|----------------------|
| Efficient grinding, optimal routes | Increases |
| Wearing mismatched gear, talking to chickens | Decreases |
| Using joke items, embracing RNG | Decreases (good!) |

**High Seriousness Penalty:** Random events become more dangerous (universe punishes being too serious)

**Low Seriousness Bonus:** Blibbertoth blessings trigger more often, "accidental" extra drops, unexpected crits

---

# **PART II: PROGRESSION SYSTEMS**

## **Chapter 5: The Skill Pillars Deep Dive (25 Skills)**

### 4.1 Pillar I: Gathering (The Foundation)

| Skill | Unique Mechanic |
|-------|-----------------|
| **Harvesting** | **Seasonal Rotation:** Resources based on real-world week |
| **Mining** | **Vein Depletion:** Rich veins exhaust, must wait or explore new areas |
| **Logging** | **Diplomacy Factor:** Higher levels = "asking nicely" for better yields |
| **Fishing** | **The One That Got Away:** Rare "Mythic" fish requiring bait experimentation |
| **Scavenging** | **Curse Chance:** Higher areas have cursed items needing Cleansing |

### 4.2 Pillar II: Crafting (The Engine)

| Skill | Active/Offline Balance |
|-------|------------------------|
| **Smithing** | **Heat Management:** Active = 2x speed if temp optimized |
| **Tailoring** | **Pattern Mastery:** Active mini-game for quality bonus |
| **Alchemy** | **Volatility:** Active = catch unstable reactions for bonus potency |
| **Runecrafting** | **Cosmic Alignment:** Some enchantments only at specific real-world times |
| **Cooking** | **Taste Testing:** Active = adjust seasoning for buff duration |
| **Construction** | **Blueprint System:** Complex projects need multiple skill contributions |
| **Fletching** | **Aerodynamics Mini-game:** Wind adjustment for specialty ammo |

**Crafting Speed Multipliers:**
- Offline: 1x base, 8-hour max queue
- Online/Idle: 1.5x base
- Active/Mini-game: 2x-5x based on performance

### 4.3 Pillar III: Combat (The Clash)

| Skill | Progression Style |
|-------|-------------------|
| **Attack** | Linear with weapon specialization branches |
| **Strength** | Affects equipment tiers unlockable |
| **Defense** | Active: Perfect block timing. Offline: Auto-block with reduced efficiency |
| **Ranged** | **Wind Reading:** Environmental factors affect accuracy |
| **Magic** | **Spell Weaving:** Combine spells for hybrid effects |
| **Constitution** | Gates content (need 50 Con for Void-Toxic zones) |

**Combat Styles (Unlockable):**
- **The Stalwart:** Shield + one-hand, high defense
- **The Blademaster:** Dual-wield, combo system
- **The Spellweaver:** Magic primary, weapon as focus
- **The Harbinger:** Voidmire-corrupted, life-drain mechanics
- **The Warden:** Pet/companion focused
- **The Trickster:** Blibbertooth-inspired, random effect procs

### 4.4 Pillar IV: Support (The Connective Tissue)

| Skill | Why It Matters |
|-------|----------------|
| **Exploration** | Unlocks fast travel, hidden dungeons, nodes |
| **Cleansing** | Purify cursed items, heal Unraveling zones |
| **Barter** | Unlock "Black Market" for rare materials |
| **Leadership** | Gates number of active companions |
| **Research** | **The Knowledge Tree:** Passive unlocks speeding up other skills |
| **Chaos Theory** | **NEW:** Embrace randomness, reduce Seriousness, unlock Blibbertoth blessings |

### 4.5 Pillar V: Cosmic (The Endgame)

| Skill | Unlock Requirement | Function |
|-------|-------------------|----------|
| **Aether Weaving** | Level 80 in three skills | Legendary crafting |
| **Void Walking** | Complete "Touch of the Void" questline | Short-range teleportation |
| **Celestial Binding** | Ally with Celestial Bureaucracy | Summon angelic assistants |
| **Chronomancy** | Discover Temporal Archives | Speed up skill training, reset daily limits |

---

## **Chapter 6: Advanced Mastery & Prestige**

### 5.1 Current Mastery System (Implemented)

- 1 point per level-up per skill
- Spend on: +5% XP, +3% yield, +4% speed

### 5.2 Specialization Branches (Level 50)

At skill level 50, choose a permanent path:

**Mining Specializations:**
- **Deep Delver:** Slower, but find gems/rare ore
- **Strip Miner:** Faster, lower quality
- **Geomancer:** Chance for magical ore (Runecrafting synergy)

**Smithing Specializations:**
- **Weaponsmith:** Better weapons, can add quirks
- **Armorsmith:** Better armor, defensive quirks
- **Artificer:** Make magical equipment (endgame)

### 5.3 Mastery Synergies

Combining skill specializations unlocks bonuses:
- Mining 50 + Smithing 50 = **"Ore Sense"** — auto-smelt ore while mining
- Cooking 50 + Herblore 50 = **"Gourmet Alchemy"** — food buffs last longer
- All Gathering 50 = **"Nature's Whisper"** — pets find items faster

### 5.4 The Prestige System (Post-99)

When you hit 99 in a skill, you can **Transcend** it back to 1:
- Gain permanent account-wide bonus (e.g., +1% all XP)
- Visual prestige number: 99★1, 99★2, etc.
- Total prestige across all skills = your **"Cosmic Weight"** (endgame ranking)
- Each transcendence resets skill but keeps specializations

---

## **Chapter 7: The Absurdity System (Chaos Theory)**

### 6.1 The Chaos Theory Skill (New)

Level up by embracing randomness rather than optimizing:
- Use random equipment combinations
- Fail mini-games intentionally
- Accept Blibbertoth's "gifts"

**Abilities:**
- **"Planned Accident"** — Next 10 actions have ±50% variance (could be terrible or amazing)
- **"Controlled Chaos"** — Once per day, re-roll all RNG outcomes from offline session
- **Capstone: "The Sneeze"** — Once per week, completely reset a bad RNG streak

### 6.2 Blibbertoth Blessings & Curses

**Blessings (random, beneficial chaos):**
- **"Blessing of the Sneeze":** 5% chance any action creates duplicate resource
- **"Accidental Discovery":** Randomly find items from skills you weren't training
- **"Cosmic Coincidence":** Two unrelated actions happen simultaneously

**Curses (mechanically interesting, not just penalties):**
- **"Curse of Seriousness":** 24h debuff, all numbers rounded to nearest 10 (visually upsetting, mechanically neutral)
- **"The Unraveling Touch":** Equipment gets temporary "glitched" appearance but hidden stat boost
- **"Gravity's Suggestion":** Character falls upward briefly when jumping (visual only)

### 6.3 The Absurdity Economy

- **Joke Items:** Whoopee cushions, rubber chickens that are actual weapons
- **Cosmetic Chaos:** Equipment that changes appearance randomly
- **Seriousness Purge:** Players can pay Lumina to reset Seriousness to zero (embrace the chaos)

---

# **PART III: WORLD & EXPLORATION**

## **Chapter 8: Location System — The Idle-Friendly World**

### 7.1 Core Principle

**What exploration is NOT:**
- Real-time walking, travel time, stamina systems
- Open-world free roam

**What exploration IS:**
- **Location selection** — Tap a place → you're there. Instant.
- **Locations** — Distinct areas with NPCs, ambiance, shops, quests
- **Unlocks** — Some locations gated by quest flags, levels, or calendar

### 7.2 The Location Roster

| Location ID | Name | Emoji | Unlock | Status |
|-------------|------|-------|--------|--------|
| `crownlands` | Crownlands | 🏰 | Always | ✅ Implemented |
| `frostvale` | Frostvale | 🎄 | December / Quest | 🚧 Planned |
| `whispering_woods` | Whispering Woods | 🌲 | Quest flag | 🚧 Planned |
| `fey_markets` | Fey Markets | ✨ | Timed event | 🚧 Planned |
| `scorched_reach` | Scorched Reach | 🌋 | Level 40 | 🚧 Planned |
| `skyward_peaks` | Skyward Peaks | ⛰️ | Level 70 | 🚧 Planned |

### 7.3 Location Screen Structure

When traveling to a location:
- **Header:** Name, emoji, ambiance line
- **NPCs:** Talk buttons (Coming soon if not implemented)
- **Shop:** Location-specific catalog (Coming soon)
- **Quests:** Location-specific offers (Coming soon)
- **Corruption Meter:** See Chapter 8

### 7.4 The Fey Markets (Detailed)

**Three Rotating Traders (Weekly):**
1. **The Glitch Merchant** — Sells corrupted items (weird stats)
2. **The Memory Vendor** — Sells "recovered" items (re-rolls old gear)
3. **The Future Broker** — Pay now, receive items when you reach the level

**Fey Currency: Promises**
- Fey don't take gold — they take quest commitments
- Buy item → Accept future quest (must complete within 7 days)
- Failure = item disappears, "Promise Broken" debuff (Fey Markets ban for a week)

---

## **Chapter 9: World State & The Unraveling**

### 8.1 Zone Corruption System

Each location has a **Corruption Level** (0-100%) based on server-wide activity:

| Corruption | Effect |
|------------|--------|
| 0-25% | Normal operations |
| 25% | **Glitch** — Nodes give weird items (abstract geometry instead of ore) |
| 50% | **Tear** — New enemies (The Unraveled), rare drops |
| 75% | **Rupture** — Zone dangerous but extremely rewarding |
| 100% | **Collapse** — Zone temporarily inaccessible until community cleansing |

### 8.2 The Cleansing Meta-Game

- Players spend **Cleansing** skill points to reduce corruption
- Community events: "The Great Scrubbing" — everyone contributes
- **Seasonal:** Voidmas causes temporary *increase* in corruption, then massive cleansing rewards after

### 8.3 Server-Wide World States

**Possible Global States:**
- **The Great Sneeze:** Blibbertoth event — all RNG variance increased 200% for 24h
- **Celestial Audit:** Bureaucracy event — all forms must be filled (mini-game), rewards for compliance
- **The Unraveling Spreads:** All zones gain +10% corruption, cleansing XP doubled

---

## **Chapter 10: The Seasonal Calendar**

### 9.1 The Calendar of Cosmic Events

| Event | Month | Theme | Mechanic |
|-------|-------|-------|----------|
| **Voidmas** | December | Darkness/Festive | Gift-giving, corruption peaks then cleanses |
| **Celestial Audit** | April | Bureaucracy | Form-filling mini-game, orderly rewards |
| **Blibberfest** | July | Pure Chaos | Random mechanics, community goals |
| **The Unraveling** | October | Horror/Void | Zone collapses, survival mode |

### 9.2 Event Participation Tiers

- **Observer:** Login during event → get cosmetic
- **Participant:** Do event activities → get currency/items
- **Architect:** Top 10% contributors → unique title/aura
- **Legend:** Server-first achievements → permanent world change

### 9.3 The Season Pass (Battle Pass, Idle-Style)

- **Free Track:** Resources, small cosmetics
- **Premium Track (Lumina):** Unique companions, housing items, shortcuts
- **Key:** Progress by *playing normally*, not event-only content. Event accelerates progress.

### 9.4 Frostvale (Christmas Town) — Detailed

**Ambiance:** Cozy winter, snow, lights. Void-Touched twist: Voidmas — ominous but festive.

**NPCs:**
- **Festival Host** — Runs Voidmas events
- **Gift-Giver** — Exchange items for presents
- **Void-Touched Caroler** — Sings in echoes

**Shop:**
- Voidmas wrapping paper (cosmetic)
- Seasonal recipes (Voidmas fruitcake)
- Limited-time items

**Quests:**
- "Light the Voidmas Tree" — gather items, reward Lumina
- "Deliver Gifts" — bring items to NPCs

---

# **PART IV: COMBAT & EQUIPMENT**

## **Chapter 11: Combat System — "The Encounter"**

### 10.1 Combat Structure

Combat occurs in **Instances**—pocket dimensions where time moves differently.

**The Flow:**
1. **Scout:** Choose location (Wilderness, Dungeon, Raid, Cosmic Rift)
2. **Prepare:** Select loadout, companions, consumables
3. **Engage:** Choose Active or Auto mode
4. **Resolve:** Collect loot, manage inventory

### 10.2 Active vs. Auto Combat

**Active Advantages:**
- Manual skill timing for combos (Shield Bash → Heavy Strike = +50% damage)
- Potion usage optimization
- Fleeing before death (saves 50% loot)
- Special attack charging

**Auto/Offline Combat:**
- Uses AI script based on your last 10 active fights (learns preferences)
- Consumes potions automatically (set threshold in UI)
- 70% efficiency of active play
- Auto-flee at 20% HP unless disabled

### 10.3 Enemy Factions (12 Types)

1. **The Unraveled** — Reality-corrupted beings
2. **Celestial Constructs** — Angelic automatons
3. **Void-Touched Wildlife**
4. **The Forgotten** — Undead from previous cycles
5. **Fey Tricksters**
6. **Cult of the Serious**
7. **Astral Pirates**
8. **Living Dungeons**
9. **Time-Echoes**
10. **The Bureaucracy's Rejected**
11. **Cosmic Vermin**
12. **Primordial Fragments**

### 10.4 Dungeon System

| Type | Duration (Active) | Duration (Offline) |
|------|-------------------|-------------------|
| **Delves** | 5-10 minutes | 1 hour |
| **Expeditions** | 30 minutes | 4 hours |
| **Raids** | Weekly lockout | Guild-supported |
| **The Infinite Stair** | Endless | Leaderboard chasing |

---

## **Chapter 12: Equipment & The Paper Doll**

### 11.1 The Cosmic Quirk System

Every equipment piece has **base stats** + **random quirk**:

| Item | Quirk Example |
|------|---------------|
| Iron Helmet | "...of Talking to Squirrels" (+5 Def, occasional squirrel dialogue) |
| Void-Touched Boots | "...of Reverse Gravity" (+3 Speed, loot drops fall upward) |
| Mythic Sword | "...of Existential Dread" (+50 Attack, occasionally whispers philosophy) |

**Quirk Management:**
- **Cleansed:** Remove quirk (pure stats)
- **Embraced:** Enhance quirk via Chaos Theory skill

### 11.2 Equipment Sets

**Matching Set Bonus:** Standard stats increased

**Mismatched Set Bonus (Absurdity):**
- Full mismatched = Blibbertoth favor bonus
- The choice between optimal and funny becomes real

### 11.3 The Wardrobe System

- **Combat Loadout:** Stats matter
- **Cosmetic Loadout:** Visual only, other players see this
- **Best Dressed:** Leaderboard during seasonal events

### 11.4 Equipment Slots

- Head, Body, Legs, Feet
- Weapon, Shield/Off-hand
- Ring (2), Amulet
- **Cosmetic Overlay:** Separate appearance layer

---

# **PART V: SOCIAL & PERSONALIZATION**

## **Chapter 13: Housing & The Sanctum**

### 12.1 The Anchor's Sanctum

Player gets **instanced housing** (no neighbors—this is a solo RPG):

**Rooms unlock based on skill mastery:**
- **Smithing Room:** Showcase best forged items
- **Kitchen:** Display perfect cooking attempts
- **Trophy Hall:** Boss kills, rare drops, achievements
- **Garden:** Farming patches (visual Farming skill)
- **Study:** Research unlocks displayed as books

### 12.2 Furniture Crafting

| Skill | Furniture Contribution |
|-------|----------------------|
| **Construction** | Blueprints (consumed to build) |
| **Farming** | Decorative plants |
| **Smithing** | Metal furniture |
| **Tailoring** | Soft furnishings |
| **Herblore** | Incense burners |

### 12.3 The "Vibe" System

Furniture combinations create **Room Vibes:**
- **Cozy:** Increases pet happiness
- **Academic:** Research progresses faster
- **Chaotic:** More Blibbertoth blessings at home
- **Void-Touched:** Occasional strange occurrences

### 12.4 Visitor System (Async Social)

- "Invite" other players (async) to see your home
- They leave **Guest Book** comments
- Earn "Hospitality" XP for visitors
- **Best Sanctum:** Seasonal leaderboard

---

## **Chapter 14: Companion System — Wandering Souls**

### 13.1 The Roster

Hire **Wandering Souls**—NPCs with their own skill levels. Unlock via **Leadership** skill.

| Companion | Role | Unlock | Trait |
|-----------|------|--------|-------|
| **Barnaby the Uncertain** | Warrior | Leadership 20 | 2x damage, 50% self-hit chance |
| **Scholar Yvette** | Researcher | Leadership 35 | Speeds crafting, occasional explosions (refunds) |
| **Sir Reginald Pomp** | Knight | Leadership 50 | Auto-sells grey items, long speeches |

### 13.2 Companion Stories (Visual Novel Style)

Each companion has a **story tree** unlocked as they level:
- **Barnaby's Arc:** Uncertain → Confident (your choices matter)
- **Yvette's Secret:** Running from Celestial Bureaucracy
- **Reginald's Past:** Was once a jester

### 13.3 Companion Relationships

- Companions can like/dislike each other
- Conflicting companions = lower efficiency, funny dialogue
- Synergistic companions = higher efficiency, may fall in love (new quests)

### 13.4 The Companion Board Game

While idling, companions play a board game representing their "planning":
- Occasionally tap to influence (cheat/help)
- Affects their offline performance
- Mini-game: "The Great Planning"

---

## **Chapter 15: The Chronicle System**

### 14.1 The Tome of the Anchor

Auto-updating "book" recording:
- Every NPC conversation (transcribed)
- Every significant drop (date, context)
- Every level-up (what you were doing)
- Random events while away (timestamps)

### 14.2 The "Previously On..." Feature

When returning after 24h+:
- Comic book style recap panel
- "While you were gone, you mined 47 copper ore, discovered the Whispering Woods, and Barnaby finally stopped hitting himself."
- **Shareable:** "My Week in Arteria" for social media

### 14.3 The Timekeepers (Anti-Cheat as Lore)

When you login, a **Timekeeper** (Celestial Bureaucracy NPC) reviews your offline report:
- If cheating detected → Not banned, but sent on **redemption quest**
- "It seems you've... lost some time. Help us recover 3 temporal fragments."
- Makes anti-cheat recovery feel like story content

### 14.4 Honesty Mode (Optional)

- Opt into "Honest Mode" — no offline cap, client-side only
- Other players see "Unverified" badge
- Separate leaderboards
- Philosophy: Play how you want, be transparent

---

# **PART VI: ECONOMY & MONETIZATION**

## **Chapter 16: Currency Systems & The Lumina Shop**

### 15.1 Currency Overview

| Currency | Source | Use | F2P/Premium |
|----------|--------|-----|-------------|
| **Gold** | Combat, selling | Basic gear, consumables | F2P |
| **Aether Shards** | High-level content | Epic crafting, housing, cosmetics | F2P |
| **Cosmic Essence** | Dailies, events | Rerolling, speeding, convenience | Both |
| **Lumina** | Real money | Premium cosmetics, slots, boosters | Premium |

### 15.2 Lumina Pricing

- $4.99 = 500 Lumina (bonus 50)
- $9.99 = 1,100 Lumina (bonus 150)
- $19.99 = 2,400 Lumina (bonus 400)
- $49.99 = 6,500 Lumina (bonus 1,500)
- $99.99 = 14,000 Lumina (bonus 4,000)

### 15.3 Monthly Premium ("The Patron's Blessing") — $9.99/month

- +20% XP all skills
- +50% offline progression (12h vs 8h)
- Double bank space
- Exclusive monthly cosmetic set
- Priority support
- **No direct power purchase**—convenience only

### 15.4 Lumina Shop Items

| Item | Lumina Cost | Purpose |
|------|-------------|---------|
| Cosmetic Outfit | 500-2000 | Visual only |
| Bank Expansion | 300 (increasing) | +10 slots |
| Skill Boost (24h) | 200 | +50% XP one skill |
| Instant Craft | 50-500 | Skip timer |
| Cosmic Rift Key | 100 | Special dungeon entry |
| Character Slot | 1000 | Alt characters |
| Housing Theme Pack | 800-1500 | Furniture blueprints |

---

## **Chapter 17: The Consumption Economy (Food & Potions)**

### 16.1 The Three Stomach System

Players have 3 "consumption slots" like equipment:

| Slot | Duration | Use |
|------|----------|-----|
| **Breakfast** | 4 hours (real-time) | Set when you start playing |
| **Lunch** | Mid-session boost | Once per 4-hour window |
| **Dinner** | Overnight/offline | Specifically affects offline calculations |

### 16.2 Potions as "Injectors"

- **Combat Potions:** Active-only (manual fighting)
- **Skilling Potions:** Affect offline progression rates
- **Voidmas Eggnog:** Seasonal — randomizes buff every hour

### 16.3 The Restaurant Mini-Game (Active Play)

**Location:** Crownlands Inn (sub-location)

**"Taste Balancing" Mini-Game:**
- Tap to keep flavors in green zone
- Perfect cooks = 2x buff duration
- Failed cooks = "Questionable Stew" — edible but random effects

### 16.4 Food Buff Types

| Food Type | Buff |
|-----------|------|
| Hearty Meals | +HP, healing rate |
| Brain Food | +XP gain |
| Lucky Charms | +Drop rate |
| Speed Snacks | +Action speed |
| Void Cuisine | Random effect (risk/reward) |

---

## **Chapter 18: Monetization & Retention Architecture**

### 17.1 The "Whale" vs "Minnow" Balance

**Free Player Experience:**
- Full access to all skills and story
- 8-hour offline caps
- Standard inventory
- All gear obtainable

**Premium Advantages (Convenience, Not Power):**
- 12-hour offline caps
- More bank space
- Faster progression (20% bonus)
- Cosmetics

### 17.2 The "Fading Pendulum" Prevention

When players hit progression walls:
1. **Immediate Alternative:** "Crafting queue finished—upgrade gear!"
2. **Event Pivot:** "The Fey Market is here! Different rewards."
3. **Skill Crossover:** "Stuck in combat? Fishing milestone reached—new bait!"

### 17.3 The "Next Big Thing" Loop (The Horizon System)

Every login, UI highlights 3 things:
1. **Immediate (0-15 min):** "Crafting queue finished! Upgrade sword."
2. **Session (15 min - 2 hours):** "80% to Mining 45. New vein unlocks at 45."
3. **Grind (Today/Week):** "Complete 5 dungeons for Celestial Cache."

### 17.4 Retention Mechanics

**Daily:**
- Login Bonus (7-day cycle, day 7 = Cosmic Essence)
- Daily Quests (3 tasks, 10 min, reward Lumina)
- Timed Events ("Unraveling spreads in 4 hours!")

**Weekly:**
- Guild Contributions (shared progress bars)
- Raid Lockouts
- Leaderboards (dungeons, skill levels, collections)

### 17.5 The "Always Something" Design

Overlapping skill timers:
- Mining: 30s (active) / 5 min (idle)
- Crafting: 2 min to 8 hours
- Combat: 30s (active) / 10 min (idle dungeon)
- Farming: 4-hour growth cycles

**Result:** No matter when you log in, something is ready.

---

# **PART VII: NARRATIVE & TECHNICAL**

## **Chapter 19: The Narrative System**

### 18.1 Main Storyline: "The Weight of Reality"

**Act I: The Unraveling Begins (Levels 1-30)**
- Tutorial: Discover you're an Anchor when you survive an Unraveling
- Meet factions, choose allegiance
- Plot: Someone is *intentionally* causing Unravelings

**Act II: The Cosmic Conspiracy (Levels 31-70)**
- Uncover the **Seriousness Cult**
- Journey to Skyward Peaks (Celestial Bureaucracy)
- Descend into Sunken Archives (learn of failed Anchors)
- Twist: Cult leader is a previous Anchor gone mad

**Act III: The Choice (Levels 71-99)**
Three paths to stabilize reality:
- **Luminar Path:** Purify Voidmire → "perfect" but stagnant world
- **Voidmire Path:** Embrace chaos → constant change
- **Third Option:** Embrace Blibbertooth's philosophy—balance through absurdity

Each path: unique quests, gear, cosmetics. All stop the Total Unraveling.

**Act IV: The Anchor's Burden (Level 100)**
- Post-story: Become mentor for new players
- Unlock **Cosmic Tiers** (prestige individual skills)
- True endgame: Meet Blibbertooth himself

### 18.2 Side Quest Systems

**Radiant Quests (Infinite):**
- Procedurally generated based on skills/level
- Examples: "Gather 20 Void-Touched Ore," "Clear 3 Unraveling zones"

**Character Quests:**
- Barnaby's Confidence → "Certain" form (no self-damage)
- Lady Mirthless's Secret → Open mic night
- Archangel File-Not-Found → Find paperwork for promotion

### 18.3 Dialogue System

Branching dialogue trees with:
- Narrative requirements (flags needed)
- On-select actions (give items, start quests, set flags)
- Cosmic Quirk responses (your character's absurd traits)

---

## **Chapter 20: Technical Architecture**

### 19.1 Offline Progression Calculation

When player reconnects:
1. Calculate elapsed (max 8h F2P, 12h Premium)
2. Simulate combat based on last loadout
3. Process crafting queue (pause if resources depleted)
4. Generate "While You Were Away" report
5. Apply missed daily bonuses (if within 24h)

### 19.2 State Management

- **Redux:** Player state, inventory, skills, active tasks
- **MMKV:** Persistence layer
- **Engine Package:** `@arteria/engine` — tick calculations, XP tables

### 19.3 Anti-Cheat

- Server-authoritative validation
- Client sends "I fought X for Y hours"
- Server validates based on stats vs. area difficulty
- Timekeeper redemption quests for anomalies (see Chapter 14)

---

## **Chapter 21: Future Expansion Hooks**

### 20.1 Year 1 Post-Launch

- **Guild System:** Shared housing, guild skills, cooperative raids
- **PvP Arena:** Asynchronous "defense teams" (AI controlled)
- **New Region:** The Shimmering Sea (naval combat, underwater skills)

### 20.2 Year 2

- **Second Kingdom:** Cross-server travel
- **Player Economy:** Auction house, player shops
- **The Cosmic Plane:** Endgame roguelike dimension

### 20.3 Technical Debt Prevention

- Modular skill system—add without rebalancing
- Horizontal progression at cap—options not just numbers
- Seasonal resets for leaderboards only, never character progress

---

# **CONCLUSION**

Aetheria: The Idle Chronicles is designed to be the game players think about during their day—not through addictive dark patterns, but through **meaningful overlapping progression systems** that respect both their time and engagement.

The cosmic comedy tone differentiates it in a market of serious fantasy idle games, while the robust skill interdependence creates the "Runescape-like" satisfaction of planning and executing long-term goals.

**The ultimate goal:** Create a world players miss when they're away, not because of FOMO mechanics, but because they genuinely enjoy their next login.

---

# **APPENDIX A: CURRENT IMPLEMENTATION STATUS & EXPANSION SURFACE**

> **Source:** `CURRENT_IMPROVEMENTS.md`, `IMPROVEMENTS.md`, `gemini_notes.md`

## A.1 Implementation Audit (as of v0.4.2)

| Pillar | Implemented | Planned |
|--------|-------------|---------|
| **Gathering** | Mining, Logging, Fishing, Harvesting, Scavenging | — |
| **Crafting** | Smithing, Forging, Cooking, Runecrafting, Herblore | Alchemy, Tailoring, Fletching |
| **Support** | Mastery, Pets | Leadership (Companions), Construction |

## A.2 Systems That Can Be Extended

| System | Current State | Expansion Surface |
|--------|---------------|-------------------|
| **Skills** | 8 implemented. Node/recipe pattern in `useGameLoop` + `ACTION_DEFS`. | Add nodes, recipes, or new skills using same pattern. |
| **Pets** | 7 pets, rare drops per tick, Pets screen, active emoji. | More pets, pet abilities, pet XP/levels, cosmetic variants. |
| **Mastery** | 1 pt/level-up, XP (+5%/level), yield (+3%/level), speed (+4%/level, max 3). Pillar grouping, skill cards. | New upgrade types. |
| **Random Events** | Blibbertooth, Cosmic Sneeze, Genie, Treasure Chest, Lucky Strike, Goblin Peek. Per-tick roll, cooldown. | Dialogue randoms, hazard events. |
| **Daily Quests** | 3/day, reset midnight, gold + Lumina. Step auto-complete. | More templates, radiant/repeatable. |
| **Lumina** | Earned: login day 7, quests. Shop: Reroll Daily (5✨, 2/day), XP Boost 1h (15✨). | More items (cosmetics, rerolls). |
| **Bestiary** | Goblin/Slime/Wolf data, seenEnemies, EnemyDrop/Location/CombatStats. | More enemies, drop tables, combat prep. |
| **Bank** | Search, filters, custom tabs (max 6), Sell All Junk, sort, "Used in", lock items. | Recipe browser, bulk actions, tab presets. |
| **Idle Soundscapes** | Toggle + stub hook on all skill screens. expo-audio SFX on tick. | Implement ambient loops per skill. |
| **Food** | 10 cooked items via Cooking skill. No consumption yet. | Food buffs (XP, yield, speed), consume in combat/skilling. |
| **Equipment** | 15 forged items (daggers, helmets). No equip system. | Equip slots, stat bonuses, combat readiness. |

## A.3 Quick Expansions (Same Patterns)

- **More nodes/recipes:** Add entries to `MINING_NODES`, `LOGGING_NODES`, `FISHING_SPOTS`, `COOKING_RECIPES`, `SMELTING_RECIPES`, `FORGING_RECIPES`, `RUNE_ALTARS`. No new systems.
- **More daily quest templates:** Add to `generateDailyQuests` / quest pool. Same claim flow.
- **More random events:** Add type to `RANDOM_EVENT_TYPES`, handle in `useGameLoop` switch. Reuse FeedbackToast.
- **More pets:** Add to `SKILL_PETS`. Drop logic already generic.
- **More enemies:** Add to `ENEMIES`. Bestiary UI already iterates.

## A.4 Medium Expansions (Reuse Existing)

- **Harvesting & Scavenging:** Define nodes, register in `ACTION_DEFS`, add skill screen (copy Mining/Logging pattern).
- **Food Consumption:** `consumeFood(itemId)` action, `currentHp`/`maxHp`, `activeFoodBuff` with expiry.
- **Equipment Slots:** `equipped` on player, Bank "Equip" button, Attack/Defence stats.
- **Radiant Quests:** "Bring Nick 10 copper" on cooldown, reuse daily quest structure.

## A.5 Larger Expansions (New Glue)

- **Crafting Queue:** Queue state, input reservation, offline processing via `processOffline`, progress UI.
- **Combat Alpha:** Reuse equipment slots, resolve fights in `processOffline` from enemy stats, WYWA-style combat report.
- **Companions:** Roster + Leadership gates, companion `activeTask`, separate `companionSkills` XP.

## A.6 Pre-Implementation Checklist (Per Feature)

Before coding any new feature:
- [ ] Content details filled in (items, IDs, XP, recipes)
- [ ] Item/recipe/node IDs defined if new
- [ ] UI placement decided
- [ ] Redux/state shape sketched (if new state)
- [ ] Docs to update: SCRATCHPAD, CHANGELOG, SUMMARY, patchHistory, UpdateBoard

## A.7 Engine Consolidation Note

`useGameLoop.ts` currently inlines engine math instead of importing from `@arteria/engine`. Decision pending on whether to migrate to package import or keep inline. `ACTION_DEFS` should be centralized in engine package so new skills don't require `useGameLoop` edits.

---

# **APPENDIX B: COMPANION DEEP DESIGN**

> **Source:** `COMPANIONS.md` — Full companion system design, companion progression, roles, and open questions.

## B.1 Companion Progression: Levels Like a Player

**Design decision:** Companions gain levels just like the player. Each companion has a **skill profile** (XP and levels per skill, similar to `SkillState`).

- When assigned to a task, companion earns XP in relevant skill(s).
- Companion skill levels gate what they can do (e.g., Mining 30 → can mine up to Mithril).
- Higher companion levels = better yields, faster ticks, access to higher-tier content.
- Companion levels do **not** contribute to player Total Level; separate progression.
- Players may "train" companions on easier content first to unlock harder content later.

## B.2 Companion Roles

| Role | Description |
|------|-------------|
| **Auto-Gather** | Assign to gathering skill (Mining, Logging, etc.). Gathers while player is offline. Level gates nodes. |
| **Auto-Craft** | Assign to crafting skill. Crafts items in queue. Yvette: +30% crafting speed, 5% explosion (partial refund). |
| **Auto-Combat** | Accompanies player in combat instances. Traits apply. |
| **Passive/Inventory** | Reginald: auto-sells grey junk. No assignment needed. |

## B.3 Design Uncertainties (Resolve Before Implementation)

**Progression:** Do companions share the player XP curve? Can they multi-task or one task only? Level cap 99? Primary skill affinity? Starting levels?

**Auto-Gather/Craft:** Do yields scale with companion level? Where do resources go (player bank or companion inventory)? Same offline cap? Use player's bank materials?

**Roster Traits:** Yvette's research-adjacent skills? Reginald's combat role? Barnaby's trait in gathering (2× yield but 50% drop)?

**Leadership Economy:** L20→1 companion, L35→2, L50→3 — final curve? Companion buffs? Hire/maintenance cost?

**UI/UX:** Detail panel content? Mid-session task swaps? PvP snapshot?

---

# **APPENDIX C: UI/UX DESIGN LANGUAGE**

> **Source:** `zhip-ai-styling.md`, `zhipu-ai.md`, `STYLE_GUIDE.md`

## C.1 Visual Tone & Concept

- "Quietly engaging": not over-stimulating, but satisfying to watch fill up.
- Dark mode by default. Numbers, progress bars, and optimization are the core "gameplay."
- UI should feel like a clean, modern desktop app — not a flashy action game.

## C.2 Color Palette (Dark Mode Default)

| Role | Hex | Token |
|------|-----|-------|
| App background | `#0f111a` | `bgApp` |
| Card background | `#1b1e29` | `bgCard` |
| Primary text | `#e8e9ed` | `textPrimary` |
| Secondary text | `#8b8fa3` | `textSecondary` |
| Disabled text | `#5a5e6b` | `textDisabled` |
| Primary accent | `#4a90e2` | `accentPrimary` |
| Accent hover | `#6aa3f5` | `accentHover` |
| Success/XP | `#4caf50` | `green` |
| Gold/Warning | `#ffca28` | `gold` |
| Danger/Low HP | `#f44336` | `red` |
| Borders | `#2b2f3d` | `border` |
| Dividers | `#252837` | `divider` |

Arteria uses semantic tokens via `useTheme().palette`. See `THEMING.md` and Appendix F.

## C.3 Typography

- **UI font:** Clean sans-serif (system default or Inter/Roboto).
- **Game font:** Cinzel for headers (`FontCinzel`, `FontCinzelBold`).
- **Scale:** xs (10-11px) → sm (12-13px) → base (14-16px) → lg (18-20px) → xl (22-24px) → 2xl (28-32px).
- Bold only for labels/headers. Avoid all-caps except small labels (XP, HP, GP).
- WCAG AA contrast minimum (4.5:1 for text).

## C.4 Layout Grid & Spacing

| Device | Columns | Margins |
|--------|---------|---------|
| Mobile | 4 | 16px |
| Tablet | 8 | 24px |
| Desktop | 12 | 32px |

**Spacing scale:** xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px.

## C.5 Component Library

### Progress Bars
- Horizontal, left-to-right fill. Smooth animation.
- States: Inactive, Active (animated fill), Paused (dimmer), Complete.
- Label left ("XP to Level"), Current/Total right ("83 / 100").

### Buttons
- **Primary:** Accent bg, white text (Start Task, Equip)
- **Secondary:** Card/border bg, secondary text (Sell, Cancel)
- **Ghost:** Transparent bg, accent text (links)
- **Disabled:** Neutral dark bg, disabled text

### Cards/Panels
- Header: Title (bold) + optional icon
- Body: Key values (HP, XP, level), progress bars
- Footer: Actions (Start, Pause, Equip)
- `CardStyle` provides shared border/shadow; override colors from palette.

### Modals & Dialogs
- Header → Body → Footer (actions) pattern.
- For confirmation, tooltips, item details.
- Auto-dismiss toast notifications: 3-4 seconds, bottom of screen above nav bar.

## C.6 Screen Layout Patterns

**Skills Screen:** Skill list/grid left → detail panel right (wider screens). Each item: icon, name+level, XP progress bar, "Train" button.

**Combat Screen:** Enemy selector top → combat log middle → stats bottom. Two-column player/enemy stats with HP bars.

**Bank Screen:** Tabs top → item grid middle → detail panel bottom/right. Fixed-size cells: icon + quantity badge. Tap to detail, long-press for quick-action.

**Shop Screen:** Buy/Sell toggle → category tabs → item list with price and quantity selector.

## C.7 Interaction & Feedback

- **Always show:** Current task, time/progress, estimated rewards.
- **Button press:** Dim 50-100ms or animate scale.
- **Success:** Show small toast notification.
- **Long actions:** Start/Stop with clear visual state.
- **Number tickers:** Animated count-up for gold/XP changes (`AnimatedNumber` component).
- **Bouncy pressables:** `BouncyButton` for interactive elements like skill cards.

## C.8 Touch Targets (Mobile)

- Settings rows: Whole row pressable (Pressable wraps label + Switch). Switch is display-only.
- Skill nodes: Use BouncyButton or TouchableOpacity for full-card hit area.
- Minimum touch target: 44×44px.

## C.9 Requirements Indicators

For craftable/skill nodes with requirements (level, essence, narrative):
- Compact badge row: `[Lv. X ✓] [emoji N/batch] [📖 Story]`
- Locked state: muted border, `reqBadgeLocked` style.
- Out-of-resource: red-tinted `reqBadgeEmpty` for essence badge.

## C.10 Responsive Behavior

- **Mobile:** Single-column, bottom nav, vertical scrolling.
- **Tablet:** Two-column where appropriate.
- If width < 360: consider 2 columns instead of 3 for skill grid.
- 6 tab bar items: ensure touch targets and labels stay clear.

---

# **APPENDIX D: BANK OSRS-FICATION — UX ANALYSIS**

> **Source:** `gemini_notes.md` §9

## D.1 Goal

Bank feels like OSRS: main tab, limited custom tabs (6 max), slot cap (100), clearer hierarchy.

## D.2 OSRS Reference → Arteria Target

| OSRS | Arteria |
|------|---------|
| Main tab = "All" (always first) | Main tab = default, cannot delete |
| Up to 9 additional tabs (10 total) | 1 main + 6 custom = **7 tabs max** |
| Tab headers show first item icon | Tab icon = first item emoji, or custom emoji |
| Drag item to create tab | Keep "+ Tabs" modal (or drag-to-create) |
| Tabs separate from type filters | Split: **Tabs** (main + custom) vs **Filters** (within tab) |

## D.3 Proposed Structure

```
┌──────────────────────────────────────────────────────┐
│ Bank                                   [Slots: 47/100] │
│ 💰 12,450 gp    ✨ 10 Lumina    [Sell All Junk]       │
├──────────────────────────────────────────────────────┤
│ [Main] [Tab 1] [Tab 2] [Tab 3] ... [Tab 6] [+ Add]   │  ← Tab bar (max 7)
├──────────────────────────────────────────────────────┤
│ [All] [Ores] [Bars] [Logs] [Fish] [Food] [Potions]    │  ← Filters (within tab)
├──────────────────────────────────────────────────────┤
│ Sort: [Name] [Qty] [Value]                            │
├──────────────────────────────────────────────────────┤
│ [Search...]                                           │
├──────────────────────────────────────────────────────┤
│  [grid of items]                                      │
└──────────────────────────────────────────────────────┘
```

**Hierarchy:** Tab (subset) → Filter (type within tab) → Sort (order).

## D.4 Systems Impact

| System | Change |
|--------|--------|
| **gameSlice** | Cap `customBankTabs.length` at 6. Migration for existing saves. |
| **constants/game.ts** | Adjust `INVENTORY_SLOT_CAP_*` if changing caps. |
| **bank.tsx** | Two-row layout: Tab bar + Filter row. Disable "+ Add" at 6 tabs. |
| **Item detail** | "Add to tab" — only show tabs that exist; max 6. |

## D.5 Implementation Checklist (Done)

- [x] Slot cap: 50 F2P, 100 Patron
- [x] Tab limit (6) confirmed; addCustomBankTab enforces
- [x] Tab bar + filter row (two rows)
- [x] Migration: >6 tabs truncated to first 6 on load
- [x] lastBankTab persisted; restore on open
- [x] Tab icon = first item or custom emoji
- [x] Long-press item → "Create new tab"; + Add modal for empty tab

---

# **APPENDIX E: RANDOM EVENTS — DEEP DESIGN**

> **Source:** `FUTURE_NOTES.md` §Random Events

## E.1 RuneScape Inspiration

| Category | Examples | Trigger | Reward |
|----------|---------|---------|--------|
| **Gift Givers** | Genie (lamp), Drunken Dwarf | XP gained / time logged | Gift box |
| **Skill Guardians** | Rock Golem, Tree Spirit | While skilling | Fight or run; drops on kill |
| **Puzzle/Interaction** | Quiz Master, Maze | XP / time | Gift box |
| **Hazards** | Exploding Rock, Tangle Vine | While skilling | Avoid or suffer penalty |

## E.2 Arteria Implementation (Implemented v0.3.0+)

**Phase 1 (Done):** Per-tick roll in `useGameLoop`: 0.5% base, 60-tick cooldown.
- **Blibbertooth's Blessing:** Bonus XP (level × 5). ✅
- **Cosmic Sneeze:** Duplicate next item haul. ✅
- **Genie's Gift:** Bonus XP (level × 10) to random trained skill. ✅
- **Treasure Chest:** Gold reward (base + level × 8). ✅
- **Lucky Strike:** Double XP for this tick. ✅
- **Goblin Peek:** Enemy sighting event + modal. ✅

**Phase 2 (Planned):** Dialogue-driven randoms via `DialogueOverlay`:
- **Mysterious Stranger:** "Odd one out" — 3 items, pick the different one.
- **Nick's Cousin:** Random item offer — accept or decline.
- Reuses `activeDialogue` in Redux, `meetsNarrativeRequirement`, quest-style choice trees.

**Phase 3 (Post-Combat):** Skill Guardians — Rock Spirit (mining), Wood Wraith (logging), Void Nibble (fishing). Fight or Ignore.

**Phase 4 (Future):** Hazard events — Cursed Vein (curse chance), Tangled Roots (miss), Big Catch (positive hazard). Temporary tick modifiers.

## E.3 Technical Hooks

- **Trigger:** `randomEventChance` per tick at ~0.005 (0.5%); scale by `ticksSinceLastEvent`.
- **State:** `player.randomEvents = { lastTriggeredAt, completedCount }`.
- **Offline:** Roll N times for offline ticks; cap 1 event per offline session.

---

# **APPENDIX F: THEMING ARCHITECTURE**

> **Source:** `THEMING.md`, `STYLE_GUIDE.md` §7-9

## F.1 Overview

Arteria uses a **semantic palette** — components reference tokens like `bgApp`, `textPrimary`, `accentPrimary` — not raw hex. Themes swap the values behind those tokens. Status: **Phase 4 complete** (2026-03-04). All components use `useTheme()`. Static `Palette` export removed.

## F.2 Theme Shape (PaletteShape)

| Category | Tokens |
|----------|--------|
| Backgrounds | `bgApp`, `bgCard`, `bgCardHover`, `bgInput` |
| Text | `textPrimary`, `textSecondary`, `textDisabled`, `textMuted` |
| Accent | `accentPrimary`, `accentHover`, `accentDim`, `accentWeb`, `borderGlow` |
| Semantic | `gold`, `goldDim`, `green`, `greenDim`, `red`, `redDim` |
| Borders | `border`, `divider` |
| Skills | `skillMining`, `skillLogging`, … (per-skill colors) |

## F.3 Theme Registry

```ts
export const THEMES: Record<ThemeId, PaletteShape> = {
  dark: { /* current palette */ },
  light: { /* inverted */ },
  sepia: { /* warm, low-contrast */ },
};
export type ThemeId = 'system' | 'dark' | 'light' | 'sepia';
```

`system` → `useColorScheme()` to resolve at runtime.

## F.4 Theme Context

```ts
interface ThemeContextValue {
  palette: PaletteShape;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
}
export function useTheme(): ThemeContextValue;
```

- Provider wraps app inside Redux; reads `player.settings.themeId`.
- `setThemeId` dispatches → stored in MMKV with save.

## F.5 Usage Pattern

```ts
const { palette } = useTheme();
const styles = useMemo(
  () => StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.bgApp },
  }),
  [palette]
);
```

- Layout tokens (`Spacing`, `Radius`, `FontSize`) stay as static imports.
- `CardStyle` stays as layout config; override `borderColor` from `palette`.
- `THEMES.dark` used for fallback outside ThemeProvider (e.g., ErrorBoundary).

## F.6 Navigation Integration

`paletteToNavigationTheme(palette)` builds React Navigation theme from palette. `NavThemeWrapper` passes result to `ThemeProvider`. Tab bar, headers, StatusBar follow selected theme.

---

# **APPENDIX G: TECHNICAL STACK & FUTURE DEPENDENCIES**

> **Source:** `STACK_ASSESSMENT.md`, `FUTURE_NOTES.md`, `TRUTH_DOCTRINE.md`

## G.1 Current Architecture

| Layer | Technology |
|-------|------------|
| **Framework** | Expo SDK 55.0.0 |
| **React Native** | 0.83.2 (New Architecture) |
| **React** | 19.2.4 |
| **Language** | TypeScript ~5.9.2 (Strict) |
| **Routing** | expo-router ~55.0.0 |
| **State** | Redux Toolkit ^2.11.2 + react-redux ^9.2.0 |
| **Persistence** | react-native-mmkv ^4.1.2 (synchronous C++) |
| **Animations** | react-native-reanimated ~4.2.1 |
| **Icons** | @expo/vector-icons ^15.0.0 (MaterialCommunityIcons) |
| **Haptics** | expo-haptics ~55.0.0 |

## G.2 The Engine (`@arteria/engine`)

- Pure, headless TypeScript. Handles TickSystem, XP calculations, Narrative logic, Offline Delta processing.
- Tested with Jest 29.7 + ts-jest 29.2. 25 tests, 7 suites.
- **Must remain free of React Native dependencies.** All new native tools go in `apps/mobile`.

## G.3 Game Loop Architecture

- **Foreground:** `setInterval` at ~100ms. Uses delta-time (`now - lastTick`).
- **Background:** `AppState` listener → save on background, load on active.
- **Offline:** Timestamp-based calculation: `Math.floor((now - lastSaved) / TICK_MS) * ratePerTick`. 24h F2P cap, 7d Patron.
- **No true background loop** — timestamp-based is reliable, battery-friendly, industry-standard.

```ts
// Recommended foreground loop pattern
useEffect(() => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'background') saveToMMKV();
    if (state === 'active') loadFromMMKV();
  });
  return () => subscription.remove();
}, []);
```

## G.4 MMKV Persistence Strategy

- **Direct MMKV** for game saves (PlayerState) — valid and recommended.
- ~30x faster than AsyncStorage, fully synchronous, built-in encryption.
- If Redux auto-persist needed later, add `redux-persist` with custom MMKV wrapper.

## G.5 Future Dependencies (Projected)

| Dependency | Phase | Why |
|-----------|-------|-----|
| **expo-audio** | Phase 3 | Idle soundscapes, SFX per skill |
| **expo-notifications** | Phase 3 | "Crafting queue done" push notifications |
| **expo-secure-store** | Phase 7 | Encrypt Lumina/Patron flags (anti-cheat) |
| **@legendapp/state** | Phase 4+ | If Redux bottlenecks during combat ticks |
| **zod** | Phase 3+ | Validate quest/node/dialogue data at startup |
| **expo-task-manager** | Phase 8+ | Background guild sync (YAGNI for now) |

## G.6 Monorepo Structure

```
Arteria/
├── apps/mobile/        # React Native app
│   ├── app/(tabs)/     # Expo Router screens
│   ├── components/     # Shared components
│   ├── constants/      # Theme, game data
│   ├── contexts/       # ThemeContext
│   ├── store/          # Redux gameSlice
│   └── hooks/          # useGameLoop, useTheme
├── packages/engine/    # Headless game logic
│   └── src/            # TickSystem, XP tables, actions
├── DOCU/               # Documentation brain
└── tools/              # Scrapers, utilities
```

## G.7 Build Pipelines

| Script | Output | Use Case |
|--------|--------|----------|
| `0_Start_Dev_Server.bat` | Metro stream | Fast Refresh development |
| `1_Run_Local_Android_Build.bat` | Dev client APK | Install once for Fast Refresh |
| `2_Build_APK_Local.bat` | Release APK | Shareable prod build |
| `Update_2_EAS_OTA_Update.bat` | OTA bundle | Push JS/UI updates instantly |
| `Update_4_EAS_Build_Android_Prod.bat` | AAB | Google Play Store submission |

## G.8 OTA Runtime Version Protocol

- **JS/UI changes only:** Do NOT change `runtimeVersion`. Just push OTA.
- **Native module changes:** MUST bump `runtimeVersion` in `app.json` before building new APK.
- Static string (e.g., `"0.4.2"`) because we use bare workflow with local builds.

---

# **APPENDIX H: MELVOR IDLE REFERENCE ARCHITECTURE**

> **Source:** `zhipu-ai.md` — Baseline feature sheet for idle RPG design.

## H.1 Core Engine Patterns

| Feature | Description |
|---------|-------------|
| **Game Loop** | Passive/Idle. Calculate actions based on elapsed time, even when app is closed. |
| **Offline Progression** | `CurrentTime - LastSaveTime` → simulate results instantly on app open. |
| **Tick System** | Actions on configurable intervals. Accumulator for partial actions. |
| **RNG** | Seed-based algorithms. Drop tables = weighted probability lists. |

## H.2 Player Stat Patterns

| Feature | Data Requirements |
|---------|-------------------|
| **Skills** | `SkillID`, `CurrentXP`, `Level`, `MasteryXP` |
| **XP Curves** | Exponential: Level 1 = 83 XP, Level 99 = 13M XP |
| **Mastery** | Skill-within-a-skill: `Skill → Item → MasteryXP` |

## H.3 Skill Category Patterns

- **Gathering:** Select resource → wait for tick → roll for success → receive item + XP.
- **Artisan:** Convert Resource A → Resource B for XP. Requires specific quantities.
- **Support:** Combine materials to create buffs or unlock passive bonuses.

## H.4 Combat Reference

- **Style:** Automated "Auto-Battler." Enemies have stats (HP, Attack Speed, Max Hit).
- **Loot Tables:** On enemy defeat, roll weighted table for drops.
- **Dungeons:** Sequence of fights. Defeat N enemies → open chest.

## H.5 Economy Reference

- **Bank:** Expandable slot storage. No weight limit, slot limits only.
- **Shop:** NPC vendor with buy/sell multipliers (sell for ~10% of value).
- **Equipment:** Paper-doll slots with level requirements and stat bonuses.

## H.6 MVP Baseline

1. The Engine: Timer that runs while app is closed.
2. One Gathering Skill (Mining): Rock → Ore + XP.
3. One Artisan Skill (Smithing): Ore → Bar + XP.
4. Inventory System: List for items.
5. Combat: One auto-fight monster.
6. UI: View inventory, start skills.

---

**Document Version 2.0 — The Expanded Cosmos (Consolidated 2026-03-05)**
*All satellite design docs merged. Cross-references preserved.*

*Source Documents:*
- `COMPANIONS.md` — Detailed companion uncertainty tracking
- `WORLD_EXPLORATION.md` — Location implementation phases
- `CURRENT_IMPROVEMENTS.md` — Extension surface tracking
- `IMPROVEMENTS.md` — Sprint planning & UX audit
- `THEMING.md` — Theme implementation details
- `STYLE_GUIDE.md` — Code conventions
- `STACK_ASSESSMENT.md` — Tech forecast
- `FUTURE_NOTES.md` — Research & forward planning
- `STORYLINE.md` — Full narrative prose (see Chapter 18 for summary)
- `EXPO_GUIDE.md` — Build & deployment workflow
- `TRUTH_DOCTRINE.md` — Core philosophy & behavioral protocols
- `gemini_notes.md` — Feature audit & planning worksheets
- `zhip-ai-styling.md` — UI/UX design language
- `zhipu-ai.md` — Melvor Idle reference architecture
