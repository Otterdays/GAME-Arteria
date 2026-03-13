# Clicker Design Document — Resonance & The Crossover Ecosystem

> **Purpose:** Authoritative design, styling, tech, and direction for the clicker-style subsystem in Arteria. This doc sits within the broader **crossover ecosystem** (one game: idle RPG + clicker + world builder).  
> **Source of truth:** MASTER_DESIGN_DOC.md §1.3 (Crossover Ecosystem); click_idea.md (Resonance concept); click_idea_2.md (Option A recommendation).  
> **Last updated:** 2026-03-07 (Multi-Pulse, Soul Cranking, Anchor Energy implemented; CLICKER_CHECKLIST.md added)  
> **Live checklist:** See [CLICKER_CHECKLIST.md](CLICKER_CHECKLIST.md) for implemented vs planned features.

---

## 1. Design

### 1.1 Vision

The clicker in Arteria is **not a separate game**. It is a **Support-pillar skill (Resonance)** that lets active players "pulse" their cosmic weight to **speed up the rest of the game**. Tapping builds **Momentum**; Momentum applies **global Haste** to every other skill and combat. The fantasy: *you are the Anchor—the gravitational center that makes the world move. When you pulse, time in Valdoria flows faster.*

- **Synergy, not replacement:** Idle remains the core. The clicker rewards active play by letting players "pump" the engine for faster results.
- **Crossover purpose:** Clicker output (Momentum, and optionally future Aether/Sparks) feeds the main RPG (haste, temporary buffs) and can later fuel the **Sanctum** (world builder) or Lumina-like shop.

### 1.2 Core Loop

1. Player opens **Resonance** tab (or enters via Skills grid / Hub).
2. **Tap the Orb** → gain Resonance XP + add to **Momentum** (0–100%).
3. **Momentum** decays over time (e.g. −2% per second) unless the player returns to pulse.
4. While Momentum > 0, **all other skills and combat** run faster (e.g. at 100% Momentum, ~50% faster).
5. **Level unlocks** improve efficiency: more momentum/XP per tap (Resonant Echo), passive momentum from other skills (Kinetic Feedback), and at 99 Momentum never decays below 25% (Perfect Stability).

### 1.3 Resonance as a Skill

Resonance is implemented as a **first-class skill** (same XP table, level 1–99, level-up toasts, Skills grid, quick-switch):

- **Pillar:** Support.
- **No "action node" in the classic sense:** Progression is via **taps** (and passive Kinetic Feedback at Lv 80), not via a tick-based gathering/crafting action.
- **Level unlocks** (see constants/resonance.ts and in-game Unlocks list):
  - **Lv 20 — Multi-Pulse:** Multi-finger tapping (up to 4) for rapid Momentum (future).
  - **Lv 40 — Resonant Echo:** +50% Momentum and XP per tap.
  - **Lv 60 — Soul Cranking:** Heavy Pulse (long press) for large Momentum at cost of "Anchor Energy" (future).
  - **Lv 80 — Kinetic Feedback:** 10% chance per successful tick in *other* skills to grant +1% Momentum.
  - **Lv 99 — Perfect Stability:** Momentum floor 25% (permanent 12.5% speed boost).

### 1.4 Crossover Integration (Current & Planned)

| From clicker | Into main game / Sanctum |
|--------------|---------------------------|
| **Momentum** (live) | Global Haste: tick interval divided by `(1 + momentum/200)` so all skilling/combat runs faster. |
| **Resonance XP/level** (live) | Level-up toasts, Skills grid, Total Level; unlocks improve tap efficiency and Momentum floor. |
| **Aether / Sparks** (optional future) | Spend on temporary buffs (+% XP, drop rate), Sanctum fuel (speed building/vibes), or Lumina-like shop. |

**Design principle:** Caps or rest-based limits (e.g. Aether per day, Sanctum rest once per 12h) keep the idle RPG as the core and clicker as complementary.

---

## 2. Layout

### 2.1 Screen Structure (Resonance Tab)

- **Header:** Title "Resonance", subtitle "The Pulse — steady the flow of time."
- **Orb section (primary CTA):**
  - Large, central **tappable orb** (circle). Size responsive (e.g. min of 50% viewport width and 200px).
  - Orb: outer ring (border + glow), inner fill with emoji/label "Pulse".
  - Hint text below: "Tap to build Momentum • +X% momentum, +Y XP" (values from level/unlocks).
- **Momentum section:**
  - Label "Momentum".
  - **Progress bar** 0–100% (fill color: theme `skillResonance`).
  - Subtext: current % and "Decays over time — pulse to maintain".
  - If Momentum > 0: "All other skills run Z% faster".
