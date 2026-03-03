/**
 * Item registry — shared across Bank, LootVacuum, and future screens.
 * Add new entries when new drop sources are added.
 */

export type ItemType = 'ore' | 'bar' | 'log' | 'fish' | 'rune' | 'other';

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

  // ── Fish ──
  raw_shrimp: { emoji: '🦐', label: 'Raw Shrimp', sellValue: 2, description: 'A tiny shrimp. Cook it before eating.', type: 'fish' },
  raw_sardine: { emoji: '🐟', label: 'Raw Sardine', sellValue: 5, description: 'A slender ocean fish. Easy to catch, easy to cook.', type: 'fish' },
  raw_herring: { emoji: '🐟', label: 'Raw Herring', sellValue: 10, description: 'A common river fish with plenty of meat.', type: 'fish' },
  raw_trout: { emoji: '🎣', label: 'Raw Trout', sellValue: 20, description: 'A freshwater favourite. Delicious when grilled.', type: 'fish' },
  raw_salmon: { emoji: '🐠', label: 'Raw Salmon', sellValue: 35, description: 'Rich pink flesh. Popular in Valdoria markets.', type: 'fish' },
  raw_tuna: { emoji: '🐡', label: 'Raw Tuna', sellValue: 60, description: 'A large, meaty ocean fish. Requires a harpoon to catch.', type: 'fish' },
  raw_lobster: { emoji: '🦞', label: 'Raw Lobster', sellValue: 90, description: 'A premium crustacean. Best caught bare-handed.', type: 'fish' },
  raw_swordfish: { emoji: '🐬', label: 'Raw Swordfish', sellValue: 130, description: 'A fierce fish with a fearsome bill. Highly nourishing.', type: 'fish' },
  raw_shark: { emoji: '🦈', label: 'Raw Shark', sellValue: 250, description: 'Apex predator of the deep. Dangerous to catch. Even rawer.', type: 'fish' },
  raw_cosmic_jellyfish: { emoji: '🪼', label: 'Raw Cosmic Jellyfish', sellValue: 600, description: 'A translucent creature from the Void Tide. Its meat defies physics.', type: 'fish' },

  // -- Rune Essences --
  rune_essence: { emoji: '💠', label: 'Rune Essence', sellValue: 1, description: 'Raw magical rock pulsing with dormant energy. Bind it at an altar.', type: 'ore' },
  pure_essence: { emoji: '🔮', label: 'Pure Essence', sellValue: 5, description: 'A refined essence stone, attuned to higher rune tiers.', type: 'ore' },
  cosmic_shard: { emoji: '🌌', label: 'Cosmic Shard', sellValue: 50, description: 'A fragment of pure cosmic energy. The Sneeze left it behind.', type: 'ore' },

  // -- Runes --
  air_rune: { emoji: '💨', label: 'Air Rune', sellValue: 4, description: 'The most basic rune. Carries the breath of the world.', type: 'rune' },
  mind_rune: { emoji: '🧠', label: 'Mind Rune', sellValue: 4, description: 'Captures a single coherent thought. Very rare for wizards.', type: 'rune' },
  water_rune: { emoji: '💧', label: 'Water Rune', sellValue: 5, description: 'Flows with the energy of rivers and rain.', type: 'rune' },
  earth_rune: { emoji: '🌍', label: 'Earth Rune', sellValue: 5, description: 'Heavy with the weight of stone and soil.', type: 'rune' },
  fire_rune: { emoji: '🔥', label: 'Fire Rune', sellValue: 6, description: 'Burns with contained magical heat. Handle carefully.', type: 'rune' },
  body_rune: { emoji: '🫀', label: 'Body Rune', sellValue: 7, description: 'Resonates with living flesh. Useful in healing spells.', type: 'rune' },
  cosmic_rune: { emoji: '✨', label: 'Cosmic Rune', sellValue: 15, description: 'Hums with the frequency of the Great Sneeze itself.', type: 'rune' },
  chaos_rune: { emoji: '🌀', label: 'Chaos Rune', sellValue: 20, description: 'Barely contained entropy. Perfect for destruction spells.', type: 'rune' },
  nature_rune: { emoji: '🌿', label: 'Nature Rune', sellValue: 25, description: 'Pulses with the rhythm of growing things.', type: 'rune' },
  law_rune: { emoji: '⚖️', label: 'Law Rune', sellValue: 35, description: 'Enforces magical order. Used in teleportation spells.', type: 'rune' },
  death_rune: { emoji: '💀', label: 'Death Rune', sellValue: 60, description: 'Carries the cold weight of finality. Guarded closely.', type: 'rune' },
  blood_rune: { emoji: '🩸', label: 'Blood Rune', sellValue: 90, description: 'Made from the essence of sacrifice. Deeply unsettling to hold.', type: 'rune' },
  soul_rune: { emoji: '👻', label: 'Soul Rune', sellValue: 150, description: 'A rune that whispers in a language you almost understand.', type: 'rune' },
  void_rune: { emoji: '🕳️', label: 'Void Rune', sellValue: 400, description: 'The absence of everything, compressed into magical potential.', type: 'rune' },
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
