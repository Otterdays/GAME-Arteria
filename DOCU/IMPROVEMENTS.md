# Arteria — Systems Audit & Improvement Ideas

> **Purpose:** Snapshot of current systems and prioritized UX/GUI/feature improvements. Use for sprint planning; append new ideas, do not delete existing entries.
> **Last reviewed:** 2026-03-05
> **See also:** `CURRENT_IMPROVEMENTS.md` — expansion opportunities that build on existing systems (no new architecture).

**Implemented (2026-03-04–05):** **Lumina Shop:** Reroll Daily Quests (5 Lumina, 2/day), XP Boost 1h (15 Lumina). Shop Buy tab shows purchasable Lumina items. applyXP applies +25% when xpBoostExpiresAt active. — **Mastery expansion:** yield_bonus (+3%/level, max 3) for all 8 skills. getMasteryYieldMultiplier in useGameLoop. Mastery UI: pillar grouping (Gathering/Crafting), skill cards, points badge, Spend/Max. — **SFX:** expo-audio; tink/thump/splash on tick; Settings → Audio "Test sound". — **Login bonus UX:** Banner shows reward; FeedbackToast on claim. — **Post-0.4.1 polish:** Bank "Used in"; Combat teaser; idle cap notification fix; Haptics; Soundscapes stub. **Bestiary groundwork:** EnemyDrop, EnemyLocation, EnemyCombatStats; Goblin/Slime/Wolf. — **v0.4.1:** Cooking, Bestiary stub, GoblinPeekModal. — **v0.4.0:** Daily quests, Stats tab, custom bank tabs, Sell All Junk, Login bonus, Lumina. — Prior: Shop Sell filters, Bank sort/empty state, Shop Buy Max, HorizonHUD Grind label, quest completion, Mastery, Idle Soundscapes "coming soon".

---

## 1. Current Systems Snapshot

| Area | What exists | Notes |
|------|-------------|--------|
| **Skills** | Index (pill grid), Mining, Logging, Fishing, Runecrafting, Smithing, Forging, **Cooking**. QuickSwitchSidebar, HorizonHUD, Activity Log, Confirm Task Switch, Feedback Toasts, Level Up / Train toasts. | Implemented skills share node-card pattern; Runite/narrative gating in place. Cooking: raw fish → cooked food. |
| **Bank** | Search, filters (All, Ores, Bars, Logs, Fish, **Food**, Runes, Equipment, Other), **custom tabs** (+ Tabs, assign from item detail), **Sell All Junk** (configurable junk, button in header), gold + **Lumina** badge, slot cap warning, item detail (Sell 1/All, lock, **Mark as Junk**, Add to tab). FlatList grid. | 50 slot cap (F2P); Patron higher. |
| **Shop** | Buy / Sell tabs. Buy: catalog + qty 1/5/10/25/50/Max; **Lumina** in header; **Lumina Shop** (Reroll Daily 5✨/2day, XP Boost 1h 15✨). Sell: filter list. 50% sell value. Nick chat button. | — |
| **Stats** | New tab. Total gathered by type (ore, log, fish, rune, bar, equipment, other), first/last play, days since first play. | player.stats; addItems increments. |
| **Combat** | Placeholder screen + **Bestiary stub** ("Enemies Spotted" section; seenEnemies from goblin_peek). "Found in" shown per enemy when locations defined. | Phase 4; no stats/loadout yet. Bestiary groundwork: EnemyDrop, EnemyLocation, EnemyCombatStats; Goblin/Slime/Wolf in constants/enemies.ts. |
| **Quests** | **Daily** (3/day, reset midnight, progress, Claim gold/Lumina). Active / Completed / Available; difficulty badges; steps; Start quest; Complete (rewards when all steps done). Step auto-complete. | Dev button only in __DEV__. |
| **Settings** | **Character** (Nickname). Appearance, Gameplay, Audio, Notifications, **Login bonus & Lumina**, Premium, About, Easter Egg, Danger. **Mastery** opened from **Skills** header (📖 next to 📜), not Settings. | Idle Soundscapes = stub. |
| **Explore** | World Map tab. Location cards (Crownlands, Frostvale, Whispering Woods, Fey Markets, Scorched Reach, Skyward Peaks). Tap to travel. Location screen: NPCs, Shop, Quests. "Coming soon" for unimplemented. Corruption system 0-100%. | Frostvale content, world state events, seasonal calendar implementation. |
| **Global** | Theme engine, tab bar theming, StatusBar, GlobalActionTicker, WhileYouWereAway, Update Board, Patch Notes (patches.tsx). | — |

