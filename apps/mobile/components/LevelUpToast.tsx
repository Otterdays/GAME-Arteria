/**
 * LevelUpToast.tsx
 *
 * Phase 1.5 — UI Polish
 * Reads the `levelUpQueue` from Redux. If there's an event, shows a toast at the top
 * of the screen for 3 seconds, then dismisses it.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { Palette, Spacing, Radius, FontSize } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

const SKILL_EMOJIS: Partial<Record<SkillId, string>> = {
    mining: '⛏️',
    woodcutting: '🪓',
    fishing: '🎣',
    cooking: '🍳',
    smithing: '🔨',
    crafting: '✂️',
    farming: '🌾',
    herblore: '🧪',
    agility: '🏃',
    attack: '⚔️',
    strength: '💪',
    defence: '🛡️',
    hitpoints: '❤️',
};

export default function LevelUpToast() {
    const dispatch = useAppDispatch();
    const queue = useAppSelector((s) => s.game.levelUpQueue);
    const [activeToast, setActiveToast] = useState<{ id: string; skillId: string; level: number } | null>(null);

    const pullY = React.useRef(new Animated.Value(-100)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!activeToast && queue.length > 0) {
            // Pick next off queue
            const next = queue[0];
            setActiveToast(next);

            // Play a strong haptic to celebrate
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Animate in
            Animated.parallel([
                Animated.spring(pullY, {
                    toValue: 60, // distance from top of screen
                    useNativeDriver: true,
                    bounciness: 12,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            // Wait 3 seconds, then animate out and pop
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(pullY, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    dispatch(gameActions.popLevelUp());
                    setActiveToast(null);
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [queue, activeToast, dispatch, pullY, opacity]);

    if (!activeToast) return null;

    const emoji = SKILL_EMOJIS[activeToast.skillId as SkillId] ?? '✨';

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: pullY }], opacity },
            ]}
        >
            <View style={styles.glow}>
                <Text style={styles.emoji}>{emoji}</Text>
                <View style={styles.textStack}>
                    <Text style={styles.title}>Level Up!</Text>
                    <Text style={styles.subtitle}>
                        <Text style={{ textTransform: 'capitalize' }}>{activeToast.skillId}</Text> is now level {activeToast.level}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // hover above EVERYTHING
        pointerEvents: 'none', // dont block touches below
        paddingHorizontal: Spacing.md,
    },
    glow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.bgCardHover,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderWidth: 1,
        borderColor: Palette.gold,
        shadowColor: Palette.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10, // android shadow
    },
    emoji: {
        fontSize: 32,
        marginRight: Spacing.md,
    },
    textStack: {
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSize.lg,
        fontWeight: '900',
        color: Palette.gold,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Palette.white,
        fontWeight: '600',
    },
});
