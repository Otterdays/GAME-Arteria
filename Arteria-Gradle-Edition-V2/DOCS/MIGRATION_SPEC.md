<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

## Agent Credits

| Date | Agent | Model / Tooling | Contribution |
|------|-------|-----------------|--------------|
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Initial MIGRATION_SPEC — TS/Redux → Kotlin patterns and file map. |
| 2026-03-30 | Cursor Agent | Composer | Title amended to **Gradle Edition V2**; scope unchanged. |

*Future contributors: append a row when you materially change this doc.*

---

# Migration Spec — React Native Monorepo → Native Kotlin (Gradle Edition V2)

This document tells **future AI agents** how to translate the existing Arteria implementation into the Gradle 9.6 / Kotlin / Compose codebase. It does **not** prescribe copying files; it prescribes **parity of behavior**.

**Monorepo root** (relative to this repo): `Arteria/`.

---

## 1. Architectural mapping

| RN / TS concept | Native V2 target | Notes |
|-----------------|-------------------|--------|
| Redux `createSlice` + `configureStore` | `ViewModel` + `StateFlow` / `MutableStateFlow` | One VM per screen or a single `GameViewModel` early on; avoid `GlobalScope`. |
| RTK selectors | Flow combinators or derived `StateFlow` in VM | Keep derived state out of Composables. |
| `useGameLoop` (`setInterval` ~100ms) | Coroutine loop on `Dispatchers.Default` + `delay` / monotonic clock | Bridge tick rate to engine `processDelta(ms)`. |
| `usePersistence` + MMKV | DataStore, Room, or MMKV NDK | Document choice in `SBOM.md` when added. |
| Expo Router screens | Compose `NavHost` + routes | See `ROADMAP.md` Phase 1–3. |
| `constants/*.ts` arrays | Kotlin `object` registries, `listOf`, or JSON in `assets/` loaded once | Prefer typed Kotlin for hot paths. |
| `packages/engine` pure TS | `core` module JVM Kotlin | No Android imports in `core`. |

---

## 2. Type and model translation

| TypeScript | Kotlin |
|------------|--------|
| `interface Foo { ... }` | `data class Foo(...)` or `sealed class` for unions |
| `type Id = string` | `typealias Id = String` or `@JvmInline value class` |
| `enum` / string unions | `enum class` or `sealed class` subclasses |
| Optional fields `?:` | Nullable types `T?` |
| `Record<string, T>` | `Map<String, T>` |
| Discriminated unions | `sealed class` with data subclasses |

---

## 3. Game loop and time

1. Read `apps/mobile/hooks/useGameLoop.ts` — identify: interval, `processDelta`, skill ticks, combat ticks, offline catch-up entry points.
2. In v1.2, implement a **single** `GameClock` or `TickCoordinator` in the Android layer that:
   - Computes `deltaMs` from monotonic time.
   - Calls into `core` functions ported from `TickSystem.ts` / `GameEngine.ts`.
3. Never run heavy loop work on `Dispatchers.Main`.

---

## 4. Key source files (main repo) — read order for engine port

**Engine package (headless logic):**

| File | Purpose |
|------|---------|
| `packages/engine/src/types.ts` | Core IDs and shared shapes |
| `packages/engine/src/TickSystem.ts` | Delta / tick processing |
| `packages/engine/src/XPTable.ts` | Level / XP math |
| `packages/engine/src/GameEngine.ts` | Orchestration entry points |
| `packages/engine/src/utils/narrative.ts` | Quest / flag gating |
| `packages/engine/src/data/story.ts`, `quests.ts`, `dialogues.ts` | Narrative data |
| `packages/engine/src/data/mining.ts`, `logging.ts`, `fishing.ts`, `harvesting.ts`, `scavenging.ts`, `astrology.ts`, `slayer.ts`, `summoning.ts`, `leadership.ts` | Skill / content data |
| `packages/engine/src/data/playerFactory.ts` | Default player shape |
| `packages/engine/src/index.ts` | Public exports |

**Mobile app (state + UI reference):**

| File / area | Purpose |
|-------------|---------|
| `apps/mobile/store/gameSlice.ts` | Player / game state fields, reducers |
| `apps/mobile/store/index.ts` | Store wiring |
| `apps/mobile/hooks/useGameLoop.ts` | Realtime + offline tick integration |
| `apps/mobile/constants/*.ts` | Items, skills UI meta, recipes (large) |
| `apps/mobile/app/(tabs)/` | Navigation structure |
| `apps/mobile/app/skills/*.tsx` | Per-skill UI patterns |

---

## 5. Testing parity

- Mirror `packages/engine/src/__tests__/*.ts` with JUnit tests in `core` where math must match (XP table, tick rounding, offline clamp).
- Target **80% coverage on `core`** long-term (align with root `DOCU` testing guidance).

---

## 6. What not to port blindly

- **Expo / RN modules:** No `expo-*` on v1.2; find Android equivalents (notifications, audio, etc.) per phase.
- **Hermes / Metro:** Not applicable.
- **Gradle 8.x lock-in from RN:** v1.2 stays on Gradle 9.x per `ARCHITECTURE.md`; never merge RN Gradle plugin into this project.

---

## 7. Doc chain for agents

1. [SCRATCHPAD.md](SCRATCHPAD.md) — current status  
2. [ROADMAP.md](ROADMAP.md) — what to build next  
3. [ARCHITECTURE.md](ARCHITECTURE.md) — stack constraints  
4. [SBOM.md](SBOM.md) — register every new dependency  
5. [REFERENCES.md](REFERENCES.md) — official Android / Gradle links  
