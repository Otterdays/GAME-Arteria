# THE TRUTH DOCTRINE

> [!CAUTION]
> **DEVELOPER MANDATE:** This is the ultimate source of truth for Aetheria (Arteria). It acts as the soul of the game and the guiding directive for all human and AI agents working on this project. Do NOT contradict these core principles.

## I. CORE PHILOSOPHY & BEHAVIORAL PROTOCOLS

**1. The "Game Developer" Mindset:** Priority is always UX and player empathy.
**2. The Triad of Code:**
   - **KISS**: Keep It Simple, Stupid.
   - **DOTI**: Don't Over-Think It.
   - **YAGNI**: You Aren't Gonna Need It. Do not build phantom features "just in case."
**3. The Immutable Chronicle:** Never delete history in the documentation files (especially `ROADMAP.md` and `SCRATCHPAD.md`). Arteria is a living chronicle. Only append, compact, or update status. 
**4. Windows-First Tooling:** All terminal commands and file paths must remain compatible with the Windows OS environment.
**5. Update Maintenance:** Make sure to keep the website updated periodically, and to update the in-app update board.

---

## II. THE SOUL OF THE GAME: AETHERIA

**The Identity:** A cosmic fantasy, math-heavy incremental idle RPG. It blends bright magical wonder (Luminar) with eldritch dark fantasy (Voidmire), all underlined by a comedic absurdity known as "The Great Joke" (the universe was sneezed out by Blibbertooth the Unserious).
**The Protagonist:** You are an "Anchor"—a heavily-souled individual immune to the "Unraveling". Not a chosen one, just someone who attracts bizarre coincidences.
**The "Next Big Thing" Loop:** The UI highlights 3 horizons to ensure constant micro-goals that keep players hooked without predatory monetization:
   - *Immediate (0-15m):* Crafting completion, node depletion.
   - *Session (15h-2h):* Levelling up to unlock a new tier, unlocking a tooltip.
   - *Grind (Daily/Weekly):* Logging's weekly yield, milestone targets, dungeon clears.

**Monetization Strategy:** Contextual. F2P players get an 8h/24h offline progression cap. Premium "Lumina" currency buys cosmetics, bank expansions, and offline caps, but *never raw power*.

---

## III. THE 5 PILLARS OF PROGRESSION

The gameplay revolves around 5 interconnected pillars (25 skills total):
1. **Gathering (The Foundation):** Harvesting, Mining, Logging, Fishing, Scavenging. Features unique mechanics like seasonal rotations and "Mythic" drops.
2. **Crafting (The Engine):** Smithing, Tailoring, Alchemy, Runecrafting, Cooking, Construction, Fletching. The bridge between inputs and combat outputs.
3. **Combat (The Clash):** Attack, Strength, Defense, Ranged, Magic, Constitution. Instance-based mechanics (Delves, Expeditions, Raids) against 12 enemy factions with an AI headless cruncher for offline combat (at 70% efficiency).
4. **Support (The Connective Tissue):** Exploration, Cleansing, Barter, Leadership, Research.
5. **Cosmic (The Endgame):** Aether Weaving, Void Walking, Celestial Binding, Chronomancy.

---

## IV. DOCUMENTATION ARCHITECTURE

The repository uses the `DOCU/` folder as its brain. When auditing or working, refer to these specific artifacts:
- **`SUMMARY.md`**: High-level project state and documentation index.
- **`ROADMAP.md`**: The Master Phased Plan (Phases 0 to 9+). NEVER shrink it.
- **`MASTER_DESIGN_DOC.md`**: Deep lore, exact skill mechanics, questlines, and monetization details.
- **`ARCHITECTURE.md`**: Technical scaffolding, data flows, and state management notes.
- **`SCRATCHPAD.md`**: Active memory and current tasks. Compact at 500 lines to preserve history.
- **`My_Thoughts.md`**: A developer log detailing "Aha!" moments, UX shifts, and structural pivots.
- **`SBOM.md`**: Security Bill of Materials tracker.
- **`README.md`**: The player-facing landing narrative.

---

## V. TECHNICAL DOCTRINE & APK PIPELINE

Arteria uses a **Modular Monorepo** architecture running on **Expo SDK 55 (New Architecture mandatory)**.

**Tech Stack:**
- **Language**: TypeScript 5.9 (Strict).
- **Engine**: Headless `packages/engine/` using `TickSystem.ts` and `GameEngine.ts` for offline/realtime calculation.
- **State**: Redux Toolkit + MMKV v4 synchronously capturing state changes.
- **Navigation**: Expo Router v6 (at `apps/mobile/app`).
- **Logic**: A foreground `setInterval` at ~100ms processes real-time ticks. An `AppState` listener triggers offline differential calculations (`Date.now() - timestamp`), applying up to a 24h offline cap limit.

**Build Pipelines (EAS vs Local):**
- **EAS Cloud**: Used for overarching updates (`Update_2_EAS_OTA_Update.bat`) and final Production AABs.
- **Local APK Build Pipeline (The Truth)**: Due to cloud queue times, the local APK build was instituted. Run via `2_Build_APK_Local.bat`. This process runs `gradlew assembleRelease` directly inside `apps/mobile/android/` *without requiring a connected device*. The root `index.js` correctly redirects metro to `apps/mobile/index.js`.
   - **Output Location**: `apps\mobile\android\app\build\outputs\apk\release\app-release.apk`

---

## VI. FUTURE PROSPECTS

**We are currently pushing from Phase 2.2 (Horizon & Mechanics Polish) toward Phase 3 (The Crafting Engine).**
Always prioritize the immediate roadmap phase while keeping the architecture scalable for Phase 4 (Combat) and beyond. Do not build features designated for Phase 8+ "just in case" (YAGNI). Keep the engine headless, the UI styled beautifully with dark Melvor glassmorphism, and the progression math flawless.
