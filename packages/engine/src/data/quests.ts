import { Quest } from './story';

export const ACT_1_QUESTS: Record<string, Quest> = {
    'q_awakening': {
        id: 'q_awakening',
        title: 'The Cosmic Sneeze',
        description: 'You\'ve awoken in the Crownlands with a splitting headache and a distinct feeling that the universe was sneezed into existence. Find someone who knows what is going on.',
        act: 1,
        requirements: {
            // Accessible immediately
        },
        rewards: {
            gold: 100,
            xp: { hitpoints: 50 },
            setFlags: ['met_blibbertooth_cultist']
        },
        steps: [
            {
                id: 'talk_to_guard',
                description: 'Talk to the confused City Guard at the gates of the Crownlands.',
            },
            {
                id: 'find_cultist',
                description: 'Locate a member of the Cult of Blibbertooth (they usually hang out near the tavern causing minor inconveniences).',
                completionRequirements: {
                    skills: { agility: 5 } // Maybe you have to chase them
                }
            }
        ]
    }
};

/** All game quests exported for the engine/UI to read */
export const ALL_QUESTS: Record<string, Quest> = {
    ...ACT_1_QUESTS,
};
