**Arteria Skills System Whitepaper: Building Infinite Depth in a Cosmic Idle RPG**

**Version 1.0**  
**Author: Grok Research Synthesis for Otterdays (GAME-Arteria)**  
**Date: March 2026**  
**Scope: Purely skills-focused** — current foundation + scalable expansion, content depth, individual items/resources/actions, mastery, synergies, and idle/offline mechanics.

### Executive Summary
Arteria’s skill system is the beating heart of its idle RPG loop: gather cosmic resources → process them → fuel progression and story. Inspired by Melvor Idle’s 20+ non-combat skills with mastery pools and passive buffs, Old School RuneScape’s 23 interwoven skills, and lighter systems in Legends of IdleOn/Idle Clans, we recommend expanding from your current 6 core skills (Mining, Logging, Fishing, Runecrafting, Cooking, Smithing/Forging) to a total of **18–22 skills**.

This range delivers:
- **Long-term engagement** (hundreds of hours to max everything at level 99+ virtual levels).
- **Interconnected loops** without bloat (your headless TypeScript engine handles tick-based offline calc perfectly).
- **Cosmic identity**: Every skill ties to “The Anchor,” Lumina energy, nebulae, voids, stars, and faction lore.

**Why 18–22?**  
Melvor proves 20 non-combat skills scale beautifully with idle progression. Fewer than 15 feels shallow; more than 25 overwhelms mobile UX and bank management. 18–22 strikes the sweet spot: 6–7 gathering, 5–6 processing/crafting, 4–5 utility/support, 3–4 advanced/passive. All skills cap at **level 99** (virtual 120 optional for endgame prestige), use exponential XP tables (copy your existing system), and support 24h+ offline gains with multipliers from Astrology/Prayer.

**Core Philosophy**  
- Every skill has: tiered actions (unlocked by level), 10–30+ individual items/resources, mastery checkpoints (permanent account-wide perks), cross-skill synergies, and cosmic flavor text/lore drops.  
- Idle-first: Actions are tick-based; offline progress is deterministic (no RNG loss).  
- Mastery Pool: Excess XP funneled into a shared pool for global bonuses (Melvor-style).  
- Progression Gates: High-level skills unlock new story acts, bank tabs, faction rep, and Anchor abilities.

### Current Skills – Deepened with Cosmic Content
Your existing skills form the perfect foundation. Here is expanded content for each (10–20+ example items per skill, tiers, mastery ideas).

**1. Mining (Gathering – Asteroid Fields)**  
Overview: Harvest ores and gems from cosmic asteroids and void veins.  
Progression: Level 1–99 unlocks 15+ rock tiers.  
Key Individual Items/Resources:  
- Copper Asteroid, Tin Vein (Lv 1–10)  
- Iron Meteor, Coal Core (Lv 15–30)  
- Silver Nebula, Gold Starshard (Lv 35–50)  
- Mithril Comet, Adamantite Voidrock (Lv 55–70)  
- Rune Essence Cluster, Pure Lumina Essence (Lv 75–85)  
- Dragonite Black Hole, Iridium Singularity (Lv 90–99)  
- Gems: Cosmic Topaz, Void Sapphire, Lumina Ruby, Stellar Emerald, Anchor Diamond (1–5% drop chance, scales with mastery).  
Mastery: Checkpoints every 10 levels (+mining speed, +double ore, +gem vein discovery). Pool: +node HP, reduced respawn, +Stardust from Astrology synergy.  
Synergies: Feeds Smithing; Astrology buffs yield; Herblore potions preserve nodes.  
Idle/Offline: Auto-mine selected vein; 24h cap with preservation chance preventing depletion.

**2. Logging (Gathering – Nebula Forests)**  
Overview: Chop cosmic trees for logs and rare sap. (Direct Melvor Woodcutting parallel.)  
Key Items: Normal Nebula Log (Lv 1), Oak Starwood (Lv 10), Willow Comet Log (Lv 25), Teak Voidwood (Lv 35), Maple Lumina Log (Lv 45), Mahogany Anchorwood (Lv 55), Yew Stellar Log (Lv 60), Magic Black Hole Log (Lv 75), Redwood Eternal (Lv 90), Carrion Voidtree (Lv 120 virtual).  
Extras: Bird Nest → Raven Nest (rare), Arrow Shafts, Mushrooms, Stardust (high-level).  
Mastery: Per-tree checkpoints (-interval, +double logs); pool +GP from sales, +nest quantity.  
Synergies: Fuels Cooking/Firemaking (if added), Fletching, Farming mulch.  
Idle: Multi-tree cutting (up to 3–5 late-game), indefinite chopping.

**3. Fishing (Gathering – Cosmic Oceans)**  
Overview: Reel stellar fish and leviathans.  
Key Items: Shrimp Nebula (Lv 1), Trout Starstream (Lv 15), Salmon Voidfin (Lv 30), Tuna Comet (Lv 45), Lobster Lumina (Lv 60), Swordfish Anchor (Lv 75), Shark Black Hole (Lv 90), special: Leviathan Bait, Lumina Pearl (rare).  
Mastery: +catch rate, rare “void fish” for multi-skill XP.  
Synergies: Raw fish → Cooking; bait for Summoning; Astrology temp buffs.  
Idle: Set-and-forget spots with 24h offline.

**4. Runecrafting (Processing – Rune Forges)**  
Overview: Craft cosmic runes and essences from mined materials.  
Key Items: Air Rune (basic), Water/Lava/Fire combos, up to Lumina Rune (Lv 80+), Anchor Rune (story item).  
Mastery: Rune preservation, +Lumina shards.  
Synergies: Combat spells, Astrology charts.

