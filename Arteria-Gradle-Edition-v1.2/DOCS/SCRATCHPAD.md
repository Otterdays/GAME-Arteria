<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

## Agent Credits

| Date | Agent | Model / Tooling | Contribution |
|------|-------|-----------------|--------------|
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Initial SCRATCHPAD — agent handoff template. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Last Actions renumbered; Next Action points at `Arteria-Gradle-Edition-v1.2/`; out-of-scope minSdk note amended. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Cinzel bundled + docs (SBOM, REFERENCES, ARCHITECTURE); SCRATCHPAD status. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Animated `DockingBackground` (twinkle, nebula, gradient breath); KDoc “way forward”. |

*Future contributors: append a row when you materially change this doc.*

---

# SCRATCHPAD — Arteria v1.2 Gradle Edition

Active state for **native Android** track. Game design truth stays in repo root `DOCU/` (e.g. `MASTER_DESIGN_DOC.md`, `TRUTH_DOCTRINE.md`). This folder is **planning + continuity** for the Gradle 9.6 / Kotlin / C++ product line.

---

## Current Status

- **Phase:** Phase 0 (Structure + Gradle 9.6 wrapper + Nightly URL) is **DONE [2026-03-22]**.
- **Runnable app:** `:app` Compose **Docking Station** styling (palette from `apps/mobile/constants/theme.ts`), **Cinzel** display type (`res/font/cinzel.ttf`, OFL), **animated space backdrop** (`DockingBackground`: twinkling stars, drifting aurora blobs, breathing gradient) on menu-related screens. NavHost `ui/ArteriaApp.kt`. `package com.arteria.game`, `minSdk 26`, `compileSdk 36.1`, `targetSdk 36`. **Daemon JVM:** JDK **21** / **Adoptium** via `gradle/gradle-daemon-jvm.properties`. `:core` empty. `:app:assembleDebug` green [2026-03-22].
- **Docs hub:** `Arteria-Gradle-Edition-v1.2/DOCS/` is the current source of truth for architecture and roadmap.
- **Main shipping app:** Still `apps/mobile/` (Expo / RN, Gradle 8.x). Unaffected.

---

## Last Actions (most recent first)

1. **2026-03-22:** **Animated main-menu sky:** `DockingBackground` — dual `InfiniteTransition` loops (26s cosmic / 5.2s twinkle), **78** stars with per-star phase/speed, **3** soft radial **nebula** blobs (accent blue / purple / luminar) drifting slowly, **lerp**-shifted vertical gradient “breath.” KDoc lists roadmap: reduced motion, parallax, shader fog, battery hooks. Used on account select / create / session screens.
2. **2026-03-22:** **Cinzel font:** Bundled variable `res/font/cinzel.ttf` (Google Fonts OFL, parity with Expo `Cinzel_400Regular` / `Cinzel_700Bold`). `ArteriaTheme.kt` uses Cinzel for display / titles / pretag; body remains sans-serif. Docs: `SBOM.md` **Bundled font assets**, `REFERENCES.md` typography section, `ARCHITECTURE.md` §4 rows. `:app:compileDebugKotlin` OK.
3. **2026-03-22:** **Docking Station UI:** Palette + starfield + gradient account cards inspired by `apps/mobile/app/character-select.tsx` and `constants/theme.ts`.
4. **2026-03-22:** **Account UI (stub):** NavHost — account selection, creation (Standard mode), session placeholder. Files: `ui/ArteriaApp.kt`, `ui/account/*`, `navigation/NavRoutes.kt`.
5. **2026-03-22:** **Handoff wrap-up:** Next Action targets **`Arteria-Gradle-Edition-v1.2/`**; SBOM single source; title *Software* Bill of Materials.
6. **2026-03-22:** **SBOM cleanup:** Single source of truth tables.
7. **2026-03-22:** **Doc accuracy pass:** `ARCHITECTURE.md`, `SCRATCHPAD.md`, `ROADMAP.md` Phase 1 `[IN PROGRESS]`.
8. **2026-03-22:** **SBOM audit:** Canonical dependency inventory.
9. **2026-03-22:** **JVM 21** app bytecode + daemon.
10. **2026-03-22:** **Gradle Daemon toolchain** JDK 21 / ADOPTIUM.
11. **2026-03-22:** **Android 16** compileSdk 36.1 / targetSdk 36.
12. **2026-03-22:** AGP 9.1 **built-in Kotlin** migration; launcher icon fix.
13. **2026-03-22:** `build-apk-for-transfer` scripts.
14. **2026-03-22:** Agent continuity suite (ROADMAP, MIGRATION_SPEC, REFERENCES, SCRATCHPAD).
15. **2026-03-22:** React Native vs Gradle 9.x documented; `whitepaper.md` superseded for execution.
16. **2026-03-22:** Established v1.2 **future direction**: Kotlin + Compose, C++/OpenGL GPU island.

---

## Blockers

- **None** for documentation / planning.
- **Build risk:** Gradle 9.6 **nightly** can change between snapshots — always pin wrapper URL (see `SBOM.md`).

---

## Next Action (for the next agent)

1. Read [ROADMAP.md](ROADMAP.md) Phase 1 (`[IN PROGRESS]` checklist — Compose + package + `:core` module are in place).
2. Read [MIGRATION_SPEC.md](MIGRATION_SPEC.md) for TS → Kotlin mapping and source file pointers.
3. Open **`Arteria-Gradle-Edition-v1.2/`** in Android Studio (project root with `settings.gradle.kts`, `:app`, `:core` — not the older `Artera-Gradle-Edition/` template tree unless comparing history).
4. **Finish Phase 1:** Navigation Compose scaffold with placeholder routes (Skills, Bank, Combat, Settings) per ROADMAP; optionally add first JVM unit test under `:core` with zero `android.*` imports.
5. **Truth for versions/deps:** [SBOM.md](SBOM.md) — single source of truth.

---

## Out-of-Scope Observations

- **Package name:** **Resolved (2026-03-22):** Current id is **com.arteria.game** (applicationId, namespace, Kotlin paths). Older scaffold used **com.example.arteriav15_gradleedition** (obsolete). When C++ is added, coordinate **System.loadLibrary** with the CMake target name.
- **minSdk:** `[AMENDED 2026-03-22]:` Repo **`minSdk` is 26** (not 36). If product policy changes supported OS floor, update `app`/`core` Gradle, `SBOM.md` Android SDK table, and note in `ROADMAP.md`.
- **`whitepaper.md`:** Grok draft; high-level native vision only. **ROADMAP + ARCHITECTURE + MIGRATION_SPEC** override for exact tooling versions and folder layout.

---

## Documentation Index (this folder)

| Doc | Role |
|-----|------|
| `ARCHITECTURE.md` | Stack, RN vs Gradle 9, render loop, conventions |
| `SBOM.md` | Single source: toolchain, SDK targets, dependency inventory, update policy |
| `ROADMAP.md` | Phased delivery 0–6 |
| `MIGRATION_SPEC.md` | How to port from RN monorepo |
| `DESIGN_TRANSLATION_AUDIT.md` | Detailed checklist of Split data / skills / content files from V1 |
| `REFERENCES.md` | External links (Gradle, AGP, Compose, GameActivity, etc.) |
| `SCRATCHPAD.md` | This file — live handoff |
| `whitepaper.md` | Vision / rhetoric — do not treat as runbook |
| `gradle_website_links.md` | Legacy one-liner; see `REFERENCES.md` |
