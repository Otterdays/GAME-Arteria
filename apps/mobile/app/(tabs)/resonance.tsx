/**
 * Resonance — The Pulse (Support skill).
 * Tap the orb to build Momentum; Momentum grants global Haste to all other skills.
 * [TRACE: click_idea.md]
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { XP_TABLE } from '@/store/gameSlice';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import {
    RESONANCE_UNLOCKS,
    getResonanceXpPerTap,
    getMomentumPerTap,
    MOMENTUM_CAP,
    getHasteMultiplier,
} from '@/constants/resonance';
import { formatNumber } from '@/utils/formatNumber';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ResonanceScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const dispatch = useAppDispatch();
    const { showFeedbackToast } = useFeedbackToast();

    const resonance = useAppSelector((s) => s.game.player.skills.resonance) ?? { id: 'resonance', xp: 0, level: 1, mastery: {} };
    const momentum = useAppSelector((s) => s.game.player.momentum) ?? 0;
    const vibrationEnabled = useAppSelector((s) => s.game.player.settings?.vibrationEnabled ?? true);

    const level = resonance.level;
    const xp = resonance.xp;
    const nextLevelXp = level < 99 ? XP_TABLE[level] : XP_TABLE[98];
    const hasResonantEcho = level >= 40;

    const xpPerTap = getResonanceXpPerTap(level, hasResonantEcho);
    const momentumPerTap = getMomentumPerTap(level, hasResonantEcho);
    const hasteMult = getHasteMultiplier(momentum);
    const speedBonusPercent = Math.round((hasteMult - 1) * 100);

    const scale = useSharedValue(1);

    const orbSize = Math.min(width * 0.5, 200);
    const orbAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePulse = () => {
        if (vibrationEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        scale.value = withSpring(0.92, { damping: 12, stiffness: 400 });
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        dispatch(gameActions.pulseResonance({ xpGain: xpPerTap, momentumGain: momentumPerTap }));
    };

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                header: {
                    paddingTop: insets.top + Spacing.md,
                    paddingHorizontal: Spacing.lg,
                    paddingBottom: Spacing.md,
                    backgroundColor: palette.bgCard,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                title: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize['2xl'],
                    color: palette.skillResonance,
                },
                subTitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 4,
                },
                scroll: {
                    flex: 1,
                    paddingBottom: insets.bottom + 80,
                },
                orbSection: {
                    alignItems: 'center',
                    paddingVertical: Spacing.xl,
                },
                orbTouch: {
                    width: orbSize,
                    height: orbSize,
                    borderRadius: orbSize / 2,
                    backgroundColor: palette.bgCard,
                    borderWidth: 3,
                    borderColor: palette.skillResonance,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: palette.skillResonance,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 8,
                },
                orbInner: {
                    width: orbSize - 24,
                    height: orbSize - 24,
                    borderRadius: (orbSize - 24) / 2,
                    backgroundColor: palette.bgApp,
                    borderWidth: 2,
                    borderColor: palette.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                orbLabel: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                },
                tapHint: {
                    marginTop: Spacing.sm,
                    fontSize: FontSize.xs,
                    color: palette.textMuted,
                },
                momentumSection: {
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                },
                momentumBarBg: {
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: palette.bgInput,
                    overflow: 'hidden',
                },
                momentumBarFill: {
                    height: '100%',
                    borderRadius: 6,
                    backgroundColor: palette.skillResonance,
                    width: `${(momentum / MOMENTUM_CAP) * 100}%`,
                },
                momentumLabel: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
                },
                hasteLabel: {
                    fontSize: FontSize.sm,
                    color: palette.green,
                    marginTop: Spacing.xs,
                },
                levelSection: {
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.sm,
                },
                levelRow: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                },
                xpBarBg: {
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: palette.bgInput,
                    overflow: 'hidden',
                    marginTop: 4,
                },
                xpBarFill: {
                    height: '100%',
                    borderRadius: 3,
                    backgroundColor: palette.skillResonance,
                    width: `${level >= 99 ? 100 : (xp / nextLevelXp) * 100}%`,
                },
                unlocksSection: {
                    paddingHorizontal: Spacing.lg,
                    paddingTop: Spacing.lg,
                },
                unlocksTitle: {
                    fontSize: FontSize.md,
                    color: palette.textPrimary,
                    fontFamily: FontCinzelBold,
                    marginBottom: Spacing.sm,
                },
                unlockRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.md,
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.md,
                    marginBottom: Spacing.xs,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                unlockLocked: { opacity: 0.6 },
                unlockLevel: {
                    fontSize: FontSize.sm,
                    color: palette.gold,
                    fontWeight: '600',
                    width: 32,
                },
                unlockLabel: {
                    fontSize: FontSize.sm,
                    color: palette.textPrimary,
                    flex: 1,
                },
                unlockEffect: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    marginTop: 2,
                },
            }),
        [palette, insets, orbSize, momentum, level, xp, nextLevelXp]
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Resonance</Text>
                <Text style={styles.subTitle}>The Pulse — steady the flow of time.</Text>
            </View>
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: Spacing.xl }} showsVerticalScrollIndicator={false}>
                <View style={styles.orbSection}>
                    <AnimatedPressable style={[styles.orbTouch, orbAnimatedStyle]} onPress={handlePulse}>
                        <View style={styles.orbInner}>
                            <Text style={styles.orbLabel}>〰️</Text>
                            <Text style={[styles.orbLabel, { marginTop: 4 }]}>Pulse</Text>
                        </View>
                    </AnimatedPressable>
                    <Text style={styles.tapHint}>Tap to build Momentum • +{momentumPerTap}% momentum, +{xpPerTap} XP</Text>
                </View>

                <View style={styles.momentumSection}>
                    <Text style={[styles.orbLabel, { marginBottom: 4 }]}>Momentum</Text>
                    <View style={styles.momentumBarBg}>
                        <View style={styles.momentumBarFill} />
                    </View>
                    <View style={styles.momentumLabel}>
                        <Text style={styles.orbLabel}>{Math.round(momentum)}%</Text>
                        <Text style={styles.orbLabel}>Decays over time — pulse to maintain</Text>
                    </View>
                    {speedBonusPercent > 0 && (
                        <Text style={styles.hasteLabel}>All other skills run {speedBonusPercent}% faster</Text>
                    )}
                </View>

                <View style={styles.levelSection}>
                    <View style={styles.levelRow}>
                        <Text style={styles.orbLabel}>Level {level}</Text>
                        <Text style={styles.orbLabel}>
                            {formatNumber(xp)} / {level < 99 ? formatNumber(nextLevelXp) : '—'} XP
                        </Text>
                    </View>
                    {level < 99 && (
                        <View style={styles.xpBarBg}>
                            <View style={styles.xpBarFill} />
                        </View>
                    )}
                </View>

                <View style={styles.unlocksSection}>
                    <Text style={styles.unlocksTitle}>Unlocks</Text>
                    {RESONANCE_UNLOCKS.map((u) => {
                        const unlocked = level >= u.level;
                        return (
                            <View key={u.id} style={[styles.unlockRow, !unlocked && styles.unlockLocked]}>
                                <Text style={styles.unlockLevel}>Lv{u.level}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.unlockLabel}>{u.label}</Text>
                                    <Text style={styles.unlockEffect}>{u.effect}</Text>
                                </View>
                                {unlocked ? <Text style={{ color: palette.green, fontSize: FontSize.xs }}>✓</Text> : null}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
