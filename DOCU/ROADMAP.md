# ARTERIA — EXPANDED MASTER ROADMAP

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.
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
> **Completed:** Feb 25, 2026 (v0.1.0)
> The scaffolding is done. Do not rebuild unless absolutely necessary.
- [x] 🟢 Expo SDK 54 monorepo (npm workspaces)
- [x] 🟢 TypeScript strict mode
- [x] 🟡 Redux Toolkit (`gameSlice` — skills, inventory, gold, active actions)
- [x] 🟡 MMKV persistence layer for offline saving
- [x] 🔴 Engine package (`XPTable`, `TickSystem`, `GameEngine`)
- [x] 🟢 All 5 tab screen skeletons (Skills, Combat, Bank, Shop, Settings)
- [x] 🟢 Dark Melvor theme + design tokens
- [x] 🟡 EAS Dev Build (APK on phone) + dev server workflows

### Phase 0 — Optional polish (backlog, do not block)
- [ ] 🟢 Root Jest multi-project + `npm test` (engine + tests/); already present — verify and document.
- [ ] 🟢 Error boundary wrapper around root layout (graceful crash UI).
- [ ] 🟢 Lint/format on pre-commit or CI (ESLint, Prettier if desired).
- [ ] 🟢 STYLE_GUIDE.md creation (trace tags, line limits, comment rules) if not yet in repo.

---

## ✅ Phase 1 — "The Core Engine" (COMPLETE)
> **Completed:** Feb 26, 2026 (v0.4.0)
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
- [x] 🟢 **Data definitions:** Define initial Ore veins (Copper, Iron, Silver, Gold, Cosmic Stone) with XP yields, tick durations, and level requirements in `engine/data/mining.ts`.
- [x] 🟢 **UI Implementation:** Mining skill screen with a list of nodes (Card layout).
- [x] 🟡 **Action State:** "Train" button sets the active `PlayerAction` (e.g., `{ type: 'MINING', targetId: 'iron_vein' }`) in Redux.
- [x] 🟡 **Progression:** XP bar fills up, calculates level-ups, unlocks new veins dynamically based on current skill level.
- [ ] 🔴 **Vein Depletion Mechanic:** Implement the "Vein Exhaustion" array (veins deplete after X actions and respawn over time).
- [x] 🟢 **Mining tooltips:** Per-vein tooltip with name, level req, XP/item, base tick time.
- [x] 🟢 **Locked vein state:** Grey out or hide veins above current Mining level; show "Unlocks at level X".
- [x] 🟢 **Active node highlight:** Clear visual state for "currently training" vein (e.g. border or accent).

### 1.3 — Bank & Inventory UI 🟡
- [ ] 🟢 **Grid System:** Render a responsive grid (using `FlatList` or `FlashList`) of owned items (ores, materials).
- [ ] 🟢 **Item Badges:** Visual count indicators on item icons.
- [ ] 🟢 **Gold Currency UI:** Persistent gold tracking at the top of the Bank screen.
- [ ] 🟡 **Data Roundtrip Test:** Verify player mines item -> item appears in Bank -> item persists after restarting app.
- [ ] 🟡 **Item Details Modal:** Tap item to see description, sell value, and "used in" recipes.
- [ ] 🟢 **Empty slots:** Show placeholder or empty cell for unused bank slots (if slot limit exists).
- [ ] 🟢 **Sort/filter placeholder:** UI hook for "All / Ores / Bars / Other" or sort by name/quantity (can stub).

### 1.4 — Welcome Back & Offline UX 🟡
- [ ] 🟢 **"While You Were Away" modal:** Show on foreground after offline calc (XP gained, items looted, time elapsed).
- [ ] 🟢 **Dismiss/ack:** Single "Got it" or "Collect" so modal doesn’t reappear until next return.
- [ ] 🟡 **Cap messaging:** If player was away >24h, mention "Capped at 24h offline progress (F2P)."
- [ ] 🟢 **MMKV round-trip test on device:** Confirm save on background, load on foreground, state matches.

