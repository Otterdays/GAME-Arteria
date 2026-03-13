/**
 * Wizardry skill — Academic study of magic. Research tomes and scrolls for XP.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md §12, sorcery wizardry plan]
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { getGlassCardGradientColors } from '@/constants/skillPageStyles';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { WIZARDRY_STUDIES, WizardryStudy } from '@/constants/wizardry';
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

const colorWizardry = '#4169e1';

export default function WizardryScreen() {
    useIdleSoundscape('wizardry');
    const { palette } = useTheme();
    const { showFeedbackToast } = useFeedbackToast();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const insets = useSafeAreaInsets();
    const wizardrySkill = useAppSelector((s) => s.game.player.skills.wizardry) || { xp: 0, level: 1, mastery: {} };
    const activeTask = useAppSelector((s) => s.game.player.activeTask);

    const isWizardry = activeTask?.skillId === 'wizardry';
    const activeNodeId = isWizardry ? activeTask.actionId : null;
    const activeNode = WIZARDRY_STUDIES.find((n) => n.id === activeNodeId);

    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(wizardrySkill.xp);
    const lastGain = React.useRef(0);
    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (wizardrySkill.xp > lastXp.current) {
            const gain = wizardrySkill.xp - lastXp.current;
            lastXp.current = wizardrySkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            shakeAnim.setValue(0);
            Animated.timing(shakeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => shakeAnim.setValue(0));
        } else {
            lastXp.current = wizardrySkill.xp;
        }
    }, [wizardrySkill.xp, shakeAnim]);

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
                navButton: { padding: Spacing.xs, opacity: 0.5 },
                titleContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
                levelTag: {
                    backgroundColor: `${colorWizardry}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: `${colorWizardry}50`,
                },
                levelTagText: {
                    color: colorWizardry,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                wizardryTitle: { fontFamily: FontCinzelBold, fontSize: FontSize.xl, color: palette.textPrimary },
                wizardrySub: { fontSize: FontSize.sm, color: palette.textSecondary },
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
                    textShadowColor: colorWizardry,
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

    const clvXP = xpForLevel(wizardrySkill.level);
    const nlvXP = xpForLevel(wizardrySkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(wizardrySkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = wizardrySkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleStudyPress = (study: WizardryStudy) => {
        if (wizardrySkill.level < study.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Wizardry Level ${study.levelReq}`,
            });
            return;
        }
        if (activeNodeId === study.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'wizardry',
                actionId: study.id,
                intervalMs: study.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }, { transform: [{ translateX: shakeX }] }]}>
            <Stack.Screen options={{ title: 'Wizardry', headerShown: false }} />
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
                            router.replace(`/skills/${getPrevSkill('wizardry')}` as any);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.titleContent}>
                        <Text style={styles.wizardryTitle}>Wizardry</Text>
                        <View style={styles.levelTag}>
                            <Text style={styles.levelTagText}>Lv. {wizardrySkill.level}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getNextSkill('wizardry')}` as any);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.wizardrySub}>Study tomes and scrolls to unlock magical knowledge.</Text>
                <MasteryBadges skillId="wizardry" />
                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={colorWizardry} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.xpText}>
                            {wizardrySkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {wizardrySkill.level >= 99 ? `${formatNumber(wizardrySkill.xp)} XP — MAX` : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop amount={lastGain.current} emoji={activeNode?.emoji || '📜'} triggerKey={popTrigger} />
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.listContent}>
                {WIZARDRY_STUDIES.map((study) => {
                    const isLocked = wizardrySkill.level < study.levelReq;
                    const isActive = activeNodeId === study.id;
                    return (
                        <BouncyButton
                            key={study.id}
                            style={[styles.nodeCard, isLocked && styles.nodeCardLocked, isActive && styles.nodeCardActive]}
                            scaleTo={0.98}
                            onPress={() => handleStudyPress(study)}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: isLocked, selected: isActive }}
                            accessibilityLabel={`${study.name}. ${isLocked ? `Unlocks at level ${study.levelReq}` : `Study for ${study.xpPerTick} XP`}`}
                        >
                            {!isLocked && (
                                <LinearGradient
                                    colors={getGlassCardGradientColors(palette)}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            {isActive && <ActivePulseGlow color={colorWizardry} />}
                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.5 }]}>{study.emoji}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLocked && styles.textLocked]}>{study.name}</Text>
                                    <Text style={styles.nodeReq}>
                                        {isLocked ? `Unlocks at Lv. ${study.levelReq}` : `Lv. ${study.levelReq} required`}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.nodeStats, isLocked && { opacity: 0.5 }]}>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/Tick</Text>
                                    <Text style={styles.statValue}>{formatNumber(study.xpPerTick)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/hr</Text>
                                    <Text style={[styles.statValue, { color: palette.gold }]}>{formatXpHr(study.xpPerTick, study.baseTickMs, study.successRate)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>To Level</Text>
                                    <Text style={[styles.statValue, { color: palette.green }]}>
                                        {wizardrySkill.level >= 99 ? 'MAX' : `~${Math.ceil((nlvXP - wizardrySkill.xp) / study.xpPerTick)}`}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Interval</Text>
                                    <Text style={styles.statValue}>{(study.baseTickMs / 1000).toFixed(1)}s</Text>
                                </View>
                            </View>
                            {!isLocked && (
                                <View style={[styles.trainButton, isActive && styles.trainButtonActive]}>
                                    <Text style={styles.trainButtonText}>{isActive ? 'Stop Studying' : 'Study'}</Text>
                                </View>
                            )}
                            {isActive && activeTask && (
                                <SmoothProgressBar partialTickMs={activeTask.partialTickMs} intervalMs={activeTask.intervalMs} fillColor={colorWizardry} />
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
