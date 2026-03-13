/**
 * Firemaking Screen — Burn logs for XP.
 * [TRACE: ROADMAP Artisan; simple tick-based skill]
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, FontCinzelBold } from '@/constants/theme';
import { getLevelBadgeStyles, getGlassCardGradientColors } from '@/constants/skillPageStyles';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { FIREMAKING_BURNS, FiremakingBurn } from '@/constants/firemaking';
import { getItemMeta } from '@/constants/items';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { formatNumber, formatXpHr } from '@/utils/formatNumber';
import { FloatingXpPop } from '@/components/FloatingXpPop';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { SmoothProgressBar } from '@/components/SmoothProgressBar';
import { BouncyButton } from '@/components/BouncyButton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { ActivePulseGlow } from '@/components/ActivePulseGlow';
import { MasteryBadges } from '@/components/MasteryBadges';
import { useIdleSoundscape } from '@/hooks/useIdleSoundscape';
import { QuickSwitchToggle } from '@/components/QuickSwitchToggle';

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

function canAffordBurn(inventory: { id: string; quantity: number }[], burn: FiremakingBurn): boolean {
    const owned = inventory.find((i) => i.id === burn.logId)?.quantity ?? 0;
    return owned >= 1;
}

function logsOwned(inventory: { id: string; quantity: number }[], burn: FiremakingBurn): number {
    return inventory.find((i) => i.id === burn.logId)?.quantity ?? 0;
}

export default function FiremakingScreen() {
    useIdleSoundscape('firemaking');
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const { showFeedbackToast } = useFeedbackToast();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const fmSkill = player.skills.firemaking;
    const inventory = player.inventory;
    const activeTask = player.activeTask;

    const isBurning = activeTask?.skillId === 'firemaking';
    const activeBurnId = isBurning ? activeTask.actionId : null;
    const activeBurn = FIREMAKING_BURNS.find((b) => b.id === activeBurnId);

    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(fmSkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (fmSkill.xp > lastXp.current) {
            const gain = fmSkill.xp - lastXp.current;
            lastXp.current = fmSkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            glowAnim.setValue(0);
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
                glowAnim.setValue(0)
            );
        } else {
            lastXp.current = fmSkill.xp;
        }
    }, [fmSkill.xp, glowAnim]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.12, 0] });
    const fmColor = palette.skillFiremaking;

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                headerRow: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.md,
                    paddingTop: Spacing.sm,
                    paddingBottom: Spacing.xs,
                    backgroundColor: palette.bgApp,
                },
                backButton: { paddingHorizontal: Spacing.sm, paddingVertical: 6 },
                backButtonText: { color: palette.accentPrimary, fontSize: FontSize.md, fontWeight: '600' },
                infoSection: {
                    padding: Spacing.lg,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                    backgroundColor: palette.bgCard,
                },
                levelTag: {
                    backgroundColor: `${fmColor}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: `${fmColor}50`,
                },
                levelTagText: {
                    color: fmColor,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                ...getLevelBadgeStyles(palette, fmColor),
                titleRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: Spacing.sm,
                    marginBottom: 4,
                },
                navButton: { padding: Spacing.xs, opacity: 0.5 },
                titleContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
                screenTitle: { fontFamily: FontCinzelBold, fontSize: FontSize.xl, color: palette.textPrimary },
                screenSub: { fontSize: FontSize.sm, color: palette.textSecondary, marginTop: 4 },
                xpRow: { width: '100%', marginTop: Spacing.sm, gap: 4 },
                xpBarBg: {
                    height: 8,
                    backgroundColor: palette.bgApp,
                    borderRadius: 4,
                    overflow: 'hidden',
                },
                xpText: { fontSize: FontSize.xs, color: palette.textSecondary, textAlign: 'center' },
                listContent: { padding: Spacing.md, paddingBottom: Spacing.xl * 2 },
                nodeCard: {
                    marginBottom: Spacing.md,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: palette.border,
                    overflow: 'hidden',
                    backgroundColor: palette.bgCard,
                    padding: Spacing.md,
                },
                nodeCardLocked: { opacity: 0.6 },
                nodeCardActive: { borderWidth: 2 },
                nodeCardEmpty: { borderColor: palette.red + '66' },
                nodeHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
                nodeEmoji: { fontSize: 32, marginRight: Spacing.sm },
                nodeTitleContainer: { flex: 1 },
                nodeName: { fontSize: FontSize.base, fontWeight: '700', color: palette.textPrimary },
                nodeReq: { fontSize: FontSize.xs, color: palette.textSecondary, marginTop: 2 },
                textLocked: { color: palette.textDisabled },
                reqBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
                reqBadge: {
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                reqBadgeEmpty: { borderColor: palette.red },
                reqBadgeText: { fontSize: FontSize.xs, color: palette.textSecondary },
                nodeStats: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: Spacing.sm,
                    marginBottom: Spacing.sm,
                },
                statPill: {
                    backgroundColor: palette.bgApp,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                statLabel: { fontSize: 10, color: palette.textMuted },
                statValue: { fontSize: FontSize.sm, fontWeight: '700', color: palette.textPrimary },
                trainButton: {
                    backgroundColor: palette.accentPrimary,
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                },
                trainButtonActive: { backgroundColor: palette.red },
                trainButtonEmpty: { backgroundColor: palette.bgCard, borderWidth: 1, borderColor: palette.border },
                trainButtonLocked: { backgroundColor: palette.bgCard, borderWidth: 1, borderColor: palette.border },
                trainButtonText: { color: palette.white, fontWeight: 'bold', fontSize: FontSize.base },
            }),
        [palette, fmColor]
    );

    const clvXP = xpForLevel(fmSkill.level);
    const nlvXP = xpForLevel(fmSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(fmSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = fmSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleBurnPress = (burn: FiremakingBurn) => {
        if (fmSkill.level < burn.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Firemaking Level ${burn.levelReq}`,
            });
            return;
        }
        if (!canAffordBurn(inventory, burn)) {
            showFeedbackToast({
                type: 'warning',
                title: 'No Logs',
                message: `You need logs to burn. Go logging first!`,
            });
            return;
        }

        if (activeBurnId === burn.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'firemaking',
                actionId: burn.id,
                intervalMs: burn.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: fmColor, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Firemaking', headerShown: false }} />

            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
                    <Text style={styles.backButtonText}>‹ Back</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <QuickSwitchToggle />
            </View>

            <View style={styles.infoSection}>
                <View style={styles.titleRow}>
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getPrevSkill('firemaking')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.titleContent}>
                        <Text style={styles.screenTitle}>Firemaking</Text>
                        <View style={styles.levelTag}>
                            <Text style={styles.levelTagText}>Lv. {fmSkill.level}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getNextSkill('firemaking')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.screenSub}>Burn logs for XP. Higher-tier logs grant more experience.</Text>
                <MasteryBadges skillId="firemaking" />

                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={fmColor} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.xpText}>
                            {fmSkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {fmSkill.level >= 99 ? `${formatNumber(fmSkill.xp)} XP — MAX` : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop amount={lastGain.current} emoji={activeBurn?.emoji || '🔥'} triggerKey={popTrigger} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {FIREMAKING_BURNS.map((burn) => {
                    const isLevelLocked = fmSkill.level < burn.levelReq;
                    const isActive = activeBurnId === burn.id;
                    const outOfLogs = !isLevelLocked && !canAffordBurn(inventory, burn);
                    const owned = logsOwned(inventory, burn);
                    const logMeta = getItemMeta(burn.logId);

                    return (
                        <BouncyButton
                            key={burn.id}
                            style={[
                                styles.nodeCard,
                                isLevelLocked && styles.nodeCardLocked,
                                isActive && [styles.nodeCardActive, { borderColor: fmColor, backgroundColor: fmColor + '11' }],
                                outOfLogs && styles.nodeCardEmpty,
                            ]}
                            scaleTo={0.98}
                            onPress={() => handleBurnPress(burn)}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: isLevelLocked || outOfLogs, selected: isActive }}
                            accessibilityLabel={`${burn.name}. ${isLevelLocked ? `Unlocks at level ${burn.levelReq}` : `Burn for ${burn.xpPerTick} XP`}`}
                        >
                            {!isLevelLocked && (
                                <LinearGradient
                                    colors={getGlassCardGradientColors(palette)}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            {isActive && <ActivePulseGlow color={fmColor} />}

                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLevelLocked && { opacity: 0.4 }]}>{burn.emoji}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLevelLocked && styles.textLocked]}>{burn.name}</Text>
                                    <Text style={styles.nodeReq}>
                                        {isLevelLocked ? `Unlocks at Lv. ${burn.levelReq}` : `Lv. ${burn.levelReq} · Consumes ${logMeta.label}`}
                                    </Text>
                                    <View style={styles.reqBadges}>
                                        <View style={[styles.reqBadge, isLevelLocked && { borderColor: palette.textDisabled, opacity: 0.8 }]}>
                                            <Text style={[styles.reqBadgeText, isLevelLocked && { color: palette.textDisabled }]}>
                                                Lv. {burn.levelReq} {!isLevelLocked ? '✓' : ''}
                                            </Text>
                                        </View>
                                        <View style={[styles.reqBadge, outOfLogs && styles.reqBadgeEmpty]}>
                                            <Text style={styles.reqBadgeText}>{logMeta.emoji} {owned}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.nodeStats, isLevelLocked && { opacity: 0.4 }]}>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/Log</Text>
                                    <Text style={styles.statValue}>{burn.xpPerTick}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/hr</Text>
                                    <Text style={[styles.statValue, { color: palette.gold }]}>
                                        {formatXpHr(burn.xpPerTick, burn.baseTickMs, burn.successRate)}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>To Level</Text>
                                    <Text style={[styles.statValue, { color: palette.green }]}>
                                        {fmSkill.level >= 99 ? 'MAX' : `~${Math.ceil((nlvXP - fmSkill.xp) / burn.xpPerTick)}`}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Success</Text>
                                    <Text style={styles.statValue}>{Math.round(burn.successRate * 100)}%</Text>
                                </View>
                            </View>

                            {!isLevelLocked && (
                                <View style={[
                                    styles.trainButton,
                                    isActive && styles.trainButtonActive,
                                    outOfLogs && styles.trainButtonEmpty,
                                ]}>
                                    <Text style={styles.trainButtonText}>
                                        {isActive ? 'Stop' : outOfLogs ? 'No Logs' : 'Burn'}
                                    </Text>
                                </View>
                            )}
                            {isActive && activeTask && (
                                <SmoothProgressBar
                                    partialTickMs={activeTask.partialTickMs}
                                    intervalMs={activeTask.intervalMs}
                                    fillColor={fmColor}
                                />
                            )}
                            {isLevelLocked && (
                                <View style={[styles.trainButton, styles.trainButtonLocked]}>
                                    <IconSymbol name="lock.fill" size={16} color={palette.textDisabled} />
                                </View>
                            )}
                        </BouncyButton>
                    );
                })}
            </ScrollView>
        </Animated.View>
    );
}