- **Level section:**
  - Level, current XP / next-level XP (or "—" at 99).
  - XP progress bar to next level (when level < 99).
- **Unlocks section:**
  - List of level unlocks (from RESONANCE_UNLOCKS). Each row: level, name, effect, locked/unlocked state (checkmark when unlocked).

### 2.2 Entry Points

- **Dedicated tab** in the bottom tab bar ("Resonance", pulse icon).
- **Hub (Home):** Card "Resonance — Pulse the orb, haste the world" → navigates to Resonance tab.
- **Skills screen:** Resonance appears in Support pillar; tap → navigate to `/(tabs)/resonance` (not a separate skill sub-screen).

---

## 3. Styling

### 3.1 Theme & Tokens

- **Skill color:** `palette.skillResonance` (e.g. `#a78bfa` in dark theme). Used for orb border/glow, momentum bar fill, XP bar, unlock accents.
- **Backgrounds:** Standard `bgApp`, `bgCard`; orb inner uses `bgApp` for contrast.
- **Text:** `textPrimary`, `textSecondary`, `textMuted` for labels and hints; `gold` for level badges if desired.

### 3.2 Orb

- **Shape:** Circle (borderRadius = size/2).
- **Outer:** Border width 3, color `skillResonance`. Optional shadow: `shadowColor: skillResonance`, `shadowOpacity: 0.5`, `shadowRadius: 20`.
- **Inner:** Slightly smaller circle, `bgApp`, subtle border for depth.
- **Interaction:** Scale-down on press (e.g. 0.92) with Reanimated spring; release springs back to 1. **Haptic:** Medium impact on tap (respects Settings → Vibration).

### 3.3 Momentum & XP Bars

- **Momentum bar:** Height ~12px, rounded corners; background `bgInput`, fill `skillResonance`. Width = `(momentum / 100) * 100%`.
- **XP bar:** Thinner (e.g. 6px), same treatment for level progress.

### 3.4 Typography

- **Title:** Cinzel Bold, larger size (e.g. 2xl), color `skillResonance`.
- **Unlocks:** Level badge (e.g. "Lv20") in `gold`; label primary text; effect secondary/small.

### 3.5 Haptics & Motion

- **Tap:** `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` on each pulse (when vibration enabled).
- **Orb:** Reanimated `useSharedValue` + `withSpring` for scale (press 0.92, release 1). No separate "clicker" sound by default; can reuse or add light SFX later.

---

## 4. Tech

### 4.1 State (Redux)

- **PlayerState:**
  - `player.skills.resonance`: standard `SkillState` (id, xp, level, mastery).
  - `player.momentum`: number 0–100 (persisted with save).
  - `player.anchorEnergy`: number 0–50 (persisted). Earned from non-Resonance skilling (1/min); consumed by Soul Cranking (5 per Heavy Pulse).
- **Actions:**
  - `pulseResonance({ xpGain, momentumGain })`: add XP (and level-up if threshold crossed; push to levelUpQueue), add momentum (capped at 100).
  - `heavyPulseResonance()`: Soul Cranking (Lv 60+). Consumes 5 Anchor Energy; grants +20% Momentum, 40 XP.
  - `addAnchorEnergy(amount)`: add Anchor Energy (capped at 50). Dispatched from useGameLoop when non-Resonance skill ticks process.
  - `decayMomentum({ deltaSeconds })`: subtract `deltaSeconds * MOMENTUM_DECAY_PER_SECOND`; at Lv 99 apply floor 25%.

### 4.2 Game Loop (useGameLoop)

- **Haste:** When processing skilling/combat ticks, effective interval =  
  `baseInterval / (speedMult * itemMasterySpeed * getHasteMultiplier(momentum))`.  
  `getHasteMultiplier(momentum)` returns `1 + (momentum/100) * 0.5` (so 100% momentum ⇒ 1.5× speed).
- **Decay:** Every loop tick (~100ms), dispatch `decayMomentum({ deltaSeconds: delta/1000 })`.
- **Kinetic Feedback (Lv 80):** In the same tick processing, when a *non*-Resonance skill has successful ticks, for each tick roll 10% chance and dispatch `pulseResonance({ xpGain: 0, momentumGain: 1 })` (batched per processDelta).

### 4.3 Constants (resonance.ts)

