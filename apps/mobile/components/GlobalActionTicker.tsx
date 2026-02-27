import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Map of skill emojis
const SKILL_EMOJIS: Record<string, string> = {
    mining: '⛏️',
    logging: '🪵',
    fishing: '🎣',
    harvesting: '🌿',
    scavenging: '🗺️',
    combat: '⚔️',
};

export const GlobalActionTicker = () => {
    const activeTask = useAppSelector((s) => s.game.player.activeTask);
    const insets = useSafeAreaInsets();

    if (!activeTask) return null;

    const progress = activeTask.intervalMs > 0
        ? (activeTask.partialTickMs / activeTask.intervalMs) * 100
        : 0;

    const skillName = activeTask.skillId
        ? activeTask.skillId.charAt(0).toUpperCase() + activeTask.skillId.slice(1)
        : 'Action';

    const emoji = activeTask.skillId ? SKILL_EMOJIS[activeTask.skillId] || '⚙️' : '⚙️';

    // Clean up the action name (e.g. copper_ore -> Copper Ore)
    const actionName = activeTask.actionId
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <View style={[styles.container, { bottom: insets.bottom + 56 }]}>
            <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.content}>
                <Text style={styles.emoji}>{emoji}</Text>
                <Text style={styles.text} numberOfLines={1}>
                    {skillName}: <Text style={styles.actionText}>{actionName}</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(13, 15, 21, 0.98)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        gap: Spacing.xs,
    },
    emoji: {
        fontSize: 16,
    },
    text: {
        color: Palette.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    actionText: {
        color: Palette.white,
    },
    progressBg: {
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.03)',
        width: '100%',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Palette.accentPrimary,
    },
});
