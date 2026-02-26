# SUMMARY

**Project:** Arteria — The AFK RPG
**Platform:** Modern Android (React Native via Expo SDK 54)
**Timeline Base:** February 26, 2026

**Overview:**
A math-heavy, passive progression RPG without real-time action gameplay. The core loops rely heavily on state management, background calculation of offline progress, and optimizing "Ticks" for skills and combat. Inspired by Melvor Idle.

**Current Status (Phase 2):**
- Engine package complete (XP curves, TickSystem, GameEngine, offline/realtime processing).
- Redux store fully wired with gameSlice (skills, inventory, gold, active actions).
- All 5 tab screens built (Skills, Combat, Bank, Shop, Settings) with dark Melvor theme.
- Monorepo metro/babel configs fixed for Expo Router compatibility.
- EAS configured for cloud builds; Development Client APK built successfully.
- Batch scripts created for all deployment workflows (Git, OTA, Dev Build, Prod Build).
- Dev server confirmed booting cleanly with zero crashes.

**Next Steps:**
- Wire real-time tick loop (setInterval → engine.processRealtime → Redux dispatch).
- Implement MMKV save/load persistence.
- Add skill detail screens (mine-specific ores within mining).
