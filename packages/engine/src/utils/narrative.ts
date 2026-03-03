import { PlayerState, SkillId } from '../types';
import { NarrativeRequirement } from '../data/story';
import type { Quest } from '../data/story';

/**
 * Returns active-quest steps that are now complete based on inventory/skills/flags.
 * Call after state changes (e.g. each tick or when opening Quests) and dispatch completeQuestStep for each.
 */
export function getQuestStepsToComplete(
    player: PlayerState,
    quests: Record<string, Quest>
): { questId: string; stepId: string }[] {
    const out: { questId: string; stepId: string }[] = [];
    for (const [questId, completedStepIds] of Object.entries(player.narrative.activeQuests)) {
        const quest = quests[questId];
        if (!quest) continue;
        for (const step of quest.steps) {
            if (completedStepIds.includes(step.id)) continue;
            if (step.completionRequirements && meetsNarrativeRequirement(player, step.completionRequirements)) {
                out.push({ questId, stepId: step.id });
            }
            break;
        }
    }
    return out;
}

/**
 * Evaluates whether a player meets a specific set of narrative requirements.
 * Useful for gating dialogue options, quests, or skilling nodes.
 * @param player The full Redux / Engine player state
 * @param req The requirement object containing skills, flags, completed quests, and items
 * @returns true if the player meets ALL criteria defined in req, otherwise false
 */
export function meetsNarrativeRequirement(
    player: PlayerState,
    req?: NarrativeRequirement
): boolean {
    if (!req) return true;

    // 1. Check Skill Levels
    if (req.skills) {
        for (const [skillIdStr, requiredLevel] of Object.entries(req.skills)) {
            const skillId = skillIdStr as SkillId;
            const playerSkill = player.skills[skillId];
            if (!playerSkill || playerSkill.level < requiredLevel) {
                return false;
            }
        }
    }

    // 2. Check Completed Quests
    if (req.questsCompleted) {
        for (const questId of req.questsCompleted) {
            if (!player.narrative.completedQuests.includes(questId)) {
                return false;
            }
        }
    }

    // 3. Check Required Flags
    if (req.flags) {
        for (const flag of req.flags) {
            if (!player.narrative.flags.includes(flag)) {
                return false;
            }
        }
    }

    // 4. Check Items Required
    if (req.itemsRequired) {
        for (const reqItem of req.itemsRequired) {
            const inventoryItem = player.inventory.find(i => i.id === reqItem.id);
            if (!inventoryItem || inventoryItem.quantity < reqItem.quantity) {
                return false;
            }
        }
    }

    return true;
}
