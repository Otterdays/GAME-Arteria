# ARTERIA — EXPANDED MASTER ROADMAP
**Synthesized from:** `MASTER_DESIGN_DOC.md` (Aetheria: The Idle Chronicles)
**Last Updated:** 2026-02-26
**Philosophy:** KISS · YAGNI · Ship the core loop first, but plan for the entire cosmos.

> **🚨 URGENT:** NEVER DELETE OR REMOVE PAST FEATURES FROM THIS ROADMAP. ONLY MARK THEM AS DONE OR COMPACT THEM. THIS ROADMAP MUST GROW, NOT SHRINK.

---

## 🗺️ The Big Picture

```text
Phase 0 (Done) ──► Phase 1 (Core) ──► Phase 2 (Gather) ──► Phase 3 (Craft) ──► Phase 4 (Combat) 
                                                                                        │
Phase 8 (Post) ◄── Phase 7 (Eco/Launch) ◄── Phase 6 (Story) ◄── Phase 5 (Support/Comps) ◄──┘
```

**Difficulty Markers:**
🟢 Low (UI/Data Entry)
🟡 Medium (Logic/State Management)
🔴 High (Complex Systems/Math/Architecture)

---

## ✅ Phase 0 — Foundation (COMPLETE)
> The scaffolding is done. Do not rebuild unless absolutely necessary.
- [x] 🟢 Expo SDK 54 monorepo (npm workspaces)
- [x] 🟢 TypeScript strict mode
- [x] 🟡 Redux Toolkit (`gameSlice` — skills, inventory, gold, active actions)
- [x] 🟡 MMKV persistence layer for offline saving
- [x] 🔴 Engine package (`XPTable`, `TickSystem`, `GameEngine`)
- [x] 🟢 All 5 tab screen skeletons (Skills, Combat, Bank, Shop, Settings)
- [x] 🟢 Dark Melvor theme + design tokens
- [x] 🟡 EAS Dev Build (APK on phone) + dev server workflows

---

## ⚙️ Phase 1 — "The Core Engine" (Playable Loop)
> **Goal:** The vertical slice. One skill working end-to-end with real persistence and UI.

### 1.1 — Game Loop & App Lifecycle 🔴
- [x] 🟡 **AppState Event Listener:** Hook into React Native's `AppState` to detect background/foreground transitions.
- [x] 🟢 **Background Trigger:** Save `PlayerState` + `Date.now()` timestamp to MMKV when backgrounded.
- [x] 🔴 **Foreground Trigger (Welcome Back):** 
  - Compute `elapsed = Date.now() - lastSaved`.
  - Enforce 24-hour offline cap (or 48h for premium).
  - Run `GameEngine.processOffline(elapsed)`.
  - Dispatch "While You Were Away" report (XP gained, items looted) to Redux.
- [x] 🔴 **Real-time Loop:** Foreground `setInterval` (~100ms) calling `engine.processRealtime`.
- [x] 🟡 **Tick Dispatch:** Dispatch processed ticks to Redux to update UI state smoothly.

### 1.2 — Mining: The Foundation Skill 🟡
- [ ] 🟢 **Data definitions:** Define initial Ore veins (Copper, Iron, Silver, Gold, Cosmic Stone) with XP yields, tick durations, and level requirements in `engine/data/mining.ts`.
- [ ] 🟢 **UI Implementation:** Mining skill screen with a list of nodes (Card layout).
- [ ] 🟡 **Action State:** "Train" button sets the active `PlayerAction` (e.g., `{ type: 'MINING', targetId: 'iron_vein' }`) in Redux.
- [ ] 🟡 **Progression:** XP bar fills up, calculates level-ups, unlocks new veins dynamically based on current skill level.
- [ ] 🔴 **Vein Depletion Mechanic:** Implement the "Vein Exhaustion" array (veins deplete after X actions and respawn over time).

### 1.3 — Bank & Inventory UI 🟡
- [ ] 🟢 **Grid System:** Render a responsive grid (using `FlatList` or `FlashList`) of owned items (ores, materials).
- [ ] 🟢 **Item Badges:** Visual count indicators on item icons.
- [ ] 🟢 **Gold Currency UI:** Persistent gold tracking at the top of the Bank screen.
- [ ] 🟡 **Data Roundtrip Test:** Verify player mines item -> item appears in Bank -> item persists after restarting app.
- [ ] 🟡 **Item Details Modal:** Tap item to see description, sell value, and "used in" recipes.

