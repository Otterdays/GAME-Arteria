// @ts-ignore
import { NarrativeRequirement } from '../../../packages/engine/src/data/story';

export interface RuneAltar {
    id: string;
    name: string;
    levelReq: number;
    /** XP awarded per essence consumed in a batch */
    xpPerEssence: number;
    /** How long one batch takes (ms) */
    baseTickMs: number;
    /** Which item is consumed per batch */
    essenceType: 'rune_essence' | 'pure_essence' | 'cosmic_shard';
    /** Essence consumed per batch */
    essencePerBatch: number;
    /** Runes produced per batch */
    runesPerBatch: number;
    outputRuneId: string;
    emoji: string;
    requirement?: NarrativeRequirement;
}

// For the ActionDef system, each altar is presented as a standard node:
//  items      = what it PRODUCES  (runes)
//  xpPerTick  = xpPerEssence * essencePerBatch (precomputed below)
//
// The game loop needs to also CONSUME essencePerBatch of essenceType per tick.
// That is handled via the `consumedItems` field in the extended ActionDef.

export const RUNE_ALTARS: RuneAltar[] = [
    {
        id: 'altar_air',
        name: 'Air Altar',
        levelReq: 1,
        xpPerEssence: 5,
        baseTickMs: 3000,
        essenceType: 'rune_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'air_rune',
        emoji: '💨',
    },
    {
        id: 'altar_mind',
        name: 'Mind Altar',
        levelReq: 2,
        xpPerEssence: 5.5,
        baseTickMs: 3000,
        essenceType: 'rune_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'mind_rune',
        emoji: '🧠',
    },
    {
        id: 'altar_water',
        name: 'Water Altar',
        levelReq: 5,
        xpPerEssence: 6,
        baseTickMs: 3000,
        essenceType: 'rune_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'water_rune',
        emoji: '💧',
    },
    {
        id: 'altar_earth',
        name: 'Earth Altar',
        levelReq: 9,
        xpPerEssence: 6.5,
        baseTickMs: 3500,
        essenceType: 'rune_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'earth_rune',
        emoji: '🌍',
    },
    {
        id: 'altar_fire',
        name: 'Fire Altar',
        levelReq: 14,
        xpPerEssence: 7,
        baseTickMs: 3500,
        essenceType: 'rune_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'fire_rune',
        emoji: '🔥',
    },
    {
        id: 'altar_body',
        name: 'Body Altar',
        levelReq: 20,
        xpPerEssence: 7.5,
        baseTickMs: 4000,
        essenceType: 'rune_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'body_rune',
        emoji: '🫀',
    },
    {
        id: 'altar_cosmic',
        name: 'Cosmic Altar',
        levelReq: 27,
        xpPerEssence: 8,
        baseTickMs: 4000,
        essenceType: 'pure_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'cosmic_rune',
        emoji: '✨',
    },
    {
        id: 'altar_chaos',
        name: 'Chaos Altar',
        levelReq: 35,
        xpPerEssence: 8.5,
        baseTickMs: 4500,
        essenceType: 'pure_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'chaos_rune',
        emoji: '🌀',
    },
    {
        id: 'altar_nature',
        name: 'Nature Altar',
        levelReq: 44,
        xpPerEssence: 9,
        baseTickMs: 5000,
        essenceType: 'pure_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'nature_rune',
        emoji: '🌿',
    },
    {
        id: 'altar_law',
        name: 'Law Altar',
        levelReq: 54,
        xpPerEssence: 9.5,
        baseTickMs: 5500,
        essenceType: 'pure_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'law_rune',
        emoji: '⚖️',
    },
    {
        id: 'altar_death',
        name: 'Death Altar',
        levelReq: 65,
        xpPerEssence: 10,
        baseTickMs: 6000,
        essenceType: 'pure_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'death_rune',
        emoji: '💀',
        requirement: { flags: ['knows_about_sneeze_cult'] },
    },
    {
        id: 'altar_blood',
        name: 'Blood Altar',
        levelReq: 77,
        xpPerEssence: 10.5,
        baseTickMs: 7000,
        essenceType: 'pure_essence',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'blood_rune',
        emoji: '🩸',
    },
    {
        id: 'altar_soul',
        name: 'Soul Altar',
        levelReq: 90,
        xpPerEssence: 12,
        baseTickMs: 8000,
        essenceType: 'cosmic_shard',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'soul_rune',
        emoji: '👻',
        requirement: { flags: ['act3_unlocked'] },
    },
    {
        id: 'altar_void',
        name: 'Void Altar',
        levelReq: 99,
        xpPerEssence: 15,
        baseTickMs: 10000,
        essenceType: 'cosmic_shard',
        essencePerBatch: 1,
        runesPerBatch: 1,
        outputRuneId: 'void_rune',
        emoji: '🕳️',
    },
];
