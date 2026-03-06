/**
 * Item registry — shared across Bank, LootVacuum, and future screens.
 * Add new entries when new drop sources are added.
 * 
 * MASTERY_EXPANSION_GROUNDWORK:
 * - TODO: Add inventoryItems tracking to PlayerState for item mastery
 * - ItemStats: { totalCrafted, masteryTier, isPerfect }
 * - Craft 100→speed I, 500→yield II, 1000→extra III, 5000→perfect IV
 * - See DOCU/MASTER_DESIGN_DOC.md Chapter 6.6 for full design
 */

export type ItemType = 'ore' | 'bar' | 'log' | 'fish' | 'food' | 'rune' | 'equipment' | 'potion' | 'other';

export type EquipSlot = 'head' | 'body' | 'legs' | 'feet' | 'weapon' | 'shield' | 'ring' | 'amulet';

export interface EquipmentStats {
  accuracy?: number;
  maxHit?: number;
  meleeDefence?: number;
  rangedDefence?: number;
  magicDefence?: number;
  attackSpeed?: number; // ms
}

export interface ItemMeta {
  emoji: string;
  label: string;
  sellValue: number;
  description: string;
  type: ItemType;
  equipSlot?: EquipSlot;
  equipmentStats?: EquipmentStats;
  healAmount?: number;
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

  // ── Bars (Smithing) ──
  bronze_bar: { emoji: '🟤', label: 'Bronze Bar', sellValue: 15, description: 'Copper and tin smelted together. The foundation of smithing.', type: 'bar' },
  iron_bar: { emoji: '⚙️', label: 'Iron Bar', sellValue: 35, description: 'Refined iron ore. Sturdy and versatile.', type: 'bar' },
  steel_bar: { emoji: '🔩', label: 'Steel Bar', sellValue: 75, description: 'Iron strengthened with coal. Essential for mid-tier gear.', type: 'bar' },
  gold_bar: { emoji: '🟡', label: 'Gold Bar', sellValue: 120, description: 'Pure gold. Used in jewellery and high-end crafting.', type: 'bar' },
  mithril_bar: { emoji: '🔵', label: 'Mithril Bar', sellValue: 200, description: 'A rare metal with a faint blue shimmer.', type: 'bar' },
  adamant_bar: { emoji: '🟢', label: 'Adamant Bar', sellValue: 400, description: 'Extremely hard. The pinnacle of non-cosmic metalwork.', type: 'bar' },
  runite_bar: { emoji: '🛸', label: 'Runite Bar', sellValue: 1000, description: 'Endgame metal. Humming with latent energy.', type: 'bar' },

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

  // ── Food (Cooking) ──
  cooked_shrimp: { emoji: '🍤', label: 'Cooked Shrimp', sellValue: 5, description: 'Perfectly grilled shrimp. Restores a little health.', type: 'food', healAmount: 30 },
  cooked_sardine: { emoji: '🐟', label: 'Cooked Sardine', sellValue: 12, description: 'Flaky and delicious. A staple of Valdorian cuisine.', type: 'food', healAmount: 40 },
  cooked_herring: { emoji: '🐟', label: 'Cooked Herring', sellValue: 22, description: 'Smoked herring. Rich and nourishing.', type: 'food', healAmount: 50 },
  cooked_trout: { emoji: '🎣', label: 'Cooked Trout', sellValue: 45, description: 'Grilled trout with a crispy skin. A favourite.', type: 'food', healAmount: 70 },
  cooked_salmon: { emoji: '🐠', label: 'Cooked Salmon', sellValue: 80, description: 'Perfectly cooked salmon. Premium healing.', type: 'food', healAmount: 90 },
  cooked_tuna: { emoji: '🐡', label: 'Cooked Tuna', sellValue: 140, description: 'Seared tuna steak. Substantial nourishment.', type: 'food', healAmount: 100 },
  cooked_lobster: { emoji: '🦞', label: 'Cooked Lobster', sellValue: 210, description: 'Buttered lobster tail. A luxury meal.', type: 'food', healAmount: 120 },
  cooked_swordfish: { emoji: '🐬', label: 'Cooked Swordfish', sellValue: 300, description: 'Grilled swordfish. Fills you right up.', type: 'food', healAmount: 140 },
  cooked_shark: { emoji: '🦈', label: 'Cooked Shark', sellValue: 550, description: 'Cooked shark steak. Massive healing potential.', type: 'food', healAmount: 200 },
  cooked_cosmic_jellyfish: { emoji: '🪼', label: 'Cooked Cosmic Jellyfish', sellValue: 1200, description: 'Somehow cooked. Defies culinary logic. Restores the soul.', type: 'food', healAmount: 300 },

