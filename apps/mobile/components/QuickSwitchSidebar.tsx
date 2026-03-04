/**
 * QuickSwitchSidebar — Slide-in drawer to jump between gathering skills.
 * [TRACE: ROADMAP U. Quick-Switch Sidebar]
 *
 * Beautiful glassmorphic panel with skill-specific colors, gold accent for active,
 * smooth Reanimated slide. Trigger: floating pill on left edge.
 *
 * Fluidity: Backdrop always mounted (no conditional mount), opacity interpolated
 * from translateX. useLayoutEffect for animation before paint. Snappier timing.
 */

import React, { useLayoutEffect, useMemo, useCallback, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Platform,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSegments, router } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import {
    SKILL_META,
    IMPLEMENTED_GATHERING_SKILLS,
    IMPLEMENTED_CRAFTING_SKILLS,
    type SkillId,
} from '@/constants/skills';
import { useQuickSwitch } from '@/contexts/QuickSwitchContext';

const SIDEBAR_WIDTH = 260;
const ANIM_DURATION = 220;

const SkillRow = memo(function SkillRow({
    skillId,
    isActive,
    onNavigate,
    palette,
    styles,
}: {
    skillId: SkillId;
    isActive: boolean;
    onNavigate: (id: SkillId) => void;
    palette: { bgCardHover: string; gold: string };
    styles: Record<string, object>;
}) {
    const meta = SKILL_META[skillId];

    return (
        <Pressable
            onPress={() => onNavigate(skillId)}
            style={({ pressed }) => [
                styles.skillRow,
                {
                    borderLeftColor: meta.color,
                    borderLeftWidth: 4,
                    backgroundColor: isActive
                        ? `${meta.color}18`
                        : pressed
                          ? palette.bgCardHover
                          : 'transparent',
                    borderColor: isActive ? palette.gold : 'transparent',
                    borderWidth: isActive ? 1 : 0,
                },
            ]}
            android_ripple={{ color: `${meta.color}30` }}
        >
            <Text style={styles.skillEmoji}>{meta.emoji}</Text>
            <Text
                style={[
                    styles.skillLabel,
                    isActive && styles.skillLabelActive,
                ]}
                numberOfLines={1}
            >
                {meta.label}
            </Text>
        </Pressable>
    );
});

export function QuickSwitchSidebar() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const segments = useSegments();
    const { isOpen, close, toggle } = useQuickSwitch();
    const activeTask = useAppSelector((s) => s.game.player.activeTask);
    const translateX = useSharedValue(-SIDEBAR_WIDTH);

    const isInSkillScreen = segments[0] === 'skills';
    const showTrigger = isInSkillScreen;

    useLayoutEffect(() => {
        translateX.value = withTiming(isOpen ? 0 : -SIDEBAR_WIDTH, {
            duration: ANIM_DURATION,
        });
    }, [isOpen, translateX]);

    const closeSidebar = useCallback(() => close(), [close]);

    const handleSkillPress = useCallback((skillId: SkillId) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        closeSidebar();
        router.push(`/skills/${skillId}` as any);
    }, [closeSidebar]);

    const sidebarStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-SIDEBAR_WIDTH, 0], [0, 1]),
    }));

    const styles = useMemo(
        () =>
            StyleSheet.create({
                trigger: {
                    position: 'absolute',
                    left: Spacing.sm,
                    zIndex: 1100,
                    ...Platform.select({
                        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
                        android: { elevation: 6 },
                    }),
                },
                triggerGradient: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.md,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    gap: Spacing.xs,
                },
                triggerIcon: {
                    fontSize: 18,
                    color: palette.textPrimary,
                    fontWeight: '700',
                },
                triggerEmoji: { fontSize: 14 },
                backdrop: {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1050,
                },
                sidebar: {
                    position: 'absolute',
                    left: 0,
                    width: SIDEBAR_WIDTH,
                    zIndex: 1060,
                    borderRightWidth: 1,
                    borderRightColor: 'rgba(139, 92, 246, 0.25)',
                    overflow: 'hidden',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 4, height: 0 },
                            shadowOpacity: 0.4,
                            shadowRadius: 12,
                        },
                        android: { elevation: 16 },
                    }),
                },
                sidebarContent: {
                    flex: 1,
                    paddingHorizontal: Spacing.md,
                    paddingBottom: Spacing.lg,
                },
                title: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.lg,
                    color: palette.accentWeb,
                    marginBottom: 2,
                },
                subtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginBottom: Spacing.lg,
                },
                skillList: { gap: Spacing.xs },
                skillRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: Spacing.md,
                    paddingHorizontal: Spacing.md,
                    borderRadius: Radius.md,
                    gap: Spacing.md,
                },
                skillEmoji: { fontSize: 24 },
                skillLabel: {
                    fontSize: FontSize.base,
                    color: palette.textPrimary,
                    fontWeight: '600',
                    flex: 1,
                },
                skillLabelActive: { color: palette.gold },
                footer: {
                    marginTop: 'auto',
                    paddingTop: Spacing.lg,
                    alignItems: 'center',
                },
                footerLine: {
                    width: 40,
                    height: 1,
                    backgroundColor: palette.divider,
                    marginBottom: Spacing.sm,
                },
                footerText: {
                    fontSize: FontSize.xs,
                    color: palette.textMuted,
                },
            }),
        [palette]
    );

    return (
        <>
            {/* Trigger — floating pill on left edge */}
            {showTrigger && (
                <Pressable
                    onPress={() => {
                        if (Platform.OS !== 'web') {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        toggle();
                    }}
                    style={[styles.trigger, { top: insets.top + 56 }]}
                    hitSlop={12}
                >
                    <LinearGradient
                        colors={[
                            palette.bgCard,
                            palette.bgCardHover,
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.triggerGradient}
                    >
                        <Text style={styles.triggerIcon}>≡</Text>
                        {activeTask?.skillId && (
                            <Text style={styles.triggerEmoji}>
                                {SKILL_META[activeTask.skillId as SkillId]?.emoji ?? '⚙️'}
                            </Text>
                        )}
                    </LinearGradient>
                </Pressable>
            )}

            {/* Backdrop — always mounted, opacity interpolated (avoids mount lag) */}
            <Animated.View
                style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
                pointerEvents={isOpen ? 'auto' : 'none'}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar} />
            </Animated.View>

            {/* Sidebar panel */}
            <Animated.View
                style={[
                    styles.sidebar,
                    {
                        top: insets.top,
                        bottom: insets.bottom,
                        paddingTop: insets.top + Spacing.md,
                    },
                    sidebarStyle,
                ]}
            >
                <LinearGradient
                    colors={[
                        'rgba(17, 19, 26, 0.98)',
                        'rgba(22, 25, 33, 0.98)',
                        'rgba(13, 15, 21, 0.99)',
                    ]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.sidebarContent}>
                    <Text style={styles.title}>Quick Switch</Text>
                    <Text style={styles.subtitle}>Jump between skills</Text>
                    <View style={styles.skillList}>
                        {[...IMPLEMENTED_GATHERING_SKILLS, ...IMPLEMENTED_CRAFTING_SKILLS].map((skillId) => (
                            <SkillRow
                                key={skillId}
                                skillId={skillId}
                                isActive={activeTask?.skillId === skillId}
                                onNavigate={handleSkillPress}
                                palette={palette}
                                styles={styles}
                            />
                        ))}
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.footerLine} />
                        <Text style={styles.footerText}>
                            Tap outside to close
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </>
    );
}
