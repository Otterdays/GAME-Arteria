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
- [x] 🟢 **Grid System:** Render a responsive grid (using `FlatList` or `FlashList`) of owned items (ores, materials).
- [x] 🟢 **Item Badges:** Visual count indicators on item icons.
- [x] 🟢 **Gold Currency UI:** Persistent gold tracking at the top of the Bank screen.
- [x] 🟡 **Data Roundtrip Test:** Verify player mines item -> item appears in Bank -> item persists after restarting app.
- [x] 🟡 **Item Details Modal:** Tap item to see description, sell value, and "used in" recipes. (Including Selling support!)
- [ ] 🟢 **Empty slots:** Show placeholder or empty cell for unused bank slots (if slot limit exists).
- [x] 🟢 **Sort/filter placeholder:** UI hook for "All / Ores / Bars / Other" or sort by name/quantity (can stub).

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

## ✨ QoL — Polish & Improvements (Ongoing)
> Small, high-impact improvements that can be done any time. Prioritise when a phase is complete or between sprints.

### Skills Screen
- [x] 🟢 **A. Skill Pillars/Grouping** — Dividers grouping skills into ⛏️ Gathering / ⚔️ Combat / 🔨 Crafting / ✨ Support.
- [x] 🟢 **B. Total Level Badge** — Sum of all skill levels shown in the header (e.g. "Total Lv. 247").
- [x] 🟢 **C. Coming Soon Tags** — Replace Alert popup with an inline locked-card style + "Phase 2 ›" tag for unimplemented skills.
- [x] 🟡 **D. XP/hr Estimate** — Show "~1,200 XP/hr" under each active node. Math: `xpPerTick * (1000 / intervalMs) * 3600`. Uses `formatNumber` utility.
- [x] 🟢 **E. Ticks-to-level** — Under the active node, show "~14 more actions to level up". Math: `Math.ceil((nextLevelXp - currentXp) / xpPerAction)`.

### Persistence
- [x] 🟡 **F. Restore Active Task on Relaunch** — Verified: `usePersistence` saves full `player` (incl. `activeTask`) on background/30s auto-save. Works by design.

### Accessibility & Readability
- [x] 🟢 **G. Haptic on level-up** — Already fires in LevelUpToast via `Haptics.notificationAsync`. Verified fires for any skill. No code change needed.
- [x] 🟢 **H. Long-number formatting** — `utils/formatNumber.ts` created. Applied to XP bars (Skills screen), XP/hr (Mining screen), XP gains (WYWA modal).
- [x] 🟢 **I. Settings: Reset Save** — "Wipe Save Data" button added to Settings screen behind a two-step destructive Alert.
- [x] 🟢 **J. Persistent Level Up Toast Fix** — Fixed bug where toast would get stuck or clear its own timer.
- [x] 🟢 **K. Android Bottom Insets** — Fixed tab bar overlap with gesture navigation bar using `useSafeAreaInsets`.
- [x] 🟢 **L. XP [current/next] Display** — Replaced flat XP with more informative "current / goal" format.
- [x] 🟢 **M. Full Card Navigation** — Tapping anywhere on a skill card now navigates into the skill.

### 🎨 VFX & Feedback
- [x] 🟡 **N. XP Floating Pop-ups** — When XP is gained, show a floating `+XP [Icon]` animation below the XP bar areas. (Includes node icon!)
- [x] 🟢 **O. XP Bar "Pulse"** — Subtle glow or flash effect on the XP bar fill when it moves.

### ⚡ Juice & Polish (QoL Backlog)
- [x] 🟢 **P. Haptic Heartbeat** — Subtle haptic pulse when a progress bar reaches 100% and resets.
- [ ] 🟢 **Q. Screen Shake (Gentle)** — Tiny "thud" shake effect when completing a heavy action (e.g. crushing a rock).
- [ ] 🟢 **R. Contextual Ambience** — Subtle loop icons/animations (birds for logging, waves for fishing) in the screen background.
- [x] 🟢 **S. "Loot Vacuum" Animation** — When gaining an item, show a small icon flying from the action area toward the Bank tab.
- [ ] 🟢 **T. Critical Hit VFX** — Larger, golden pop-up for "Critical Gains" (double loot/xp random procs).
- [ ] 🟢 **U. Quick-Switch Sidebar** — A drawer or small icon set to jump between gathering skills without going back to the Skill list.
- [x] 🟢 **V. Inventory Full Warning** — Persistent "!" on the Bank tab if the player is capped (preventing further gathering).
- [x] 🟡 **W. Universal Action Ticker** — A persistent, slim progress bar at the top/bottom of the screen showing the *current action loop* (e.g., a 4-second bar for Mining Iron) with the skill emoji. Keeps the "heartbeat" of the game visible even in the Bank/Settings.

