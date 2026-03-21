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
import { PATCH_HISTORY } from '@/constants/patchHistory';

export default function UpdateBoard() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const lastSeenVersion = useAppSelector((s) => s.game.player.lastSeenVersion);
    const isLoaded = useAppSelector((s) => s.game.isLoaded);
    const forceShow = useAppSelector((s) => s.game.forceShowUpdateBoard);

    const currentVersion = Constants.expoConfig?.version || '0.1.0';

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isLoaded && (lastSeenVersion !== currentVersion || forceShow)) {
            if (forceShow) {
                logger.debug('UI', 'Update Board opened via manual trigger');
            } else {
                logger.info('UI', `Version bump detected: ${lastSeenVersion ?? 'New User'} -> ${currentVersion}. Opening Update Board.`);
            }
            setVisible(true);
        }
    }, [isLoaded, lastSeenVersion, currentVersion, forceShow]);

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

        // If it was a natural bump, mark this version as seen
        if (lastSeenVersion !== currentVersion) {
            dispatch(gameActions.updateSeenVersion(currentVersion));
        }

        // If it was a manual trigger, reset the flag
        if (forceShow) {
            dispatch(gameActions.setForceShowUpdateBoard(false));
        }

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
                    <Text style={styles.title}>Arteria v{PATCH_HISTORY[0].version}</Text>
                    <Text style={styles.subtitle}>
                        {currentVersion === '0.7.0' ? 'The Timelines'
                            : currentVersion === '0.6.3' ? 'The Queue'
                                : currentVersion === '0.6.2' ? 'The Profile'
                                : currentVersion === '0.6.1' ? 'The Forge & The Bow'
                                : currentVersion === '0.6.0' ? 'The Ascended Master'
                                : currentVersion === '0.5.3' ? 'The Legion & The Soul'
                                    : currentVersion === '0.5.2' ? 'The Celestial Expansion'
                                        : currentVersion.startsWith('0.5') ? 'THE 0.5.1 extended update directors cut remix - alpha'
                                            : currentVersion.startsWith('0.4.2') ? 'Skill Pets, Tick SFX & Polish'
                                                : currentVersion.startsWith('0.4.1') ? 'The Anchor Man — Character, Cooking & Bestiary'
                                                    : currentVersion.startsWith('0.4') ? 'Daily Quests, Stats, Bank Tabs & Lumina'
                                                        : 'Theme Engine, Quick-Switch & Random Events'}
                    </Text>

                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                        {currentVersion === '0.7.0' ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⏳ Anchor Timelines</Text>
                                    <Text style={styles.changeText}>• Multi-slot character account system. Create and manage isolated character profiles (Anchors) with isolated saves.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>Characters Switcher</Text>
                                    <Text style={styles.changeText}>• Landing page setup to force accurate account allocation before hitting the core loop dashboards.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚗️ Alchemy Skill Activated</Text>
                                    <Text style={styles.changeText}>• Alchemy is now fully integrated into the implementation pool. Start testing the transmutative recipes in the craft section.</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: palette.border, marginVertical: Spacing.sm, opacity: 0.3 }} />
                            </>
                        ) : currentVersion === '0.6.3' ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚙️ Crafting Queue System</Text>
                                    <Text style={styles.changeText}>• You can now queue up multiple consecutive skilling or crafting actions. Sit back and watch your character train automatically!</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📱 Crafting Queue UI Hub</Text>
                                    <Text style={styles.changeText}>• Sticky Glassmorphic queue dock featuring real-time timers, Estimated Time to Completion (ETC), and individual cancel buttons to manage tasks efficiently.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📜 WYWA Combat Report</Text>
                                    <Text style={styles.changeText}>• The While You Were Away report evaluates offline battle gains and now displays your defeated enemies count natively.</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: palette.border, marginVertical: Spacing.sm, opacity: 0.3 }} />
                            </>
                        ) : currentVersion === '0.6.2' ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>Profile Screen</Text>
                                    <Text style={styles.changeText}>• New account hub (Settings → Character → Profile). Identity, progress snapshot, rewards & entitlements, quick actions (edit nickname, Pets, Expansions, Patch notes).</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>Selected Title</Text>
                                    <Text style={styles.changeText}>• Optional displayed title on your profile; set via setSelectedTitle.</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: palette.border, marginVertical: Spacing.sm, opacity: 0.3 }} />
                            </>
                        ) : currentVersion === '0.6.1' ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>👑 Skill Capes Complete</Text>
                                    <Text style={styles.changeText}>• Added 10 missing skill capes. All 27 implemented skills now have purchasable capes at Lv 99 from the Ascended Master.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏹 New Skill: Fletching</Text>
                                    <Text style={styles.changeText}>• Logs + feathers + bars → arrows and bows. 7 recipes from shafts to willow longbow. Mastery: XP, yield, speed, log saver. Feathers in shop.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>✂️ New Skill: Tailoring</Text>
                                    <Text style={styles.changeText}>• Cloth → gloves, cap, shoes, vest. 4 recipes. Mastery: XP, yield, speed, cloth saver. Cloth in shop.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⭕ Crafting UI Redesign</Text>
                                    <Text style={styles.changeText}>• Radial Mastery design: circular recipe wheel, tier-based nodes, center orb with XP ring, bottom detail panel. Competes with Woodworking workbench.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🎽 EquipSlot Expansion</Text>
                                    <Text style={styles.changeText}>• Added hands and cape slots for cloth gloves and skill capes.</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: palette.border, marginVertical: Spacing.sm, opacity: 0.3 }} />
                            </>
                        ) : currentVersion === '0.6.0' ? (
                            <>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🛡️ Stability Patch</Text>
                                    <Text style={styles.changeText}>• Resolved a critical bug where the new skills search bar would cause a crash. All main navigation tabs have been audited for stability.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>✨ Magic Hub Dashboard</Text>
                                    <Text style={styles.changeText}>• The starting landing page has been transformed into a magical hub with portal buttons for faster navigation.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🎭 New Skill: Thieving</Text>
                                    <Text style={styles.changeText}>• Pickpocket NPCs and loot stalls for gold and items. Beware of the stun risk if you're caught!</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏃 New Skill: Agility</Text>
                                    <Text style={styles.changeText}>• Run 6 different obstacle courses spanning from the Crownlands Rooftops to the Void Rift Traverse to gain XP and global passive bonuses.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏪 The Agora: Shop Revamp</Text>
                                    <Text style={styles.changeText}>• Nick's shop has been completely redesigned with a premium glassmorphism aesthetic, golden accents, and better item grouping for a high-end merchant feel.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📉 Smooth Progress Bars</Text>
                                    <Text style={styles.changeText}>• Fixed a subtle flickering bug in the skilling progress bars. Interpolation is now perfectly synced to the game engine for a buttery smooth 60fps experience.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🎲 Random Events In-Game Only</Text>
                                    <Text style={styles.changeText}>• Random events (Blibbertooth, Genie, Goblin Peek, etc.) now only trigger while actively playing, not when opening the app.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⏳ WYWA Offline XP Fix</Text>
                                    <Text style={styles.changeText}>• Offline gains (XP, items, gold) now apply when you tap "Collect & Continue" on the While You Were Away screen. Ensures your progress is always applied correctly.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🪵 New Skill: Woodworking</Text>
                                    <Text style={styles.changeText}>• Turn logs into furniture, shields, and staves. Flagship workbench UI with category rail (Furniture, Combat, Utility), recipe cards with input/output slots, and sticky action dock. 5 recipes: Pine Stool, Maple Dining Table, Training Staff, Willow Shield, Barrel.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>👑 Mastery Skill Capes</Text>
                                    <Text style={styles.changeText}>• Hit Level 99 in a skill? Purchase a Mastery Skill Cape from the Ascended Master in the Shop tab for 99,000 gp.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📊 Skills Page QoL</Text>
                                    <Text style={styles.changeText}>• Skills are now grouped by Pillar with thin progress bars, mastery badges, and a new search bar!</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🎨 Enhanced Skill UI</Text>
                                    <Text style={styles.changeText}>• Slayer, Summoning, and Resonance have been upgraded to the premium "Enhanced!" UI with navigation arrows and gold badges.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🐺 Summoning & Slayer</Text>
                                    <Text style={styles.changeText}>• Bind 5 new spirit pouches and seek Master Mark to start culling monsters. Integrated shops directly into the skill screens.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>✂️ Crafting & Companions</Text>
                                    <Text style={styles.changeText}>• Turn leather into armour and gems into jewelry. Hire allies like Garry the Guard to assist in your journey.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🌾 New Skill: Farming</Text>
                                    <Text style={styles.changeText}>• Plant seeds in 3 patches (Crownlands Farm, Frostvale Greenhouse), wait for crops to grow, then harvest. 7 crops from wheat to void cap. Seeds from shop; Bank Seeds filter.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🔥 New Skill: Firemaking</Text>
                                    <Text style={styles.changeText}>• Burn logs for XP. 9 burn types from Normal Log to Cosmic Wood. Consumes logs from inventory; higher-tier logs grant more XP.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🚀 New Expansions System</Text>
                                    <Text style={styles.changeText}>• Patron's Pack is now Exp. 1. Added a dedicated Expansions page in Settings to preview and manage unlocked expansions.</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: palette.border, marginVertical: Spacing.sm, opacity: 0.3 }} />
                            </>
                        ) : currentVersion.startsWith('0.5') ? (
                            <>
                                {currentVersion === '0.5.3' && (
                                    <>
                                        <View style={styles.changeBlock}>
                                            <Text style={styles.changeHeader}>💀 New Skill: Slayer</Text>
                                            <Text style={styles.changeText}>• Seek Master Mark to start culling monsters! Tasks are assigned based on your level. Complete them to earn Slayer Coins for future unique equipment.</Text>
                                        </View>
                                        <View style={styles.changeBlock}>
                                            <Text style={styles.changeHeader}>🐺 New Skill: Summoning</Text>
                                            <Text style={styles.changeText}>• Bind the spirits of nature with the new Summoning skill. Added 5 initial pouches including Spirit Wolf, Dreadfowl, and Honey Badger.</Text>
                                        </View>
                                        <View style={styles.changeBlock}>
                                            <Text style={styles.changeHeader}>🤝 Companion System</Text>
                                            <Text style={styles.changeText}>• Your Leadership can now attract wandering souls. Hire Barnaby the Uncertain or the new Garry the Guard to assist in your journey.</Text>
                                        </View>
                                        <View style={{ height: 1, backgroundColor: palette.border, marginVertical: Spacing.sm, opacity: 0.3 }} />
                                    </>
                                )}
                                {currentVersion === '0.5.2' && (
                                    <>
                                        <View style={styles.changeBlock}>
                                            <Text style={styles.changeHeader}>🔭 New Skill: Astrology</Text>
                                            <Text style={styles.changeText}>• Fully implemented Astrology! Study the constellations of Deedree, The Anchor Eternal, The Void Fish, and The Lumina Tree to gather Stardust and Meteorites.</Text>
                                        </View>
                                        <View style={styles.changeBlock}>
                                            <Text style={styles.changeHeader}>✨ Celestial Items</Text>
                                            <Text style={styles.changeText}>• Added Stardust, Golden Stardust, and Meteorite items. These rare cosmic materials will be vital for future high-level progression.</Text>
                                        </View>
                                        <View style={styles.changeBlock}>
                                            <Text style={styles.changeHeader}>⛏️ Skill Progression Icons</Text>
                                            <Text style={styles.changeText}>• Astrology is now fully integrated into the skill header progression bar with its own unique celestial icons.</Text>
                                        </View>
                                        <View style={styles.changeBlock}>
                                            <Text style={styles.changeHeader}>➡️ Unified Navigation</Text>
                                            <Text style={styles.changeText}>• Included Astrology in the alphabetical skill cycling system. Navigation arrows now handle the full list of 11 implemented skills.</Text>
                                        </View>
                                        <View style={styles.changeBlock}>
                                            <Text style={styles.changeHeader}>🛠️ Critical Fixes</Text>
                                            <Text style={styles.changeText}>• Resolved TypeScript linting errors in the SkillBox component and idle soundscape registration.</Text>
                                        </View>
                                        <View style={{ height: 1, backgroundColor: palette.border, marginVertical: Spacing.sm, opacity: 0.3 }} />
                                    </>
                                )}
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>📖 Architectural Tome</Text>
                                    <Text style={styles.changeText}>• Formalized the "Technical User Manual" in DOCU/. Identified and named the 11 core subsystems (e.g., Arteria-game-engine, Arteria-tick-orchestrator) to build a more technical foundation.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>✨ Arteria Depth System</Text>
                                    <Text style={styles.changeText}>• Multi-layered depth presets: ShadowSubtle, ShadowMedium, ShadowElevated, and ShadowDeep. Node cards now float, stat pills are recessed, and headers cast shadows for a premium tactile feel.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⛏️ Skill Progression Bar</Text>
                                    <Text style={styles.changeText}>• Each skill screen now shows a sleek horizontal icon strip at the bottom of its header. Node icons are greyed out and dimmed when locked, and glow with their skill colour once unlocked. The level badge has also been compressed inline with the skill title to free up vertical screen space.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🌌 Midnight Theme</Text>
                                    <Text style={styles.changeText}>• A new deep-black (#050508) premium theme with purple accents and enhanced glassmorphism. Perfect for OLED and late-night sessions.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏅 Achievement Expansion</Text>
                                    <Text style={styles.changeText}>• Added 6 new reactive achievements including Head Chef, Potion Master, Sneeze Cultist, and Void Walker. Reach 16 distinct milestones!</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚙️ Gameplay Settings</Text>
                                    <Text style={styles.changeText}>• New toggles for Haptics & Vibration, Screen Shake (thud/shake on success), and Floating XP numbers.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>➡️ Skill Navigation Arrows</Text>
                                    <Text style={styles.changeText}>• Added premium stylized arrows to the top left and right of all 10 skill titles. Instantly cycle through your available skills in alphabetical order!</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🏷️ "Enhanced!" UI Badges</Text>
                                    <Text style={styles.changeText}>• Mining and Logging now proudly display an "Enhanced!" badge, marking them as the premier icon-based gameplay experiences.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚒️ Infinite Equipment Refining</Text>
                                    <Text style={styles.changeText}>• Merge 10 identical pieces of equipment in your Bank into a +1 variant! +1 variants have dynamically scaled stats and exponentially higher sell values. Refining can go on infinitely!</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🔮 Future Skills Added</Text>
                                    <Text style={styles.changeText}>• Summoning, Astrology, and Slayer have been added to the skill roster and now show on the grid with beautiful "Coming Soon" badges.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>⚡ Quick-Switch Animation</Text>
                                    <Text style={styles.changeText}>• The Quick-Switch toggle now is more dynamic! It slides and pops when you change panels, and hides gracefully when the sidebar is open.</Text>
                                </View>
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🛡️ Coming Soon Skills</Text>
                                    <Text style={styles.changeText}>• Construction, Leadership, Adventure, and Dungeon Dwelling added for the future! Tap them to see the new high-fidelity "In Works" glassmorphic popup.</Text>
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
                                <View style={styles.changeBlock}>
                                    <Text style={styles.changeHeader}>🧪 Herblore</Text>
                                    <Text style={styles.changeText}>• New crafting skill! Brew herbs + empty vials into potions. 7 recipes from Minor Healing to Void Resistance.</Text>
                                    <Text style={styles.changeText}>• Buy empty vials from Nick's Shop (15 gp). Harvest herbs from the Harvesting skill. Bank Potions filter. Pet Fizz.</Text>
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

