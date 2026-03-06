<p align="center">
  <img src="https://img.shields.io/badge/Arteria-0.5.1-8b5cf6?style=for-the-badge&labelColor=0a0b0f" alt="Version" />
  <img src="https://img.shields.io/badge/Expo-SDK_55-000020?style=for-the-badge&logo=expo&logoColor=fff" alt="Expo" />
  <img src="https://img.shields.io/badge/React_Native-0.83-61dafb?style=for-the-badge&logo=react&logoColor=fff" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=fff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=fff" alt="Redux" />
  <img src="https://img.shields.io/badge/MMKV-v4_C%2B%2B-f97316?style=for-the-badge" alt="MMKV" />
  <img src="https://img.shields.io/badge/OTA-EAS_Updates-0ea5e9?style=for-the-badge&logo=expo&logoColor=fff" alt="OTA" />
  <img src="https://img.shields.io/badge/Tests-25_Passing-22c55e?style=for-the-badge" alt="Tests" />
  <img src="https://img.shields.io/badge/License-MIT-64748b?style=for-the-badge" alt="License" />
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
| **⛏️ Skills** | 10 active: Mining, Logging, Fishing, Runecrafting, Cooking, Smithing, Forging, Harvesting, Scavenging, Herblore |
| **🔮 Coming Soon Skills** | Leadership, Adventure, Dungeon Dwelling, Construction, Fletching, Tailoring, Thieving |
| **🙏 Prayer** | 12 unlockable prayers (Lv.1–60) · Bone burying grants XP · Combat drain mechanic |
| **🗺️ World** | 6 Explorable Locations · NPCs & Shops · Instant Travel |
| **⚔️ Combat** | Auto-battler · 4 zones · Equipment loadouts · Combat styles (Controlled/Aggressive/Defensive/Accurate) |
| **📜 Quests** | 18 story quests across Act I & II · 30 daily quest templates · All-time completion tracker |
| **🏦 Systems** | OSRS-Style Bank Tabs · Multi-pillar Mastery · Lumina Shop · Theme Engine (4 themes) |
| **🏅 Achievements** | 16 reactive milestones (Head Chef, Void Walker, Death Defier, and more) |
| **💬 NPCs** | Nick, Bianca the Herbalist, Kate the Traveler · Branching dialogue engine |
| **🎲 Random Events** | Blibbertooth's Blessing, Cosmic Sneeze, Genie's Gift, Treasure Chest, Lucky Strike |
| **🐾 Skill Pets** | Rare pet drops per skill · Equip in Settings → Pets |
| **🔊 Audio** | Per-skill tick SFX (tink/thump/splash) · Idle Soundscapes |

---

## 🚀 Latest — v0.5.1 "Director's Cut Remix - Alpha"

| System | Details |
|---------|---|
| **⚔️ Combat Alpha** | Full auto-battler engine! 4 combat zones, loadouts, 12 unlockable Prayers, and active enemy bestiary drops. |
| **🗺️ World Exploration** | Interactive World Map with 6 unique locations (Frostvale, etc.) enabling instant travel & NPC interactions. |
| **🪴 Expanded Gathering** | Harvesting (flora), Scavenging (ruins), and Herblore (potions, vials). |
| **🏦 OSRS Bank Redux** | Main tab + up to 6 custom tabs. Drag & drop, emoji mapping, type filters, and memory tracking. |
| **✨ Arteria Depth System**| Multi-layered UI depth (Subtle, Medium, Elevated, Deep) applied across glassmorphism panels and nodes. |

---

## ⚙️ The Arteria Program Stack

Arteria operates on a strictly decoupled architecture, isolating heavy progression math from the React Native view layer.

| Subsystem | Tech / Role |
|-------|------|
| **`arteria-game-engine`** | **Pure TypeScript** · Headless math. XP tables, loop logic, and deterministic rolls. 100% Jest-tested. |
| **`arteria-tick-orchestrator`**| **Game Loop** · Delta-time tick processor running at 100ms for skilling and auto-battler loops. |
| **`arteria-state`** | **Redux Toolkit 2.11** · Unified single source of truth for inventory, skills, and combat. Typed hooks. |
| **`arteria-persist`** | **MMKV v4** · Lightning-fast synchronous C++ persistence syncing Redux snapshots to local storage. |
| **`arteria-ui`** | **React Native 0.83 + Expo 55** · New Architecture, glassmorphism, Reanimated 4, and Expo Router. |

---

## 📁 Repo Structure

| Path | Purpose |
|------|---------|
| `DOCU/` | All specs, design docs, architecture, and roadmaps |
| `DOCU/TECHNICAL_USER_MANUAL.md` | Engine taxonomy — the 11 named Arteria subsystems |
| `DOCU/MASTER_DESIGN_DOC.md` | Full GDD: 7 Parts, 21 Chapters, complete world & skills design |
| `DOCU/CHANGELOG.md` | Version history (Keep a Changelog format) |
| `DOCU/ROADMAP.md` | Phased development milestones (Phases 0–9+) |
| `apps/mobile/` | React Native app · Screens, themes, components |
| `apps/mobile/constants/` | Game data: skills, items, enemies, quests, patches, prayers |
| `apps/mobile/store/` | Redux gameSlice · All reducers and selectors |
| `apps/mobile/hooks/` | `useGameLoop`, `usePersistence`, `useAchievements` |
| `packages/engine/` | Headless game math · XPTable, TickSystem, GameEngine |
| `index.html` | Landing site · [GitHub Pages](https://otterdays.github.io/GAME-Arteria) |
| `wiki.html` | Interactive skill wiki with node explorer |

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

**OTA Update (push without rebuild):**
```bash
3_Send_OTA_Update.bat
# Pushes JS bundle over-the-air via EAS — no APK rebuild needed
```

---

<p align="center">
  <sub>Built with 💜 by <a href="https://github.com/Otterdays">Otterdays</a></sub>
</p>