  // ── Harvesting (plants, fibers) ──
  wheat: { emoji: '🌾', label: 'Wheat', sellValue: 2, description: 'Basic grain. Used in cooking and brewing.', type: 'other' },
  cabbage: { emoji: '🥬', label: 'Cabbage', sellValue: 5, description: 'A hearty vegetable. Good for stews.', type: 'other' },
  tomato: { emoji: '🍅', label: 'Tomato', sellValue: 8, description: 'Ripe and red. Essential for sauces.', type: 'other' },
  sweetcorn: { emoji: '🌽', label: 'Sweetcorn', sellValue: 15, description: 'Golden kernels. A staple crop.', type: 'other' },
  strawberry: { emoji: '🍓', label: 'Strawberry', sellValue: 25, description: 'Sweet and fragrant. Used in potions.', type: 'other' },
  snape_grass: { emoji: '🌿', label: 'Snape Grass', sellValue: 50, description: 'Magical herb. Key ingredient for high-tier alchemy.', type: 'other' },
  void_cap_mushroom: { emoji: '🍄', label: 'Void Cap Mushroom', sellValue: 120, description: 'Grows near reality tears. Unsettling to hold.', type: 'other' },

  // ── Scavenging (ruins, debris) ──
  rusty_scrap: { emoji: '🔩', label: 'Rusty Scrap', sellValue: 3, description: 'Old metal from forgotten settlements.', type: 'other' },
  discarded_tech: { emoji: '⚙️', label: 'Discarded Tech', sellValue: 20, description: 'Ancient machinery. Still hums faintly.', type: 'other' },
  fey_trinket: { emoji: '✨', label: 'Fey Trinket', sellValue: 60, description: 'A small charm from the Fey Markets. Glimmers oddly.', type: 'other' },
  celestial_fragment: { emoji: '☄️', label: 'Celestial Fragment', sellValue: 150, description: 'A shard from the Skyward Peaks. Warm to touch.', type: 'other' },
  voidmire_crystal: { emoji: '🕳️', label: 'Voidmire Crystal', sellValue: 400, description: 'Condensed void energy. Pulses with dark power.', type: 'other' },

  // ── Astrology (Stardust) ──
  stardust: { emoji: '✨', label: 'Stardust', sellValue: 10, description: 'Glimmering dust from the cosmos. Used to uncover celestial mysteries.', type: 'other' },
  golden_stardust: { emoji: '🌟', label: 'Golden Stardust', sellValue: 50, description: 'Rare stardust that hums with ancient power.', type: 'other' },
  meteorite: { emoji: '☄️', label: 'Meteorite', sellValue: 200, description: 'A chunk of fallen star. Extremely dense.', type: 'other' },

  // ── Herblore (vials & potions) ──
  empty_vial: { emoji: '🧪', label: 'Empty Vial', sellValue: 5, description: 'A glass vial for brewing potions. Buy from Nick or find in ruins.', type: 'other' },
  minor_healing_potion: { emoji: '🧪', label: 'Minor Healing Potion', sellValue: 25, description: 'Restores a small amount of health. Brewed from wheat.', type: 'potion' },
  strength_elixir: { emoji: '💪', label: 'Strength Elixir', sellValue: 45, description: 'Temporarily boosts strength. Brewed from cabbage.', type: 'potion' },
  agility_tonic: { emoji: '🏃', label: 'Agility Tonic', sellValue: 80, description: 'Increases agility for a short time. Brewed from tomato.', type: 'potion' },
  defence_brew: { emoji: '🛡️', label: 'Defence Brew', sellValue: 120, description: 'Hardens the skin. Brewed from sweetcorn.', type: 'potion' },
  xp_boost_potion: { emoji: '✨', label: 'XP Boost Potion', sellValue: 200, description: 'Grants bonus XP for a period. Brewed from strawberry.', type: 'potion' },
  natures_blessing: { emoji: '🌿', label: "Nature's Blessing", sellValue: 350, description: 'A powerful restorative. Brewed from snape grass.', type: 'potion' },
  void_resistance_potion: { emoji: '🕳️', label: 'Void Resistance', sellValue: 600, description: 'Reduces void damage. Brewed from void cap mushroom.', type: 'potion' },