### 1.5 — Phase 1 polish & hooks (small bits)
- [ ] 🟢 **Haptic feedback:** Light haptic on Train/Stop (expo-haptics already in stack).
- [ ] 🟢 **Toast/snackbar:** "Mining started: Iron" / "Level up: Mining 12" (non-blocking).
- [ ] 🟢 **Analytics/events placeholder:** Log or no-op for "skill_started", "level_up" (for future analytics).
- [ ] 🟢 **Accessibility:** Ensure skill cards and main CTAs have accessible labels; touch targets ≥44px where possible.
- [ ] 🟢 **Settings persistence:** If any new settings (e.g. sound on/off), persist via MMKV or existing store.

---

## 🌾 Phase 2 — "The Gathering Pillar & Horizon"
> **Goal:** Expand gathering options and implement the core retention UI hooks.

### 2.1 — Remaining Gathering Skills 🟡
- [x] 🟢 **Harvesting (Plants/Fibers):** Define nodes.
  - [ ] *Unique Mechanic (🟡):* Seasonal Rotation (server-side/device date check alters available flora).
- [x] 🟢 **Logging (Woodcutting):** Define trees.
  - [ ] *Unique Mechanic (🟡):* Sentient Tree Negotiation (unlock "ask nicely" toggle at higher levels for better yields without breaking tools).
- [x] 🟢 **Fishing:** Define nodes.
  - [ ] *Unique Mechanic (🔴):* "Mythic" fish probabilities requiring specific discovered bait combos (hidden recipes).
- [x] 🟢 **Scavenging:** Define ruins/zones.
  - [ ] *Unique Mechanic (🟡):* Curse Chance (items drop as "Cursed X" requiring Cleansing skill later).

### 2.2 — The "Horizon System" UI (Core Retention) 🔴
- [ ] 🟡 **Dashboard Widget Layout:** Implement the 3-tier goal HUD on the main screen component.
- [ ] 🔴 **The Immediate Logic (<15m):** Selectors to find nearest completion (e.g., "Fishing level up in 5 catches," "Crafting queue done in 2m").
- [ ] 🔴 **The Session Logic (<2h):** Selectors for medium goals (e.g., "80% to Level 45 Logging").
- [ ] 🟡 **The Grind Logic (Daily/Weekly):** Static or slowly updating goals (e.g., "Clear 3 Unraveling zones").
- [ ] 🟢 **Milestone Teasers:** UI to show next-level unlocks prominently displayed under active progress bars ("Only 3 more logs to unlock Sentient Oaks").
- [ ] 🟢 **Horizon cards:** One card per tier (Immediate / Session / Grind) with icon + short text + optional progress.
- [ ] 🟢 **Seasonal/date hook:** Data or config hook for "season" (e.g. week number) for Harvesting rotation — no UI required yet.
- [ ] 🟢 **Gathering skill tooltips:** Same pattern as Mining (node name, level, yield, tick) for Harvesting, Logging, Fishing, Scavenging.

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
- [ ] 🟢 **Crafting queue UI:** List of queued items with name, progress bar, ETA, cancel button.
- [ ] 🟢 **Recipe browser:** Per-skill list of recipes with inputs/outputs and level requirement.
- [ ] 🟡 **Partial queue completion:** If offline interrupted, grant outputs for completed items and refund or retain partial inputs (design decision + impl).
- [ ] 🟢 **Crafting speed indicator:** Show "1x offline" vs "1.5x active" in UI.

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
- [ ] 🟢 **Enemy bestiary stub:** Simple list or modal of encountered enemies with name, level, faction.
- [ ] 🟢 **Combat log scroll:** Last N messages (damage, flee, loot) with optional "clear" or max lines.
- [ ] 🟢 **Loot popup/toast:** On kill or dungeon clear, brief summary of gold + items gained.
- [ ] 🟡 **Auto-combat settings UI:** HP threshold for potion use, flee-at-HP%, enable/disable auto-flee.

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
- [ ] 🟢 **Companion detail panel:** Tap companion to see stats, trait description, current task.
- [ ] 🟢 **Leadership cap display:** Show "Companions: 2/3" (or current max) in UI.
- [ ] 🟢 **Unlock teaser:** "Unlock Barnaby at Level 20" style messaging.

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
- [ ] 🟢 **Quest log UI:** List active and completed quests with short description and objectives.
- [ ] 🟢 **Story milestone modal:** Popup at Total Level thresholds with Act title and short flavor text.
- [ ] 🟢 **Radiant quest reroll:** If Cosmic Essence is implemented, "Reroll daily" button and cost display.

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
- [ ] 🟢 **Login bonus UI:** Calendar or day strip showing Days 1–7 and claimed state.
- [ ] 🟢 **Notification settings:** Per-type toggles (crafting done, idle cap, level up) persisted to MMKV/settings.
- [ ] 🟢 **Sound/music placeholder:** Settings toggles for SFX and BGM; wire to no-op or minimal sounds first.
- [ ] 🟢 **Onboarding/tutorial stub:** First-launch flow (optional): "Tap Skills → Mining → Train" (can be minimal).

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
- [ ] 🟢 **Guild roster UI:** List members, roles, contribution (stub if backend not ready).
- [ ] 🟢 **PvP defense setup UI:** Equip "defense team" loadout and companions for async attacks.
- [ ] 🟢 **Leaderboard placeholder:** Screen or section for Infinite Stair / seasonal rankings (mock or real API).

