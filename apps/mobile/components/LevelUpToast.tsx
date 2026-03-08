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
    forging: '🔥',
    crafting: '✂️',
    farming: '🌾',
    herblore: '🧪',
    agility: '🏃',
    thieving: '🎭',
    fletching: '🏹',
    tailoring: '🧵',
    prayer: '🙏',
    construction: '🏠',
    runecrafting: '✨',
    leadership: '👑',
    adventure: '🗺️',
    dungeoneering: '🗝️',
    astrology: '🌟',
    summoning: '🔮',
    slayer: '💀',
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
    const currentToastId = useRef<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const pullY = useRef(new Animated.Value(-120)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    // Force re-render when toast content changes (display only)
    const [displayToast, setDisplayToast] = React.useState<{ skillId: string; level: number } | null>(null);

    // Initial cleanup on unmount only
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        // If already animating or nothing in queue, bail
        if (isAnimating.current || queue.length === 0) return;

        const next = queue[0];
        // If we are looking at the same toast ID we already handled, skip
        if (next.id === currentToastId.current) return;

        isAnimating.current = true;
        currentToastId.current = next.id;
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

        // After 2s, animate out and pop the queue
        timerRef.current = setTimeout(() => {
            let handled = false;
            const done = () => {
                if (handled) return;
                handled = true;
                dispatch(gameActions.popLevelUp());
                // We deliberately do NOT `setDisplayToast(null)` here! 
                // Unmounting the Animated.View while `queue` updates causes React flash & unmount errors.
                // It will just stay visually "hidden" offscreen (opacity 0, pullY -120) until the next toast pops.
                currentToastId.current = null;
                isAnimating.current = false;
                timerRef.current = null;
            };
            Animated.parallel([
                Animated.timing(pullY, {
                    toValue: -120,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(done);
            // Fallback: ensure we clear even if animation callback doesn't fire
            setTimeout(done, 400);
        }, 2000);

        // We do NOT return a clearTimeout here because we want the timer 
        // to survive re-renders (which occur if the queue updates while animating).
        // The isAnimating.current check at start handles concurrency.
    }, [queue.length, queue[0]?.id]);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    zIndex: 9999,
                },
                glow: {
                    backgroundColor: palette.bgCard,
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                    borderRadius: Radius.lg,
                    borderWidth: 1,
                    borderColor: palette.accentPrimary,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                },
                emoji: { fontSize: 28 },
                textStack: { flex: 1 },
                title: {
                    fontSize: FontSize.lg,
                    fontWeight: 'bold',
                    color: palette.textPrimary,
                },
                subtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                },
            }),
        [palette]
    );

    if (!displayToast) return null;

    const emoji = SKILL_EMOJIS[displayToast.skillId as SkillId] ?? '✨';

    return (
        <Animated.View
            pointerEvents="none"
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

