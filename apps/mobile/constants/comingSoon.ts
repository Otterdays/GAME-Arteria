/**
 * Coming Soon / In Progress flags for UI badges.
 * Red = planned (not started). Green = in progress.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md]
 */

import type { SkillId } from '@/store/gameSlice';

/** Skills currently being implemented. Green badge. */
export const SKILLS_IN_PROGRESS: Set<SkillId> = new Set([
  // Add skillIds when implementation starts, e.g. 'agility'
]);

/** Feature IDs for non-skill "coming soon" items (locations, combat, etc.). */
export type ComingSoonFeatureId =
  | 'combat_phase4'
  | 'location_frostvale'
  | 'location_fey_markets'
  | 'location_whispering_woods'
  | 'location_scorched_reach'
  | 'location_skyward_peaks'
  | 'idle_soundscapes';

/** Features currently being implemented. Green badge. */
export const FEATURES_IN_PROGRESS: Set<ComingSoonFeatureId> = new Set([
  // Add when work starts, e.g. 'combat_phase4'
]);

export function isSkillInProgress(skillId: SkillId): boolean {
  return SKILLS_IN_PROGRESS.has(skillId);
}

export function isFeatureInProgress(featureId: ComingSoonFeatureId): boolean {
  return FEATURES_IN_PROGRESS.has(featureId);
}

/** Map location id to feature id for coming-soon badges. */
export const LOCATION_TO_FEATURE: Record<string, ComingSoonFeatureId> = {
  frostvale: 'location_frostvale',
  fey_markets: 'location_fey_markets',
  whispering_woods: 'location_whispering_woods',
  scorched_reach: 'location_scorched_reach',
  skyward_peaks: 'location_skyward_peaks',
};
