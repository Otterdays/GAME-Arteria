# ARCHITECTURE

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **🤖 AI: When implementing new features, update versioning:** `UpdateBoard.tsx`, `index.html` §Changelog, `patchHistory.ts`, `CHANGELOG.md`, `app.json`. Current: **0.6.0**.

> **⚠️ SDK 55 Note:** Expo SDK 54 is the last version supporting the Legacy Architecture.
> SDK 55 makes New Architecture **mandatory**. See `DOCS/FUTURE_NOTES.md` for full migration steps.

## 📚 Source of Truth

All architectural decisions must align with:

- **[TRUTH_DOCTRINE.md](TRUTH_DOCTRINE.md)** — The ultimate source of truth. Core philosophy, behavioral protocols, and developer mandates (Triad of Code: KISS, DOTI, YAGNI).
- **[MASTER_DESIGN_DOC.md](MASTER_DESIGN_DOC.md)** — Complete game design document. The source of all system requirements and feature specifications.

These documents provide the design truth; this document describes the technical implementation.

---

## Tech Stack (as of Feb 2026)
- **Framework:** Expo SDK 55 (React Native 0.83.2, New Architecture mandatory)
- **Language:** TypeScript 5.9 (strict mode)
- **State Management:** Redux Toolkit (RTK) 2.11.2 + react-redux 9.2.0
- **Local Storage:** react-native-mmkv 4.1.2 (fast synchronous KV store for saves)
- **Routing:** Expo Router v6.0.23 (file-based)
- **Animations:** React Native Reanimated v4.1.6
- **Testing:** Jest 29.7 + ts-jest 29.2. Multi-project: `packages/engine` + `tests/` (unit, integration, e2e placeholders). 25 tests, 7 suites. `npm run test:coverage` for engine coverage. See tests/README.md.
- **Build System:** Local APK via `2_Build_APK_Local.bat` (Gradle from `apps/mobile/android`, no device) + EAS for cloud/production builds

## Monorepo Structure (npm workspaces)

```
Arteria/
├── babel.config.js          # Root Babel config (required for monorepo hoisting)
├── index.js                 # Metro entry redirect (Gradle resolves from Arteria → apps/mobile)
├── package.json             # Root monorepo config (workspaces, hoisted deps)
├── 0_Start_Dev_Server.bat   # Starts Metro dev server
├── 2_Build_APK_Local.bat    # Local release APK (gradlew, no device)
├── Update_1_Git_Push.bat    # Git commit + push
├── Update_2_EAS_OTA_Update.bat  # OTA update to players
├── Update_3_EAS_Build_Android_Dev.bat   # Dev APK build
├── Update_4_EAS_Build_Android_Prod.bat  # Production AAB build
├── apps/
│   └── mobile/              # Expo React Native app
│       ├── index.js         # Entry proxy (bridges to expo-router/entry)
│       ├── babel.config.js  # Mobile Babel config
│       ├── metro.config.js  # Metro config (monorepo watchFolders)
│       ├── eas.json         # EAS build profiles
│       ├── app.json         # Expo app config
│       ├── app/             # Expo Router screens
│       │   ├── _layout.tsx  # Root layout (Redux Provider)
│       │   ├── modal.tsx    # Modal screen
│       │   └── (tabs)/      # Bottom tab navigation
│       │       ├── _layout.tsx   # Tab bar config
│       │       ├── index.tsx     # Skills screen
│       │       ├── combat.tsx    # Combat screen
│       │       ├── bank.tsx      # Bank screen
│       │       ├── shop.tsx      # Shop screen
│       │       ├── settings.tsx  # Settings screen
│       │       └── explore.tsx   # Explore screen
│       ├── store/           # Redux store
│       │   ├── index.ts     # Store config
│       │   ├── gameSlice.ts # Player state slice
│       │   ├── hooks.ts     # Typed useDispatch/useSelector
│       │   └── persistence.ts  # MMKV persistence helpers
│       ├── constants/
│       │   └── theme.ts     # PaletteShape, THEMES (dark/light/sepia), design tokens
│       ├── contexts/
│       │   └── ThemeContext.tsx  # ThemeProvider, useTheme
│       ├── components/      # Reusable UI components
│       └── hooks/           # Custom hooks (game loop, persistence, etc.)
├── packages/
│   └── engine/              # Pure TypeScript game engine (zero React deps)
│       └── src/
│           ├── index.ts     # Public API barrel
│           ├── types.ts     # All type definitions
│           ├── XPTable.ts   # RuneScape-style XP curve
│           ├── TickSystem.ts# Delta-time tick processor
│           ├── GameEngine.ts# Offline/realtime orchestrator
│           └── data/
│               ├── mining.ts       # Mining action defs
│               └── playerFactory.ts# New player creator
└── DOCS/                    # Project documentation
```