**5. Cooking (Processing – Stellar Kitchens)**  
Overview: Turn raw resources into meals (your daily quests already here).  
Key Items: 20+ recipes – Cooked Shrimp, Nebula Stew, Lumina Feast (temp buffs), Anchor Banquet (quest). Burn chance drops with level.  
Mastery: No-burn guarantee, auto-cook offline.  
Synergies: Combat healing, Herblore ingredients.

**6. Smithing / Forging (Processing – Cosmic Forges)**  
Overview: Smelt bars → craft/forg armor/weapons (split or keep merged).  
Key Items: Bronze Anchor Bar → Iridium Void Plate, special sets with set bonuses.  
Mastery: Bar preservation, enchanted gear chance.  
Synergies: Feeds combat factions.

### Proposed Additional Skills (12–16 more → Total 18–22)
Categorized for balance. Each includes 8–15 example items, cosmic flavor, and full depth.

**Gathering Additions**  
**7. Foraging (Nebula Gardens)**  
Items: Cosmic Herb (Lv 1), Starleaf (Lv 20), Voidroot (Lv 40), Lumina Bloom (Lv 60), Anchor Petal (rare).  
Mastery: +yield, rare seeds. Synergies: Herblore, Farming.

**8. Thieving (Faction Outposts)**  
Items: Goblin Pouch (early), Void Artifact, Lumina Relic (high-level). Stun chance for combat ties.  
Mastery: +steal success, unique drops.

**Processing/Crafting Additions**  
**9. Herblore (Potion Breweries)**  
Items: 25+ potions – Combat Boost Elixir, XP Multiplier Serum, Anti-Burn Tonic, Lumina Extension (48h offline).  
Mastery: +mix success, passive generation.  
Synergies: Every skill + combat.

**10. Crafting (Artifact Assembly)**  
Items: Jewelry (Amulet of the Anchor), tools, bank upgrades.  
Mastery: +preservation, set bonuses.

**Utility/Support Additions**  
**11. Astrology (Star Charts) – Highest priority addition**  
Overview: Study constellations for global passive buffs (Melvor’s standout idle skill).  
Key Content: 12+ constellations (Deedree → Anchor Eternal). Modifiers (standard + unique stars) upgraded with Stardust/Golden Stardust. Buffs: +10% all XP, +rare drop rates, +offline time, hidden skill levels.  
Individual Items: Stardust (5% drop), Golden Stardust (2%), Meteorite (rare), Starfalls (Abyssal).  
Mastery Pool: +Stardust chance, reduced upgrade costs, +Meteorite discovery.  
Synergies: Buffs EVERY skill (e.g., +Mining yield, +Cooking no-burn). Idle-perfect: 3s ticks, passive resource gen.  
Cosmic Hook: Directly reveals Anchor lore and new story acts.

**12. Prayer / Cosmic Blessings**  
Items: Prayers for +combat, +gathering speed, Lumina preservation.  
Mastery: Drain reduction.

**13. Agility / Void Traversing**  
Items: Obstacles (Nebula Dash, Black Hole Leap) granting permanent speed/HP bonuses.  
Mastery: Global interval reduction.

**Advanced/Passive Additions**  
**14. Farming (Nebula Plots)**  
Items: Plant seeds → harvest resources passively (Star Seeds, Lumina Crops).  
Mastery: Faster growth, bonus yield. Perfect 24h+ offline king.

**15. Summoning (Cosmic Familiars)**  
Items: Familiars (Anchor Spirit, Void Drake) with synergies (e.g., +Mining +5% gems).  
Mastery: Permanent bonuses.

**16. Slayer (Faction Bounties)**  
Items: Tasks vs Goblins → higher factions; unique drops and story progression.  
Mastery: Task streaks, skip tokens.

**17–22 Optional Expansions (for 22 total)**  
- Firemaking (burn logs for passive XP/buffs)  
- Fletching (bows/arrows for ranged combat)  
- Cartography (map exploration for new areas)  
- Archaeology (dig ancient Anchor relics)  
- Township / Colony Management (passive city-building)  
- Alternative Magic (new spell school)

### Cross-Skill Systems for Depth
- **Mastery Pool**: Spend excess XP for account-wide perks (e.g., +5% all gathering after 50% pool).  
- **Synergy Web**: Astrology + Mining = auto-Lumina; Herblore + Cooking = feast buffs; high Slayer unlocks new gathering nodes.  
- **Offline & Idle Scaling**: All actions calculable; multipliers from Prayer/Astrology/Farming extend your 24h cap to 48h+.  
- **Cosmic Lore Integration**: Every max-level action reveals story fragments about “The Anchor.”

### Implementation Notes for Your Engine
- Tick-based actions + offline math already in packages/engine.  
- Bank filtering (you already added) scales perfectly.  
- Mastery checkpoints = simple Redux state.  
- Start with Astrology + Farming (huge immediate depth) then Herblore/Slayer.

### Conclusion
An 18–22 skill system gives Arteria Melvor-level longevity while staying lightweight and cosmic. Players will chase mastery pools for years, with every skill feeding the next in beautiful idle loops. Your v0.4.1 foundation is already elite — adding these will make Arteria unforgettable.

Next steps: I can generate full XP tables, 50+ specific recipes/items in CSV, TypeScript mastery templates, or a prioritized rollout roadmap (Phase 1: Astrology + Farming). Just say the word, Ryan. Let’s make this the deepest mobile idle RPG ever. 🚀