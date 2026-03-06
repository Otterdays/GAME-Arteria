import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { getLevelBadgeStyles, getNodeCardBaseStyles, getGlassCardGradientColors } from '@/constants/skillPageStyles';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { ASTROLOGY_CONSTELLATIONS, AstrologyConstellation } from '@/constants/astrology';
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

const colorAstrology = '#6366f1';

export default function AstrologyScreen() {
    useIdleSoundscape('astrology');
    const { palette } = useTheme();
    const { showFeedbackToast } = useFeedbackToast();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const insets = useSafeAreaInsets();
    // Default to basic fallback object if skill not initialized yet, though the engine should have handled it
    const astrologySkill = useAppSelector((s) => s.game.player.skills.astrology) || { xp: 0, level: 1, mastery: {} };
    const activeTask = useAppSelector((s) => s.game.player.activeTask);

    const isAstrology = activeTask?.skillId === 'astrology';
    const activeNodeId = isAstrology ? activeTask.actionId : null;
    const activeNode = ASTROLOGY_CONSTELLATIONS.find((n) => n.id === activeNodeId);

    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(astrologySkill.xp);
    const lastGain = React.useRef(0);
    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (astrologySkill.xp > lastXp.current) {
            const gain = astrologySkill.xp - lastXp.current;
            lastXp.current = astrologySkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            shakeAnim.setValue(0);
            Animated.timing(shakeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => shakeAnim.setValue(0));
        } else {
            lastXp.current = astrologySkill.xp;
        }
    }, [astrologySkill.xp, shakeAnim]);

    const shakeX = shakeAnim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, 4, -4, 4, 0] });

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                infoSection: {
                    padding: Spacing.lg,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                    backgroundColor: palette.bgCard,
                },
                headerRow: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.md,
                    paddingTop: Spacing.sm,
                    paddingBottom: Spacing.xs,
                    backgroundColor: palette.bgApp,
                },
                backButton: { paddingHorizontal: Spacing.sm, paddingVertical: 6 },
                backButtonText: { color: palette.accentPrimary, fontSize: FontSize.md, fontWeight: '600' },
                titleRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: Spacing.sm,
                    marginBottom: 4,
                },
                navButton: {
                    padding: Spacing.xs,
                    opacity: 0.5,
                },
                titleContent: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.sm,
                },
                levelTag: {
                    backgroundColor: `${colorAstrology}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: `${colorAstrology}50`,
                },
                levelTagText: {
                    color: colorAstrology,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                astrologyTitle: { fontFamily: FontCinzelBold, fontSize: FontSize.xl, color: palette.textPrimary },
                astrologySub: { fontSize: FontSize.sm, color: palette.textSecondary },
                listContent: { padding: Spacing.md, gap: Spacing.md },
                nodeCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                nodeCardLocked: { backgroundColor: palette.bgApp, borderColor: 'transparent' },
                nodeCardActive: {},
                nodeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
                nodeEmoji: {
                    fontSize: 32,
                    marginRight: Spacing.md,
                    textShadowColor: colorAstrology,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                },
                nodeTitleContainer: { flex: 1 },
                nodeName: { fontFamily: FontCinzelBold, fontSize: FontSize.lg, color: palette.textPrimary, marginBottom: 2 },
                textLocked: { color: palette.textDisabled },
                nodeReq: { fontSize: FontSize.xs, color: palette.textSecondary },
                nodeStats: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
                statPill: {
                    flex: 1,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    padding: Spacing.sm,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                statLabel: { fontSize: 10, color: palette.textSecondary, textTransform: 'uppercase', marginBottom: 2 },
                statValue: { fontSize: FontSize.sm, color: palette.white, fontWeight: '600' },
                trainButton: {
                    backgroundColor: palette.accentPrimary,
                    paddingVertical: Spacing.sm,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                },
                trainButtonActive: { backgroundColor: palette.redDim },
                trainButtonLocked: {
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                trainButtonText: { color: palette.white, fontWeight: 'bold', fontSize: FontSize.base },
                xpRow: { width: '100%', marginTop: Spacing.md, gap: 4 },
                xpBarBg: {
                    height: 6,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.full,
                    overflow: 'hidden',
                    width: '100%',
                },
                xpText: { fontSize: FontSize.xs, color: palette.textSecondary, textAlign: 'center' },
            }),
        [palette]
    );

    const clvXP = xpForLevel(astrologySkill.level);
    const nlvXP = xpForLevel(astrologySkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(astrologySkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = astrologySkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleNodePress = (node: AstrologyConstellation) => {
        if (astrologySkill.level < node.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Astrology Level ${node.levelReq}`,
            });
            return;
        }
        if (activeNodeId === node.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'astrology',
                actionId: node.id,
                intervalMs: node.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }, { transform: [{ translateX: shakeX }] }]}>
            <Stack.Screen options={{ title: 'Astrology', headerShown: false }} />
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
                            router.replace(`/skills/${getPrevSkill('astrology')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.titleContent}>
                        <Text style={styles.astrologyTitle}>Astrology</Text>
                        <View style={styles.levelTag}>
                            <Text style={styles.levelTagText}>Lv. {astrologySkill.level}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getNextSkill('astrology')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.astrologySub}>Study constellations to gather Stardust.</Text>
                <MasteryBadges skillId="astrology" />
                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={colorAstrology} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.xpText}>
                            {astrologySkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {astrologySkill.level >= 99 ? `${formatNumber(astrologySkill.xp)} XP — MAX` : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop amount={lastGain.current} emoji={activeNode?.emoji || '🔭'} triggerKey={popTrigger} />
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.listContent}>
                {ASTROLOGY_CONSTELLATIONS.map((node) => {
                    const isLocked = astrologySkill.level < node.levelReq;
                    const isActive = activeNodeId === node.id;
                    return (
                        <BouncyButton
                            key={node.id}
                            style={[
                                styles.nodeCard,
                                isLocked && styles.nodeCardLocked,
                                isActive && styles.nodeCardActive,
                            ]}
                            scaleTo={0.98}
                            onPress={() => handleNodePress(node)}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: isLocked, selected: isActive }}
                            accessibilityLabel={`${node.name}. ${isLocked ? `Unlocks at level ${node.levelReq}` : `Study for ${node.xpPerTick} XP`}`}
                        >
                            {!isLocked && (
                                <LinearGradient
                                    colors={getGlassCardGradientColors(palette)}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            {isActive && <ActivePulseGlow color={colorAstrology} />}
                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.5 }]}>{node.emoji}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLocked && styles.textLocked]}>{node.name}</Text>
                                    <Text style={styles.nodeReq}>{isLocked ? `Unlocks at Lv. ${node.levelReq}` : `Lv. ${node.levelReq} required`}</Text>
                                </View>
                            </View>
                            <View style={[styles.nodeStats, isLocked && { opacity: 0.5 }]}>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/Drop</Text>
                                    <Text style={styles.statValue}>{formatNumber(node.xpPerTick)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/hr</Text>
                                    <Text style={[styles.statValue, { color: palette.gold }]}>{formatXpHr(node.xpPerTick, node.baseTickMs, node.successRate)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>To Level</Text>
                                    <Text style={[styles.statValue, { color: palette.green }]}>
                                        {astrologySkill.level >= 99 ? 'MAX' : `~${Math.ceil((nlvXP - astrologySkill.xp) / node.xpPerTick)}`}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Time</Text>
                                    <Text style={styles.statValue}>{(node.baseTickMs / 1000).toFixed(1)}s</Text>
                                </View>
                            </View>
                            {!isLocked && (
                                <View style={[styles.trainButton, isActive && styles.trainButtonActive]}>
                                    <Text style={styles.trainButtonText}>{isActive ? 'Stop Studying' : 'Study Constellation'}</Text>
                                </View>
                            )}
                            {isActive && activeTask && (
                                <SmoothProgressBar partialTickMs={activeTask.partialTickMs} intervalMs={activeTask.intervalMs} fillColor={colorAstrology} />
                            )}
                            {isLocked && (
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