## Data Flow
1. **App opens** → Load saved PlayerState from MMKV
2. **Offline calc** → `useGameLoop` processDelta computes ticks since last save; when building WYWA report, accumulates XP/items/gold into OfflineReport (does not dispatch applyXP/addItems)
3. **WYWA modal** → User sees summary; on "Collect & Continue", `WhileYouWereAway` dispatches applyXP, addItems, addGold from report
4. **Foreground loop** → `setInterval` (~100ms) calls processDelta; dispatches applyXP/addItems immediately (no accumulator)

## Audio (SFX)
- **Assets:** `apps/mobile/assets/sounds/` — tink.wav, thump.wav, splash.wav (generated by `scripts/generate-sounds.js`).
- **Hook:** `utils/sounds.ts` — `useSfx()` exposes `playTink`, `playThump`, `playSplash`, `playForSkill(skillId)`. Uses `expo-audio` `useAudioPlayer`. Respects `settings.sfxEnabled`.
- **Tick wiring:** Root `_layout.tsx` calls `useGameLoop({ onTickComplete: playForSkill })`. When a skill tick completes, `useGameLoop` invokes the callback with `skillId`; `playForSkill` maps skill to tink/thump/splash and plays. Ref-stable callback via `onTickCompleteRef` in useGameLoop.
- **Test:** Settings → Audio → "Test sound" plays all three in sequence.

## Combat System (Phase 4, v0.5.1+)
- **State:** `ActiveCombat` interface on `PlayerState.activeCombat` (enemyId, enemyName, HP max/current, attack/defense/accuracy, player/enemy attack timers, killCount, zoneId). `CombatLogEntry[]` on `GameState.combatLog` (max 40). `CombatLogEntry` types: player_hit, enemy_hit, player_miss, enemy_miss, kill, loot, died, info.
- **Reducers:** `startCombat` (init from `ENEMIES` data, stop skilling, clear log), `fleeCombat`, `processCombatTick` (timer accumulation, accuracy/damage rolls, kill cycle, XP split, loot drops, gold, enemy respawn, player death), `pushCombatLog`.
- **Game Loop:** `useGameLoop.ts` dispatches `processCombatTick({ deltaMs })` on every 100ms interval when `activeCombat` is truthy, alongside skilling ticks.
- **Combat Math:** Player hit chance = `0.5 + (accuracy - enemyDefense) * 0.02` (clamped 5%–95%). Damage = `1..maxHit`. Enemy hit chance = `enemyAccuracy - meleeDefence * 0.015` (clamped 5%–95%). On kill: XP = enemyMaxHp split to hitpoints/attack/strength/defence. Gold = `enemyMaxHp * (1–3)`. Enemy respawns for continuous AFK farming.
- **Zones:** 4 zones defined in `combat.tsx` — Sunny Meadows Farm (Tier 1), Goblin House (Tier 1), Whispering Woods Forest (Tier 1), Frostfall Mountain (Tier 2).
- **Enemies:** 7 enemies in `constants/enemies.ts` with combat stats + drop tables. Equipment system (8 slots, Bronze–Runite) feeds into `recalculateCombatStats`.

## Production Action Logic (v0.2.7)
- **Consumed Inputs:** The `ActionDef` interface was extended with `consumedItems?: { id: string; quantity: number }[]`.
- **Transactional Ticks:** In `useGameLoop.ts`, the `processDelta` function now:
  1. Checks inventory stock for any `consumedItems`.
  2. Clamps the number of processable ticks based on available stock.
  3. Dispatches `removeItems` to subtract inputs from Redux before granting XP/Loot.
  4. Automatically stops the active task if stock reaching zero, providing a deterministic "out of resources" state.

5. **App backgrounds** → Save PlayerState to MMKV with current timestamp

