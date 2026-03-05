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
    },
    'dt_bianca_herbalist': {
        id: 'dt_bianca_herbalist',
        startNodeId: 'node_1',
        nodes: {
            'node_1': {
                id: 'node_1',
                speaker: 'Bianca the Herbalist',
                text: 'Oh, a visitor! I\'m Bianca. I run the herb stall when the market isn\'t floating sideways. Wheat, cabbage, void caps — if it grows, I\'ve probably poked it.',
                options: [
                    {
                        id: 'opt_1',
                        text: 'What do you know about potions?',
                        nextNodeId: 'node_2'
                    },
                    {
                        id: 'opt_2',
                        text: 'Void caps?',
                        nextNodeId: 'node_3'
                    },
                    {
                        id: 'opt_3',
                        text: 'Good to meet you. Bye!',
                        nextNodeId: 'end'
                    }
                ]
            },
            'node_2': {
                id: 'node_2',
                speaker: 'Bianca the Herbalist',
                text: 'Herbs and empty vials — that\'s the secret. Nick sells vials. Combine the right herb with a vial and you\'ll brew something useful. Minor healing, strength elixirs... the void-resistant stuff takes void caps. Don\'t ask how I know.',
                options: [
                    {
                        id: 'opt_4',
                        text: 'Thanks for the tip.',
                        nextNodeId: 'end'
                    }
                ]
            },
            'node_3': {
                id: 'node_3',
                speaker: 'Bianca the Herbalist',
                text: 'They grow near the ruptures. Spooky, but potent. Great for Void Resistance potions. Harvesting skill helps — the higher you are, the better your odds. Just... don\'t stare into the rupture too long.',
                options: [
                    {
                        id: 'opt_5',
                        text: 'I\'ll be careful.',
                        nextNodeId: 'end'
                    }
                ]
            }
        }
    },
    'dt_kate_traveler': {
        id: 'dt_kate_traveler',
        startNodeId: 'node_1',
        nodes: {
            'node_1': {
                id: 'node_1',
                speaker: 'Kate the Traveler',
                text: 'Hey! I\'m Kate. I\'ve been everywhere the roads still go — and a few places they don\'t. The world\'s bigger than this town, you know.',
                options: [
                    {
                        id: 'opt_1',
                        text: 'What other places are there?',
                        nextNodeId: 'node_2'
                    },
                    {
                        id: 'opt_2',
                        text: 'Ever heard of somewhere... festive?',
                        nextNodeId: 'node_3'
                    },
                    {
                        id: 'opt_3',
                        text: 'Safe travels.',
                        nextNodeId: 'end'
                    }
                ]
            },
            'node_2': {
                id: 'node_2',
                speaker: 'Kate the Traveler',
                text: 'Whispering Woods, the Scorched Reach, Skyward Peaks... Valdoria\'s full of weird pockets. Some open up when the stars align. There\'s even a place up north — Frostvale — snow and lights year-round. The Void-Touched throw a party there around the winter solstice. Voidmas, they call it.',
                options: [
                    {
                        id: 'opt_4',
                        text: 'Frostvale? How do I get there?',
                        nextNodeId: 'node_3'
                    },
                    {
                        id: 'opt_5',
                        text: 'Sounds magical. Thanks!',
                        nextNodeId: 'end'
                    }
                ]
            },
            'node_3': {
                id: 'node_3',
                speaker: 'Kate the Traveler',
                text: 'Frostvale\'s a bit... seasonal. The path opens when the Voidmire thins and the Luminar gets all nostalgic. Keep an eye on the horizon — when the northern lights show up, the way should clear. Till then, enjoy the Crownlands. Plenty to do here.',
                options: [
                    {
                        id: 'opt_6',
                        text: 'I\'ll watch for it.',
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
