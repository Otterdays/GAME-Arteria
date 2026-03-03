# Arteria — Systems Audit & Improvement Ideas

> **Purpose:** Snapshot of current systems and prioritized UX/GUI/feature improvements. Use for sprint planning; append new ideas, do not delete existing entries.
> **Last reviewed:** 2026-03-03

**Implemented (2026-03-03):** Shop Sell filters (Fish, Runes, Equipment). Bank: sort (Name / Qty / Value), empty state + "Clear filter & search" when filtered, item detail recipe line removed, total value already in header. Shop Buy: 25, 50, Max. Quests: dev button only in `__DEV__`; **real quest completion** — Complete button only when all steps done, applies rewards (gold, XP, flags, items) then completes quest. HorizonHUD: Grind label "Lv. X → Y". Skills grid: 2 cols when width < 360. Combat: Phase 4 teaser card. Settings: Idle Soundscapes description "coming soon".

---

## 1. Current Systems Snapshot

| Area | What exists | Notes |
|------|-------------|--------|
| **Skills** | Index (pill grid), Mining, Logging, Fishing, Runecrafting, Smithing, Forging. QuickSwitchSidebar, HorizonHUD, Activity Log, Confirm Task Switch, Feedback Toasts, Level Up / Train toasts. | Implemented skills share node-card pattern; Runite/narrative gating in place. |
| **Bank** | Search, filters (All, Ores, Bars, Logs, Fish, Runes, Equipment, Other), gold badge, slot cap warning, item detail modal (Sell 1/All, lock). FlatList grid. | 50 slot cap (F2P); Patron higher. |
| **Shop** | Buy / Sell tabs. Buy: catalog + qty 1/5/10. Sell: filter list. 50% sell value. Nick chat button. | Sell filters missing Fish, Runes, Equipment. |
| **Combat** | Placeholder screen only ("Coming Soon" + short blurb). | Phase 4; no stats/loadout yet. |
| **Quests** | Active / Completed / Available; difficulty badges; steps; Start quest; Complete (mock). Dev button: "Play Guard Intro Dialogue". | Completion is test-only; no real step progression. |
| **Settings** | Appearance (theme), Gameplay (confirm task, battery saver, horizon HUD), Notifications, Audio (idle soundscapes), Easter Egg, Danger (wipe). Patron. | Idle Soundscapes = stub. |
| **Explore** | Tab hidden (`href: null`). | — |
| **Global** | Theme engine, tab bar theming, StatusBar, GlobalActionTicker, WhileYouWereAway, Update Board, Patch Notes (patches.tsx). | — |

---

## 2. Quick Wins (UX / GUI)

- **Shop Sell filters** — Add **Fish**, **Runes**, and **Equipment** to `SELL_FILTERS` in `shop.tsx` so Sell tab matches Bank filter options and is consistent.
- **Bank total value** — In Bank header, show "Total value: X gp" (sum of `qty * sellValue` for all items). Gives at-a-glance wealth.
- **Bank empty state** — When `filteredInventory.length === 0`, show a short message ("No items in this category" or "No items match search") and a "Clear filter" / "Show all" action instead of empty grid.
- **Shop Buy quantities** — Add **Max** (or 25, 50) to `BUY_QUANTITIES` so users can buy in bulk without repeated taps; optionally cap by gold (e.g. "Max" = floor(gold / buyPrice)).
- **Bank item detail copy** — Replace or remove "Used in recipes: Coming in Phase 1.3+". Either: "Used in: Smithing / Forging" (link to skill if possible) or remove line until recipe links are implemented.
- **Quests dev button** — Hide "[DEV] Play Guard Intro Dialogue" in production (e.g. `__DEV__` only or a feature flag) so release builds don’t show test UX.
- **HorizonHUD "The Grind"** — Label/copy clarity: e.g. "Lv. X → Lv. Y" or "X/Y levels" so progress reads as level milestone, not raw %.

---

## 3. Consistency & Polish

- **Skills grid responsiveness** — On very small width, consider 2 columns instead of 3 for skill pills (e.g. breakpoint or `width: '50%'` when `Dimensions.get('window').width < 360`).
- **Tab bar** — 6 tabs can feel crowded. Optional: move Quests into a "More" or "Explore" tab, or keep as-is and ensure touch targets and labels stay clear.
- **Accessibility** — Audit key actions (filter chips, Train, Sell 1/All, theme chips) for `accessibilityLabel` / `accessibilityHint` so screen readers and automation are covered.
- **Combat teaser** — Add a single line or card: "Phase 4 — Loadouts, stats, and first enemies coming soon" with a mail/notify CTA or link to roadmap if you have one in-app.

---

## 4. Features (Larger)

- **Quest completion for real** — Replace mock complete with real step progression: advancing `activeQuests[questId]` when conditions are met, and moving to completed when all steps done. Depends on engine/quest definitions.
- **Recipe / usage from Bank** — For each item, show "Used in: [Skill name]" (e.g. Copper ore → Smithing) from a small recipe lookup (action defs → required items). Improves discovery.
- **Idle Soundscapes** — Implement actual ambient loops per skill (or disable the toggle and show "Coming soon" in Settings) so the toggle isn’t misleading.
- **Bank sort** — Optional sort by: Name, Quantity, Value (total), Type. Simple dropdown or segmented control above the grid.
- **Offline queue / cap** — ROADMAP Phase 3: queue system and 8-hour offline queue; document here when scoped so UX (e.g. "Queued: 3h smithing") can be designed.
- **Mastery system** — Spend mastery points for permanent buffs; needs design (where points come from, where they’re spent, UI).

---

## 5. Doc / Code Hygiene

- **Quest engine import** — `quests.tsx` uses a relative path to `packages/engine/src/data/quests` and `story`; consider a package export (e.g. `@arteria/engine`) or alias so refactors don’t break.
- **FUTURE_NOTES** — Theme Phase 3 "Remaining" list may be outdated (e.g. QuickSwitchSidebar, HorizonHUD might already be migrated). Refresh when touching theming.

---

## 6. Priority Order (Suggested)

1. **Quick:** Shop Sell filters (Fish, Runes, Equipment).  
2. **Quick:** Bank total value in header.  
3. **Quick:** Bank empty state + clear filter.  
4. **Quick:** Quests dev button hidden in prod.  
5. **Polish:** Shop Buy Max (or 25/50).  
6. **Polish:** Bank item detail "Used in" line.  
7. **Polish:** HorizonHUD Grind label.  
8. **Feature:** Quest real completion flow.  
9. **Feature:** Recipe/usage in Bank.  
10. **Feature:** Idle Soundscapes implementation or "Coming soon".

Use this list to pick items for the next sprint; append new ideas and mark done when shipped.
