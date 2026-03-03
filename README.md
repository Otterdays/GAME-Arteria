<div align="center">

# 🌌 Arteria

### *The AFK RPG — Train skills. Gather resources. Progress while you sleep.*

[![Version](https://img.shields.io/badge/Version-0.3.0-8b5cf6?style=for-the-badge&logo=github)](https://github.com/Otterdays/GAME-Arteria/releases)
[![Expo](https://img.shields.io/badge/Expo-SDK_55-000020?style=for-the-badge&logo=expo)](https://expo.dev)
[![Tests](https://img.shields.io/badge/Tests-25_Passing-22c55e?style=for-the-badge)](https://github.com/Otterdays/GAME-Arteria)
[![License](https://img.shields.io/badge/License-MIT-38bdf8?style=for-the-badge)](LICENSE)

**[🌐 Live Site](https://otterdays.github.io/GAME-Arteria)** · **[📚 Docs](DOCU/SUMMARY.md)** · **[🗺️ Roadmap](DOCU/ROADMAP.md)** · **[📦 Releases](https://github.com/Otterdays/GAME-Arteria/releases)**

</div>

---

> [!NOTE]
> **Living chronicle:** Do not remove or delete existing content. Only append, compact, or update. Arteria is a living project.

---

## ✨ What is Arteria?

A **math-heavy, incremental idle RPG** inspired by **Melvor Idle** and **RuneScape**. Built for **React Native (Expo)** with a headless TypeScript engine — zero UI coupling, 100% testable game logic.

| 🌱 **Offline** | ⛏️ **Skills** | ⚔️ **Combat** |
|:---:|:---:|:---:|
| 24h progression cap · Gains while you sleep | 25 skills · Mining, Logging, Fishing, Runecrafting live | 12 factions · Auto or active bossing *(coming)* |

---

## 🚀 v0.3.0 — The Big Update

| Feature | Description |
|:---|:---|
| 🎨 **Theme Engine** | System / Dark / Light / Sepia. Tab bar, headers, StatusBar follow your pick. |
| ⚡ **Quick-Switch** | Floating pill → slide-in drawer. Jump Mining ↔ Logging ↔ Fishing ↔ Runecrafting. |
| 🎲 **Random Events** | Blibbertooth, Cosmic Sneeze, Genie, Treasure Chest, Lucky Strike. Per-tick roll. |
| 🎣 **Fishing & ✨ Runecrafting** | 10 spots, 14 altars. Smart loop consumes inputs, auto-stops when out. |
| 📜 **18 Story Quests** | Act I & II. Narrative gating, difficulty tiers. |
| ⚙️ **Settings** | Confirm Task Switch, Battery Saver, Horizon HUD, Notifications, Idle Soundscapes. |

---

## 🛠️ Stack

| Layer | Tech |
|:---|:---|
| **Engine** | Pure TypeScript · Headless · Jest-tested |
| **Runtime** | Expo SDK 55 · React Native 0.83 · New Architecture |
| **State** | Redux Toolkit · Typed hooks |
| **Storage** | MMKV v4 · Synchronous C++ |
| **Nav** | Expo Router v6 · File-based |

---

## 📂 Repo

| Path | Purpose |
|:---|:---|
| [`DOCU/`](DOCU/SUMMARY.md) | Specs, roadmaps, architecture |
| [`apps/mobile/`](apps/mobile/) | React Native app · Screens, themes, UI |
| [`packages/engine/`](packages/engine/) | Game math · XP tables, tick system, actions |
| [`index.html`](index.html) | Landing site · Deployed to [GitHub Pages](https://otterdays.github.io/GAME-Arteria) |

---

## 🏗️ Quick Start

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

<div align="center">

**[📖 Full Roadmap](DOCU/ROADMAP.md)** · Built with 💜 by [Otterdays](https://github.com/Otterdays)

</div>
