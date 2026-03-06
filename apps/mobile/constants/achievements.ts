import { PlayerState, SkillId } from '@/store/gameSlice';

export interface Achievement {
    id: string;
    title: string;       // e.g. "The Stubborn"
    emoji: string;
    description: string;
    /** How to check if this is unlocked from PlayerState */
    check: (player: PlayerState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'the_stubborn',
        title: 'The Stubborn',
        emoji: '🔴',
        description: 'Press "Don\'t Push This" 1,000 times.',
        check: (p) => (p.unlockedTitles ?? []).includes('The Stubborn'),
    },
    {
        id: 'first_blood',
        title: 'First Blood',
        emoji: '⚔️',
        description: 'Defeat your first enemy in combat.',
        check: (p) => (p.lifetimeStats?.enemiesDefeated ?? 0) >= 1,
    },
    {
        id: 'centurion',
        title: 'The Centurion',
        emoji: '🛡️',
        description: 'Defeat 100 enemies.',
        check: (p) => (p.lifetimeStats?.enemiesDefeated ?? 0) >= 100,
    },
    {
        id: 'daily_devotee',
        title: 'Daily Devotee',
        emoji: '📅',
        description: 'Complete 10 daily quests.',
        check: (p) => (p.totalDailyQuestsCompleted ?? 0) >= 10,
    },
    {
        id: 'quest_master',
        title: 'Quest Master',
        emoji: '📜',
        description: 'Complete 50 daily quests.',
        check: (p) => (p.totalDailyQuestsCompleted ?? 0) >= 50,
    },
    {
        id: 'hoarder',
        title: 'The Hoarder',
        emoji: '📦',
        description: 'Fill your bank to the slot cap.',
        check: (p) => p.inventory.length >= 50,
    },
    {
        id: 'pet_lover',
        title: 'Pet Whisperer',
        emoji: '🐾',
        description: 'Unlock your first skill pet.',
        check: (p) => (p.pets?.unlocked?.length ?? 0) >= 1,
    },
    {
        id: 'millionaire',
        title: 'The Millionaire',
        emoji: '💰',
        description: 'Earn 1,000,000 total gold.',
        check: (p) => (p.lifetimeStats?.totalGoldEarned ?? 0) >= 1_000_000,
    },
    {
        id: 'smith_master',
        title: 'Master Smith',
        emoji: '🔨',
        description: 'Smelt 500 bars.',
        check: (p) => {
            const bars = ['bronze_bar', 'iron_bar', 'steel_bar', 'gold_bar', 'mithril_bar', 'adamant_bar', 'runite_bar'];
            return bars.reduce((sum, id) => sum + (p.lifetimeStats?.byItem?.[id] ?? 0), 0) >= 500;
        },
    },
    {
        id: 'rune_master',
        title: 'The Rune Master',
        emoji: '✨',
        description: 'Craft 1,000 runes.',
        check: (p) => (p.stats?.byType?.['rune'] ?? 0) >= 1000,
    },
    {
        id: 'head_chef',
        title: 'Head Chef',
        emoji: '👨‍🍳',
        description: 'Cooked 500 meals.',
        check: (p) => {
            const cooked = p.lifetimeStats?.totalItemsProduced ?? 0;
            // More specific check for cooked food if available
            return cooked >= 500; // Simplified for now
        },
    },
    {
        id: 'potion_master',
        title: 'Potion Master',
        emoji: '🧪',
        description: 'Brewed 200 potions.',
        check: (p) => {
            const produced = p.lifetimeStats?.totalItemsProduced ?? 0;
            return produced >= 200; // Simplified for now
        },
    },
    {
        id: 'sneeze_cultist',
        title: 'Sneeze Cultist',
        emoji: '👃',
        description: 'Learned the secrets of the Cosmic Sneeze.',
        check: (p) => (p.narrative?.flags ?? []).includes('knows_about_sneeze_cult'),
    },
    {
        id: 'tome_of_knowledge',
        title: 'Tome of Knowledge',
        emoji: '📖',
        description: 'Reach a Total Level of 500.',
        check: (p) => {
            const total = Object.values(p.skills).reduce((sum, s) => sum + s.level, 0);
            return total >= 500;
        },
    },
    {
        id: 'void_walker',
        title: 'Void Walker',
        emoji: '🌌',
        description: 'Reach level 90 in any skill.',
        check: (p) => Object.values(p.skills).some(s => s.level >= 90),
    },
    {
        id: 'death_defier',
        title: 'Death Defier',
        emoji: '💀',
        description: 'Die 10 times in combat.',
        check: (p) => (p.lifetimeStats?.totalDeaths ?? 0) >= 10,
    },
];
