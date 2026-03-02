import { DialogueTree } from './story';

export const ACT_1_DIALOGUES: Record<string, DialogueTree> = {
    'dt_guard_intro': {
        id: 'dt_guard_intro',
        startNodeId: 'node_1',
        nodes: {
            'node_1': {
                id: 'node_1',
                speaker: 'Confused Gate Guard',
                text: 'Halt... or don\'t. Look, I don\'t really know anymore. Did you hear that sound?',
                options: [
                    {
                        id: 'opt_1',
                        text: 'What sound?',
                        nextNodeId: 'node_2'
                    },
                    {
                        id: 'opt_2',
                        text: 'You mean the cosmic sneeze?',
                        nextNodeId: 'node_3'
                    }
                ]
            },
            'node_2': {
                id: 'node_2',
                speaker: 'Confused Gate Guard',
                text: 'Like the heavens themselves had allergies. Ever since then, the gravity by the tavern has been leaning left.',
                options: [
                    {
                        id: 'opt_3',
                        text: 'Who would know about this?',
                        nextNodeId: 'node_4'
                    }
                ]
            },
            'node_3': {
                id: 'node_3',
                speaker: 'Confused Gate Guard',
                text: 'A sneeze! Exactly! You\'re the only one who makes sense around here. Watch out for the Cultists of Blibbertooth by the tavern, they think it means we\'re all getting wiped by a giant tissue.',
                options: [
                    {
                        id: 'opt_4',
                        text: 'I\'ll investigate the tavern.',
                        nextNodeId: 'end',
                        onSelect: {
                            setFlags: ['knows_about_sneeze_cult'],
                            startQuest: 'q_awakening',
                        }
                    }
                ]
            },
            'node_4': {
                id: 'node_4',
                speaker: 'Confused Gate Guard',
                text: 'Try the Cult of Blibbertooth. They hang out behind the tavern wearing mismatched socks. They seem to know more than us regular guards.',
                options: [
                    {
                        id: 'opt_5',
                        text: 'I\'ll find them.',
                        nextNodeId: 'end',
                        onSelect: {
                            startQuest: 'q_awakening',
                        }
                    }
                ]
            }
        }
    },
    'dt_nick_shop': {
        id: 'dt_nick_shop',
        startNodeId: 'node_1',
        nodes: {
            'node_1': {
                id: 'node_1',
                speaker: 'Nick the Merchant',
                text: 'Welcome, traveler! Since the cosmic sneeze threw off the property values, prices have been... erratic. What can I do for you?',
                options: [
                    {
                        id: 'opt_1',
                        text: 'Who are you?',
                        nextNodeId: 'node_2'
                    },
                    {
                        id: 'opt_2',
                        text: 'Nothing right now.',
                        nextNodeId: 'end'
                    }
                ]
            },
            'node_2': {
                id: 'node_2',
                speaker: 'Nick the Merchant',
                text: 'I\'m Nick! Chief supply chain officer of whatever is left of the economy. If you find anything shiny, bring it to me. I buy junk, I sell dreams.',
                options: [
                    {
                        id: 'opt_3',
                        text: 'Good to know. See ya.',
                        nextNodeId: 'end'
                    }
                ]
            }
        }
    }
};

export const ALL_DIALOGUES: Record<string, DialogueTree> = {
    ...ACT_1_DIALOGUES
};