### 🌟 Advanced UX & Immersion
- [x] 🟢 **X. Pulsing Tab Glow** — Tab icons pulse gold when a level-up occurs or a task finishes until the user visits that screen.
- [ ] 🟡 **Y. Adaptive App Shortcuts** — Support for Android app icon shortcuts to jump directly into the active skill or Bank.
- [x] 🟢 **Z. Advanced Bank Search** — Add a real-time search bar and "Type" filters (Ore, Bar, Item) to the Bank UI.
- [ ] 🟢 **ZA. Action Haptic Sequence** — A unique rhythmic vibration pattern when starting/stopping different types of skills.
- [ ] 🟢 **ZB. Skill-Specific Ambience** — Subtle background soundscapes (birds, echoes, waves) that activate based on the open skill screen.

---

## 🌾 Phase 2 — "The Gathering Pillar & Horizon"
> **Goal:** Expand gathering options and implement the core retention UI hooks.

### 2.1 — Remaining Gathering Skills 🟡
- [x] 🟢 **Harvesting (Plants/Fibers):** Define nodes.
  - [x] *Unique Mechanic (🟡):* Seasonal Rotation (server-side/device date check alters available flora).
- [x] 🟢 **Logging (Woodcutting):** Define trees.
  - [x] *Unique Mechanic (🟡):* Weekly Yield (Seasonal rotation implemented in `GameEngine`).
- [x] 🟢 **Fishing:** Define nodes.
  - [x] *Unique Mechanic (🔴):* Mythic fish probabilities.
- [x] 🟢 **Scavenging:** Define ruins/zones.
  - [ ] *Unique Mechanic (🟡):* Curse Chance (items drop as "Cursed X" requiring Cleansing skill later).

### 2.2 — The "Horizon System" UI (Core Retention) ✅
- [x] 🟡 **Dashboard Widget Layout:** Implement the 3-tier goal HUD on the main screen component.
- [x] 🔴 **The Immediate Logic (<15m):** Real-time progress toward the next individual drop/tick (0-100%).
- [x] 🔴 **The Session Logic (<2h):** XP progress toward the next character level for the active skill.
- [x] 🟡 **The Grind Logic (Daily/Weekly):** Progress toward major milestones (Decade levels or Lv. 99).
- [x] 🟢 **Milestone Teasers:** UI to show next-level unlocks prominently displayed under active progress bars.
- [x] 🟢 **Horizon cards:** One card per tier (Immediate / Session / Grind) with glassmorphic styling and progress bars.
- [x] 🟢 **Seasonal/date hook:** Weekly yield logic for Logging.
- [x] 🟢 **Gathering skill tooltips:** Same pattern as Mining (node name, level, yield, tick) for Harvesting, Logging, Fishing, Scavenging.

### 2.3 — Nick's Shop (Gold Vendor) 🟡
> **Merchant:** Nick (see DOCU/PEOPLE_TO_ADD.md). NPC vendor for gold buy/sell per zhipu-ai.md Shop System.
- [x] 🟢 **Shop catalog data:** Define items Nick sells (e.g. ores, bars, supplies) and buy price per item (e.g. 2× base value). Shared with ITEM_META where possible. (`SHOP_CATALOG` in `constants/items.ts`.)
- [x] 🟢 **Redux buyItem:** Action to spend gold and add item(s) to inventory; respect INVENTORY_SLOT_CAP (no buy if at cap unless stacking).
- [x] 🟢 **Shop screen UI:** Replace placeholder with Buy/Sell toggle, category tabs (General / Resources / Equipment), item list with price and Buy/Sell. Merchant name "Nick" in header or subtitle.
- [x] 🟢 **Sell from Shop:** Reuse existing sellItem; optional: "Sell" tab shows player inventory with sell prices (or link to Bank for selling).
- [ ] 🟡 **Sell price multiplier (optional):** Apply merchant sell ratio (e.g. 50% of ITEM_META.sellValue) when selling to Nick; document for future Barter skill hook.

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
- [ ] 🟡 **EAS Production:** Generate Android App Bundle (.aab), target API 36 (Android 16), update Keystores. *Note: EAS credits exhausted as of 2026 — use `2_Build_APK_Local.bat` for local APK builds.*
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

