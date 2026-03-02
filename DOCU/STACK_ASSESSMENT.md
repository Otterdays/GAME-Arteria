# ARTERIA — STACK ASSESSMENT & TECH FORECAST

> [!NOTE]
> **ATTENTION:** This document details the current state of Arteria's technology stack and its viability for future phases. It also lists planned future dependencies to support expanded game systems.
> **Date Assessed:** 2026-03-02

---

## 🏗️ Current Architecture Snapshot

Arteria is built on a highly modern, bleeding-edge monorepo setup utilizing npm workspaces to separate the native frontend (`apps/mobile`) and the pure-logic game engine (`packages/engine`).

### Core Versions (As of v0.2.6)
- **Framework:** Expo SDK 55.0.0 (Cutting-edge / Pre-release profile)
- **React Native:** 0.83.2 (New Architecture enabled natively by default)
- **React:** 19.2.4
- **Routing:** expo-router `~55.0.0`
- **TypeScript:** `~5.9.2`

### The Engine (`@arteria/engine`)
- **Nature:** Pure, headless TypeScript math and logic package.
- **Testing:** 100% Jest (`^29.7.0`).
- **Purpose:** Handles the TickSystem, XP calculations, Narrative logic, and Offline Catchup Delta processing completely isolated from React.

### State & Storage
- **State Management:** `@reduxjs/toolkit` (`^2.11.2`) married with `react-redux` (`^9.2.0`). This drives the main `gameSlice`.
- **Persistence:** `react-native-mmkv` (`^4.1.2`). Ultra-fast, synchronous C++ key-value storage used to snapshot Redux state on `AppState` background events.

### UI & Aesthetics
- **Core Components:** React Native standard components (`View`, `Text`, `Pressable`).
- **Icons:** `@expo/vector-icons` (`^15.0.0`), specifically leveraging `MaterialCommunityIcons` for game stylings.
- **Animations:** `react-native-reanimated` (`~4.2.1`) and `react-native-worklets` (`^0.7.4`) to support 60-120fps UI Thread animations (like the floating XP ticks and progress bars) without blocking the JS thread.
- **Haptics:** `expo-haptics` (`~55.0.0`) for immersive "heartbeat" feedback.

---

## 🛡️ Viability & Upgrade Path

**Can the current stack be upgraded?**
No. Arteria is operating significantly ahead of the standard production curve. Pushing React to canary builds or forcing unrecognized RN versions would destabilize the `expo-router` file-based navigation. The current version matrix is extremely stable and requires no immediate migrations. Technical debt on the framework level is effectively zero.

---

## 🔮 Future Dependencies (The Forecast)

As Arteria moves toward Phase 3 (Crafting Engine), Phase 4 (Combat), and Phase 7 (Economy/Launch), the mobile app will require additional capabilities. Based on the Master Roadmap, here are the projected dependencies:

### 1. The Audio Engine: `expo-av`
**Why:** The roadmap demands "Juice" and "Contextual Ambience" (e.g., the rhythmic clinking of a forge, sword clashes in Combat). `expo-av` is the Expo standard for playing low-latency sound effects and looping background music without blocking the main thread.

### 2. Background Engagement: `expo-notifications`
**Why:** Arteria handles offline progress perfectly via time-delta calculations on foregrounding. However, players currently must guess when their 24h F2P cap is reached or when their upcoming Crafting Queue finishes. `expo-notifications` will allow the engine to confidently schedule localized push notifications without a backend server.

### 3. Anti-Cheat & Premium Data: `expo-secure-store`
**Why:** Moving to Phase 7 introduces the Lumina currency and Patron status. Saving these sensitive flags directly into the plaintext `mmkv` exposes them to localized save editors. `expo-secure-store` encrypts values directly to the iOS Keychain or Android Keystore to deter casual tampering.

### 4. High-Performance State Migration: `@legendapp/state`
**Why:** Redux Toolkit handles the current gathering state effortlessly. However, Idle games are incredibly CPU-heavy. Eventually, in Phase 4 (Combat) where thousands of hits, HP regeneration, and buffs are ticking simultaneously, React's traditional render cycle might bottleneck. If the render ceiling is hit, `Legend-State` provides an observable-based system that bypasses React reconciliation entirely, mutating the DOM directly for maximum frame rates.

### 5. Runtime Data Validation: `zod`
**Why:** The `ALL_QUESTS`, `DIALOGUES`, and `MINING_NODES` maps are growing in complexity. Manually typing complex conditional `NarrativeRequirement` structures makes the engine prone to human error (e.g. typos in item ID requirements). Zod would allow the engine to validate JSON/data tables at startup, preventing cascading game crashes.

### 6. Background Activity: `expo-task-manager` / `expo-background-fetch`
**Why:** If the game later requires syncing multiplayer guild data or fetching daily radiant quests natively while the app is completely closed, basic background fetch capabilities will be required.

---
**Conclusion:** The `@arteria/engine` must remain completely pristine and free of React Native dependencies. Any tools listed above MUST be installed directly into the `apps/mobile` workspace, allowing the game engine to stay headless, fast, and 100% unit-testable.
