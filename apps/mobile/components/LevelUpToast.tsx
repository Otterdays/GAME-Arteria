/**
 * LevelUpToast.tsx — Phase 1.5 UI Polish
 *
 * Fix: Replaced useState/useEffect combo (which caused re-render loops
 * that cleared the dismiss timer) with a ref-based approach.
 * The activeToast is tracked in a ref so it doesn't trigger re-renders.
 */
import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { Spacing, Radius, FontSize } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

const SKILL_EMOJIS: Partial<Record<SkillId, string>> = {
    mining: '⛏️',
    logging: '🪓',
    harvesting: '🪴',
    scavenging: '🏕️',
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
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const queue = useAppSelector((s) => s.game.levelUpQueue);

    // Use refs to avoid re-render loops
    const isAnimating = useRef(false);
    const currentToast = useRef<{ skillId: string; level: number } | null>(null);

    const pullY = useRef(new Animated.Value(-120)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    // Force re-render when toast content changes (display only)
    const [displayToast, setDisplayToast] = React.useState<{ skillId: string; level: number } | null>(null);

    useEffect(() => {
        // If already animating or nothing in queue, bail
        if (isAnimating.current || queue.length === 0) return;

        const next = queue[0];
        isAnimating.current = true;
        currentToast.current = next;
        setDisplayToast(next);

        // Reset animation values to start position
        pullY.setValue(-120);
        opacity.setValue(0);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Animate in
        Animated.parallel([
            Animated.spring(pullY, {
                toValue: 60,
                useNativeDriver: true,
                bounciness: 10,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        // After 3s, animate out and pop the queue
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(pullY, {
                    toValue: -120,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                dispatch(gameActions.popLevelUp());
                setDisplayToast(null);
                currentToast.current = null;
                isAnimating.current = false;
            });
        }, 3000);

        return () => clearTimeout(timer);
        // Only re-run when the queue length changes or the first item changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queue.length, queue[0]?.id]);

    if (!displayToast) return null;

    const emoji = SKILL_EMOJIS[displayToast.skillId as SkillId] ?? '✨';

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
                        <Text style={{ textTransform: 'capitalize' }}>{displayToast.skillId}</Text> is now level {displayToast.level}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