---

## 🚀 Phase 9 — "Year 2 & Beyond"
> **Goal:** Deep expansion of the game world and economy.

- [ ] 🔴 **Second Kingdom:** Cross-server travel to entirely new biomes with separate and persistent rule sets.
- [ ] 🔴 **Player Economy:** Full asynchronous Auction House and player-run shops (High risk of duping, requires rigid validation).
- [ ] � **The Cosmic Plane:** True endgame dimension featuring roguelike elements (perma-death runs with persistent meta-progression).
- [ ] 🔴 **Horizontal Crossover Skills:** Creating completely new interactions between existing level 99 skills.
- [ ] 🟢 **Second Kingdom map UI:** Region selector and travel gate (stub until backend).
- [ ] 🟢 **Auction House UI:** Browse, search, list, buy/sell (depends on validation/backend).
- [ ] 🟢 **Cosmic Plane entry UI:** "Enter run" button, meta-progression display, run modifiers summary.

---

## 🔧 Cross-Cutting & Meta (Ongoing / Backlog)
> **Goal:** Quality, maintainability, and future-proofing. Do not delete; only append.

### Docs & Process
- [ ] 🟢 **STYLE_GUIDE.md:** Trace tag format, line/function limits, comment prefixes (TODO/FIXME/NOTE).
- [ ] 🟢 **Doc freshness:** When touching a doc, refresh obviously stale bullets (e.g. "SDK 54" if already on 55).
- [ ] 🟢 **SCRATCHPAD compact:** Keep SCRATCHPAD under 500 lines; compact history, keep last 5 actions + next steps.

### QA & Tooling
- [ ] 🟢 **Integration test placeholder:** At least one test in `tests/integration/` (e.g. load save → dispatch → assert state).
- [ ] 🟢 **E2E placeholder:** Document or stub Playwright (or Detox) target for one critical path (e.g. open app → Skills → Train Mining).
- [ ] 🟢 **CI checklist:** Lint, typecheck, unit tests on push/PR (when CI is added).
- [ ] 🟢 **expo-doctor:** Run periodically; fix or document any new warnings.

### Accessibility & Theming
- [ ] 🟢 **Screen reader labels:** Ensure all interactive elements have accessible labels.
- [ ] 🟢 **Reduce motion:** Respect system or in-app "reduce motion" for animations.
- [ ] 🟢 **Theme tokens:** Centralize light/dark (or future "forest"/"arcane") in theme; avoid hardcoded hex in components.
- [ ] 🟢 **Font scaling:** Support dynamic type / large text where applicable.

### Localization & i18n (Future)
- [ ] 🟢 **i18n placeholder:** Decide strategy (expo-localization, react-i18next, or JSON + key lookup); add to FUTURE_NOTES if not building yet.
- [ ] 🟢 **String extraction:** Keep user-facing strings in one layer (e.g. `constants/strings.ts` or JSON) for future translation.

### Performance Checkpoints
- [ ] 🟢 **Bank/Inventory:** Use FlatList/FlashList with stable keys; avoid inline object creation in render.
- [ ] 🟢 **Tick loop:** Ensure single source of truth; avoid dispatching every tick if batching is possible.
- [ ] 🟢 **MMKV read frequency:** Don't read full save on every tick; only on foreground load and save on background.

---

## 🎯 Current Target
**We are here → Phase 2 (Gathering Expansion & Combat Foundation)**

Phase 1 complete! Next action: Expand gathering skills (Harvesting, Logging, Fishing, Scavenging) and begin combat system stats infrastructure.