---

## 🌾 Phase 2 — "The Gathering Pillar & Horizon"
> **Goal:** Expand gathering options and implement the core retention UI hooks.

### 2.1 — Remaining Gathering Skills 🟡
- [ ] 🟢 **Harvesting (Plants/Fibers):** Define nodes. *Unique Mechanic (🟡):* Seasonal Rotation (server-side/device date check alters available flora).
- [ ] 🟢 **Logging (Woodcutting):** Define trees. *Unique Mechanic (🟡):* Sentient Tree Negotiation (unlock "ask nicely" toggle at higher levels for better yields without breaking tools).
- [ ] 🟢 **Fishing:** Define nodes. *Unique Mechanic (🔴):* "Mythic" fish probabilities requiring specific discovered bait combos (hidden recipes).
- [ ] 🟢 **Scavenging:** Define ruins/zones. *Unique Mechanic (🟡):* Curse Chance (items drop as "Cursed X" requiring Cleansing skill later).

### 2.2 — The "Horizon System" UI (Core Retention) 🔴
- [ ] 🟡 **Dashboard Widget Layout:** Implement the 3-tier goal HUD on the main screen component.
- [ ] 🔴 **The Immediate Logic (<15m):** Selectors to find nearest completion (e.g., "Fishing level up in 5 catches," "Crafting queue done in 2m").
- [ ] 🔴 **The Session Logic (<2h):** Selectors for medium goals (e.g., "80% to Level 45 Logging").
- [ ] 🟡 **The Grind Logic (Daily/Weekly):** Static or slowly updating goals (e.g., "Clear 3 Unraveling zones").
- [ ] 🟢 **Milestone Teasers:** UI to show next-level unlocks prominently displayed under active progress bars ("Only 3 more logs to unlock Sentient Oaks").

---

## 🔨 Phase 3 — "The Crafting Engine"
> **Goal:** Let players process what they gathered. Building complex inter-skill dependencies.

### 3.1 — Crafting Queue Architecture 🔴
- [ ] 🔴 **Queue System State:** Support an 8-hour max queue of crafting actions in Redux/Engine. 
- [ ] 🟡 **Speed Modifiers:** F2P capped at base rate, active play (app open) grants 1.5x-2x speed multiplier.
- [ ] 🔴 **Bank Integration:** Subtract inputs on queue start (reserve them), grant outputs on queue complete (or partial completion if interrupted).
- [ ] 🟡 **Offline Queue Processing:** Ensure `processOffline` handles completing multiple queued items over elapsed time.

### 3.2 — Core Crafting Skills (Data & UI) 🟡
- [ ] 🟡 **Smithing:** Weapons, armor, tools. *Active Mechanic (🔴):* "Heat Management" minigame multiplier (tap to keep heat in green zone).
- [ ] 🟡 **Alchemy:** Potions/bombs. *Active Mechanic (🔴):* "Catching Volatility" minigame for bonus absolute potency.
- [ ] 🟡 **Cooking:** Food buffs, bait, companion meals. *Active Mechanic (🟡):* Taste testing for extended buff duration.
- [ ] 🟢 **Tailoring:** Robes, bags, fishing nets.
- [ ] 🟢 **Fletching:** Arrows, bows, throwable cosmos.
- [ ] 🟡 **Runecrafting:** Enchantments, scrolls. *Mechanic (🟡):* Real-world time checks (e.g., Lunar Weave only craftable at night local time).
- [ ] 🔴 **Construction:** Housing, storage. *Blueprint System:* Requires multi-skill inputs (e.g., Nails from Smithing + Planks from Logging).

---

## ⚔️ Phase 4 — "The Clash" (Combat Pillar)
> **Goal:** Develop the Instance-based Combat system and Dungeons mapping.

### 4.1 — Combat Stats & Loadouts 🔴
- [ ] 🔴 **Stats Infrastructure:** Map Attack, Strength, Defense, Ranged, Magic, Constitution skills to raw combat math (accuracy, max hit, evasion).
- [ ] 🟡 **Equipment System:** Equip weapon, shield, armor, accessory, and limit ammo/runes slots in Redux.
- [ ] 🟡 **Combat Styles Selector:** Toggle between The Stalwart (Shield), The Blademaster (Dual), Spellweaver, Harbinger, Warden, Trickster (affects stat weighting).

