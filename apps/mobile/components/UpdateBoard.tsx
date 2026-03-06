/**
 * Update Board — In-app modal that pops when the app version changes.
 * Shows the changelog for the new version. Trigger: lastSeenVersion !== currentVersion
 * (from app.json). Dismissing stores currentVersion so it won't show again until next bump.
 * [TRACE: DOCU/SCRATCHPAD.md — Versioning & Update Board]
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Constants from 'expo-constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { Spacing, Radius, FontSize, CardStyle, FontCinzel, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { logger } from '@/utils/logger';

export default function UpdateBoard() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const lastSeenVersion = useAppSelector((s) => s.game.player.lastSeenVersion);
    const isLoaded = useAppSelector((s) => s.game.isLoaded);

    const currentVersion = Constants.expoConfig?.version || '0.1.0';

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isLoaded && lastSeenVersion !== currentVersion) {
            logger.info('UI', `Version bump detected: ${lastSeenVersion ?? 'New User'} -> ${currentVersion}. Opening Update Board.`);
            setVisible(true);
        }
    }, [isLoaded, lastSeenVersion, currentVersion]);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                overlay: {
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: Spacing.lg,
                },
                card: {
                    width: '100%',
                    maxWidth: 400,
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.lg,
                    ...CardStyle,
                    borderColor: palette.border,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 10,
                    maxHeight: '80%',
                },
                boardLabel: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.accentWeb,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    textAlign: 'center',
                    marginBottom: 4,
                },
                title: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.xl,
                    color: palette.accentWeb,
                    textAlign: 'center',
                },
                subtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    marginBottom: Spacing.md,
                },
                scroll: {
                    flexGrow: 0,
                    maxHeight: 400,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    padding: Spacing.md,
                    marginBottom: Spacing.md,
                    borderWidth: 1,
                    borderColor: 'rgba(139, 92, 246, 0.2)',
                },
                scrollContent: { gap: Spacing.md },
                changeBlock: { gap: 4 },
                changeHeader: {
                    fontSize: FontSize.base,
                    fontWeight: '700',
                    color: palette.textPrimary,
                    marginBottom: 2,
                },
                changeText: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    lineHeight: 20,
                },
                footerNote: {
                    fontSize: FontSize.xs,
                    color: palette.textMuted,
                    textAlign: 'center',
                    marginTop: Spacing.md,
                    fontStyle: 'italic',
                },
                button: {
                    backgroundColor: palette.accentPrimary,
                    paddingVertical: 14,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                },
                buttonText: {
                    color: palette.white,
                    fontSize: FontSize.base,
                    fontWeight: '700',
                },
            }),
        [palette]
    );

    if (!visible) return null;

    const handleDismiss = () => {
        logger.debug('UI', 'Update Board dismissed', { version: currentVersion });
        dispatch(gameActions.updateSeenVersion(currentVersion));
        setVisible(false);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            accessibilityLabel="Update Board"
            accessibilityHint="Shows what's new in this version"
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.boardLabel}>Update Board</Text>
                    <Text style={styles.title}>Arteria v{currentVersion}</Text>
                    <Text style={styles.subtitle}>
                        {currentVersion.startsWith('0.5.0') ? 'Big Weeds + Combat Alpha'
                            : currentVersion.startsWith('0.4.4') ? 'Herblore'
                                : currentVersion.startsWith('0.4.3') ? 'Harvesting & Scavenging'
                                    : currentVersion.startsWith('0.4.2') ? 'Skill Pets, Tick SFX & Polish'
                                        : currentVersion.startsWith('0.4.1') ? 'The Anchor Man — Character, Cooking & Bestiary'
                                            : currentVersion.startsWith('0.4') ? 'Daily Quests, Stats, Bank Tabs & Lumina'
                                                : 'Theme Engine, Quick-Switch & Random Events'}
                    </Text>

                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                        {currentVersion.startsWith('0.5.0') ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🛡️ Coming Soon Skills</Text>
                                    <Text style={styles.changeText}>• Leadership, Adventure, Dungeon Dwelling, Construction added. Tap them to see the new stylized popup!</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🌿 Big Weeds Update</Text>
                                    <Text style={styles.changeText}>• Harvesting, Scavenging & Herblore: gather herbs, loot ruins, brew potions. Buy empty vials from Nick. Bank Potions filter. Pet Fizz.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏦 Bank OSRS-style</Text>
                                    <Text style={styles.changeText}>• Main tab + up to 6 custom tabs. Tab bar and type filters. Long-press any item to create a new tab with it. Last tab remembered.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🗺️ World Exploration</Text>
                                    <Text style={styles.changeText}>• Explore tab = World Map. 6 locations. Tap to travel. Location screens with NPCs, Shop, Quests. Frostvale, Fey Markets, and more.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>✨ Lumina Shop & Mastery</Text>
                                    <Text style={styles.changeText}>• Lumina Shop: Reroll Daily Quests (5✨, 2/day), XP Boost 1h (15✨). Mastery: +yield and +speed for all 10 skills. Settings → Mastery.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚔️ Combat System Alpha</Text>
                                    <Text style={styles.changeText}>• Fully playable auto-battler! Equip weapons and armour to boost stats. 4 combat zones with unique enemies (Goblin, Wolves, Farm animals). Kills grant gold and loot drops.</Text>
                                    <Text style={styles.changeText}>• Combat styles: Choose Controlled, Aggressive, Defensive, or Accurate to funnel XP where you want it. Eat food mid-combat. Passive HP regen.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>✨ Prayer Skill & Bestiary Drops</Text>
                                    <Text style={styles.changeText}>• Gain Prayer XP by burying bones. 12 unlockable prayers (Lv.1-60). Activate in combat to boost Accuracy, Strength, Defense, or reduce incoming damage. Drains prayer points per tick.</Text>
                                    <Text style={styles.changeText}>• New bestiary drops: Raw Chicken, Feathers, Raw Beef, Leather Hide, Raw Pork, and Bad Meat.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏅 Mastery Badges & Quests</Text>
                                    <Text style={styles.changeText}>• Gold badges on skill screens show active mastery bonuses (📖 XP, 📦 yield, ⚡ speed). 30 daily quest templates across all 10 skills. All-time quest counter on Quests screen.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>💬 New NPCs</Text>
                                    <Text style={styles.changeText}>• Bianca the Herbalist, Kate the Traveler. Find them in Quests → NPCs in Town. Talk to learn about the world.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏷️ Coming Soon Badges</Text>
                                    <Text style={styles.changeText}>• Red = planned, green = in progress. Unimplemented skills (Thieving, Fletching, Tailoring), locked locations, and Combat show status badges.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚒️ Forging & Gems</Text>
                                    <Text style={styles.changeText}>• 5 weapon types: dagger, shortsword, longsword, scimitar, 2H Longblade + armour. 54 recipes across 6 tiers. Runite story-gated.</Text>
                                    <Text style={styles.changeText}>• Rare mining drops: Sapphire (Iron+), Emerald (Coal+), Ruby (Mithril+), Diamond (Adamant+). Bank → Other.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏹 Fletching & Tailoring</Text>
                                    <Text style={styles.changeText}>• New planned skills on the Skills grid (red Coming Soon). Arrows/bows from logs; gloves/hats/shoes/boots from cloth.</Text>
                                </View>
                            </>
                        ) : currentVersion.startsWith('0.4.4') ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🧪 Herblore</Text>
                                    <Text style={styles.changeText}>• New crafting skill! Brew herbs + empty vials into potions. 7 recipes from Minor Healing to Void Resistance.</Text>
                                    <Text style={styles.changeText}>• Buy empty vials from Nick's Shop (15 gp). Harvest herbs from the Harvesting skill. Bank Potions filter. Pet Fizz.</Text>
                                </View>
                            </>
                        ) : currentVersion.startsWith('0.4.3') ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🪴 Harvesting</Text>
                                    <Text style={styles.changeText}>• New gathering skill! 7 nodes from Wheat Field to Void Caps. Gather wheat, cabbage, tomato, sweetcorn, strawberry, snape_grass, void_cap_mushroom.</Text>
                                    <Text style={styles.changeText}>• Same polished UI as Mining and Logging — XP bar, node cards, thump SFX on tick. Find it in the Quick-Switch Sidebar.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏕️ Scavenging</Text>
                                    <Text style={styles.changeText}>• Loot ruins, battlefields, and cosmic debris. 5 nodes from Surface Ruins to Void Rupture.</Text>
                                    <Text style={styles.changeText}>• Drops: rusty_scrap, discarded_tech, fey_trinket, celestial_fragment, voidmire_crystal. Also in Quick-Switch Sidebar.</Text>
                                </View>
                            </>
                        ) : currentVersion.startsWith('0.4.2') ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🐾 Skill Pets</Text>
                                    <Text style={styles.changeText}>• Rare companions drop from skilling! Every skill has its own unique pet with a tiny drop chance per tick.</Text>
                                    <Text style={styles.changeText}>• Found a pet? Head to Settings → Pets to equip it. Your active pet shows as an emoji on the Skills screen.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🔊 Tick Sound Effects</Text>
                                    <Text style={styles.changeText}>• Each skill now plays a distinct sound on every successful tick — satisfying tinks, thumps, and splashes.</Text>
                                    <Text style={styles.changeText}>• Head to Settings → Audio to toggle SFX on/off, or tap "Test Sound" to preview.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🔧 Connection Fix</Text>
                                    <Text style={styles.changeText}>• Fixed the dev server so your phone can reconnect to Metro over Wi-Fi again. No more manual IP entry needed.</Text>
                                </View>
                            </>
                        ) : currentVersion.startsWith('0.4.1') ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>👤 The Anchor Man</Text>
                                    <Text style={styles.changeText}>• Main character: "The Anchor". First-time nickname entry; Settings → Character to change. Skills header: "Welcome, [name]".</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>👹 Goblin — First Enemy</Text>
                                    <Text style={styles.changeText}>• Goblin Peek random event during skilling. Modal shows goblin artwork. Combat tab: "Enemies Spotted" bestiary.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🍳 Cooking Skill</Text>
                                    <Text style={styles.changeText}>• Cook raw fish into food. 10 recipes from Shrimp to Cosmic Jellyfish. Bank Food filter. Daily quests for cooking.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📖 Bestiary</Text>
                                    <Text style={styles.changeText}>• Combat tab tracks enemies you've spotted. Keep training to discover more.</Text>
                                </View>
                            </>
                        ) : currentVersion.startsWith('0.4') ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📅 Daily Quests</Text>
                                    <Text style={styles.changeText}>• Three random gather objectives per day (reset at midnight). Quests screen → Daily section. Claim gold and Lumina when done.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📊 Detailed Stats</Text>
                                    <Text style={styles.changeText}>• New Stats tab: total items gathered by type, first/last play, days since first play.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📁 Custom Bank Tabs</Text>
                                    <Text style={styles.changeText}>• "+ Tabs" in Bank to create tabs (name + emoji). Assign items from item detail. Filter by your tabs.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🗑️ Sell All Junk</Text>
                                    <Text style={styles.changeText}>• Mark items as junk in item detail (configurable). "Sell All Junk" in Bank sells all junk; locked items are skipped.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🎁 Login Bonus & ✨ Lumina</Text>
                                    <Text style={styles.changeText}>• 7-day login bonus (100–600 gp; day 7: 500 gp + 10 Lumina). Claim banner on Skills screen. Settings → Login bonus & Lumina shows streak. Lumina shown in Bank, Shop, Settings.</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🎨 Theme Engine</Text>
                                    <Text style={styles.changeText}>• Settings → Appearance. Choose System, Dark, Light, or Sepia. Tab bar, headers, and StatusBar follow your theme. Persisted with save.</Text>
                                </View>

                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚡ Quick-Switch Sidebar</Text>
                                    <Text style={styles.changeText}>• Floating pill on the left edge when in a skill screen. Tap to slide open a beautiful drawer.</Text>
                                    <Text style={styles.changeText}>• Jump between Mining, Logging, Fishing, Runecrafting, Smithing, Forging without going back to the Skills tab. Active skill highlighted in gold.</Text>
                                </View>

                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🔨 Smithing & ⚒️ Forging</Text>
                                    <Text style={styles.changeText}>• Smithing: Smelt ore into bars at the furnace (Bronze → Runite).</Text>
                                    <Text style={styles.changeText}>• Forging: Forge bars into weapons and armour at the anvil. Daggers, half helmets, full helmets. Grouped by metal tier (Bronze, Iron, Steel, Mithril, Adamant). Bank Equipment filter.</Text>
                                </View>

                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🎲 Random Events</Text>
                                    <Text style={styles.changeText}>• Blibbertooth's Blessing: Bonus XP (level × 5) to active skill.</Text>
                                    <Text style={styles.changeText}>• Cosmic Sneeze: Double your next item haul.</Text>
                                    <Text style={styles.changeText}>• Genie's Gift: Bonus XP (level × 10) to a random trained skill.</Text>
                                    <Text style={styles.changeText}>• Treasure Chest: Gold reward (scales with level).</Text>
                                    <Text style={styles.changeText}>• Lucky Strike: Double XP for this tick.</Text>
                                </View>

                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🎣 Fishing & ✨ Runecrafting</Text>
                                    <Text style={styles.changeText}>• Fishing: 10 spots from Shrimp to Cosmic Jellyfish.</Text>
                                    <Text style={styles.changeText}>• Runecrafting: Mine essence, bind at 14 altars. Requirements indicator on each altar (Lv., essence, Story). Loop auto-stops when you run out.</Text>
                                    <Text style={styles.changeText}>• Bank filters for Fish and Runes.</Text>
                                </View>

                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>💬 Feedback Toasts</Text>
                                    <Text style={styles.changeText}>• In-game stylized prompts replace system alerts for locked nodes, no essence, level requirements. Themed variants (locked, warning, error, info), haptics, auto-dismiss.</Text>
                                </View>

                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚙️ Settings & Notifications</Text>
                                    <Text style={styles.changeText}>• Confirm Task Switch, Battery Saver, Horizon HUD (hide 3 goal cards), Idle Soundscapes. Whole row tap to toggle.</Text>
                                    <Text style={styles.changeText}>• Idle Cap Reached: Notify when 24h/7-day offline cap is full.</Text>
                                    <Text style={styles.changeText}>• Easter egg: "Don't Push This" → title "The Stubborn" at 1,000 presses.</Text>
                                </View>

                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚔️ Next Up (Coming Soon)</Text>
                                    <Text style={styles.changeText}>• Combat Alpha: Early testing for weapons, stats, and simple mobs.</Text>
                                    <Text style={styles.changeText}>• Mastery Overhaul: Spend mastery points for efficiency boosts.</Text>
                                </View>
                            </>
                        )}

                        <Text style={styles.footerNote}>Thanks for playing the Alpha!</Text>
                    </ScrollView>

                    <TouchableOpacity style={styles.button} onPress={handleDismiss} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Start Playing</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

