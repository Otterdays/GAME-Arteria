/**
 * Interfaces and data structures for Arteria's story, dialogue, and quest engine.
 * Narrative Architecture based on the "Cosmic Comedy" tone and 4-Act structure.
 */

import { SkillId, InventoryItem } from '../types';

/** 
 * Requirements needed to start a quest, unlock a dialogue, or pick a dialogue option.
 */
export interface NarrativeRequirement {
    /** Required skill level(s). Format: { mining: 15, logging: 10 } */
    skills?: Partial<Record<SkillId, number>>;
    /** IDs of quests that must be completed first */
    questsCompleted?: string[];
    /** Items that must be in the player's inventory */
    itemsRequired?: InventoryItem[];
    /** Custom flags set during gameplay, e.g., 'met_god_of_cabbage' */
    flags?: string[];
}

/**
 * Rewards granted upon quest completion or specific dialogue choices.
 */
export interface NarrativeReward {
    xp?: Partial<Record<SkillId, number>>;
    items?: InventoryItem[];
    gold?: number;
    /** Flags to set upon receiving this reward, unlocking future content */
    setFlags?: string[];
}

/** 
 * A single Quest definition in the game.
 */
export interface Quest {
    id: string;
    title: string;
    description: string;
    act: 1 | 2 | 3 | 4; // The narrative Act this quest belongs to
    requirements: NarrativeRequirement;
    rewards: NarrativeReward;
    /** 
     * Steps required to complete the quest.
     * Maps step ID (e.g., 'gather_wood', 'talk_to_king') to a description.
     */
    steps: {
        id: string;
        description: string;
        /** Optional: The step is completed when these requirements are met */
        completionRequirements?: NarrativeRequirement;
    }[];
}

/**
 * A choice the player can make during a dialogue sequence.
 */
export interface DialogueOption {
    id: string;
    text: string;
    /** The ID of the DialogueNode to jump to if this option is chosen */
    nextNodeId: string;
    /** Requirements to see or pick this option (e.g., needing 50 Strength to threaten) */
    requirements?: NarrativeRequirement;
    /** Actions to trigger when this option is selected */
    onSelect?: {
        setFlags?: string[];
        giveItems?: InventoryItem[];
        removeItems?: InventoryItem[];
        startQuest?: string;
        completeQuestStep?: { questId: string; stepId: string };
    };
}

/**
 * A single beat / node of a conversation.
 */
export interface DialogueNode {
    id: string;
    /** The character speaking (e.g., 'The Void Sphere', 'King Blubber') */
    speaker: string;
    /** The text the character is saying */
    text: string;
    /** The player's available responses */
    options: DialogueOption[];
    /** Optional function to trigger arbitrary engine logic when node is reached */
    onEnter?: () => void;
}

/**
 * A full conversation tree with a specific NPC or event.
 */
export interface DialogueTree {
    id: string;
    /** The default starting node ID */
    startNodeId: string;
    /** All nodes in this conversation, mapped by their ID */
    nodes: Record<string, DialogueNode>;
    /** Global requirements to even initiate this dialogue */
    requirements?: NarrativeRequirement;
}

/**
 * The player's active progression state for the narrative.
 * This should be stored in Redux (e.g., in a questSlice or gameSlice).
 */
export interface PlayerNarrativeState {
    /** List of all narrative flags the player has earned */
    flags: string[];
    /** Quests currently in progress. Map of QuestId -> Array of completed StepIds */
    activeQuests: Record<string, string[]>;
    /** List of fully completed quests */
    completedQuests: string[];
}
