import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppSelector } from '@/store/hooks';
import { useInterpolatedProgress } from '@/hooks/useInterpolatedProgress';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSegments } from 'expo-router';

// Map of skill emojis
const SKILL_EMOJIS: Record<string, string> = {
    mining: '⛏️',
    logging: '🪵',
    fishing: '🎣',
    harvesting: '🪴',
    scavenging: '🏕️',
    runecrafting: '✨',
    smithing: '🔨',
    forging: '⚒️',
    cooking: '🍳',
    herblore: '🧪',
    combat: '⚔️',
    slayer: '👹',
    summoning: '🔮',
    astrology: '🌌',
    resonance: '🧿',
    agility: '🏃',
    thieving: '🎭',
    woodworking: '🪵',
    leadership: '👑',
};

export const GlobalActionTicker = () => {
    const { palette } = useTheme();
    const activeTask = useAppSelector((s) => s.game.player.activeTask);
    const insets = useSafeAreaInsets();
    const segments = useSegments();

    const intervalMs = activeTask?.intervalMs ?? 0;
    const partialTickMs = activeTask?.partialTickMs ?? 0;
    const progressAnim = useInterpolatedProgress(partialTickMs, intervalMs);

    // P. Haptic Heartbeat — pulse when progress bar reaches 100% and resets (hooks must run before early return)
    useEffect(() => {
        let wasNearFull = false;
        const listenerId = progressAnim.addListener(({ value }) => {
            const isNearFull = value >= 85;
            const nowNearLow = value < 15;
            if (wasNearFull && nowNearLow) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            wasNearFull = isNearFull;
        });
        return () => {
            progressAnim.removeListener(listenerId);
        };
    }, [progressAnim]);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: 'rgba(13, 15, 21, 0.95)',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255,255,255,0.08)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 10,
                },
                content: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: 6,
                    gap: Spacing.xs,
                },
                emoji: { fontSize: 16 },
                text: {
                    color: palette.textSecondary,
                    fontSize: 12,
                    fontWeight: '600',
                },
                actionText: {
                    color: palette.white,
                },
                progressBg: {
                    height: 2,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    width: '100%',
                },
                progressFill: {
                    height: '100%',
                    backgroundColor: palette.accentPrimary,
                },
            }),
        [palette]
    );

    // Detect if we are in a tab route to add offset for the tab bar
    const isInTabs = (segments as any[]).includes('(tabs)');
    const bottomOffsetBase = isInTabs ? 56 : 0;
    const targetOffset = insets.bottom + bottomOffsetBase;

    const animatedBottom = useRef(new Animated.Value(targetOffset)).current;

    useEffect(() => {
        Animated.spring(animatedBottom, {
            toValue: targetOffset,
            useNativeDriver: false,
            friction: 7,
            tension: 50,
        }).start();
    }, [targetOffset, animatedBottom]);

    if (!activeTask) return null;

    const skillName = activeTask.skillId
        ? activeTask.skillId.charAt(0).toUpperCase() + activeTask.skillId.slice(1)
        : 'Action';

    const emoji = activeTask.skillId ? SKILL_EMOJIS[activeTask.skillId] || '⚙️' : '⚙️';

    // Clean up the action name (e.g. copper_ore -> Copper Ore)
    const actionName = activeTask.actionId
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const widthInterpolated = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[styles.container, { bottom: animatedBottom }]}>
            <View style={styles.progressBg}>
                <Animated.View style={[styles.progressFill, { width: widthInterpolated }]} />
            </View>
            <View style={styles.content}>
                <Text style={styles.emoji}>{emoji}</Text>
                <Text style={styles.text} numberOfLines={1}>
                    {skillName}: <Text style={styles.actionText}>{actionName}</Text>
                </Text>
            </View>
        </Animated.View>
    );
};