### 4.2 — Encounter Flow (Instances) 🔴
- [ ] 🟡 **Scout & Prepare UI:** Screen to select zone, equip loadout, and slot consumables (potions/food).
- [ ] 🔴 **Auto-Combat Engine:** Headless math cruncher for offline. Resolves fights at 70% efficiency, auto-uses pots (based on HP threshold setting), auto-flees at 20% HP.
- [ ] 🟡 **The "While You Were Away" Combat Report:** Detailed summary of kills, deaths, loot drops, gold earned, and combat skill XP.

### 4.3 — Active Combat Interface 🔴
- [ ] 🟡 **Action Bar UI:** Buttons for Basic attacks, Heavy strikes (MP), Shield bashes, Items. Fixed cooldowns.
- [ ] 🟢 **Enemy UI:** Large HP Bar, Status Effects icons (Enraged, Stunned).
- [ ] 🔴 **Combo System:** Code manual timing logic (e.g., tracking a Stun state to apply +50% dmg modifier from next hit if specific skill used).

### 4.4 — Enemy Factions & Dungeons 🟡
- [ ] 🟢 **Data Structures:** Define the 12 Enemy Factions (The Unraveled, Celestial Constructs, Void wildlife, Astral Pirates, Cosmic Vermin, etc.) with stat blocks and loot tables.
- [ ] 🟡 **Dungeon Modes:** Logic for Delves (5-10 min active / 1h idle clear), Expeditions (30 min / 4h idle max).
- [ ] 🔴 **Dungeon Modifiers Engine:** Random weekly rules applied to combat math (e.g., "Gravity's Suggestion" reverses fall damage, "Blibbertooth's Blessing" causes confetti visual effects).

---

## 🤝 Phase 5 — "Connective Tissue" (Support & Companions)
> **Goal:** Link systems together, introduce companions, and deepen the account meta.

### 5.1 — The Protagonist (Character Creation) 🟡
- [ ] 🟢 **Character Creation Flow:** Setup single-run screen. Select Ancestry (Human, Elf, Dwarf, Fey-Touched, Void-Blooded).
- [ ] 🟡 **Affinities & Quirks:** Select Luminar/Voidmire/Balanced (modifies starting stats/xp rates). Assign a random Cosmic Quirk modifier (e.g., "Attracts sentient furniture" - mostly flavor text).

### 5.2 — Support Skills 🟡
- [ ] 🟡 **Exploration:** Uncover map nodes, passively reduces travel/dungeon time.
- [ ] 🟡 **Cleansing:** Minigame or timer to purify "Cursed" items generated from Scavenging.
- [ ] 🟡 **Barter:** Affects shop buy/sell ratios. Logic to unlock "Black Market" shop tab at Level 50.
- [ ] 🔴 **Research:** Passive knowledge tree (similar to Path of Exile passive tree, but smaller) that provides global multipliers to other skills.
- [ ] 🟢 **Leadership:** Simple integer check that dictates maximum active companions.