---

## 2. Quick Wins (UX / GUI)

- **Shop Sell filters** — ✅ Done: Fish, Runes, Equipment, **Food** in `SELL_FILTERS` (shop.tsx).
- **Bank total value** — ✅ Done: "Worth ~X gp" in Bank header (totalWorth).
- **Bank empty state** — ✅ Done: "No matching items" + "Clear filter & search" when filter/search returns empty.
- **Shop Buy quantities** — ✅ Done: 1, 5, 10, 25, 50 + Max (cap by gold).
- **Bank item detail "Used in"** — ✅ Done: Shows "Used in: Mining, Smithing" (etc.) per item type. ore→Mining/Smithing, bar→Smithing/Forging, log→Logging, fish→Fishing/Cooking, food→Cooking, rune→Runecrafting, equipment→Forging.
- **Quests dev button** — ✅ Done: Hidden in `__DEV__` only (0.3.0).
- **HorizonHUD "The Grind"** — ✅ Done: "Lv. X → Lv. Y" label; subtext "X/Y levels".

---

## 3. Consistency & Polish

- **Skills grid responsiveness** — On very small width, consider 2 columns instead of 3 for skill pills (e.g. breakpoint or `width: '50%'` when `Dimensions.get('window').width < 360`).
- **Tab bar** — 6 tabs can feel crowded. Optional: move Quests into a "More" or "Explore" tab, or keep as-is and ensure touch targets and labels stay clear.
- **Accessibility** — Audit key actions (filter chips, Train, Sell 1/All, theme chips) for `accessibilityLabel` / `accessibilityHint` so screen readers and automation are covered.
- **Combat teaser** — Add a single line or card: "Phase 4 — Loadouts, stats, and first enemies coming soon" with a mail/notify CTA or link to roadmap if you have one in-app.

---

## 4. Features (Larger)

- **Quest completion for real** — ✅ Done: Complete when all steps done (rewards applied); step auto-complete via engine completionRequirements + getQuestStepsToComplete.
- **Recipe / usage from Bank** — For each item, show "Used in: [Skill name]" (e.g. Copper ore → Smithing) from a small recipe lookup (action defs → required items). Improves discovery.
- **Idle Soundscapes** — Hook wired to all 7 skill screens; SFX (tink/thump/splash) now play on tick. Implement actual ambient loops per skill (or disable the toggle and show "Coming soon" in Settings) so the toggle isn’t misleading.
- **Bank sort** — Optional sort by: Name, Quantity, Value (total), Type. Simple dropdown or segmented control above the grid.
- **Offline queue / cap** — ROADMAP Phase 3: queue system and 8-hour offline queue; document here when scoped so UX (e.g. "Queued: 3h smithing") can be designed.
- **Mastery system** — ✅ Done: 1 pt per level-up, Settings → Mastery, spend on +5% XP, +3% yield, +4% speed (all 8 skills). applyXP uses getMasteryXpMultiplier; useGameLoop uses getMasteryYieldMultiplier and getMasterySpeedMultiplier. Pillar grouping, skill cards, Spend/Max UI.

---

## 5. Doc / Code Hygiene

- **Quest engine import** — `quests.tsx` uses a relative path to `packages/engine/src/data/quests` and `story`; consider a package export (e.g. `@arteria/engine`) or alias so refactors don’t break.
- **FUTURE_NOTES** — Theme Phase 3 complete (2026-03-04). See THEMING.md.

---

## 6. Priority Order (Suggested)

1. ~~**Quick:** Shop Sell filters (Fish, Runes, Equipment, Food).~~ ✅  
2. ~~**Quick:** Bank total value in header.~~ ✅  
3. ~~**Quick:** Bank empty state + clear filter.~~ ✅  
4. ~~**Quick:** Quests dev button hidden in prod.~~ ✅  
5. ~~**Polish:** Shop Buy Max (or 25/50).~~ ✅  
6. ~~**Polish:** Bank item detail "Used in" line.~~ ✅  
7. ~~**Polish:** HorizonHUD Grind label.~~ ✅  
8. ~~**Feature:** Quest real completion flow.~~ ✅  
9. **Feature:** Recipe/usage in Bank.  
10. ~~**Feature:** Idle Soundscapes — Hook wired; SFX (expo-audio + tink/thump/splash) play on tick.~~ ✅ SFX done. Idle ambient loops still "Coming soon."

Use this list to pick items for the next sprint; append new ideas and mark done when shipped.