## Monorepo Babel/Metro Notes
- `babel-preset-expo` is installed at **both** the root and `apps/mobile` levels.
- The root `babel.config.js` exists because NPM hoists `expo-router` to root `node_modules`, and Babel needs to process it with the Expo preset.
- `apps/mobile/index.js` is a thin proxy (`import "expo-router/entry"`) that keeps the entry point inside the project directory so Babel doesn't skip it.
- `metro.config.js` sets `watchFolders` to the workspace root and `nodeModulesPaths` to both local and root `node_modules`.
- **SDK 54 Autolinking improvement:** Set `experiments.autolinkingModuleResolution: "yarn-workspaces"` in `app.json` for more reliable native module resolution in monorepos. This becomes automatic in SDK 55.

- Offline time is capped at **24 hours** to prevent clock manipulation exploits.
- Formula: `gained = Math.floor(elapsed / TICK_MS) * ratePerTick`

## Universal UI Components
- **Node-local State:** Screens (like Mining) subscribe to `activeTask` directly to render micro-progress visuals synchronized with the global ticker.
- **Skill Workbench Primitives (v0.6.0):** A new **next-gen artisan screen paradigm** in `components/skill/`. Replaces the plain card-list pattern with a workbench-style layout:
  - **SkillHeroHeader** — skill title, level, XP bar, active recipe, XP/hour; large progress focus.
  - **SkillCategoryRail** — segmented chips (Furniture, Combat, Utility) for faster category scanning.
  - **RecipeWorkbenchCard** — explicit input/output slots, level gate, affordability, Craft/Stop.
  - **StickyTaskDock** — sticky bottom CTA; materials missing or batches available summary.
  - **Design principles:** Active-task storytelling, one-tap affordance, inputs/outputs visually separated, sticky primary action. Woodworking is the flagship; Crafting, Firemaking, Herblore can migrate. See `DOCU/SKILLS_ARCHITECTURE.md` §0.

## OTA Update System (v0.4.2+)
- **Engine:** `expo-updates` native module integrated. Explicit plugin in `app.json` with `checkAutomatically: ON_LAUNCH`. `fallbackToCacheTimeout: 0` (don't block launch).
- **Runtime Version:** `appVersion` policy (derives from `expo.version` in app.json). OTA updates only reach devices running the same version. If native modules change, bump version → redistribute APK.
- **Batch Export:** `Update_2_EAS_OTA_Update.bat` pushes a compiled JS bundle to the EAS `production` channel. `Rollback_OTA.bat` for emergency rollbacks.
- **Identity Alignment:** Uses `ARTERIA_LEAN_PROD=1` to ensure the exported bundle matches the production APK's package name (`com.anonymous.arteria`) and native module configuration.
- **ABI Splits Plugin:** `plugins/withAbiSplits.js` — Expo config plugin that auto-injects `splits { abi { ... } }` into build.gradle during prebuild. Survives `expo prebuild --clean`.
- **Settings UI:** Settings → About → "Check for Updates" — manual OTA check via `Updates.checkForUpdateAsync()` / `fetchUpdateAsync()` / `reloadAsync()`. Shows status (checking, downloading, ready, up to date, error, dev mode). Disabled in dev builds.

## Global Components & Modals
- **Mastery:** Opened from the Skills screen header (📖 button next to activity log 📜) via `MasteryModal` in `components/MasteryModal.tsx`. Two-column Gathering/Crafting layout. Mastery row was removed from Settings.
- **Update Board:** In-app modal (`UpdateBoard.tsx`) that pops when `lastSeenVersion !== currentVersion` (from `app.json`). Shows changelog for the new version.
- **Special Message Modal:** A premium animated modal (`SpecialMessageModal.tsx`) for global announcements or milestone celebrations. Triggered via `testMessage` state in `AppShell` (root layout). Supports spring entry, bouncing emojis, and shimmering border glows.
- **GlobalActionTicker:** Located in root `_layout.tsx`. Uses `useSegments()` to detect navigation state and adjust its bottom offset (Above Tab Bar vs. Absolute Bottom).

## Horizon System & Action Mechanics
- **Horizon HUD:** A 3-tier goal tracking system (`ImmediateGoal`, `SessionGoal`, `GrindGoal`). 
  - `Immediate`: Real-time progress toward the next individual drop/tick (0-100%).
  - `Session`: XP progress toward the next character level for the active skill.
  - `Grind`: Progress toward major milestones (Decade levels or Lv. 99).
- **Extended Action Logic:** The `TickSystem` handles non-linear loot logic:
  - `rareChance`: Probability-based bonus item rolls per tick (e.g. Gems/Mythic fish).
  - `yieldMultiplier`: Variable yield scaling (e.g. Logging Seasonal Rotation).
  - Multipliers are applied during both `processOffline` and `processRealtime`.
