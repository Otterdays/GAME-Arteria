/**
 * Resonance skill — "The Pulse" (Support Pillar).
 * [TRACE: click_idea.md]
 * Manual pulsing of cosmic weight to build Momentum; Momentum grants global Haste to all other skills.
 */

export const RESONANCE_XP_PER_TAP = 8;
export const MOMENTUM_PER_TAP_BASE = 2;
export const MOMENTUM_CAP = 100;
/** Momentum decay per second when not tapping (e.g. -2% per second). */
export const MOMENTUM_DECAY_PER_SECOND = 2;
/** At 100% Momentum, other skills run 50% faster: interval / (1 + momentum/200) => 1.5x at 100. */
export const HASTE_MULTIPLIER_AT_FULL = 0.5;

/** Soul Cranking (Lv 60): Heavy Pulse consumes this. Earned from non-Resonance skilling. */
export const ANCHOR_ENERGY_PER_MINUTE = 1;
export const ANCHOR_ENERGY_CAP = 50;
export const SOUL_CRANKING_ENERGY_COST = 5;
export const SOUL_CRANKING_MOMENTUM_GAIN = 20;
export const SOUL_CRANKING_XP_GAIN = 40;

/** Multi-Pulse (Lv 20): multiplier per simultaneous finger (2 fingers = 2x, 4 = 4x). */
export function getMultiPulseMultiplier(touchCount: number, level: number): number {
    if (level < 20) return 1;
    return Math.min(4, Math.max(1, touchCount));
}

/** Level unlocks (from click_idea.md). */
export interface ResonanceUnlock {
    level: number;
    id: string;
    label: string;
    effect: string;
}

export const RESONANCE_UNLOCKS: ResonanceUnlock[] = [
    { level: 20, id: 'multi_pulse', label: 'Multi-Pulse', effect: 'Multi-finger tapping (up to 4) for rapid Momentum.' },
    { level: 40, id: 'resonant_echo', label: 'Resonant Echo', effect: 'Taps generate 50% more Momentum and XP.' },
    { level: 60, id: 'soul_cranking', label: 'Soul Cranking', effect: 'Heavy Pulse (long press) — massive Momentum, consumes Anchor Energy.' },
    { level: 80, id: 'kinetic_feedback', label: 'Kinetic Feedback', effect: '10% chance per skill tick to grant +1% Momentum.' },
    { level: 99, id: 'perfect_stability', label: 'Perfect Stability', effect: 'Momentum never decays below 25% (permanent 12.5% speed).' },
];

export function getMomentumPerTap(level: number, hasResonantEcho: boolean): number {
    let v = MOMENTUM_PER_TAP_BASE;
    if (hasResonantEcho) v *= 1.5;
    return Math.min(MOMENTUM_CAP, v);
}

export function getResonanceXpPerTap(level: number, hasResonantEcho: boolean): number {
    let v = RESONANCE_XP_PER_TAP;
    if (hasResonantEcho) v = Math.floor(v * 1.5);
    return v;
}

/** Haste multiplier for tick interval: interval / (1 + momentum * factor). At 100% momentum => 1.5x speed. */
export function getHasteMultiplier(momentumPercent: number): number {
    return 1 + (momentumPercent / 100) * HASTE_MULTIPLIER_AT_FULL;
}

/** Minimum momentum when level 99 Perfect Stability is unlocked. */
export const PERFECT_STABILITY_FLOOR = 25;