  // ── Monster Drops ──
  bones: { emoji: '🦴', label: 'Bones', sellValue: 1, description: 'Burying gives prayer experience.', type: 'other' },
  raw_chicken: { emoji: '🍗', label: 'Raw Chicken', sellValue: 5, description: 'Plucked poultry.', type: 'food' },
  feathers: { emoji: '🪶', label: 'Feathers', sellValue: 1, description: 'Useful for fletching.', type: 'other' },
  leather_hide: { emoji: '🐄', label: 'Leather Hide', sellValue: 10, description: 'Can be crafted into leather.', type: 'other' },
  raw_beef: { emoji: '🥩', label: 'Raw Beef', sellValue: 8, description: 'Uncooked cow meat.', type: 'food' },
  raw_pork: { emoji: '🥓', label: 'Raw Pork', sellValue: 12, description: 'Uncooked pig meat.', type: 'food' },
  bad_meat: { emoji: '🍖', label: 'Bad Meat', sellValue: 2, description: 'Meat from a wild beast. Tastes terrible.', type: 'other' },

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

  // ── Equipment (Forging: bars → weapons & armour) ──
  bronze_dagger: { emoji: '🗡️', label: 'Bronze Dagger', sellValue: 25, description: 'A simple bronze blade. Good for beginners.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 1800, accuracy: 2, maxHit: 1 } },
  bronze_shortsword: { emoji: '⚔️', label: 'Bronze Shortsword', sellValue: 45, description: 'A compact bronze blade. Quick and light.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 3, maxHit: 2 } },
  bronze_longsword: { emoji: '⚔️', label: 'Bronze Longsword', sellValue: 50, description: 'A longer bronze blade. Reach and power.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3000, accuracy: 4, maxHit: 3 } },
  bronze_scimitar: { emoji: '⚔️', label: 'Bronze Scimitar', sellValue: 48, description: 'A curved bronze blade. Favoured by desert warriors.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 4, maxHit: 2 } },
  bronze_2h_longblade: { emoji: '🗡️', label: 'Bronze 2H Longblade', sellValue: 70, description: 'A two-handed bronze greatsword. Devastating swings.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3600, accuracy: 5, maxHit: 5 } },
  bronze_half_helmet: { emoji: '⛑️', label: 'Bronze Half Helmet', sellValue: 30, description: 'Light bronze head protection.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 2, rangedDefence: 1, magicDefence: 0 } },
  bronze_full_helmet: { emoji: '🪖', label: 'Bronze Full Helmet', sellValue: 55, description: 'Full bronze helm. Sturdy for its tier.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 3, rangedDefence: 2, magicDefence: -1 } },
  bronze_platebody: { emoji: '🛡️', label: 'Bronze Platebody', sellValue: 80, description: 'Bronze chest armour. Covers the torso.', type: 'equipment', equipSlot: 'body', equipmentStats: { meleeDefence: 8, rangedDefence: 6, magicDefence: -4 } },
  bronze_shield: { emoji: '🛡️', label: 'Bronze Shield', sellValue: 50, description: 'A small bronze shield. Blocks incoming blows.', type: 'equipment', equipSlot: 'shield', equipmentStats: { meleeDefence: 6, rangedDefence: 5, magicDefence: -3 } },
  iron_dagger: { emoji: '🗡️', label: 'Iron Dagger', sellValue: 60, description: 'A reliable iron blade.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 1800, accuracy: 4, maxHit: 2 } },
  iron_shortsword: { emoji: '⚔️', label: 'Iron Shortsword', sellValue: 110, description: 'A compact iron blade. Quick and reliable.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 6, maxHit: 4 } },
  iron_longsword: { emoji: '⚔️', label: 'Iron Longsword', sellValue: 120, description: 'A longer iron blade. Solid reach.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3000, accuracy: 8, maxHit: 6 } },
  iron_scimitar: { emoji: '⚔️', label: 'Iron Scimitar', sellValue: 115, description: 'A curved iron blade. Slashing edge.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 8, maxHit: 4 } },
  iron_2h_longblade: { emoji: '🗡️', label: 'Iron 2H Longblade', sellValue: 165, description: 'A two-handed iron greatsword. Heavy but effective.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3600, accuracy: 10, maxHit: 10 } },
  iron_half_helmet: { emoji: '⛑️', label: 'Iron Half Helmet', sellValue: 70, description: 'Iron skullcap. Better protection.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 4, rangedDefence: 2, magicDefence: 0 } },
  iron_full_helmet: { emoji: '🪖', label: 'Iron Full Helmet', sellValue: 130, description: 'Full iron helm. Solid mid-tier armour.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 6, rangedDefence: 4, magicDefence: -2 } },
  iron_platebody: { emoji: '🛡️', label: 'Iron Platebody', sellValue: 200, description: 'Iron chest armour. Solid protection.', type: 'equipment', equipSlot: 'body', equipmentStats: { meleeDefence: 16, rangedDefence: 12, magicDefence: -8 } },
  iron_shield: { emoji: '🛡️', label: 'Iron Shield', sellValue: 130, description: 'An iron shield. Reliable defence.', type: 'equipment', equipSlot: 'shield', equipmentStats: { meleeDefence: 12, rangedDefence: 10, magicDefence: -6 } },
  steel_dagger: { emoji: '🗡️', label: 'Steel Dagger', sellValue: 120, description: 'A sharp steel blade.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 1800, accuracy: 6, maxHit: 3 } },
  steel_shortsword: { emoji: '⚔️', label: 'Steel Shortsword', sellValue: 220, description: 'A compact steel blade. Keen edge.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 9, maxHit: 6 } },
  steel_longsword: { emoji: '⚔️', label: 'Steel Longsword', sellValue: 240, description: 'A longer steel blade. Excellent balance.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3000, accuracy: 12, maxHit: 9 } },
  steel_scimitar: { emoji: '⚔️', label: 'Steel Scimitar', sellValue: 230, description: 'A curved steel blade. Swift slashes.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 12, maxHit: 6 } },
  steel_2h_longblade: { emoji: '🗡️', label: 'Steel 2H Longblade', sellValue: 330, description: 'A two-handed steel greatsword. Formidable.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3600, accuracy: 15, maxHit: 15 } },
  steel_half_helmet: { emoji: '⛑️', label: 'Steel Half Helmet', sellValue: 140, description: 'Steel skullcap. Strong and light.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 6, rangedDefence: 3, magicDefence: 0 } },
  steel_full_helmet: { emoji: '🪖', label: 'Steel Full Helmet', sellValue: 260, description: 'Full steel helm. Excellent protection.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 9, rangedDefence: 6, magicDefence: -3 } },
  steel_platebody: { emoji: '🛡️', label: 'Steel Platebody', sellValue: 400, description: 'Steel chest armour. Heavy but strong.', type: 'equipment', equipSlot: 'body', equipmentStats: { meleeDefence: 24, rangedDefence: 18, magicDefence: -12 } },
  steel_shield: { emoji: '🛡️', label: 'Steel Shield', sellValue: 260, description: 'A steel shield. Solid mid-tier defence.', type: 'equipment', equipSlot: 'shield', equipmentStats: { meleeDefence: 18, rangedDefence: 15, magicDefence: -9 } },
  mithril_dagger: { emoji: '🗡️', label: 'Mithril Dagger', sellValue: 350, description: 'A blade with a faint blue shimmer.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 1800, accuracy: 10, maxHit: 5 } },
  mithril_shortsword: { emoji: '⚔️', label: 'Mithril Shortsword', sellValue: 650, description: 'A mithril shortsword. Light and deadly.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 15, maxHit: 10 } },
  mithril_longsword: { emoji: '⚔️', label: 'Mithril Longsword', sellValue: 700, description: 'A mithril longsword. Surprisingly light.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3000, accuracy: 20, maxHit: 15 } },
  mithril_scimitar: { emoji: '⚔️', label: 'Mithril Scimitar', sellValue: 680, description: 'A curved mithril blade. Swift and elegant.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 20, maxHit: 10 } },
  mithril_2h_longblade: { emoji: '🗡️', label: 'Mithril 2H Longblade', sellValue: 950, description: 'A two-handed mithril greatsword. Devastating.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3600, accuracy: 25, maxHit: 25 } },
  mithril_half_helmet: { emoji: '⛑️', label: 'Mithril Half Helmet', sellValue: 400, description: 'Mithril skullcap. Light yet strong.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 10, rangedDefence: 5, magicDefence: 0 } },
  mithril_full_helmet: { emoji: '🪖', label: 'Mithril Full Helmet', sellValue: 750, description: 'Full mithril helm. Rare and prized.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 15, rangedDefence: 10, magicDefence: -5 } },
  mithril_platebody: { emoji: '🛡️', label: 'Mithril Platebody', sellValue: 1200, description: 'Mithril chest armour. Light and strong.', type: 'equipment', equipSlot: 'body', equipmentStats: { meleeDefence: 40, rangedDefence: 30, magicDefence: -20 } },
  mithril_shield: { emoji: '🛡️', label: 'Mithril Shield', sellValue: 750, description: 'A mithril shield. Surprisingly light.', type: 'equipment', equipSlot: 'shield', equipmentStats: { meleeDefence: 30, rangedDefence: 25, magicDefence: -15 } },
  adamant_dagger: { emoji: '🗡️', label: 'Adamant Dagger', sellValue: 700, description: 'An extremely hard blade.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 1800, accuracy: 16, maxHit: 8 } },
  adamant_shortsword: { emoji: '⚔️', label: 'Adamant Shortsword', sellValue: 1300, description: 'An adamant shortsword. Devastating.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 24, maxHit: 16 } },
  adamant_longsword: { emoji: '⚔️', label: 'Adamant Longsword', sellValue: 1400, description: 'An adamant longsword. Nearly unbreakable.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3000, accuracy: 32, maxHit: 24 } },
  adamant_scimitar: { emoji: '⚔️', label: 'Adamant Scimitar', sellValue: 1350, description: 'A curved adamant blade. Razor edge.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 32, maxHit: 16 } },
  adamant_2h_longblade: { emoji: '🗡️', label: 'Adamant 2H Longblade', sellValue: 1900, description: 'A two-handed adamant greatsword. The pinnacle of metalwork.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3600, accuracy: 40, maxHit: 40 } },
  adamant_half_helmet: { emoji: '⛑️', label: 'Adamant Half Helmet', sellValue: 800, description: 'Adamant skullcap. Top-tier protection.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 16, rangedDefence: 8, magicDefence: 0 } },
  adamant_full_helmet: { emoji: '🪖', label: 'Adamant Full Helmet', sellValue: 1500, description: 'Full adamant helm. The pinnacle of metalwork.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 24, rangedDefence: 16, magicDefence: -8 } },
  adamant_platebody: { emoji: '🛡️', label: 'Adamant Platebody', sellValue: 2400, description: 'Adamant chest armour. Nearly impenetrable.', type: 'equipment', equipSlot: 'body', equipmentStats: { meleeDefence: 64, rangedDefence: 48, magicDefence: -32 } },
  adamant_shield: { emoji: '🛡️', label: 'Adamant Shield', sellValue: 1500, description: 'An adamant shield. Top-tier defence.', type: 'equipment', equipSlot: 'shield', equipmentStats: { meleeDefence: 48, rangedDefence: 40, magicDefence: -24 } },
  runite_dagger: { emoji: '🗡️', label: 'Runite Dagger', sellValue: 2500, description: 'A blade humming with latent energy.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 1800, accuracy: 28, maxHit: 14 } },
  runite_shortsword: { emoji: '⚔️', label: 'Runite Shortsword', sellValue: 5000, description: 'A runite shortsword. The finest blade.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 42, maxHit: 28 } },
  runite_longsword: { emoji: '⚔️', label: 'Runite Longsword', sellValue: 5500, description: 'A runite longsword. Humming with power.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3000, accuracy: 56, maxHit: 42 } },
  runite_scimitar: { emoji: '⚔️', label: 'Runite Scimitar', sellValue: 5200, description: 'A curved runite blade. Cosmic edge.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 2400, accuracy: 56, maxHit: 28 } },
  runite_2h_longblade: { emoji: '🗡️', label: 'Runite 2H Longblade', sellValue: 7500, description: 'A two-handed runite greatsword. Endgame devastation.', type: 'equipment', equipSlot: 'weapon', equipmentStats: { attackSpeed: 3600, accuracy: 70, maxHit: 70 } },
  runite_half_helmet: { emoji: '⛑️', label: 'Runite Half Helmet', sellValue: 2800, description: 'Runite skullcap. Endgame protection.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 28, rangedDefence: 14, magicDefence: 0 } },
  runite_full_helmet: { emoji: '🪖', label: 'Runite Full Helmet', sellValue: 5500, description: 'Full runite helm. The apex of metalwork.', type: 'equipment', equipSlot: 'head', equipmentStats: { meleeDefence: 42, rangedDefence: 28, magicDefence: -14 } },
  runite_platebody: { emoji: '🛡️', label: 'Runite Platebody', sellValue: 9000, description: 'Runite chest armour. Humming with power.', type: 'equipment', equipSlot: 'body', equipmentStats: { meleeDefence: 112, rangedDefence: 84, magicDefence: -56 } },
  runite_shield: { emoji: '🛡️', label: 'Runite Shield', sellValue: 5500, description: 'A runite shield. Endgame defence.', type: 'equipment', equipSlot: 'shield', equipmentStats: { meleeDefence: 84, rangedDefence: 70, magicDefence: -42 } },

  // ── Gems (Mining rare drops) ──
  sapphire: { emoji: '💎', label: 'Sapphire', sellValue: 50, description: 'A blue gem. Found while mining iron and above.', type: 'other' },
  emerald: { emoji: '💚', label: 'Emerald', sellValue: 100, description: 'A green gem. Found while mining coal and above.', type: 'other' },
  ruby: { emoji: '❤️', label: 'Ruby', sellValue: 200, description: 'A red gem. Found while mining mithril and above.', type: 'other' },
  diamond: { emoji: '🔷', label: 'Diamond', sellValue: 500, description: 'A brilliant diamond. Found while mining adamant and above.', type: 'other' },
};

const UNKNOWN: ItemMeta = { emoji: '❓', label: 'Unknown Item', sellValue: 1, description: 'An unregistered item.', type: 'other' };

export function getItemMeta(id: string): ItemMeta {
  const meta = ITEM_META[id];
  if (meta) return meta;

  // Handle dynamic equipment refining (e.g., "iron_dagger+2")
  const refineMatch = id.match(/^(.+)\+(\d+)$/);
  if (refineMatch) {
    const baseId = refineMatch[1];
    const refineLevel = parseInt(refineMatch[2], 10);
    const baseMeta = ITEM_META[baseId];

    if (baseMeta && baseMeta.type === 'equipment' && baseMeta.equipmentStats) {
      const stats = { ...baseMeta.equipmentStats };

      // Scale stats based on refine level (+10% or +1 flat per level)
      if (stats.accuracy !== undefined) stats.accuracy += Math.ceil((stats.accuracy * 0.1) * refineLevel) + refineLevel;
      if (stats.maxHit !== undefined) stats.maxHit += Math.ceil((stats.maxHit * 0.1) * refineLevel) + Math.floor(refineLevel / 2);
      if (stats.meleeDefence !== undefined) stats.meleeDefence += Math.ceil((stats.meleeDefence * 0.1) * refineLevel) + refineLevel;
      if (stats.rangedDefence !== undefined) stats.rangedDefence += Math.ceil((stats.rangedDefence * 0.1) * refineLevel) + refineLevel;
      if (stats.magicDefence !== undefined && stats.magicDefence !== 0) {
        // Negative magic def shouldn't get better (more negative?), but positive should scale. 
        // For simplicity, just increase the magnitude.
        stats.magicDefence += Math.sign(stats.magicDefence) * (Math.ceil(Math.abs(stats.magicDefence) * 0.1) * refineLevel + refineLevel);
      }

      return {
        ...baseMeta,
        label: `${baseMeta.label} +${refineLevel}`,
        // Sell value scales infinitely: +50% of base per level
        sellValue: Math.floor(baseMeta.sellValue * (1 + 0.5 * refineLevel)),
        description: `A refined ${baseMeta.label.toLowerCase()}, elevated to +${refineLevel} via the forge.`,
        equipmentStats: stats,
      };
    }
  }

  return { ...UNKNOWN, label: id.replace(/_/g, ' ') };
}

/** Nick's Shop — items the merchant sells and their buy price (gold per unit). [TRACE: ROADMAP 2.3] */
export const SHOP_CATALOG: { id: string; buyPrice: number }[] = [
  { id: 'copper_ore', buyPrice: 8 },
  { id: 'tin_ore', buyPrice: 8 },
  { id: 'iron_ore', buyPrice: 28 },
  { id: 'coal', buyPrice: 42 },
  { id: 'gold_ore', buyPrice: 110 },
  { id: 'empty_vial', buyPrice: 15 },
];
