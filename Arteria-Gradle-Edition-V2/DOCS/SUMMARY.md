<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

## Agent Credits

| Date | Agent | Model / Tooling | Contribution |
|------|-------|-----------------|--------------|
| 2026-03-30 | Cursor Agent | Composer | Initial `DOCS/SUMMARY.md` — V2 hub, canonical paths, AI workflow for features/QoL/UI. |

*Future contributors: append a row when you materially change this doc.*

---

# SUMMARY — Arteria Gradle Edition V2

**What this is:** Native Android track (Kotlin, Jetpack Compose, Gradle 9.x line). The shipping React Native app remains under monorepo root `apps/mobile/`; this folder is the **parallel native product**.

**Gradle project root:** `Arteria-Gradle-Edition-V2/` (contains `settings.gradle.kts`, `:app`, `:core`). Open this directory in Android Studio.

---

## Source of truth (read order for any AI / new contributor)

| Order | Doc | Why |
|-------|-----|-----|
| 1 | [SCRATCHPAD.md](SCRATCHPAD.md) | Current phase, blockers, last actions, **next action**. |
| 2 | [ROADMAP.md](ROADMAP.md) | Phased delivery including **platform (0–6)** and **features / QoL / UI (7+)**. |
| 3 | [ARCHITECTURE.md](ARCHITECTURE.md) | Stack decisions, RN vs native split, module layout. |
| 4 | [MIGRATION_SPEC.md](MIGRATION_SPEC.md) | How to translate RN + TypeScript engine patterns → Kotlin / Compose. |
| 5 | [SBOM.md](SBOM.md) | Toolchain and dependency versions — verify before changing Gradle or SDKs. |

---

## Game design & UI intent (features, QoL, polish)

**Canonical (monorepo):** `../DOCU/` relative to this folder — especially:

- `MASTER_DESIGN_DOC.md`, `TRUTH_DOCTRINE.md`, `ROADMAP.md` (shipping app roadmap — cross-check for feature parity targets)
- `IMPROVEMENTS.md`, `CURRENT_IMPROVEMENTS.md` — prioritized UX and feature ideas
- `UI_REVISION_CRAFTING_v2.md`, `THEMING.md`, `zhip-ai-styling.md`, `STYLE_GUIDE.md` — UI/QoL alignment

**Bundled copy (offline / historical):** [ARTERIA-V1-DOCS/DOCU/](ARTERIA-V1-DOCS/DOCU/) — same filenames. If **root `DOCU/`** and the copy disagree, **root wins**.

**Detailed content audit:** [DESIGN_TRANSLATION_AUDIT.md](DESIGN_TRANSLATION_AUDIT.md).

---

## Aligning multiple AIs on the same work

1. **Claim a slice:** Add or update a line in `SCRATCHPAD.md` (Last Actions + Next Action) so parallel sessions do not collide.
2. **Track delivery:** Mark items in `ROADMAP.md` with `[DONE YYYY-MM-DD]:` or `[IN PROGRESS …]:` per preservation rules — never delete old text.
3. **Design parity:** Before UI work, open the matching RN screen under monorepo `apps/mobile/app/` and the relevant `DOCU/` spec.
4. **After dependency changes:** Update `SBOM.md` the same session.

---

## Documentation index (this `DOCS/` folder)

| Doc | Role |
|-----|------|
| **SUMMARY.md** | This hub — paths, reading order, AI alignment. |
| **SCRATCHPAD.md** | Live handoff. |
| **ROADMAP.md** | Full phased plan. |
| **ARCHITECTURE.md** | System structure. |
| **MIGRATION_SPEC.md** | TS / RN → Kotlin mapping. |
| **SBOM.md** | Versions and bill of materials. |
| **REFERENCES.md** | External official links. |
| **DESIGN_TRANSLATION_AUDIT.md** | File-level port checklist from V1. |
| **Gradle_Tool_Chain_Migration.md** | Daemon JVM / toolchain notes. |
| **gradle_website_links.md** | Legacy pointer; prefer REFERENCES. |

---

## Quick link — root README

Monorepo overview and RN commands: [../README.md](../README.md).
