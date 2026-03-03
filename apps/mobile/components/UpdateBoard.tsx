/**
 * Update Board — In-app modal that pops when the app version changes.
 * Shows the changelog for the new version. Trigger: lastSeenVersion !== currentVersion
 * (from app.json). Dismissing stores currentVersion so it won't show again until next bump.
 * [TRACE: DOCU/SCRATCHPAD.md — Versioning & Update Board]
 */

import React, { useEffect, useState } from 'react';
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
import { Palette, Spacing, Radius, FontSize, CardStyle, FontCinzel, FontCinzelBold } from '@/constants/theme';
import { logger } from '@/utils/logger';

export default function UpdateBoard() {
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
                    <Text style={styles.subtitle}>Quick-Switch Sidebar & Random Events</Text>

                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                        {/* Future AI: Update changelog for the *current* version here when bumping app.json */}
                        <View style={styles.changeBlock}>
                            <Text style={styles.changeHeader}>⚡ Quick-Switch Sidebar</Text>
                            <Text style={styles.changeText}>• Floating pill on the left edge when in a skill screen. Tap to slide open a beautiful drawer.</Text>
                            <Text style={styles.changeText}>• Jump between Mining, Logging, Fishing, Runecrafting without going back to the Skills tab. Active skill highlighted in gold.</Text>
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

const styles = StyleSheet.create({
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
        backgroundColor: Palette.bgCard,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        ...CardStyle,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        maxHeight: '80%',
    },
    boardLabel: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Palette.accentWeb,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
        marginBottom: 4,
    },
    title: {
        fontFamily: FontCinzelBold,
        fontSize: FontSize.xl,
        color: Palette.accentWeb,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    scroll: {
        flexGrow: 0,
        maxHeight: 400,
        backgroundColor: Palette.bgApp,
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    scrollContent: {
        gap: Spacing.md,
    },
    changeBlock: {
        gap: 4,
    },
    changeHeader: {
        fontSize: FontSize.base,
        fontWeight: '700',
        color: Palette.textPrimary,
        marginBottom: 2,
    },
    changeText: {
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
        lineHeight: 20,
    },
    footerNote: {
        fontSize: FontSize.xs,
        color: Palette.textMuted,
        textAlign: 'center',
        marginTop: Spacing.md,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: Palette.accentPrimary,
        paddingVertical: 14,
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    buttonText: {
        color: Palette.white,
        fontSize: FontSize.base,
        fontWeight: '700',
    },
});
