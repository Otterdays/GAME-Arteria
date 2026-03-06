/**
 * Patch History — Full changelog from CHANGELOG.md.
 * [TRACE: DOCU/CHANGELOG.md] Keep in sync when shipping new versions.
 * Current release: 0.5.0 "Big Weeds Update".
 */

export interface PatchEntry {
  version: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
}

export const PATCH_HISTORY: PatchEntry[] = [
  {
    version: '0.5.0',
    date: '2026-03-05',
    added: [
      '🛡️ Coming Soon Skills: Leadership, Adventure, Dungeon Dwelling, Construction added in Coming Soon mode.',
      '📝 Dynamic Update Board & Coming Soon UI implementation.',
      '🌿 Big Weeds Update & Combat Alpha: Harvesting, Scavenging, Herblore, Bank OSRS redesign, World Exploration, Auto-battler loop, Lumina Shop, Mastery expansion.',
      '⚔️ Combat Alpha: Active 100ms auto-battler loop. 4 combat zones with 7 enemies (Goblin, Wolves, Farm animals). Drop tables, passive HP regen, food eating, combat styles.',
      '🪴 Harvesting & Scavenging: 7 harvest nodes, 5 scavenge nodes. Quick-Switch, thump SFX.',
      '🧪 Herblore: 7 potion recipes (herb + vial). Buy vials from Nick. Bank Potions filter. Pet Fizz.',
      '🏦 Bank OSRS-style: Main tab + up to 6 custom tabs. Tab bar + type filters. Long-press item to create tab. Remember last tab.',
      '✨ Prayer Skill & Bestiary Drops: Gain Prayer XP by burying bones. 12 prayers to unlock and use in combat (Accuracy/Str/Def/Damage Reduction). Enemies now drop Raw Chicken, Feathers, Raw Beef, Leather Hide, Raw Pork, and Bad Meat.',
      '🗺️ World Exploration: Explore tab = World Map. 6 locations, tap to travel. Location screen with NPCs, Shop, Quests.',
      '✨ Lumina Shop: Reroll Daily Quests (5 Lumina, 2/day), XP Boost 1h (15 Lumina).',
      '📈 Mastery: Yield +3%/level, Speed +4%/level (max 3 each) for all 10 skills. Pillar UI in Settings. 20 new unique skill-specific upgrades (double-drops, preserve resources).',
      '🏅 MasteryBadges: Active mastery bonuses (📖 XP, 📦 yield, ⚡ speed) shown as gold badges on every skill screen.',
      '📅 Daily Quests expanded: 30 templates across all 10 skills (was 14). Smithing bars, forging daggers, harvest crops, scavenged loot, herblore potions.',
      '📅 Daily Quest log: All-time completed counter on Quests screen. Each claim logged to Activity Log.',
      '💬 New NPCs: Bianca the Herbalist, Kate the Traveler. NPCs in Town on Quests tab.',
      '📐 Skills architecture: DOCU/SKILLS_ARCHITECTURE.md — Farming, Agility, Thieving, Crafting pre-implementation design.',
      '🏷️ ComingSoonBadge: Red (planned) or green (in progress). Skills grid, Location, Explore, Combat.',
      '🎭 Thieving skill: Added to skill roster. Coming soon on Skills screen.',
      '⚒️ Forging weapons: Dagger, shortsword, longsword, scimitar, 2H Longblade + armour. 54 recipes across 6 tiers. Runite story-gated.',
      '🏹 Fletching & Tailoring: New planned skills on Skills grid (red Coming Soon). Arrows/bows from logs; gloves/hats/shoes/boots from cloth.',
      '💎 Gems: Rare mining drops — Sapphire (Iron+), Emerald (Coal+), Ruby (Mithril+), Diamond (Adamant+). Bank → Other.',
    ],
  },
  {
    version: '0.4.4',
    date: '2026-03-05',
    added: [
      '🧪 Herblore skill: Brew herbs + empty vials into potions. 7 recipes from Minor Healing to Void Resistance. Uses wheat, cabbage, tomato, sweetcorn, strawberry, snape_grass, void_cap_mushroom.',
      '🧪 Empty vials: Buy from Nick\'s Shop (15 gp). Required for all herblore recipes.',
      '🧪 Bank Potions filter: New filter for potion items. Stats track "Potions brewed".',
      '🧪 Herblore pet Fizz: A tiny cauldron. Rare drop while brewing.',
    ],
  },
  {
    version: '0.4.3',
    date: '2026-03-05',
    added: [
      '🪴 Harvesting skill: 7 nodes from Wheat Field to Void Caps. Gather wheat, cabbage, tomato, sweetcorn, strawberry, snape_grass, void_cap_mushroom. Full XP bar, node cards, thump SFX on tick.',
      '🏕️ Scavenging skill: 5 nodes from Surface Ruins to Void Rupture. Loot rusty_scrap, discarded_tech, fey_trinket, celestial_fragment, voidmire_crystal. Same polished UI as other gathering skills.',
      '⚡ Quick-Switch Sidebar: Harvesting and Scavenging added to the skill drawer.',
    ],
  },
  {
    version: '0.4.2',
    date: '2026-03-05',
    added: [
      '🐾 Skill Pets: Rare companion drops from skilling. Find pets by training — each skill has its own unique pet. Equip one in Settings → Pets to display it on the Skills screen.',
      '🔊 Tick SFX: Each skill now plays a unique sound on every successful tick (tink for mining, thump for logging, splash for fishing). Settings → Audio to toggle.',
      '🔗 Dev server fix: Metro now binds to your LAN IP so your phone can connect over Wi-Fi without needing a manual IP entry.',
    ],
    fixed: [
      'Dev server --localhost flag removed; phone can now reach Metro over Wi-Fi again.',
    ],
  },
  {
    version: '0.4.1',
    date: '2026-03-03',
    added: [
      '👤 The Anchor Man: Main character & nickname. First-time NameEntryModal when no save; canonical name "The Anchor"; player chooses nickname (or Skip). Settings → Character to change. Skills header "Welcome, [name]".',
      '👹 Goblin — first random enemy: Goblin Peek random event during skilling; GoblinPeekModal shows goblin SVG when event fires. constants/enemies.ts. Bestiary: Combat tab "Enemies Spotted" section; player.seenEnemies tracks encountered foes.',
      '🍳 Cooking skill: 10 recipes (raw fish → cooked food). Shrimp to Cosmic Jellyfish. Bank Food filter. Daily quests: Cook Shrimp, Cook Trout. Stats: Food cooked.',
      '📖 Bestiary stub: Combat tab shows enemies you\'ve spotted. Recorded when goblin_peek fires.',
    ],
    fixed: ['Bank crash: Missing ScrollView import caused crash when opening Bank tab.'],
  },
  {
    version: '0.4.0',
    date: '2026-03-03',
    added: [
      '📅 Daily quests: Three random gather objectives per day, reset at midnight. Quests screen Daily section with progress and Claim (gold + Lumina). Templates in constants/dailyQuests.ts.',
      '📊 Detailed stats: New Stats tab. Tracks total gathered by type (ore, log, fish, rune, bar, equipment), first/last play, days since first play. addItems updates stats.',
      '📁 Custom bank tabs: Create tabs (name + emoji) via "+ Tabs"; assign items from item detail. Filter row shows custom tabs.',
      '🗑️ Sell All Junk: Mark items as junk in item detail (configurable). Sell All Junk button in Bank sells all junk; respects locked.',
      '🎁 Login bonus: 7-day escalating rewards. Skills screen banner when claimable; Settings shows streak and next reward. Day 7 grants 10 Lumina.',
      '✨ Lumina currency UI: Premium currency in Bank/Shop headers and Settings. Day 7 login bonus grants Lumina.',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-03-03',
    added: [
      '🎨 Theme Engine: Settings → Appearance → Theme picker (System, Dark, Light, Sepia). Tab bar, headers, StatusBar follow selected theme. paletteToNavigationTheme(), NavThemeWrapper, persisted with save.',
      '⚡ Quick-Switch Sidebar: Floating pill on left edge in skill screens. Slide-in drawer to jump Mining, Logging, Fishing, Runecrafting, Smithing, Forging. Active skill gold highlight. Shared constants/skills.ts.',
      '🔨 Smithing: Smelting skill. Ore → bars (Bronze, Iron, Steel, Gold, Mithril, Adamant, Runite). Consumes ore per tick; produces bars. Runite gated by narrative.',
      '⚒️ Forging: New skill. Bars → equipment (daggers, half helmets, full helmets). 15 recipes grouped by metal tier (Bronze, Iron, Steel, Mithril, Adamant). Bank Equipment filter.',
      '📜 Activity Log: Skills screen 📜 button opens modal. Logs random events, level-ups, skill starts. Max 50 entries, session-based.',
      '🎲 Random Events: Blibbertooth\'s Blessing, Cosmic Sneeze, Genie\'s Gift, Treasure Chest, Lucky Strike. Per-tick roll (~0.5% base, 60-tick cooldown). player.randomEvents state.',
      'AI versioning reminder in doc heads.',
      '📋 UX batch: Bank sort (Name/Qty/Value), empty state Clear filter, Shop Buy 25/50/Max, Quests dev button __DEV__ only, HorizonHUD Grind label, Skills 2-col narrow, Combat Phase 4 teaser, Idle Soundscapes "coming soon".',
      '📜 Quest completion: Complete button only when all steps done; applying rewards (gold, XP, flags, items) on complete.',
      '📜 Quest step auto-complete: Engine step completionRequirements + getQuestStepsToComplete; app runs check and completes steps when inventory/skills meet requirements.',
      '⭐ Mastery: 1 point per level-up per skill. Settings → Mastery: spend on +5% XP (and other buffs). Permanent; applied in XP calc.',
    ],
  },
  {
    version: '0.2.7',
    date: '2026-03-03',
    added: [
      '🎣 Fishing Skill: 10 fishing spots from Shrimp (Lv. 1) to Cosmic Jellyfish (Lv. 90). Area-grouped UI with bobbing animation.',
      '✨ Runecrafting Skill: Mine essence (Rune Essence, Pure Essence, Cosmic Shard) and bind it at 14 rune altars to produce all 14 rune types (Air → Void).',
      '⚙️ Smart Game Loop: The action system now tracks and consumes inventory items per tick. Tasks like Runecrafting auto-stop when you run out of essence.',
      '🏦 Bank Filters: Added "Fish" and "Runes" tabs to the Bank screen filter strip.',
      '⛏️ Mining: Added 3 new essence veins — Rune Essence (Lv. 1), Pure Essence (Lv. 30), Cosmic Shard Vein (Lv. 65, narrative-gated).',
      '⚙️ Confirm Task Switch: New setting (Settings → Gameplay). When on, switching to a different task while one is active shows a confirmation dialog.',
      '🔋 Battery Saver: New setting (Settings → Gameplay). After 5 min with no touch, a dim overlay appears to save battery; touch anywhere to dismiss.',
      '🥚 Easter egg: "Don\'t Push This" button in Settings. Press 1,000 times to unlock the title "The Stubborn".',
      '🔔 Notifications: Level Up Alerts, Task Complete, and Idle Cap Reached toggles wired and persisted. Idle Cap Reached schedules a local notification when you background the app so you get notified when 24h/7-day offline cap is full.',
      '🔊 Idle Soundscapes: New Audio toggle; stub hook ready for ambient loops per skill (e.g. forge, waves).',
      '📋 Horizon HUD toggle: Settings → Gameplay. Turn off to hide the 3 goal cards (Immediate / Session / Grind) under the skill XP bar on the Skills screen.',
      '🔧 Settings touch fix: Whole row is now pressable for toggle rows; no more dead zones.',
      '✨ Runecrafting: Requirements indicator on each altar card (Lv. X, essence/batch, Story lock).',
    ],
  },
  {
    version: '0.2.6',
    date: '2026-03-02',
    added: [
      'Lore Expansion: Branching NPC dialogue system (DialogueOverlay) with Redux-driven dialogue trees.',
      'Narrative Gating: Skill nodes can now be locked behind quest flags (e.g. Runite Vein requires knowing about the Sneeze Cult).',
      'Quest Ledger: New Quests tab automatically sorts Active, Completed, and Available quests.',
      'Website: Glassmorphism overhaul with dynamic backdrop-blur cards.',
    ],
  },
  {
    version: '0.2.5',
    date: '2026-02-28',
    added: [
      'Release build: Smaller APKs via ABI split (arm64 + armv7) and lean production mode (dev-client excluded).',
      'Local build script sets ARTERIA_LEAN_PROD=1; output: app-arm64-v8a-release.apk (~31 MB), app-armeabi-v7a-release.apk (~25 MB).',
    ],
  },
  {
    version: '0.2.4',
    date: '2026-02-28',
    added: [
      'AnimatedNumber: Smooth XP and Gold tickers. BouncyButton across Skills and nodes. ActivePulseGlow and tick shake (Mining, Logging).',
    ],
  },
  {
    version: '0.2.3',
    date: '2026-02-27',
    added: [
      'Logging skill UI, log items, Logs filter. Shop 50% sell modifier. Curse system (TickSystem). Horizon (3-tier goal HUD), rare gems, mythic fish, Seasonal Rotation. Patch Notes screen.',
    ],
    fixed: ['Slot cap in Bank. Local APK build. Monorepo bundling.'],
  },
  {
    version: '0.2.2',
    date: '2026-02-26',
    added: [
      'Bank search + filters. Train Toast, pulsing tab glow, Loot Vacuum. XP Bar Pulse, Haptic Heartbeat, Inventory Full "!". SmoothProgressBar (60fps).',
    ],
    fixed: ['GlobalActionTicker hooks. APK build.'],
  },
  {
    version: '0.2.1',
    date: '2026-02-26',
    added: [
      'Global Action Ticker, Header XP Dashboard, MaterialCommunityIcons. Custom back nav, edge-to-edge Android.',
    ],
    fixed: ['Ticker in sub-screens. Node progress bars. Gesture bar overlap.'],
  },
  {
    version: '0.2.0',
    date: '2026-02-26',
    added: [
      'Pipeline & Gathering: Core loop, Mining (Copper–Cosmic), gathering data, Skill Pillars, Total Level, XP [current/next], ticks-to-level, wipe save, XP/hr.',
    ],
    fixed: ['State migration. Level Up Toast. Tab insets. Worklets crash.'],
  },
  {
    version: '1.1.0',
    date: '2026-02-26',
    added: [
      'Deployment & Fixes: Batch scripts (Start, EAS OTA, EAS Build). EXPO_GUIDE, MY_ADHD. EAS CLI via npx.',
    ],
    fixed: ['EXPO_ROUTER_APP_ROOT (Babel, metro, index proxy). Recovered screens after reset-project.'],
  },
  {
    version: '1.0.0',
    date: '2026-02-26',
    added: [
      'Persistence & Pipeline: Gradle 9.3, Android prebuild, Melvor palette (30+ tokens), tabs (Skills, Bank, Shop, Combat, Settings). Skills screen, Bank grid, Combat/Shop placeholders. Jest tests.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-02-26',
    added: [
      'Initial scaffold: Expo SDK 54, monorepo (apps/mobile + packages/engine), @arteria/engine, Redux, MMKV, dark theme, 5 tab screens.',
    ],
  },
];
