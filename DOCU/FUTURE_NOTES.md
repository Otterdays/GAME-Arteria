# FUTURE NOTES — Research & Forward Planning

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: Features designed here require versioning updates when implemented:** `UpdateBoard.tsx`, `index.html`, `patchHistory.ts`, `CHANGELOG.md`, `app.json`.

**Last Updated:** 2026-03-03 | **Source:** Arize MCP + Web Research

This document captures research-based insights to guide future development decisions for Arteria.
Do not delete — append new entries at the bottom.

---

## 🎲 Random Events — Design Proposal (2026-03-03)

> **Status:** Design phase. Inspired by RuneScape wiki (`tools/info_scraper/output/runescape-wiki__w_Random_events.html`).
> **Docs:** My_Thoughts.md (dialogue from any screen), MASTER_DESIGN_DOC.md (Blibbertooth Factor), ROADMAP Phase 2/4.

### RuneScape Inspiration Summary

| Category | Examples | Trigger | Reward |
|----------|----------|--------|--------|
| **Gift Givers** | Genie (lamp), Drunken Dwarf (beer/kebab), Lost Pirate (items), Sandwich Lady (choose bread) | XP gained / time logged | Random event gift box |
| **Skill Guardians** | Rock Golem (mining), Tree Spirit (logging), River Troll (fishing), Ent (logging) | While skilling | Fight or run; drops on kill |
| **Puzzle/Interaction** | Certer (identify item), Quiz Master (Odd One Out), Mime (copy emotes), Maze (reach center) | XP / time | Gift box; faster = better |
| **Hazards** | Exploding Rock, Tangle Vine, Big Fish, Poison Gas, Swarm | While skilling | Avoid or suffer penalty |

**RS Mechanics:**
- Trigger: XP gained within a period (or extended login). Higher XP = more frequent.
- Completion record: Consistently completing events → less frequent (anti-bot).
- Genie lamp: XP = 10 × chosen skill level.
- Gift box: Higher skill totals → better reward options.

### Arteria Implementation Ideas

**1. Skill-Linked "Blessings" (Implemented v0.2.8)**
- Per-tick roll in `useGameLoop`: 0.5% base chance, 60-tick cooldown.
- **Blibbertooth's Blessing:** Bonus XP (level × 5) to active skill. ✅
- **Cosmic Sneeze:** Duplicate next item haul. ✅
- **Genie's Gift:** Bonus XP (level × 10) to a random trained skill. ✅
- **Treasure Chest:** Gold reward (base + level × 8, plus random variance). ✅
- **Lucky Strike:** Double XP for this tick. ✅
- **Genie Visit (dialogue):** Future — choose skill via DialogueOverlay.

**2. Skill Guardians (Phase 2 — Post-Combat)**
- **Rock Spirit** (mining), **Wood Wraith** (logging), **Void Nibble** (fishing): Spawn during active task.
- Options: "Fight" (mini combat instance) or "Ignore" (lose 1 tick progress, event ends).
- Kill reward: bones + skill-related loot. Fits Phase 4 combat infrastructure.

**3. Dialogue-Driven Randoms (Leverage Existing)**
- `activeDialogue` in Redux can be set from `useGameLoop` when event triggers.
- **Mysterious Stranger:** "Odd one out" — 3 items, pick the different one. Correct → gift; wrong → nothing.
- **Nick's Cousin:** "I found this while traveling. Want it?" — Accept = random item; Decline = "Suit yourself."
- Reuses `DialogueOverlay`, `meetsNarrativeRequirement`, quest-style choice trees.

**4. Hazard Events (Optional)**
- **Cursed Vein:** Mining — next 3 ticks have 2× curse chance.
- **Tangled Roots:** Logging — next tick yields 0 (one "miss").
- **Big Catch:** Fishing — next tick gives 2× fish (positive hazard).
- Implement as temporary `activeTask` modifiers or one-off tick overrides.

