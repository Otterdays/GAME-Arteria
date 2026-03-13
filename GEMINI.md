# Arteria Development Guidelines

## Project Overview

**Arteria (Aetheria)** is a math-heavy, cosmic fantasy incremental idle RPG inspired by Melvor Idle and RuneScape. It is built as a modular monorepo tailored for Android. The project enforces a strict separation between a headless, pure-TypeScript math engine and a React Native presentation layer.

**Core Technologies:**
*   **Framework:** React Native 0.83 + Expo SDK 55 (New Architecture mandatory)
*   **Language:** TypeScript 5.9 (Strict mode)
*   **State Management:** Redux Toolkit 2.11
*   **Persistence:** MMKV v4 (Synchronous C++ local storage)
*   **Routing:** Expo Router v6
*   **Testing:** Jest (100% test coverage for game logic)

**Project Structure:**
*   `apps/mobile/`: The React Native application, containing UI, Expo Router navigation, themes, components, and Redux state configuration (`store/`).
*   `packages/engine/`: The headless math engine responsible for calculating ticks, XP tables, offline differential math, and deterministic rolls.
*   `DOCU/`: The central brain for the project's design docs, architecture, roadmap, and active developer memory.

## Building and Running

The repository makes extensive use of Windows `.bat` scripts to orchestrate processes.

*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Start Development Server:**
    ```bash
    # Starts the Metro bundler for the Expo app
    0_Start_Dev_Server.bat
    # Alternatively via npm:
    npm run mobile
    ```
*   **Local Android Build (APK):**
    ```bash
    # Runs gradlew assembleRelease within the mobile Android folder
    2_Build_APK_Local.bat
    ```
*   **Run Tests:**
    ```bash
    npm test
    npm run test:coverage
    ```
*   **Over-The-Air (OTA) Update:**
    ```bash
    Update_2_EAS_OTA_Update.bat
    ```

## Development Conventions

### The Core Philosophy (Triad of Code)
1.  **KISS:** Keep It Simple, Stupid.
2.  **DOTI:** Don't Over-Think It.
3.  **YAGNI:** You Aren't Gonna Need It. Do not build phantom features designated for future phases "just in case." Keep current scope tightly bound to the current phase.

### Documentation & Memory
The `DOCU/` directory is strictly maintained to preserve project history.
*   **NEVER delete history** in documentation files. Append, compact, or update status only.
*   `DOCU/TRUTH_DOCTRINE.md`: The ultimate source of truth for lore, mechanics, and design philosophies.
*   `DOCU/MASTER_DESIGN_DOC.md`: Comprehensive game design details.
*   `DOCU/ROADMAP.md`: The phased development milestones. Never shrink it.
*   `DOCU/SCRATCHPAD.md`: Active memory and current tasks. (Compact around 500 lines).
*   `DOCU/My_Thoughts.md`: Developer log for structural pivots and architectural "Aha!" moments.

### Architecture Rules
*   **Strict Decoupling:** Heavy progression math and loops MUST remain in `packages/engine/` and remain 100% UI-agnostic. 
*   **Testing:** The core game engine requires 100% Jest test coverage.
*   **UI / Styling:** Target a "dark Melvor glassmorphism" style. Keep the UI visually appealing while maintaining high performance. 
*   **Offline Support:** Gameplay relies on a robust differential calculation system relying on timestamps vs. real-time interval ticks at ~100ms. Keep calculations deterministic.
*   **Windows First Tooling:** Ensure any added terminal commands and file paths are fully compatible with Windows OS.