### 5.3 — Companion System (Wandering Souls) 🔴
- [ ] 🟢 **Companion Roster Data:** Define Barnaby the Uncertain, Scholar Yvette, Sir Reginald Pomp (stats, flavor text, unlock condition).
- [ ] 🟡 **Companion Tasks UI:** Drag-and-drop or select menu to assign companions to Auto-Gather or Auto-Combat.
- [ ] 🔴 **Companion Traits Logic:** Hook traits into Engine math (e.g., Barnaby's 50% hit-self chance but 2x damage modifier).

---

## 📜 Phase 6 — "The Narrative Framework"
> **Goal:** Inject context, tone, and goals without blocking the core idle experience.

### 6.1 — Quest Engine 🔴
- [ ] 🔴 **Radiant (Infinite) Quests:** Procedural generator for standard "Gather X" or "Kill Y" daily tasks scaling with player level.
- [ ] 🟡 **Character Quests:** Multi-step boolean chains for Companions (e.g., curing Barnaby's self-doubt).
- [ ] 🟡 **Main Storyline (Act I - IV):** Milestone triggers (modal popups) at specific Total Levels leading up to the "Choice" between Luminar, Voidmire, and Absurdity.

### 6.2 — Factions & Dialogue 🟡
- [ ] 🟢 **Dialogue UI:** Simple, punchy text boxes (visual novel style) for The Order of the Balanced Scale, The Celestial Bureaucracy, and The Cult of Blibbertooth.
- [ ] 🟡 **Reputation Tracking:** Global integer state flags for decisions made, altering shop prices or available quests per faction.

---

## 💰 Phase 7 — "Economy, Polish, & Launch"
> **Goal:** Implement the "Contextual Monetization" strategy and finalize for release.

### 7.1 — Currency Architecture 🟡
- [ ] 🟢 **Aether Shards:** Wire to epic crafting / deep dungeon drops (F2P).
- [ ] 🟢 **Cosmic Essence:** Wire to daily quests; used for rerolls/skips (F2P/Earnable).
- [ ] 🟡 **Lumina:** Premium "Robux" currency system setup (UI only initially, mock integration).

### 7.2 — The Lumina Shop 🟡
- [ ] 🟢 **UI Categories:** Cosmetics, Bank Expansion, Skill Boosts (24h max), Instant Craft Skips.
- [ ] 🟡 **The Patron's Blessing:** Implement $9.99/mo subscription logic check (12h offline cap, +20% XP, 2x bank slots). *Strictly convenience, no raw power.*
- [ ] 🔴 **The Treasure Hunt (Battle Pass):** Setup monthly grid-digging mechanic using daily shovels (complex UI/state).

### 7.3 — Retention & Polish 🔴
- [ ] 🟡 **7-Day Login Bonus:** Escalating reward array, capped at Cosmic Essence on Day 7. Tracks consecutive days.
- [ ] 🔴 **Push Notifications Architecture:** Local push notifications for "Crafting Ready" or "Idle Cap Reached" using `expo-notifications`.
- [ ] 🔴 **Performance Audit:** React Native Flamegraph checks, eliminate re-renders in FlatLists, `npx expo-doctor`.
- [ ] 🟡 **EAS Production:** Generate Android App Bundle (.aab), target API 36 (Android 16), update Keystores.

---

## 🌌 Phase 8 — "Year 1 Post-Launch & Endgame"
> **Goal:** The initial post-launch runway. DO NOT BUILD UNTIL LAUNCH IS STABLE.

### 8.1 — Pillar V: Cosmic Skills (Endgame) 🔴
- [ ] 🔴 **Aether Weaving:** Unlock at Level 80 in three skills. Manipulate reality for legendary crafting.
- [ ] 🔴 **Void Walking:** Unlocked via "Touch of the Void" questline. Short-range teleportation to access hidden areas.
- [ ] 🔴 **Celestial Binding:** Ally with Celestial Bureaucracy. Summon angelic assistants for offline automation boosts.
- [ ] 🔴 **Chronomancy:** Discover the Temporal Archives. Speed up individual skill training, reset daily limits once per week.

### 8.2 — Level 100 Content: The Anchor's Burden 🔴
- [ ] 🔴 **Cosmic Tiers (Prestige):** Infinite scaling. Prestige individual level 100 skills for permanent account-wide bonuses.
- [ ] 🟡 **Mentor System:** Act as a mentor for new players (basic social framework).
- [ ] 🔴 **Blibbertooth's Ultimate Quest:** The true endgame quest: "Make the universe laugh" (extreme difficulty narrative content).

### 8.3 — Year 1 Major Features 🔴
- [ ] 🔴 **Guild System:** Shared housing, guild passive skills, weekly lockout cooperative raids. Shared progress bars for server-wide rewards.
- [ ] 🔴 **PvP Arena:** Asynchronous AI-controlled "Defense Teams" (Companions + your Character build) attacking each other.
- [ ] 🟡 **The Infinite Stair:** Procedurally generated endless dungeon with server-sided leaderboard chasing.
- [ ] � **New Region: The Shimmering Sea:** Naval combat mechanics and underwater gathering skills.

---

## 🚀 Phase 9 — "Year 2 & Beyond"
> **Goal:** Deep expansion of the game world and economy.

- [ ] 🔴 **Second Kingdom:** Cross-server travel to entirely new biomes with separate and persistent rule sets.
- [ ] 🔴 **Player Economy:** Full asynchronous Auction House and player-run shops (High risk of duping, requires rigid validation).
- [ ] � **The Cosmic Plane:** True endgame dimension featuring roguelike elements (perma-death runs with persistent meta-progression).
- [ ] 🔴 **Horizontal Crossover Skills:** Creating completely new interactions between existing level 99 skills.

---

## 🎯 Current Target
**We are here → Phase 1.2 (Mining: The Foundation Skill)**

Next action: Build the Mining skill screen UI and set up the active task triggers to feed into the newly built offline-capable game loop.
