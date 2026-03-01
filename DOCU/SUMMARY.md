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
| **PEOPLE_TO_ADD.md** | Names for future inclusion in the game (NPCs, credits, companions, etc.) — reference only. |
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

**Version scheme:** 0.2.x (current **0.2.5**). Restructured from 0.4.x on 2026-02-28 so versioning reflects early-stage development. See CHANGELOG.md.

**v0.2.5 (2026-02-28):** Current release. Changelog, website, in-app Patch History, app.json, build.gradle, README, UpdatesModal updated. See CHANGELOG.md [0.2.5].

**Build (2026-02-27):** EAS hit account concurrency limit (builds queue). **Use local APK build:** `2_Build_APK_Local.bat` from repo root. Release now outputs split APKs: `app-arm64-v8a-release.apk` (~31 MB) and `app-armeabi-v7a-release.apk` (~25 MB) in `apps\mobile\android\app\build\outputs\apk\release\`. Prefer arm64 for modern phones. Script also sets `ARTERIA_LEAN_PROD=1` to exclude Expo dev-client native modules during release autolinking. See EXPO_GUIDE §4b.

**Entry point (2026-02-26):** If you start the dev server from the repo root, root `package.json` now has `"main": "apps/mobile/index.js"` so Metro uses Expo Router instead of the default AppEntry (which expected a root `App`). Prefer running from `apps/mobile` (e.g. `0_Start_Dev_Server.bat` or `npm run mobile`).

**Local APK build (2026-02-27):** `2_Build_APK_Local.bat` produces release APKs without a connected device. Uses `gradlew assembleRelease` from `apps\mobile\android`. Root `index.js` redirects Metro (which resolves from Arteria) to `apps/mobile/index.js`. Output folder: `apps\mobile\android\app\build\outputs\apk\release\` with split APKs (`app-arm64-v8a-release.apk`, `app-armeabi-v7a-release.apk`).

**Platform:** Modern Android (React Native via Expo SDK 54)
**Timeline Base:** February 26, 2026

**Overview:**
A math-heavy, passive progression RPG without real-time action gameplay. The core loops rely heavily on state management, background calculation of offline progress, and optimizing "Ticks" for skills and combat. Inspired by Melvor Idle.

**Current Status (Phase 2.2 — Horizon & Mechanics):**
- **Phase 1 Complete:** Engine, native pipeline, save/load, real-time loop, offline catchup.
- **v0.2.5 (Build & Release):** Smaller APKs (ABI split, lean prod). AnimatedNumber, BouncyButton, ActivePulseGlow, tick shake.
- **v0.2.4 (Premium UI):** AnimatedNumber, BouncyButton, ActivePulseGlow, tick shake.
- **v0.2.3 (Horizon & Logging):** Logging UI, Shop 50% sell, Curse system, Horizon HUD, rare gems, mythic fish, Seasonal Rotation, Patch Notes.
- **v0.2.2 (Juice):** Bank search/filters, Train Toast, pulsing tab glow, Loot Vacuum, XP Bar Pulse, Haptic Heartbeat, SmoothProgressBar.
- **v0.2.1 (Immersion):** Global Action Ticker, Header XP dashboard, MaterialCommunityIcons, edge-to-edge.
- **v0.2.0 (Pipeline & Gathering):** Gradle, prebuild, Melvor palette, core loop, Mining, Skill Pillars, Total Level, XP tracking.

**Next Steps (Phase 3 — Combat Foundation):**
- Finalize gathering pillar balancing and drop tables.
- Begin Combat system alpha: loadouts, weapon stats, health/damage infrastructure.
- Mastery System: Spend skill-specific mastery points for permanent buffs.

