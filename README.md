<p align="center">
  <img src="https://img.shields.io/badge/Arteria-0.4.1-8b5cf6?style=flat-square&labelColor=0a0b0f" alt="Version" />
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

## What is Arteria?

A **cosmic idle RPG** inspired by **Melvor Idle** and **RuneScape**. Built for **React Native (Expo)** with a headless TypeScript engine — zero UI coupling, 100% testable game logic.

| | |
|:---:|:---|
| **🌙 Offline** | 24h progression cap · Gains while you sleep |
| **⛏️ Skills** | Mining, Logging, Fishing, Runecrafting, Cooking, Smithing, Forging · 25 planned |
| **⚔️ Combat** | 12 factions · Auto or active · Goblin first enemy |
| **📜 Quests** | 18 story quests · Act I & II · Daily quests |

---

## Latest — v0.4.1 "The Anchor Man"

| Feature | |
|---------|---|
| **The Anchor** | Main character + nickname. First-time name entry; Settings → Character to change. |
| **Goblin** | First random enemy. Goblin Peek event + modal. Bestiary stub in Combat tab. |
| **Cooking** | 10 recipes (fish → cooked food). Bank Food filter. Daily quests Cook Shrimp, Cook Trout. |
| **Login bonus** | 7-day streak. Day 7: 500 gp + 10 Lumina. |

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
