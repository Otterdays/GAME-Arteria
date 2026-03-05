/**
 * Lumina Shop — premium currency purchases.
 * [TRACE: CURRENT_IMPROVEMENTS.md — Lumina Shop]
 */

export interface LuminaShopItem {
    id: string;
    label: string;
    description: string;
    cost: number;
    emoji: string;
    /** Effect type for Redux handler */
    effect: 'reroll_daily' | 'xp_boost_1h' | 'cosmetic';
    /** Optional: max uses per day (e.g. reroll = 2) */
    maxPerDay?: number;
}

export const LUMINA_SHOP_ITEMS: LuminaShopItem[] = [
    {
        id: 'reroll_daily',
        label: 'Reroll Daily Quests',
        description: 'Get 3 new daily quests. Resets at midnight.',
        cost: 5,
        emoji: '🎲',
        effect: 'reroll_daily',
        maxPerDay: 2,
    },
    {
        id: 'xp_boost_1h',
        label: 'XP Boost (1 hour)',
        description: '+25% XP from all skills for 1 hour.',
        cost: 15,
        emoji: '⚡',
        effect: 'xp_boost_1h',
    },
];
