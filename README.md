<div align="center">

# 🌌 Arteria
### A Cosmic Idle RPG — Built for the Modern Mobile Era

**Train skills. Gather resources. Fight monsters. Even while you sleep.**

[**Live Landing Page ↗**](https://otterdays.github.io/GAME-Arteria) • [**Documentation Index ↗**](DOCU/SUMMARY.md) • [**Roadmap ↗**](DOCU/ROADMAP.md)

---

[![v0.4.5](https://img.shields.io/badge/Version-0.4.5-8b5cf6?style=for-the-badge)](https://github.com/Otterdays/GAME-Arteria/releases)
[![Build Status](https://img.shields.io/badge/Build-Success-22c55e?style=for-the-badge)](https://github.com/Otterdays/GAME-Arteria)
[![Tests](https://img.shields.io/badge/Tests-30+_Passing-f59e0b?style=for-the-badge)](https://github.com/Otterdays/GAME-Arteria/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-38bdf8?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

> [!CAUTION]
> **DEVELOPER MANDATE:** Do NOT remove or delete existing texts, updates, docs, or project history in this repository. Arteria is a living chronicle. Only append, compact, or update status.

---

## ✨ What is Arteria?

Arteria is a hard-math, incremental idle RPG inspired by the deep progression systems of **Melvor Idle** and the timeless charm of **RuneScape**. Designed from the ground up for **React Native (Expo)**, it features a modular engine architecture that separates game logic from the UI.

### 🎯 Key Pillars
| 🌱 **Persistence** | ⛏️ **Progression** | ⚔️ **Combat** |
| :--- | :--- | :--- |
| **Offline Progression** with a 24h cap. The engine calculates your gains while you sleep, study, or work. | **25 Skills** across 4 logical pillars: Gathering, Combat, Crafting, and Support. | **Auto-Combat** vs 12 eldritch factions. Passive grinding or active bossing. |

---

## 🚀 The Latest: v0.4.5 "Horizon & Mechanics"

This update adds long-term depth and premium visuals to the core gameplay:
*   **Horizon System:** A 3-tier goal HUD (Immediate / Session / Grind) for persistent micro-goal tracking.
*   **Unique Gathering Mechanics:** Rare gems (Mining), Mythic fish (Fishing), and Seasonal Rotation (Logging).
*   **Premium HUD Styling:** Integrated glassmorphism and custom gradients.
*   **Local APK Fix:** Improved build pipeline to generate shareable APKs without a connected device.

---

## 🛠️ The Cosmic Stack

Arteria uses a production-grade monorepo structure with modern developer ergonomics.

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Logic** | `Pure TypeScript Engine` | Headless-ready, 100% testable game math. |
| **Runtime** | `Expo SDK 55` | The gold standard for modern RN apps. |
| **State** | `Redux Toolkit` | Single source of truth with RTK Query and Slice patterns. |
| **Storage** | `MMKV v4` | High-speed C++ synchronous storage for consistent saving. |
| **Nav** | `Expo Router v6` | File-based navigation for clean, native-feel routing. |

---

## 📂 Project Navigation

The repository is built on a **Modular Monorepo** architecture.

*   📂 [**`DOCU/`**](DOCU/SUMMARY.md) — The brain. All specifications, roadmaps, and architecture logs.
*   📂 [**`apps/mobile/`**](apps/mobile/) — The React Native interface, themes, and screen layouts.
*   📂 [**`packages/engine/`**](packages/engine/) — The math. XP tables, tick systems, and core game loops.
*   📂 [**`docs/`**](docs/) — The landing site. Deployed to [GitHub Pages](https://otterdays.github.io/GAME-Arteria).

---

## 🏗️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [Android Studio](https://developer.android.com/studio) (for local native builds)

### 2. Installation
```bash
npm install
```

### 3. Local Development (Android)
To run with our custom local pipeline (bypassing EAS limits):
```bash
./1_Run_Local_Android_Build.bat
```

### 4. Running Tests
```bash
npm test
```

---

<div align="center">

**[View full Roadmap in DOCU/ROADMAP.md](DOCU/ROADMAP.md)**

Built with 💜 by [Otterdays](https://github.com/Otterdays)

</div>
