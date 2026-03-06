import React, { useMemo, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    Pressable,
    Platform,
    View,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSegments, usePathname } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { Spacing, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { SKILL_META, type SkillId } from '@/constants/skills';
import { useQuickSwitch } from '@/contexts/QuickSwitchContext';

/**
 * QuickSwitchToggle — Animated trigger for the Quick-Switch Sidebar.
 * Now a standalone component so it can be placed inside screen headers
 * to ensure it transitions gracefully with the UI.
 */
export function QuickSwitchToggle() {
    const { palette } = useTheme();
    const { isOpen, toggle } = useQuickSwitch();
    const activeTask = useAppSelector((s) => s.game.player.activeTask);
    const pathname = usePathname();

    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);

    // Hide when sidebar is open
    useEffect(() => {
        if (isOpen) {
            opacity.value = withTiming(0, { duration: 150 });
            scale.value = withTiming(0.8, { duration: 200 });
            translateX.value = withTiming(-15, { duration: 200 });
        } else {
            opacity.value = withDelay(100, withTiming(1, { duration: 200 }));
            scale.value = withDelay(100, withSpring(1));
            translateX.value = withDelay(100, withSpring(0));
        }
    }, [isOpen]);

    // Entrance animation on route change (Panel Switching)
    useEffect(() => {
        // Lateral shift and scale "pop" when switching skill panels
        translateX.value = 10;
        scale.value = 0.95;
        rotate.value = -10;

        translateX.value = withSpring(0, { damping: 15 });
        scale.value = withSpring(1, { damping: 12 });
        rotate.value = withSpring(0, { damping: 12 });
    }, [pathname]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` }
        ],
    }));

    const styles = useMemo(
        () =>
            StyleSheet.create({
                trigger: {
                    ...Platform.select({
                        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
                        android: { elevation: 6 },
                    }),
                },
                gradient: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: 'rgba(139, 92, 246, 0.4)',
                    gap: 6,
                },
                iconContainer: {
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                icon: {
                    fontSize: 18,
                    color: palette.textPrimary,
                    fontWeight: '700',
                    lineHeight: 20,
                },
                emoji: { fontSize: 13 },
            }),
        [palette]
    );

    return (
        <Animated.View style={[styles.trigger, animatedStyle]} pointerEvents={isOpen ? 'none' : 'auto'}>
            <Pressable
                onPress={() => {
                    if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }
                    toggle();
                }}
                hitSlop={15}
            >
                <LinearGradient
                    colors={[palette.bgCardHover, palette.bgCard]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>≡</Text>
                    </View>
                    {activeTask?.skillId && (
                        <Text style={styles.emoji}>
                            {SKILL_META[activeTask.skillId as SkillId]?.emoji ?? '⚙️'}
                        </Text>
                    )}
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}
