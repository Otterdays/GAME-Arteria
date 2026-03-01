/**
 * Item registry — shared across Bank, LootVacuum, and future screens.
 * Add new entries when new drop sources are added.
 */

export type ItemType = 'ore' | 'bar' | 'log' | 'other';

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

  cursed_copper_ore: { emoji: '🪨', label: 'Cursed Copper Ore', sellValue: 1, description: 'A cursed common ore found near the surface. It pulsates with a dark energy.', type: 'ore' },
  cursed_tin_ore: { emoji: '🪨', label: 'Cursed Tin Ore', sellValue: 1, description: 'A cursed ore. It feels unnervingly cold to the touch.', type: 'ore' },
  cursed_iron_ore: { emoji: '⛰️', label: 'Cursed Iron Ore', sellValue: 1, description: 'A cursed sturdy ore. Whispers can be heard from within.', type: 'ore' },
  cursed_coal: { emoji: '⚫', label: 'Cursed Coal', sellValue: 1, description: 'Cursed fuel. It burns with a chilling purple flame.', type: 'ore' },
  cursed_gold_ore: { emoji: '🟡', label: 'Cursed Gold Ore', sellValue: 1, description: 'Valuable cursed ore. The gold seems to shift entirely into void when not looked at directly.', type: 'ore' },
  cursed_mithril_ore: { emoji: '🔵', label: 'Cursed Mithril Ore', sellValue: 1, description: 'A rare curved ore with sickening magical properties.', type: 'ore' },
  cursed_adamantite_ore: { emoji: '🟢', label: 'Cursed Adamantite Ore', sellValue: 1, description: 'Extremely hard cursed ore. It resists not only physical blows, but also rational thought.', type: 'ore' },
  cursed_runite_ore: { emoji: '🛸', label: 'Cursed Runite Ore', sellValue: 1, description: 'Endgame cursed material. Staring at it for too long invokes existential dread.', type: 'ore' },

  normal_log: { emoji: '🪵', label: 'Normal Log', sellValue: 2, description: 'A basic wooden log. Good for starting fires or basic fletching.', type: 'log' },
  oak_log: { emoji: '🪵', label: 'Oak Log', sellValue: 5, description: 'Sturdy oak wood. Used in basic construction and fletching.', type: 'log' },
  willow_log: { emoji: '🪵', label: 'Willow Log', sellValue: 12, description: 'Flexible willow wood, excellent for bows.', type: 'log' },
  teak_log: { emoji: '🪵', label: 'Teak Log', sellValue: 25, description: 'High quality tropical wood, prized for furniture.', type: 'log' },
  maple_log: { emoji: '🪵', label: 'Maple Log', sellValue: 40, description: 'Dense maple wood, burns long and smells sweet.', type: 'log' },
  mahogany_log: { emoji: '🪵', label: 'Mahogany Log', sellValue: 70, description: 'Premium hardwood used in advanced construction.', type: 'log' },
  yew_log: { emoji: '🪵', label: 'Yew Log', sellValue: 150, description: 'Ancient yew wood. Extremely flexible and rare.', type: 'log' },
  magic_log: { emoji: '🪵', label: 'Magic Log', sellValue: 350, description: 'Wood imbued with arcane energy. It hums softly.', type: 'log' },
  cosmic_wood: { emoji: '🌌', label: 'Cosmic Wood', sellValue: 800, description: 'Wood harvested from the very fabric of the cosmos.', type: 'log' },
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
