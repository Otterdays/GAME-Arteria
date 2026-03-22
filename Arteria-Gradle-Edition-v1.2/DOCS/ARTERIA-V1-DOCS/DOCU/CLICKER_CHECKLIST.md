# Clicker (Resonance) — Live Feature Checklist

> **Purpose:** Track implemented vs planned features for the Resonance clicker skill. Update as features ship or get deprioritized.
> **Source:** CLICKER_DESIGN.md, click_idea.md, ROADMAP §5.4
> **Last updated:** 2026-03-07

---

## Core Loop

| Feature | Status | Notes |
|---------|--------|-------|
| Tap orb → XP + Momentum | ✅ Done | Base loop |
| Momentum decay over time | ✅ Done | −2%/s; foreground only |
| Momentum → global Haste | ✅ Done | All skills run faster |
| Level 1–99, XP table | ✅ Done | Standard skill progression |

---

## Level Unlocks

| Lv | Unlock | Status | Notes |
|----|--------|--------|-------|
| 20 | **Multi-Pulse** | ✅ Done | Multi-finger tap (2–4) scales momentum/XP |
| 40 | **Resonant Echo** | ✅ Done | +50% Momentum and XP per tap |
| 60 | **Soul Cranking** | ✅ Done | Long-press Heavy Pulse: +20% Momentum, 40 XP, costs 5 Anchor Energy |
| 80 | **Kinetic Feedback** | ✅ Done | 10% chance per skill tick (non-Resonance) → +1% Momentum |
| 99 | **Perfect Stability** | ✅ Done | Momentum floor 25% (permanent 12.5% speed) |

---

## Anchor Energy

| Feature | Status | Notes |
|---------|--------|-------|
| State (`player.anchorEnergy`) | ✅ Done | 0–50 cap |
| Idle accumulation | ✅ Done | 1 per minute of non-Resonance skilling |
| Soul Cranking consumption | ✅ Done | 5 per Heavy Pulse |
| Quest completion source | ⬜ Planned | Future: grant on quest complete |

---

## UI & Entry Points

| Feature | Status | Notes |
|---------|--------|-------|
| Dedicated tab | ✅ Done | Resonance in tab bar |
| Hub card | ✅ Done | "Pulse the orb, haste the world" |
| Skills grid (Support pillar) | ✅ Done | Tap → Resonance |
| Orb + Momentum bar + Unlocks list | ✅ Done | Full screen |
| Anchor Energy display | ✅ Done | Shown when Lv 60+ |
| Long-press hint | ✅ Done | Shown when Lv 60+ |
| Multi-touch hint | ✅ Done | Shown when Lv 20+ |

---

## Planned / Optional

| Feature | Status | Source |
|---------|--------|--------|
| Aether / Sparks economy | ⬜ Planned | CLICKER_DESIGN §5.2; ROADMAP |
| Offline momentum decay | ⬜ Planned | Apply decay on app return |
| Companion relay (auto Momentum) | ⬜ Planned | CLICKER_DESIGN §7.4 |
| World-State (corruption) | ⬜ Planned | CLICKER_DESIGN §7.1 |
| Seasonal pulse modes | ⬜ Planned | CLICKER_DESIGN §7.2 |
| Chaos Theory crossover | ⬜ Planned | CLICKER_DESIGN §7.3 |
| Chronicle / Timekeeper framing | ⬜ Planned | CLICKER_DESIGN §7.5 |
| Shared active-play minigame framework | ⬜ Planned | CLICKER_DESIGN §7.6 |
| Accessibility (reduce motion, contrast) | ⬜ Planned | CLICKER_DESIGN §7.7 |
| Economy guardrails (Aether caps) | ⬜ Planned | CLICKER_DESIGN §7.8 |

---

## Removed / Deprioritized

| Feature | Status | Reason |
|---------|--------|--------|
| — | — | *(None yet)* |

---

## Files

| Area | Path |
|------|------|
| Screen | `apps/mobile/app/skills/resonance.tsx` |
| Constants | `apps/mobile/constants/resonance.ts` |
| State | `apps/mobile/store/gameSlice.ts` (momentum, anchorEnergy, pulseResonance, heavyPulseResonance, addAnchorEnergy, decayMomentum) |
| Game loop | `apps/mobile/hooks/useGameLoop.ts` (haste, Kinetic Feedback, Anchor Energy accumulation) |
| Design | `DOCU/CLICKER_DESIGN.md` |