- `RESONANCE_XP_PER_TAP`, `MOMENTUM_PER_TAP_BASE`, `MOMENTUM_CAP`, `MOMENTUM_DECAY_PER_SECOND`, `HASTE_MULTIPLIER_AT_FULL`, `PERFECT_STABILITY_FLOOR`.
- `ANCHOR_ENERGY_CAP` (50), `ANCHOR_ENERGY_PER_MINUTE` (1), `SOUL_CRANKING_ENERGY_COST` (5), `SOUL_CRANKING_MOMENTUM_GAIN` (20), `SOUL_CRANKING_XP_GAIN` (40).
- `RESONANCE_UNLOCKS`: array of { level, id, label, effect }.
- Helpers: `getMomentumPerTap`, `getResonanceXpPerTap`, `getHasteMultiplier`, `getMultiPulseMultiplier(touchCount, level)`.

### 4.4 Navigation & Files

- **Screen:** `apps/mobile/app/(tabs)/resonance.tsx`.
- **Tab:** Registered in `(tabs)/_layout.tsx`; icon `waveform.circle.fill` → MaterialCommunityIcons `pulse`.
- **Skills:** Resonance in `constants/skills.ts` (SkillId, SKILL_META, IMPLEMENTED_SUPPORT_SKILLS); in `skillNavigation.ts` for quick-switch; in Skills pillar and `handleNavigate` to `/(tabs)/resonance`.

### 4.5 Offline / Persistence

- Momentum is saved with the rest of `PlayerState` (MMKV). It does *not* accrue offline; decay is only applied in the foreground loop. When the app was backgrounded, momentum is whatever it was at save time.

---

## 5. Direction

### 5.1 Chosen Path: Option A (One Game, Two Subsystems + Crossover)

- **One app,** one save. Clicker = Resonance skill; world builder = Sanctum (Chapter 13). Both feed and are fed by the core idle RPG.
- **No separate "Arteria: Tap" product** unless explicitly decided later; crossover is the differentiator inside a single experience.

### 5.2 Future Clicker Expansions (Optional)

- **Multi-Pulse (Lv 20):** Detect multi-touch (e.g. up to 4 fingers); scale momentum/XP per tap by number of simultaneous touches (with cap).
- **Soul Cranking (Lv 60):** Long-press "Heavy Pulse" that grants a large chunk of Momentum but consumes a new resource "Anchor Energy" (earned from idling or quests).
- **Aether / Sparks economy:** Taps or Momentum could generate a spendable currency (Aether) for:
  - Temporary RPG buffs (+% XP for 1h),
  - Sanctum fuel (speed up building or vibes),
  - Or a Lumina-like shop. If added, consider daily caps to keep idle as core.

### 5.3 World Builder Crossover (Sanctum)

- Construction skill provides blueprints and materials for Sanctum rooms/furniture.
- Sanctum produces passive gold, rest bonus (+% XP), companion efficiency.
- **Clicker → Sanctum:** Future Aether/Sparks could "fuel" building speed or vibes. See MASTER_DESIGN_DOC Chapter 13 and ROADMAP §5.4.

---

## 6. Merits Summary

| Merit | Description |
|-------|-------------|
| **Synergy** | Clicker rewards active play without replacing idle; Momentum is a bonus, not a requirement. |
| **Thematic fit** | Anchor identity: you literally pulse to make the world move faster. |
| **Tactile satisfaction** | Orb + haptics + spring animation make tapping feel premium. |
| **Single install/save** | No account linking; one character, one bank, one Lumina. |
| **Crossover differentiator** | Same philosophy as ore→smithing→forging: systems feed each other. |
| **Extensibility** | Level unlocks and future Aether/Sanctum hooks are designed in from the start. |

---

## 7. Broaden & Deepen Ideas (Sourced)

### 7.1 World-State Resonance (Corruption Interaction)

Add a world-facing use for tapping by letting Resonance contribute to **zone stability**:
- Spending Momentum (or future Aether) can temporarily reduce local corruption pressure in active zones.
- At high corruption tiers (Glitch/Tear/Rupture), Resonance pulses could grant short anti-chaos windows.
- Could tie into Cleansing progression without replacing Cleansing's primary role.

**Source:** `MASTER_DESIGN_DOC.md` Chapter 9 (Zone Corruption System, Cleansing meta-game, server-wide states).

### 7.2 Seasonal Pulse Modes

Make Resonance feel different during calendar events:
- **Voidmas:** Momentum decay slower but effects more volatile.
- **Celestial Audit:** Precision timing windows for "perfectly compliant" pulses.
- **Blibberfest:** Extreme variance mode for risk/reward tapping.

This keeps clicker content fresh without building a second subsystem.

