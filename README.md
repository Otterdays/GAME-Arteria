<p align="center">
  <img src="https://img.shields.io/badge/Arteria-0.5.0-8b5cf6?style=flat-square&labelColor=0a0b0f" alt="Version" />
  <img src="https://img.shields.io/badge/Expo-SDK_55-000020?style=flat-square&logo=expo&logoColor=fff" alt="Expo" />
  <img src="https://img.shields.io/badge/React_Native-0.83-61dafb?style=flat-square&logo=react&logoColor=fff" alt="React Native" />
  <img src="https://img.shields.io/badge/Tests-25_Passing-22c55e?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/License-MIT-64748b?style=flat-square" alt="License" />
</p>

<h1 align="center">Arteria</h1>
<p align="center">
  <strong>The Idle RPG</strong> — Train skills. Gather resources. Progress while you sleep.
</p>

<p align="center">
  <a href="https://otterdays.github.io/GAME-Arteria">🌐 Live Site</a> ·
  <a href="DOCU/SUMMARY.md">📚 Docs</a> ·
  <a href="DOCU/ROADMAP.md">🗺️ Roadmap</a> ·
  <a href="https://github.com/Otterdays/GAME-Arteria/releases">📦 Releases</a>
</p>

---

## 📚 Source of Truth

For the definitive game design, philosophy, and architecture, refer to:

- **[TRUTH_DOCTRINE.md](DOCU/TRUTH_DOCTRINE.md)** — The ultimate source of truth. Core philosophy, behavioral protocols, and developer mandates.
- **[MASTER_DESIGN_DOC.md](DOCU/MASTER_DESIGN_DOC.md)** — Complete game design document. All skills, systems, mechanics, lore, and monetization strategy.

All other documentation derives from these two primary sources.

---

## What is Arteria?

A **cosmic idle RPG** inspired by **Melvor Idle** and **RuneScape**. Built for **React Native (Expo)** with a headless TypeScript engine — zero UI coupling, 100% testable game logic.

| | |
|:---:|:---|
| **🌙 Offline** | 24h progression cap (F2P) · 7-day cap (Patron) |
| **⛏️ Skills** | Mining, Logging, Fishing, Runecrafting, Cooking, Smithing, Forging, Harvesting, Scavenging, Herblore |
| **🗺️ World** | 6 Explorable Locations · NPCs & Shops · Instant Travel |
| **⚔️ Combat** | 12 factions · Auto or active · Goblin first enemy |
| **📜 Quests** | 18 story quests · Act I & II · 30 daily quest templates |
| **🏦 Systems** | OSRS-Style Bank Tabs · Multi-pillar Mastery · Theme Engine |

---

## Latest — v0.5.0 "Big Weeds Update"

| Feature | |
|---------|---|
| **New Skills** | Harvesting (flora), Scavenging (ruins), and Herblore (potions). |
| **World Map** | Explore tab with 6 locations (Frostvale, Fey Markets, etc.). Tap to travel and visit local NPCs. |
| **Bank Redesign** | Main tab + up to 6 custom tabs. Drag & drop items, type filters, remember last tab. |
| **Mastery & Lumina**| Yield and Speed Mastery upgrades. Lumina Shop to reroll daily quests or buy XP boosts. |
| **Weapons** | Massive Forging expansion with 5 weapon types across all 6 metal tiers (54 recipes). |

---

## Stack

| Layer | Tech |
|-------|------|
| **Engine** | Pure TypeScript · Headless · Jest-tested |
| **Runtime** | Expo SDK 55 · React Native 0.83 · New Architecture |
| **State** | Redux Toolkit · Typed hooks |
| **Storage** | MMKV v4 · Synchronous C++ |
| **Nav** | Expo Router v6 · File-based |

---

## Repo Structure

| Path | Purpose |
|------|---------|
| `DOCU/` | Specs, roadmaps, architecture, companions |
| `apps/mobile/` | React Native app · Screens, themes, UI |
| `packages/engine/` | Game math · XP tables, tick system, actions |
| `index.html` | Landing site · [GitHub Pages](https://otterdays.github.io/GAME-Arteria) |

---

## Quick Start

```bash
npm install
```

**Dev (Fast Refresh):**
```bash
# 1. Build dev client (one-time)
1_Run_Local_Android_Build.bat

# 2. Start Metro
0_Start_Dev_Server.bat
```

**Release APK:**
```bash
2_Build_APK_Local.bat
# → apps/mobile/android/app/build/outputs/apk/release/
```

**Tests:**
```bash
npm test
npm run test:coverage
```

---

<p align="center">
  <sub>Built with 💜 by <a href="https://github.com/Otterdays">Otterdays</a></sub>
</p>
