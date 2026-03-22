<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

## Agent Credits

| Date | Agent | Model / Tooling | Contribution |
|------|-------|-----------------|--------------|
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Initial SCRATCHPAD — agent handoff template. |
| 2026-03-22 | Cursor Agent (Composer) | Cursor | Last Actions renumbered; Next Action points at `Arteria-Gradle-Edition-v1.2/`; out-of-scope minSdk note amended. |

*Future contributors: append a row when you materially change this doc.*

---

# SCRATCHPAD — Arteria v1.2 Gradle Edition

Active state for **native Android** track. Game design truth stays in repo root `DOCU/` (e.g. `MASTER_DESIGN_DOC.md`, `TRUTH_DOCTRINE.md`). This folder is **planning + continuity** for the Gradle 9.6 / Kotlin / C++ product line.

---

## Current Status

- **Phase:** Phase 0 (Structure + Gradle 9.6 wrapper + Nightly URL) is **DONE [2026-03-22]**.
- **Runnable app:** `:app` Compose shell **confirmed running on API 36.1 AVD** — shows "Welcome to Arteria Gradle Edition" [2026-03-22]. `package com.arteria.game`, `minSdk 26`, `compileSdk 36.1`, `targetSdk 36`. **Daemon JVM:** JDK **21** / **Adoptium** via `gradle/gradle-daemon-jvm.properties`. `:core` module present (empty library, no sources yet).
- **Docs hub:** `Arteria-Gradle-Edition-v1.2/DOCS/` is the current source of truth for architecture and roadmap.
- **Main shipping app:** Still `apps/mobile/` (Expo / RN, Gradle 8.x). Unaffected.

---

## Last Actions (most recent first)

1. **2026-03-22:** **Handoff wrap-up:** Last Actions list renumbered 1–12; Next Action targets **`Arteria-Gradle-Edition-v1.2/`** and Phase 1 remaining work (navigation routes); out-of-scope package/minSdk bullets corrected; doc index calls out SBOM as single source. SBOM title fixed to *Software* Bill of Materials.
2. **2026-03-22:** **SBOM cleanup:** Removed all deprecated/stale tables. SBOM is now one clean source of truth with correct values only.
3. **2026-03-22:** **Doc accuracy pass:** `ARCHITECTURE.md` amended (identity, diagram, Gradle files, source layout, package note). `SCRATCHPAD.md` status strengthened. `ROADMAP.md` Phase 1 annotated `[IN PROGRESS]`.
4. **2026-03-22:** **SBOM audit:** Canonical dependency inventory (Declared / Latest known / Checked); populated from all Gradle files. (Superseded by **SBOM cleanup** entry above: deprecated tables removed entirely.)
5. **2026-03-22:** **JVM 21 for app bytecode:** `app` + `core` `compileOptions` → `JavaVersion.VERSION_21` (matches daemon JDK 21). SBOM amended; `Gradle_Tool_Chain_Migration.md` note updated. `:app:assembleDebug` OK.
6. **2026-03-22:** **Gradle Daemon toolchain:** Android Studio *Migrate* applied; `gradle/gradle-daemon-jvm.properties` pins **JDK 21** / **ADOPTIUM** (Foojay URLs). Docs updated: `Gradle_Tool_Chain_Migration.md` (preservation header + current state), `SBOM.md` toolchain row, `REFERENCES.md` daemon link, `ARCHITECTURE.md` §7a file list; SCRATCHPAD status refreshed.
7. **2026-03-22:** Raised compile/target to **Android 16**: `compileSdk { release(36) { minorApiLevel = 1 } }` (36.1 / Baklava, matches AVD), `targetSdk { release(36) }`, `core` compileSdk aligned; manifest `tools:targetApi="36"`. SBOM §Android SDK Targets amended with AGP 9.1 / migration doc links.
8. **2026-03-22:** AGP 9.1 **built-in Kotlin** migration: removed `org.jetbrains.kotlin.android` from root/app/core (duplicate `kotlin` extension); `:app` uses `org.jetbrains.kotlin.plugin.compose` only; dropped `kotlinOptions` (JVM target follows `compileOptions`). Fixed missing launcher mipmaps: `AndroidManifest` + `res/drawable/ic_launcher.xml` vector. `:app:assembleDebug` verified green.
9. **2026-03-22:** Added local APK packaging scripts at v1.2 root: `build-apk-for-transfer.bat` / `build-apk-for-transfer.ps1` — runs `:app:assembleDebug` (default) or `release`, optional `clean`, copies newest `.apk` to `dist/Arteria-v1.2-<variant>-<timestamp>.apk` for Drive/sideload transfer.
10. **2026-03-22:** Added agent continuity suite: `ROADMAP.md`, `MIGRATION_SPEC.md`, `REFERENCES.md`, `SCRATCHPAD.md`; agent credits on `ARCHITECTURE.md` / `SBOM.md`; expanded target directory layout in `ARCHITECTURE.md` §7.
11. **2026-03-22:** Documented React Native incompatibility with Gradle 9.x; superseded RN-centric execution of `whitepaper.md` (see `ARCHITECTURE.md` §9 and `SBOM.md` whitepaper notice).
12. **2026-03-22:** Established v1.2 as **future direction**: Kotlin + Compose (UI), C++/OpenGL (GPU island), port of engine logic from `packages/engine/`.

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
| `REFERENCES.md` | External links (Gradle, AGP, Compose, GameActivity, etc.) |
| `SCRATCHPAD.md` | This file — live handoff |
| `whitepaper.md` | Vision / rhetoric — do not treat as runbook |
| `gradle_website_links.md` | Legacy one-liner; see `REFERENCES.md` |
