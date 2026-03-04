/**
 * Random Events — Constants and config for the Blibbertooth-inspired system.
 * [TRACE: DOCU/FUTURE_NOTES.md — Random Events Design Proposal]
 *
 * Per-tick roll during skilling. MVP: Blibbertooth Blessing (bonus XP),
 * Cosmic Sneeze (duplicate item). Future: Genie lamp, Dialogue randoms, Skill guardians.
 */

/** Base chance per successful tick to trigger a random event (0.005 = 0.5%). */
export const RANDOM_EVENT_CHANCE_BASE = 0.005;

/** Min ticks between events (avoids clustering). */
export const RANDOM_EVENT_COOLDOWN_TICKS = 60;

/** Blibbertooth Blessing: bonus XP = activeSkillLevel × this. */
export const BLIBBERTOOTH_XP_MULTIPLIER = 5;

/** Genie's Gift: bonus XP = chosenSkillLevel × this (RS-style lamp). */
export const GENIE_XP_MULTIPLIER = 10;

/** Treasure Chest: gold = base + (level × perLevel). */
export const TREASURE_GOLD_BASE = 25;
export const TREASURE_GOLD_PER_LEVEL = 8;

/** Lucky Strike: multiplies this tick's XP by this factor. */
export const LUCKY_STRIKE_XP_MULTIPLIER = 2;

/** Event type IDs for the registry and future expansion. */
export type RandomEventType =
    | 'blibbertooth_blessing'
    | 'cosmic_sneeze'
    | 'genie_gift'
    | 'treasure_chest'
    | 'lucky_strike'
    | 'goblin_peek';

export const RANDOM_EVENT_TYPES: RandomEventType[] = [
    'blibbertooth_blessing',
    'cosmic_sneeze',
    'genie_gift',
    'treasure_chest',
    'lucky_strike',
    'goblin_peek',
];
