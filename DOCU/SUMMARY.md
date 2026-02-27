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
**Platform:** Modern Android (React Native via Expo SDK 54)
**Timeline Base:** February 26, 2026

**Overview:**
A math-heavy, passive progression RPG without real-time action gameplay. The core loops rely heavily on state management, background calculation of offline progress, and optimizing "Ticks" for skills and combat. Inspired by Melvor Idle.

**Current Status (Phase 2.2 — Immersion & Utility):**
- **Phase 1 Complete:** Engine, native pipeline, save/load, real-time loop, offline catchup.
- **v0.4.1 (Immersion Update):** Global Action Ticker for persistent feedback; Android Edge-to-Edge layout; RPG Icon set (MaterialCommunityIcons); Immersive navigation headers.
- **v0.4.0 (QoL Polish):** Skills screen Pillars; Total Level badge; XP progress tracking; Ticks-to-level estimates.

**Next Steps (Phase 2.2 — Horizon & Combat):**
- Implement unique mechanics for new gathering skills (Seasonal Rotation, Sentient Trees, Mythic Fish).
- Horizon System: 3-tier goal HUD (Immediate / Session / Grind goals) for retention.
- Begin Combat system foundation: stats infrastructure, loadouts, auto-combat.