**Source:** `MASTER_DESIGN_DOC.md` Chapter 10 (Seasonal Calendar), `WORLD_EXPLORATION.md` (Frostvale, event windows, location-gated content).

### 7.3 Chaos Theory Crossover

Integrate Resonance with the Absurdity system for opt-in variance:
- "Overpulse" mode increases speed ceiling but introduces variance outcomes.
- Add a Chaos Theory synergy where deliberate imperfect timing can trigger bonus outcomes.
- Optional daily reroll-like interaction for bad Momentum streaks.

**Source:** `MASTER_DESIGN_DOC.md` Chapter 7 (Chaos Theory skill, blessings/curses, controlled chaos abilities).

### 7.4 Companion Relay Layer

Use companions as a clicker extension:
- Leadership-gated companions can auto-maintain a small baseline Momentum.
- Companion traits alter Resonance behavior (stability, spikes, or conversion to resources).
- The existing "Great Planning" board-game concept can become a low-frequency clicker influence layer.

**Source:** `MASTER_DESIGN_DOC.md` Chapter 14 (Companion system, board game), `COMPANIONS.md` (roles, leadership cap, assignment model), `ROADMAP.md` §5.3.

### 7.5 Chronicle + Timekeeper Framing

Turn clicker telemetry into narrative retention:
- Add "Resonance session recap" lines to the Tome / Previously On panel.
- If abnormal activity is detected, use Timekeeper framing and a recovery quest pattern instead of hard punishment.
- Great for trust, anti-cheat UX, and story continuity.

**Source:** `MASTER_DESIGN_DOC.md` Chapter 15 (Chronicle System, Previously On, Timekeepers anti-cheat framing).

### 7.6 Shared Active-Play Minigame Framework

Resonance should be one member of a reusable "active boost" family:
- Smithing Heat Management, Cooking Taste Balancing, and Resonance Pulse all use "keep in green zone" language.
- Standardize these into one interaction toolkit (timing window, overheat/overshoot state, reward multiplier).
- Reuse UI patterns and balancing knobs to reduce implementation entropy.

**Source:** `MASTER_DESIGN_DOC.md` (Smithing Heat Management, Restaurant mini-game), `ROADMAP.md` §3.2 (Heat Management, Alchemy volatility), `ORE_CHAIN_EXPANSION.md` §4.1.

### 7.7 Accessibility + Feedback Hardening

Broaden the clicker doc with explicit accessibility and feedback guarantees:
- Reduce motion option must dampen orb animation amplitude/speed.
- Always show current Momentum, projected speed bonus, and expected tap gain.
- Keep high-contrast compatibility for orb and progress bars.

**Source:** `PROGRESS-DOCUMENTS/zhip-ai-styling.md` (accessibility: reduce motion; idle feedback patterns and progress bar guidance).

### 7.8 Economy Guardrails

If Aether/Sparks is added, protect economy integrity:
- Keep upgrades convenience-focused (tempo, QoL, builder fuel), not raw pay-to-win power.
- Respect existing offline-cap and premium philosophy.
- Use daily caps and diminishing returns for active click throughput.

**Source:** `TRUTH_DOCTRINE.md` (monetization principles), `ROADMAP.md` / `ARCHITECTURE.md` (offline cap model and progression behavior).

---

## 8. References

- **MASTER_DESIGN_DOC.md** — §1.3 Crossover Ecosystem; Chapter 7 Chaos Theory; Chapter 9 World State; Chapter 10 Seasonal Calendar; Chapter 13 Sanctum; Chapter 14 Companions; Chapter 15 Chronicle/Timekeepers.
- **ROADMAP.md** — §5.4 Crossover Subsystems; §5.3 Companions; §3.2 active mechanics (Heat Management/Volatility).
- **WORLD_EXPLORATION.md** — event windows, location gates, Frostvale/Fey Markets framing.
- **COMPANIONS.md** — leadership gating, roles, task assignment, implementation notes.
- **TRUTH_DOCTRINE.md** — monetization and offline-cap philosophy.
- **PROGRESS-DOCUMENTS/ORE_CHAIN_EXPANSION.md** — Heat Management minigame design hooks.
- **PROGRESS-DOCUMENTS/zhip-ai-styling.md** — accessibility and idle feedback conventions.
- **click_idea.md** — Original Resonance concept (Pulse, Momentum, level unlocks).
- **click_idea_2.md** — Option A recommendation and crossover table.
- **apps/mobile/constants/resonance.ts** — Live constants and helpers.
- **apps/mobile/app/(tabs)/resonance.tsx** — Live Resonance tab UI.
