<p align="center">
  <img src="https://img.shields.io/badge/Arteria-0.6.0-8b5cf6?style=for-the-badge&labelColor=0a0b0f" alt="Version" />
  <img src="https://img.shields.io/badge/Expo-SDK_55-000020?style=for-the-badge&logo=expo&logoColor=fff" alt="Expo" />
  <img src="https://img.shields.io/badge/React_Native-0.83-61dafb?style=for-the-badge&logo=react&logoColor=fff" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=fff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=fff" alt="Redux" />
  <img src="https://img.shields.io/badge/MMKV-v4_C%2B%2B-f97316?style=for-the-badge" alt="MMKV" />
  <img src="https://img.shields.io/badge/OTA-EAS_Updates-0ea5e9?style=for-the-badge&logo=expo&logoColor=fff" alt="OTA" />
  <img src="https://img.shields.io/badge/License-MIT-64748b?style=for-the-badge" alt="License" />
</p>

<h1 align="center">Arteria</h1>
<p align="center">
  <strong>The Idle RPG</strong> — Train skills. Gather resources. Progress while you sleep.
</p>

<p align="center">
  <a href="https://otterdays.github.io/GAME-Arteria">🌐 Live Site</a> ·
  <a href="DOCU/SUMMARY.md">📚 Docs</a> (index, catalogs, checklists) ·
  <a href="DOCU/ROADMAP.md">🗺️ Roadmap</a> ·
  <a href="https://github.com/Otterdays/GAME-Arteria/releases">📦 Releases</a>
</p>

---

## 📚 Source of Truth

For the definitive game design, philosophy, and architecture:

- **[TRUTH_DOCTRINE.md](DOCU/TRUTH_DOCTRINE.md)** — Core philosophy, behavioral protocols, and developer mandates.
- **[MASTER_DESIGN_DOC.md](DOCU/MASTER_DESIGN_DOC.md)** — Complete GDD: skills, systems, mechanics, lore, and monetization.

All other documentation derives from these two sources.

---

## What is Arteria?

A **cosmic idle RPG** inspired by **Melvor Idle** and **RuneScape**. Built for **React Native (Expo)** with a headless TypeScript engine — zero UI coupling, 100% testable game logic.

| | |
|:---:|:---|
| **🌙 Offline** | 24h progression cap (F2P) · 7-day cap (Patron) |
| **⛏️ Skills** | 24+ implemented: Mining, Logging, Fishing, Runecrafting, Cooking, Smithing, Forging, Harvesting, Scavenging, Herblore, Crafting, Firemaking, Woodworking, Astrology, Thieving, Agility, Farming, Resonance, Exploration, Wizardry, Sorcery, Leadership, Summoning, Slayer |
| **🗺️ World** | 6 explorable locations · Exploration skill gates unlocks · Instant travel |
| **⚔️ Combat** | Auto-battler · 4 zones · Equipment loadouts · Prayers |
| **📜 Quests** | 18 story quests · 30 daily quest templates · All-time tracker |
| **🏦 Systems** | OSRS-style Bank · Multi-pillar Mastery · Lumina Shop · 4 themes |
| **🏅 Achievements** | 16 reactive milestones |
| **💬 NPCs** | Branching dialogue engine |
| **🎲 Random Events** | Blibbertooth, Cosmic Sneeze, Genie, Treasure, Lucky Strike |
| **🐾 Skill Pets** | Rare drops per skill |
| **🔊 Audio** | Per-skill SFX · Idle soundscapes |

---

## 🚀 Latest — v0.6.0 "The Ascended Master"

| System | Details |
|--------|---------|
| **🗺️ Exploration** | Survey routes, chart regions. 6 expeditions tied to world locations. Discovery items. World Map level gates. |
| **📜 Wizardry** | Study tomes and scrolls for XP. 3 nodes: Basic Scroll, Tome of the Void, Celestial Almanac. |
| **🪄 Sorcery** | Cast spells by consuming runes. Lumina Spark, Voidmire Bolt, Astral Storm. Runes from Runecrafting. |
| **〰️ Resonance** | Clicker skill. Multi-Pulse (Lv 20), Soul Cranking (Lv 60), Anchor Energy. Momentum → global Haste. |
| **🪵 Woodworking** | Flagship workbench UI. Logs → furniture, shields, staves. 5 recipes. |
| **🔥 Firemaking** | Burn logs for XP. 9 burn types. |
| **🌾 Farming** | Patch-based growth. 3 patches, 7 crops. |
| **🏠 Magic Hub** | Redesigned home screen. Pillar grouping, search bar, mastery badges. |

---

## ⚙️ The Arteria Program Stack

| Subsystem | Tech / Role |
|-----------|-------------|
| **arteria-game-engine** | Pure TypeScript · Headless math. XP tables, loop logic, deterministic rolls. |
| **arteria-tick-orchestrator** | Game loop · 100ms delta-time for skilling and combat. |
| **arteria-state** | Redux Toolkit 2.11 · Single source of truth. Typed hooks. |
| **arteria-persist** | MMKV v4 · Synchronous C++ persistence. |
| **arteria-ui** | React Native 0.83 + Expo 55 · New Architecture, glassmorphism, Reanimated 4. |

---

## 📁 Repo Structure

| Path | Purpose |
|------|---------|
| `DOCU/` | Specs, design docs, architecture, roadmaps |
| `DOCU/TECHNICAL_USER_MANUAL.md` | Engine taxonomy — Arteria subsystems |
| `DOCU/MASTER_DESIGN_DOC.md` | Full GDD: 7 Parts, 21 Chapters |
| `DOCU/CHANGELOG.md` | Version history |
| `DOCU/ROADMAP.md` | Phased milestones (Phases 0–9+) |
| `apps/mobile/` | React Native app |
| `apps/mobile/constants/` | Game data: skills, items, enemies, quests |
| `apps/mobile/store/` | Redux gameSlice |
| `apps/mobile/hooks/` | useGameLoop, usePersistence, useAchievements |
| `packages/engine/` | Headless game math |
| `index.html` | Landing site |

---

## ⚙️ Commands

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
```

---

<p align="center">
  <sub>Built with 💜 by <a href="https://github.com/Otterdays">Otterdays</a></sub>
</p>
