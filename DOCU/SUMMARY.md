# SUMMARY

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

**Project:** Arteria — The AFK RPG

---

## 📚 Documentation Index (All Docs)

| Doc | Purpose |
|-----|---------|
| **SUMMARY.md** | This file — project status, quick links, doc index. |
| **ROADMAP.md** | Phased feature roadmap (Phases 0–9+). Do not delete items; only append or mark done. |
| **ARCHITECTURE.md** | Tech stack, monorepo layout, data flow, offline progression, Babel/Metro notes. |
| **MASTER_DESIGN_DOC.md** | Full game design (Aetheria: world, skills, combat, economy, narrative, monetization). |
| **SCRATCHPAD.md** | Active task, history, next steps, blockers. Compact at 500 lines. |
| **CHANGELOG.md** | Version history (Keep a Changelog format). |
| **FUTURE_NOTES.md** | Research & forward planning (SDK 55 migration, MMKV, game loop patterns). |
| **My_Thoughts.md** | Decisions & rationale (e.g. EAS build times, Fast Refresh). |
| **SBOM.md** | Security Bill of Materials — packages, versions, update tracking. |
| **EXPO_GUIDE.md** | Expo/EAS workflow, CNG, when to build vs OTA, monorepo config. |
| **MY_ADHD.md** | Quick Q&A for deployment and testing. |
| **zhipu-ai.md** | Baseline feature sheet for Melvor-like core engine, skills, combat, economy. |
| **zhip-ai-styling.md** | UI/UX style guide (Melvor-like): layout, colors, components, screens. |
| **debugs/** | Issue tracking (e.g. `audit-2026-02-26.md`). |
| **README.md** (root) | User-facing project intro; links to DOCS. |
| **tests/README.md** | Test suite structure and commands. |
| **apps/mobile/README.md** | Expo app quick start (boilerplate). |

*Doc updates: add to top; never delete. Refresh stale sections when touching a doc.*

**Entry point (2026-02-26):** If you start the dev server from the repo root, root `package.json` now has `"main": "apps/mobile/index.js"` so Metro uses Expo Router instead of the default AppEntry (which expected a root `App`). Prefer running from `apps/mobile` (e.g. `0_Start_Dev_Server.bat` or `npm run mobile`).

**Local APK build (2026-02-27):** `2_Build_APK_Local.bat` produces a release APK without a connected device. Uses `gradlew assembleRelease` from `apps\mobile\android`. Root `index.js` redirects Metro (which resolves from Arteria) to `apps/mobile/index.js`. Output: `apps\mobile\android\app\build\outputs\apk\release\app-release.apk`.

**Platform:** Modern Android (React Native via Expo SDK 54)
**Timeline Base:** February 26, 2026

**Overview:**
A math-heavy, passive progression RPG without real-time action gameplay. The core loops rely heavily on state management, background calculation of offline progress, and optimizing "Ticks" for skills and combat. Inspired by Melvor Idle.

**Current Status (Phase 2.2 — Horizon & Mechanics):**
- **Phase 1 Complete:** Engine, native pipeline, save/load, real-time loop, offline catchup.
- **v0.4.5 (Horizon & Mechanics):** 3-tier goal HUD (Horizon system); Rare gems, Mythic fish, and Seasonal Logging yield; Local APK build fix.
- **v0.4.4 (Patch History):** Patch history screen accessible from settings.
- **v0.4.3 (Bank & Juice):** Bank search + filters; Train toast; Pulsing tab glow; Loot vacuum animation.

**Next Steps (Phase 3 — Combat Foundation):**
- Finalize gathering pillar balancing and drop tables.
- Begin Combat system alpha: loadouts, weapon stats, health/damage infrastructure.
- Mastery System: Spend skill-specific mastery points for permanent buffs.