## 💡 Brainstormed Additions & Juice Backlog
> **Goal:** Massive list of granular ideas, deep resource sinks, and thematic absurdities to keep the game infinitely engaging.

### 🎒 Bank & Inventory QoL
- [x] 🟢 **Item Locking:** A toggle to "Lock" an item so it cannot be sold, consumed, or crafted with accidentally.
- [ ] 🟡 **Custom Bank Tabs:** Let players buy (with gold) custom tabs and assign an emoji (⚔️, 🐟, 💎) to sort their hoard.
- [ ] 🟢 **"Sell All Junk" Button:** A one-tap button to clear out grey/common items marked as junk.

### 🎨 UI/UX Juice & Flavor
- [ ] 🟢 **Battery Saver Mode:** Dim, 1 FPS "true black" screen mode that activates if the screen hasn't been touched in 5 minutes, saving battery while keeping the foreground loop active.
- [ ] 🟡 **Swipe Navigation:** Swipe left/right to instantly jump between gathering skills without returning to the main menu.
- [ ] 🟢 **Detailed Statistics Page:** A screen showing "Total Ores Mined," "Total Damage Dealt," "Days since you last touched grass," etc.
- [ ] 🟡 **Dynamic Backgrounds:** Background color/styling subtly shifts based on real-world time of day.
- [ ] 🟢 **The "Jackpot" Haptic:** When you roll a Mythic drop, the phone vibrates to the tune of a little fanfare.
- [ ] 🟢 **Idle Soundscapes:** A toggle for "White Noise" (e.g., rhythmic clinking of a forge, swoosh of a fishing rod).
- [ ] 🟢 **The "Don't Push This" Button:** A literal button deep in settings. Pressing it 1,000 times gives a unique Title: "The Stubborn".

### ♻️ Deep Resource Sinks & Meta-Progression
- [ ] 🔴 **The "Recycler" / Deconstruction:** A machine/skill to throw obsolete low-tier resources (or old gear) to generate "Cosmic Dust" for endgame upgrades.
- [ ] 🔴 **Mastery Pools & Item Mastery:** Gain "Mastery XP" for specific items (e.g., crafting Iron Swords). At Lv 50, Copper Veins never deplete. At Lv 99, crafting Iron Sword has 10% duplicate chance.
- [ ] 🔴 **Relics & The Museum (Collection Log):** 1 in 10,000 chance to find a "Relic" anywhere. Relics give permanent global buffs (e.g., Fossilized Pickaxe = +2% mining speed).
- [ ] 🟡 **Pets & Familiars:** Very rare drops from activities. Examples: Rocky the Pet Rock (+1% double ore), The Void-Guppy (Eats 10% fish, poops Aether Shards).
- [ ] 🔴 **Equipment Augmentation / Refining:** Combine 10 base Iron Swords to make an Iron Sword +1. Combine 10 +1s to make a +2. Infinite sink for crafted items.

### 🌌 Cosmic & Blibbertooth Anomalies
- [ ] 🔴 **Cosmic Weather / Anomalies:** Daily global buffs/debuffs. "Gravity is Hiccuping" (Logging takes 10% longer, Ranged combat +20% damage).
- [ ] 🟡 **"Cursed" Mechanics (via Scavenging):** Terrible items with hidden uses. "The Heavy Helmet" (-50% attack speed, but confuses enemy turn 1). "Ring of Clumsiness" (5% chance to drop weapon for massive damage).

### ⚔️ Idle Combat Staples
- [ ] 🔴 **Idle Boss Takedowns:** Bosses with 10 Billion HP. You assign your character to "Auto-Attack" it. Takes 3 real-world days to chip away to 0, granting a massive chest.
- [ ] 🔴 **The Gambit System (Auto-Combat Programming):** Program offline combat logic. "IF HP < 30% -> USE Health Potion." "IF Enemy Stunned -> USE Heavy Attack."
- [ ] 🔴 **Offline Raiding Parties:** Assemble a "B-Team" of Companions and send them on a 12-hour real-time Expedition. Return with a report and loot.

---

## 🎯 Current Target
**We are here → Phase 3 (The Crafting Engine)**

v0.4.5 "Horizon & Mechanics" deployed! The core gathering pillar is balanced and the retention HUD is active. Next action: Build the **Crafting System** (Smithing, Alchemy) and implement the 8-hour offline queue architecture.

---
