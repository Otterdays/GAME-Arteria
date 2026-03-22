<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

## Agent Credits

| Date | Agent | Model / Tooling | Contribution |
|------|-------|-----------------|--------------|
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Initial ROADMAP Phases 0–6 + source references. |

*Future contributors: append a row when you materially change this doc.*

---

# ROADMAP — Arteria v1.2 Gradle Edition

Phased plan for the **native** Android line. Game content and tone remain defined in root `DOCU/MASTER_DESIGN_DOC.md` and related design docs.

**Rules for agents:** Mark phases done in this file with `[DONE YYYY-MM-DD]:` notes — do not delete prior text. Add new phases at the top if the plan forks.

---

## Phase 0 — Scaffold and documentation [DONE 2026-03-22]

- GameActivity + C++/OpenGL ES 3 template under `Artera-Gradle-Edition/`.
- Gradle 9.6 nightly wrapper, AGP 9.1.0, API 36 targets (see `SBOM.md`).
- Docs: `ARCHITECTURE.md`, `SBOM.md`, continuity docs in this folder.

**Reference:** `Artera-Gradle-Edition/app/src/main/cpp/`, `MainActivity.kt`, `gradle/wrapper/gradle-wrapper.properties`.

---

## Phase 1 — Foundation (Compose shell + package identity)

**Goal:** Runnable app with Jetpack Compose entry, clear package name, and a **pure Kotlin** `core` module (no Android imports in `core`).

- Add Compose BOM + dependencies; enable Compose in `app/build.gradle.kts`.
- Introduce navigation scaffold (e.g. Navigation Compose) with placeholder routes: Skills, Bank, Combat, Settings.
- Rename application id / namespace from `com.example.arteriav15_gradleedition` toward `com.arteria.game` (or chosen final id) — update manifest, CMake native lib name + `loadLibrary` if lib name changes.
- Create Gradle module or source set: `core/` — empty engine package + first unit test (JUnit runs on JVM).

**Consult (main repo, read-only patterns):**

- `apps/mobile/app/_layout.tsx` — tab structure intent (not code copy).
- `DOCU/ARCHITECTURE.md` — monorepo concepts; v1.2 is separate project.

**Exit criteria:** `./gradlew :app:assembleDebug` succeeds; Compose shows a stub home screen; `core` compiles with zero `android.*` imports.

`[IN PROGRESS 2026-03-22]:` Partial Phase 1 complete:
- [x] Compose BOM + dependencies in `app/build.gradle.kts` (BOM 2024.06.00, Material3, Navigation Compose)
- [x] Package renamed to `com.arteria.game` — `applicationId`, `namespace`, Kotlin source path, manifest
- [x] `:core` Gradle module created (empty library, `compileSdk 36.1`, `minSdk 26`)
- [x] `./gradlew :app:assembleDebug` green; app confirmed running on API 36.1 AVD
- [ ] **Remaining:** Navigation scaffold with placeholder routes (Skills, Bank, Combat, Settings)

---

## Phase 2 — Engine port (headless Kotlin)

**Goal:** Port idle **math and rules** from TypeScript engine into `core` — no UI.

- Tick / delta processing: mirror `TickSystem.ts` behavior.
- XP progression: port `XPTable.ts` + tests.
- Types: port `types.ts` skill IDs, player shape subsets needed for ticks.
- Narrative helpers: port relevant pieces of `narrative.ts` if gating is in-engine.

**Primary sources (main repo):**

- `packages/engine/src/TickSystem.ts`
- `packages/engine/src/XPTable.ts`
- `packages/engine/src/types.ts`
- `packages/engine/src/GameEngine.ts`
- `packages/engine/src/utils/narrative.ts`
- Tests: `packages/engine/src/__tests__/TickSystem.test.ts`, `XPTable.test.ts`

**Exit criteria:** JVM unit tests in v1.2 cover XP + tick invariants comparable to engine tests.

---

## Phase 3 — UI shell (Compose)

**Goal:** Screens that **display** engine-driven state (read-only or stub actions).

- Skills grid / pillars (visual parity with design intent, not pixel-perfect clone).
- Bank, Combat, Settings placeholders wired to `ViewModel` + `StateFlow`.
- Theme: start from `DOCU/THEMING.md` / `DOCU/zhip-ai-styling.md` tokens (manual Compose colors first).

**Primary sources (main repo, UI reference only):**

- `apps/mobile/app/(tabs)/` — tab layout patterns.
- `apps/mobile/constants/theme.ts` — palette numbers.
- `apps/mobile/store/gameSlice.ts` — field names for future parity (port gradually in Phase 4–5).

**Exit criteria:** Navigate between main tabs; state hoisted in ViewModels (even if mock data).

---

## Phase 4 — Persistence + offline

**Goal:** Save/load player state; deterministic migrations; WYWA-style report data structures.

- Choose storage: **DataStore** (protobuf/json) and/or **MMKV** NDK — document choice in `SBOM.md` when added.
- Port migration mindset from `apps/mobile/store/` (migrations in `gameSlice` / persistence layer).
- Offline window: port cap logic and report DTOs from `useGameLoop.ts` / WYWA components conceptually.

**Primary sources:**

- `apps/mobile/hooks/useGameLoop.ts` — tick loop, offline processing, combat ticks.
- `apps/mobile/hooks/usePersistence.ts` (if present) / `store/persistence.ts`
- `apps/mobile/components/WhileYouWereAway.tsx` — UX contract for report fields.

**Exit criteria:** Cold start restores state; instrumented or unit tests for migration round-trip.

---

## Phase 5 — Content port

**Goal:** Data-driven skills, nodes, recipes, enemies — backed by Kotlin definitions or assets.

- Port tables from `packages/engine/src/data/*.ts` and `apps/mobile/constants/*.ts` as needed (mining, logging, items, combat).
- Wire `useGameLoop`-equivalent orchestration in a **single** Android-side loop (coroutine + clock).

**Primary sources:**

- `packages/engine/src/data/mining.ts`, `logging.ts`, `fishing.ts`, `quests.ts`, `story.ts`, etc.
- `apps/mobile/constants/items.ts`, skill screens under `apps/mobile/app/skills/`.

**Exit criteria:** At least one vertical slice (e.g. Mining + Bank) playable end-to-end offline.

---

## Phase 6 — Polish and release engineering

**Goal:** Production hygiene.

- Enable R8/minify for release; keep rules for any reflection/native JNI.
- Sound (e.g. Oboe or Android audio), haptics, accessibility labels on Compose.
- Play listing: signing config, versionCode policy, privacy/data safety notes.
- Optional: retain C++/OpenGL subview for effects — compose over GL per `ARCHITECTURE.md`.

**Primary sources:**

- `apps/mobile/android/app/proguard-rules.pro` — patterns for native/RN (adapt, do not copy blindly).
- Root `2_Build_APK_Local.bat` — inspiration for a v1.2-specific script when stable.

**Exit criteria:** Release build produces uploadable AAB; smoke checklist documented in `SCRATCHPAD.md`.

---

## Cross-links

- **How to translate RN code:** [MIGRATION_SPEC.md](MIGRATION_SPEC.md)
- **Stack truth:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Dependency versions:** [SBOM.md](SBOM.md)
- **External docs:** [REFERENCES.md](REFERENCES.md)
