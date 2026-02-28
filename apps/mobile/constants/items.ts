/**
 * Item registry — shared across Bank, LootVacuum, and future screens.
 * Add new entries when new drop sources are added.
 */

export type ItemType = 'ore' | 'bar' | 'other';

export interface ItemMeta {
  emoji: string;
  label: string;
  sellValue: number;
  description: string;
  type: ItemType;
}

export const ITEM_META: Record<string, ItemMeta> = {
  copper_ore: { emoji: '🪨', label: 'Copper Ore', sellValue: 3, description: 'A common ore found near the surface.', type: 'ore' },
  tin_ore: { emoji: '🪨', label: 'Tin Ore', sellValue: 3, description: 'Used with Copper to make Bronze.', type: 'ore' },
  iron_ore: { emoji: '⛰️', label: 'Iron Ore', sellValue: 10, description: 'A sturdy ore for smithing mid-tier gear.', type: 'ore' },
  coal: { emoji: '⚫', label: 'Coal', sellValue: 15, description: 'Fuel for the furnace. Needed for Steel.', type: 'ore' },
  gold_ore: { emoji: '🟡', label: 'Gold Ore', sellValue: 40, description: 'Valuable ore. Smelt into Gold Bars.', type: 'ore' },
  mithril_ore: { emoji: '🔵', label: 'Mithril Ore', sellValue: 80, description: 'A rare ore with magical properties.', type: 'ore' },
  adamantite_ore: { emoji: '🟢', label: 'Adamantite Ore', sellValue: 150, description: 'Extremely hard. Forms the best non-cosmic armour.', type: 'ore' },
  runite_ore: { emoji: '🛸', label: 'Runite Ore', sellValue: 400, description: 'Endgame material. Guarded by Runite Golems.', type: 'ore' },
};

const UNKNOWN: ItemMeta = { emoji: '❓', label: 'Unknown Item', sellValue: 1, description: 'An unregistered item.', type: 'other' };

export function getItemMeta(id: string): ItemMeta {
  return ITEM_META[id] ?? { ...UNKNOWN, label: id.replace(/_/g, ' ') };
}

/** Nick's Shop — items the merchant sells and their buy price (gold per unit). [TRACE: ROADMAP 2.3] */
export const SHOP_CATALOG: { id: string; buyPrice: number }[] = [
  { id: 'copper_ore', buyPrice: 8 },
  { id: 'tin_ore', buyPrice: 8 },
  { id: 'iron_ore', buyPrice: 28 },
  { id: 'coal', buyPrice: 42 },
  { id: 'gold_ore', buyPrice: 110 },
];
