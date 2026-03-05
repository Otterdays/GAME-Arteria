/**
 * Daily (radiant) quest templates. Reset at midnight; 3 random quests per day.
 * [TRACE: ROADMAP Phase 6 — Radiant quests]
 */

export interface DailyQuestTemplate {
    id: string;
    itemId: string;
    quantityMin: number;
    quantityMax: number;
    rewardGold: number;
    rewardLumina?: number;
    label: string; // e.g. "Mine Copper Ore"
}

export const DAILY_QUEST_TEMPLATES: DailyQuestTemplate[] = [
    // Mining
    { id: 'dq_copper', itemId: 'copper_ore', quantityMin: 10, quantityMax: 25, rewardGold: 50, label: 'Mine Copper Ore' },
    { id: 'dq_tin', itemId: 'tin_ore', quantityMin: 10, quantityMax: 25, rewardGold: 50, label: 'Mine Tin Ore' },
    { id: 'dq_iron', itemId: 'iron_ore', quantityMin: 8, quantityMax: 20, rewardGold: 80, label: 'Mine Iron Ore' },
    { id: 'dq_coal', itemId: 'coal', quantityMin: 5, quantityMax: 15, rewardGold: 100, label: 'Mine Coal' },
    { id: 'dq_gold_ore', itemId: 'gold_ore', quantityMin: 5, quantityMax: 12, rewardGold: 120, rewardLumina: 1, label: 'Mine Gold Ore' },
    { id: 'dq_essence', itemId: 'rune_essence', quantityMin: 15, quantityMax: 40, rewardGold: 45, label: 'Mine Rune Essence' },
    // Logging
    { id: 'dq_normal_logs', itemId: 'normal_log', quantityMin: 15, quantityMax: 30, rewardGold: 40, label: 'Chop Normal Logs' },
    { id: 'dq_oak_logs', itemId: 'oak_log', quantityMin: 10, quantityMax: 25, rewardGold: 70, label: 'Chop Oak Logs' },
    // Fishing
    { id: 'dq_shrimp', itemId: 'raw_shrimp', quantityMin: 10, quantityMax: 25, rewardGold: 35, label: 'Catch Raw Shrimp' },
    { id: 'dq_sardine', itemId: 'raw_sardine', quantityMin: 8, quantityMax: 20, rewardGold: 55, label: 'Catch Raw Sardine' },
    { id: 'dq_herring', itemId: 'raw_herring', quantityMin: 8, quantityMax: 18, rewardGold: 70, label: 'Catch Raw Herring' },
    { id: 'dq_trout_raw', itemId: 'raw_trout', quantityMin: 6, quantityMax: 15, rewardGold: 85, label: 'Catch Raw Trout' },
    // Runecrafting
    { id: 'dq_air_rune', itemId: 'air_rune', quantityMin: 20, quantityMax: 50, rewardGold: 60, label: 'Craft Air Runes' },
    // Smithing
    { id: 'dq_bronze_bar', itemId: 'bronze_bar', quantityMin: 5, quantityMax: 15, rewardGold: 90, label: 'Smelt Bronze Bars' },
    { id: 'dq_iron_bar', itemId: 'iron_bar', quantityMin: 5, quantityMax: 12, rewardGold: 110, label: 'Smelt Iron Bars' },
    { id: 'dq_steel_bar', itemId: 'steel_bar', quantityMin: 3, quantityMax: 10, rewardGold: 140, label: 'Smelt Steel Bars' },
    // Cooking
    { id: 'dq_cooked_shrimp', itemId: 'cooked_shrimp', quantityMin: 10, quantityMax: 25, rewardGold: 60, label: 'Cook Shrimp' },
    { id: 'dq_cooked_trout', itemId: 'cooked_trout', quantityMin: 5, quantityMax: 15, rewardGold: 100, label: 'Cook Trout' },
    { id: 'dq_cooked_salmon', itemId: 'cooked_salmon', quantityMin: 4, quantityMax: 12, rewardGold: 130, label: 'Cook Salmon' },
    // Forging
    { id: 'dq_bronze_dagger', itemId: 'bronze_dagger', quantityMin: 3, quantityMax: 8, rewardGold: 95, label: 'Forge Bronze Daggers' },
    { id: 'dq_iron_dagger', itemId: 'iron_dagger', quantityMin: 2, quantityMax: 6, rewardGold: 125, label: 'Forge Iron Daggers' },
    // Harvesting
    { id: 'dq_wheat', itemId: 'wheat', quantityMin: 15, quantityMax: 35, rewardGold: 45, label: 'Harvest Wheat' },
    { id: 'dq_cabbage', itemId: 'cabbage', quantityMin: 12, quantityMax: 28, rewardGold: 55, label: 'Harvest Cabbage' },
    { id: 'dq_tomato', itemId: 'tomato', quantityMin: 10, quantityMax: 22, rewardGold: 70, label: 'Harvest Tomato' },
    { id: 'dq_snape_grass', itemId: 'snape_grass', quantityMin: 6, quantityMax: 15, rewardGold: 100, label: 'Harvest Snape Grass' },
    // Scavenging
    { id: 'dq_rusty_scrap', itemId: 'rusty_scrap', quantityMin: 10, quantityMax: 25, rewardGold: 50, label: 'Scavenge Rusty Scrap' },
    { id: 'dq_discarded_tech', itemId: 'discarded_tech', quantityMin: 6, quantityMax: 18, rewardGold: 80, label: 'Scavenge Discarded Tech' },
    { id: 'dq_fey_trinket', itemId: 'fey_trinket', quantityMin: 4, quantityMax: 12, rewardGold: 110, label: 'Scavenge Fey Trinket' },
    // Herblore
    { id: 'dq_minor_healing', itemId: 'minor_healing_potion', quantityMin: 5, quantityMax: 15, rewardGold: 90, label: 'Brew Minor Healing Potions' },
    { id: 'dq_strength_elixir', itemId: 'strength_elixir', quantityMin: 3, quantityMax: 10, rewardGold: 120, label: 'Brew Strength Elixirs' },
];

/** Returns timestamp of next midnight (local time). */
export function getNextMidnight(): number {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime();
}

function randomInt(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1));
}

export interface DailyQuestEntry {
    id: string;
    templateId: string;
    objective: { type: 'gather'; itemId: string; quantity: number };
    current: number;
    rewardGold: number;
    rewardLumina?: number;
    completed: boolean;
    label: string;
}

/** Pick N random daily quest entries for the day. */
export function generateDailyQuests(count: number = 3): DailyQuestEntry[] {
    const shuffled = [...DAILY_QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((t, i) => ({
        id: `daily_${Date.now()}_${i}`,
        templateId: t.id,
        label: t.label,
        objective: { type: 'gather' as const, itemId: t.itemId, quantity: randomInt(t.quantityMin, t.quantityMax) },
        current: 0,
        rewardGold: t.rewardGold,
        rewardLumina: t.rewardLumina,
        completed: false,
    }));
}
