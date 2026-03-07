/**
 * Agility Skill — Run courses for XP and passive global speed buffs.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md]
 */

// @ts-ignore
import { NarrativeRequirement } from '../../../packages/engine/src/data/story';

export interface AgilityCourse {
    id: string;
    name: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    items: { id: string; quantity: number }[]; // Always empty for agility
    emoji: string;
    requirement?: NarrativeRequirement;
}

export const AGILITY_COURSES: AgilityCourse[] = [
    { id: 'agility_course_crownlands', name: 'Crownlands Rooftops', levelReq: 1, xpPerTick: 8, baseTickMs: 4000, successRate: 1, items: [], emoji: '🏘️' },
    { id: 'agility_course_forest', name: 'Forest Stump Run', levelReq: 10, xpPerTick: 18, baseTickMs: 4500, successRate: 0.95, items: [], emoji: '🪵' },
    { id: 'agility_course_docks', name: 'Docks Balance Beam', levelReq: 25, xpPerTick: 35, baseTickMs: 5000, successRate: 0.9, items: [], emoji: '⚓' },
    { id: 'agility_course_fey', name: 'Fey Ring Leap', levelReq: 45, xpPerTick: 60, baseTickMs: 6000, successRate: 0.85, items: [], emoji: '✨' },
    { id: 'agility_course_scorched', name: 'Scorched Ledge', levelReq: 65, xpPerTick: 95, baseTickMs: 7000, successRate: 0.8, items: [], emoji: '🔥' },
    { id: 'agility_course_void', name: 'Void Rift Traverse', levelReq: 85, xpPerTick: 140, baseTickMs: 8500, successRate: 0.7, items: [], emoji: '🕳️' },
];
