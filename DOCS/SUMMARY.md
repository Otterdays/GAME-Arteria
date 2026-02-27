# SUMMARY

**Project:** Arteria — The AFK RPG
**Platform:** Modern Android (React Native via Expo SDK 54)
**Timeline Base:** February 26, 2026

**Overview:**
A math-heavy, passive progression RPG without real-time action gameplay. The core loops rely heavily on state management, background calculation of offline progress, and optimizing "Ticks" for skills and combat. Inspired by Melvor Idle.

**Current Status (Phase 1.1 Complete):**
- Engine package complete (XP curves, TickSystem, GameEngine, offline/realtime processing) and unit tested via Jest.
- Local Android native build pipeline established over USB debugging to bypass EAS concurrency limits.
- MMKV v4 save/load state wired to React Native `AppState`.
- Real-time tick loop and 24-hour capped Offline catchup functioning.
- Redux store fully wired with gameSlice (skills, inventory, gold, active actions).
- All 5 tab screens built (Skills, Combat, Bank, Shop, Settings) with dark Melvor theme.

**Next Steps (Phase 1.2):**
- Expand Mining skill logic (Copper, Iron, Silver, Gold node definitions).
- Hook actual ore gathering loop to fill Redux inventory/Bank UI.