### Phased Rollout

| Phase | Scope | Effort | Dependencies |
|-------|-------|--------|--------------|
| **MVP** | Blibbertooth Blessing (bonus XP), Cosmic Sneeze (duplicate item), Genie lamp (dialogue choice) | 4–6h | useGameLoop, DialogueOverlay, FeedbackToast |
| **Phase 2** | 2–3 dialogue randoms (Mysterious Stranger, Nick's Cousin) | 2–3h | Dialogue trees, narrative flags |
| **Phase 3** | Skill guardians (Rock Spirit, etc.) | 8–12h | Combat system (Phase 4) |
| **Phase 4** | Hazard events, completion tracking (reduce freq if consistent) | 4–6h | Tick modifiers |

### Technical Hooks

- **Trigger:** Add `randomEventChance` per tick in `processDelta` or `useGameLoop.processDelta`. Base rate ~0.005 (0.5%) per successful tick; scale by `ticksSinceLastEvent` to avoid clustering.
- **State:** `player.randomEvents = { lastTriggeredAt: number, completedCount: number }` for frequency tuning.
- **Offline:** Roll N times for offline ticks (cap e.g. 1 event per offline session to avoid exploit).

### Alignment with Existing Design

- **Blibbertooth Factor** (MASTER_DESIGN_DOC): "Random blessings and curses that are mechanically interesting" — direct fit.
- **Dialogue from any screen** (My_Thoughts.md): "random event while skilling" — already architected.
- **Curse system:** Already in TickSystem; hazard "Cursed Vein" extends it.
- **Rare drops:** `rareChance` / `rareItems` pattern exists; Cosmic Sneeze = conditional duplicate.

---

## 🎨 Theme Engine — Implementation & Refactor Effort (2026-03-03)

> **Status:** Planned. Documented before implementation to scope migration effort.

### Goal
Provide a unified theme system supporting dark/light/system, with future extensibility (forest, arcane). Replace direct `Palette` imports with a context-driven `palette` so components can react to theme changes.

### Architecture

| Layer | Responsibility |
|-------|-----------------|
| `ThemeContext` | Holds `theme`, `resolvedTheme`, `palette`; persists via MMKV |
| `constants/theme.ts` | Defines `PALETTES.dark`, `PALETTES.light`; layout tokens (Spacing, Radius, FontSize) unchanged |
| `useTheme()` | Returns `{ theme, resolvedTheme, palette, setTheme }` |
| Settings | Theme selector: Dark / Light / System |

### Effort Breakdown

| Task | Effort | Files | Notes |
|------|--------|-------|-------|
| `contexts/ThemeContext.tsx` | 2h | 1 new | Provider, useColorScheme, MMKV persistence |
| `constants/theme.ts` refactor | 1h | 1 | `Palette` → `PALETTES.dark`; add `PALETTES.light` |
| `useTheme()` hook | 0.5h | 1 new | Thin wrapper |
| Settings UI | 1h | Settings screen | 3-way toggle |
| MMKV migration | 0.5h | persistence.ts | Add `theme_preference` key |
| **Component migration** | **6–8h** | **~30 files** | Replace `Palette.X` with `useTheme().palette.X` |

### Component Migration (Refactor Scope)

| File | Imports | Notes |
|------|---------|-------|
| `apps/mobile/app/(tabs)/_layout.tsx` | Palette | Tab bar |
| `apps/mobile/app/(tabs)/index.tsx` | Palette | Skills grid |
| `apps/mobile/app/(tabs)/bank.tsx` | Palette | Bank |
| `apps/mobile/app/(tabs)/combat.tsx` | Palette | Combat |
| `apps/mobile/app/(tabs)/shop.tsx` | Palette | Shop |
| `apps/mobile/app/(tabs)/settings.tsx` | Palette | Settings |
| `apps/mobile/app/(tabs)/quests.tsx` | Palette | Quests |
| `apps/mobile/app/(tabs)/explore.tsx` | Palette | Explore |
| `apps/mobile/app/skills/mining.tsx` | Palette | Mining |
| `apps/mobile/app/skills/logging.tsx` | Palette | Logging |
| `apps/mobile/app/skills/fishing.tsx` | Palette | Fishing |
| `apps/mobile/app/skills/runecrafting.tsx` | Palette | Runecrafting |
| `apps/mobile/app/patron.tsx` | Palette | Patron |
| `apps/mobile/app/patches.tsx` | Palette | Patches |
| `apps/mobile/components/*.tsx` | Palette | ~15 components |

**Strategy:** Migrate in batches. Layout tokens (Spacing, Radius, FontSize) stay as static imports — only color tokens move to `useTheme().palette`. Components that use `Palette` must become consumers of `ThemeContext` (or receive `palette` via props).

### Light Palette Definition (Reference)

```ts
// constants/theme.ts — PALETTES.light (inverted from dark)
export const PALETTES = {
  dark: { /* current Palette */ },
  light: {
    bgApp: '#f5f6fa',
    bgCard: '#ffffff',
    bgCardHover: '#f0f1f5',
    textPrimary: '#11181C',
    textSecondary: '#687076',
    accentPrimary: '#4a90e2',
    red: '#c62828',
    gold: '#c49b1a',
    // ... full mapping
  },
};
```

### Dependencies
- No new packages. Uses `useColorScheme`, `createContext`, MMKV (already in use).
- `@react-navigation/native` ThemeProvider can remain for nav theming; our ThemeContext wraps app for semantic colors.

### Rollback
If migration is abandoned: revert ThemeContext, keep `Palette` as single source. No data loss — theme preference is additive.

---

## ⚠️ CRITICAL: Expo SDK 55 Migration (When Ready)

SDK 54 is the **last version supporting the Legacy Architecture**.
SDK 55 (React Native 0.83.1, React 19.2.0) makes New Architecture **mandatory**.

### What Changes in SDK 55
| Area | Change | Action Required |
|------|--------|----------------|
| New Architecture | Mandatory, `newArchEnabled` flag removed from `app.json` | Delete the flag when upgrading |
| Legacy Architecture | Dropped entirely | No action, we're already on New Arch |
| `notification` field in `app.json` | Removed — causes prebuild failure | Migrate to `expo-notifications` config plugin |
| Expo Go + Push Notifications (Android) | Hard error instead of warning | Use Dev Client (already doing this ✅) |
| `expo-av` | Removed from Expo Go | Migrate to `expo-video` + `expo-audio` when needed |
| Package versioning | All Expo packages share the SDK major version (e.g., `expo-camera@^55.0.0`) | Update SBOM checks |
| Hermes v1 | Opt-in for Hermes v1 — smaller EAS Update bundles (~75% smaller) | Opt in when stable |

### SDK 55 Migration Steps (When We're Ready)
```sh
# 1. Upgrade
npx expo install expo@next --fix

# 2. Remove newArchEnabled from app.json (it's now meaningless)

# 3. Delete android/ (we use CNG, so Expo regenerates it)

# 4. Check for library incompatibilities
npx expo-doctor@latest

# 5. Rebuild Development Build via EAS
```

---

## 🗺️ Monorepo Best Practices (SDK 54+)

### Autolinking Improvement (SDK 54)
SDK 54 introduced a **new autolinking algorithm** for monorepos. Enable it now for better reliability:

```json
// apps/mobile/app.json
{
  "expo": {
    "experiments": {
      "autolinkingModuleResolution": "yarn-workspaces"
    }
  }
}
```
> From SDK 55+, this becomes the automatic default for monorepos.

### Isolated Dependencies (SDK 54+)
If the project ever migrates to **pnpm** or **Bun**, they support isolated dependency installation
which prevents duplicate `react` / `react-native` versions across workspaces — a common source of
runtime crashes. Worth considering if npm hoisting causes more pain.

### Metro Config (Good News)
Since SDK 52+, `expo/metro-config` handles monorepo `watchFolders` and `nodeModulesPaths` automatically.
Our manual `metro.config.js` settings are correct; future upgrades should verify this remains aligned.

---

## 💾 MMKV Persistence Strategy

### Current Approach (Direct MMKV)
We use MMKV directly for save/load in `persistence.ts`. This is **valid and recommended** for our use case.

### Direct MMKV vs redux-persist + MMKV
| Approach | Best For | Overhead |
|----------|----------|----------|
| **Direct MMKV** (our current plan) | Game save data, fast tick-level reads | Very low |
| **redux-persist + MMKV** | Persisting entire Redux slices automatically | Adds redux-persist dependency |

**Recommendation for Arteria:** Stay with direct MMKV for game saves (PlayerState).
If we ever need to auto-persist Redux slices (e.g., settings, auth), add `redux-persist` then.

### MMKV v4 Notes (Nitro Rewrite)
MMKV v4.x was rewritten using the Nitro native module system:
- ~30x faster than AsyncStorage
- Fully synchronous API (no async/await needed)
- Built-in encryption support (useful for anti-cheat timestamp storage)
- Multiple instances supported (e.g., separate `playerSave` and `settings` stores)

### Custom redux-persist Storage Wrapper (if ever needed)
```typescript
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};
```

---

## 🎮 Game Loop & Offline Progression Patterns

### Offline Calculation Formula
```typescript
// Standard idle RPG pattern
const gained = Math.floor((now - lastSaved) / TICK_MS) * ratePerTick;
```

### Important Caps and Guards
- **Cap max offline duration** (e.g., 24 hours) to prevent exploit and calculation overflows
- **Validate timestamps** — never trust `Date.now()` alone for anti-cheat; store on backend if needed
- **Clock manipulation resistance:** Store last-save timestamp server-side for competitive features

### Background Task Reality on Mobile
| Platform | Reality |
|----------|---------|
| **Android** | Headless JS can run when app is closed, but Android 12+ restricts launching bg tasks from bg |
| **iOS** | Only a few minutes allowed; no true background game loop without audio/location hacks |

**Our Architecture Decision (Correct):** We use timestamp-based offline calculation, NOT a true
background loop. This is the right call — it's reliable, battery-friendly, and works on all platforms.
The `GameEngine.processOffline()` pattern is industry-standard for idle RPGs.

### setInterval Tick Loop Gotchas
- `setInterval` in React Native can drift under heavy load; use delta-time: `const delta = now - lastTick`
- Clear the interval in `useEffect` cleanup to prevent memory leaks
- Consider `AppState` listener to pause/resume the loop on background/foreground transitions

```typescript
// Recommended foreground loop pattern
useEffect(() => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'background') saveToMMKV();
    if (state === 'active') loadFromMMKV();
  });
  return () => subscription.remove();
}, []);
```

---

## 🔮 Future Feature Considerations (YAGNI — Do Not Build Yet)

- **SQLite via expo-sqlite:** Consider if PlayerState grows beyond simple KV (e.g., item history, combat logs)
- **Hermes v1 (OTA update size 75% reduction):** Opt in when SDK 55 migration is done
- **expo-widgets (iOS alpha in SDK 55):** Could surface Arteria skill progress as a Lock Screen widget — interesting UX opportunity
- **Turborepo or Nx:** If monorepo complexity grows beyond 2 packages, these tools help with caching and parallel builds
- **Anti-cheat backend timestamps:** Store `lastSaved` server-side via a lightweight API if leaderboards are ever added

---

## 📋 Key Commands Reference

```sh
# Check project health
npx expo-doctor@latest

# Upgrade to next SDK (when ready)
npx expo install expo@next --fix

# Verify current installed versions
npm ls --depth=0

# Start dev server (clean cache)
npx expo start --clear
```
