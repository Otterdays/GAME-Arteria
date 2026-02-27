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
import { Palette, Spacing, Radius, FontSize } from '@/constants/theme';
import { logger } from '@/utils/logger';

export default function UpdatesModal() {
    const dispatch = useAppDispatch();
    const lastSeenVersion = useAppSelector((s) => s.game.player.lastSeenVersion);
    const isLoaded = useAppSelector((s) => s.game.isLoaded);

    // Note: fallback to 0.1.0 if running in an environment without expo-constants
    const currentVersion = Constants.expoConfig?.version || '0.1.0';

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show if the save is fully loaded and versions don't match
        if (isLoaded && lastSeenVersion !== currentVersion) {
            // If lastSeenVersion is undefined, it's a completely new player.
            // We could optionally choose NOT to show the changelog to brand new users
            // But for this alpha, let's show it so they know what's new.
            logger.info('UI', `Version bump detected: ${lastSeenVersion ?? 'New User'} -> ${currentVersion}. Opening Updates Modal.`);
            setVisible(true);
        }
    }, [isLoaded, lastSeenVersion, currentVersion]);

    if (!visible) return null;

    const handleDismiss = () => {
        logger.debug('UI', 'Updates modal dismissed', { version: currentVersion });
        dispatch(gameActions.updateSeenVersion(currentVersion));
        setVisible(false);
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Arteria v{currentVersion}</Text>
                    <Text style={styles.subtitle}>Welcome to the next phase!</Text>

                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                        {/* 
              Future AI: Hardcode the changelog for the *current* version here. 
              The modal will automatically reappear whenever you bump the version in app.json 
            */}
                        <View style={styles.changeBlock}>
                            <Text style={styles.changeHeader}>🚀 What's New</Text>
                            <Text style={styles.changeText}>• Brand new 'Updates' modal to track new feature drops! (Yes, this modal!)</Text>
                            <Text style={styles.changeText}>• Proper internal dev logging infrastructure added.</Text>
                        </View>

                        <View style={styles.changeBlock}>
                            <Text style={styles.changeHeader}>⛏️ Next Up (Coming Soon)</Text>
                            <Text style={styles.changeText}>• Phase 1.2: Interactive Mining skill screen with proper node selection and item drops directly to the bank.</Text>
                            <Text style={styles.changeText}>• The 'While you were away' offline reporting system.</Text>
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
        borderWidth: 1,
        borderColor: Palette.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        maxHeight: '80%',
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Palette.accentPrimary,
        fontFamily: 'Cinzel',
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
