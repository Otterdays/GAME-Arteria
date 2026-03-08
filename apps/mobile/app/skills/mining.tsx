import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, Radius, ButtonRaisedStyle, HeaderShadow, InsetStyle, FontCinzelBold, ShadowSubtle } from '@/constants/theme';
import { getLevelBadgeStyles, getNodeCardBaseStyles, getGlassCardGradientColors, getStatPillInsetStyles } from '@/constants/skillPageStyles';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { MINING_NODES, MiningNode } from '@/constants/mining';
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

// @ts-ignore
import { meetsNarrativeRequirement } from '../../../../packages/engine/src/utils/narrative';

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

export default function MiningScreen() {
    useIdleSoundscape('mining');
    const { palette } = useTheme();
    const { showFeedbackToast } = useFeedbackToast();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const insets = useSafeAreaInsets();
    const miningSkill = useAppSelector((s) => s.game.player.skills.mining);
    // Only re-render if the active item ID/skill changes, do not listen to partialTickMs
    const activeTaskBase = useAppSelector(
        (s) => s.game.player.activeTask,
        (prev, next) => prev?.skillId === next?.skillId && prev?.actionId === next?.actionId
    );
    const flags = useAppSelector((s) => s.game.player.narrative.flags);
    const mockPlayerForNarrative = useMemo(() => ({ narrative: { flags } }), [flags]);

    const isMining = activeTaskBase?.skillId === 'mining';
    const activeNodeId = isMining ? activeTaskBase?.actionId : null;
    const activeNode = MINING_NODES.find(n => n.id === activeNodeId);

    // XP floating pop-up logic + Q. Screen shake on tick complete
    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(miningSkill.xp);
    const lastGain = React.useRef(0);
    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (miningSkill.xp > lastXp.current) {
            const gain = miningSkill.xp - lastXp.current;
            lastXp.current = miningSkill.xp;
            lastGain.current = gain;
            setPopTrigger(t => t + 1);
            // Q. Gentle screen shake when completing a mining tick
            shakeAnim.setValue(0);
            Animated.timing(shakeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => shakeAnim.setValue(0));
        } else {
            lastXp.current = miningSkill.xp;
        }
    }, [miningSkill.xp, shakeAnim]);

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
                    ...HeaderShadow,
                },
                headerRow: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.md,
                    paddingTop: Spacing.sm,
                    paddingBottom: Spacing.xs,
                    backgroundColor: palette.bgApp,
                },
                backButton: { paddingHorizontal: Spacing.sm, paddingVertical: 6 },
                backButtonText: {
                    color: palette.accentPrimary,
                    fontSize: FontSize.md,
                    fontWeight: '600',
                },
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
                    position: 'relative',
                },
                enhancedBadge: {
                    position: 'absolute',
                    top: -10,
                    left: 0,
                    backgroundColor: palette.gold,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    borderRadius: 4,
                    zIndex: 10,
                    transform: [{ rotate: '-5deg' }],
                    ...ShadowSubtle,
                },
                enhancedBadgeText: {
                    color: palette.bgApp,
                    fontSize: 8,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                },
                miningTitle: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.xl,
                    color: palette.textPrimary,
                },
                levelTag: {
                    backgroundColor: `${palette.skillMining}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: `${palette.skillMining}50`,
                },
                levelTagText: {
                    color: palette.skillMining,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                miningSub: { fontSize: FontSize.sm, color: palette.textSecondary },
                iconBarContainer: {
                    width: '100%',
                    marginTop: Spacing.md,
                    borderTopWidth: 1,
                    borderTopColor: palette.border,
                    paddingTop: Spacing.sm,
                },
                iconBarScroll: {
                    paddingHorizontal: Spacing.sm,
                    paddingBottom: Spacing.sm,
                    gap: Spacing.sm,
                    flexDirection: 'row',
                    alignItems: 'center',
                },
                iconWrapper: {
                    width: 44,
                    height: 44,
                    backgroundColor: palette.bgApp,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: palette.border,
                    ...InsetStyle,
                    borderRadius: 22,
                    borderWidth: 1,
                },
                iconUnlocked: {
                    borderColor: `${palette.skillMining}50`,
                    backgroundColor: `${palette.skillMining}15`,
                    shadowColor: palette.skillMining,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                },
                iconEmoji: {
                    fontSize: 22,
                },
                iconLocked: {
                    opacity: 0.25,
                    transform: [{ scale: 0.9 }],
                },
                listContent: { padding: Spacing.md, gap: Spacing.md },
                ...getNodeCardBaseStyles(palette),
                nodeCardActive: {
                    borderColor: palette.skillMining,
                    borderWidth: 1,
                },
                nodeHeader: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Spacing.md,
                },
                nodeEmoji: {
                    fontSize: 32,
                    marginRight: Spacing.md,
                    textShadowColor: palette.skillMining,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                },
                nodeTitleContainer: { flex: 1 },
                nodeName: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.lg,
                    color: palette.textPrimary,
                    marginBottom: 2,
                },
                textLocked: { color: palette.textDisabled },
                nodeReq: { fontSize: FontSize.xs, color: palette.textSecondary },
                nodeStats: {
                    flexDirection: 'row',
                    gap: Spacing.sm,
                    marginBottom: Spacing.md,
                },
                statPill: {
                    flex: 1,
                    backgroundColor: palette.bgApp,
                    padding: Spacing.sm,
                    alignItems: 'center',
                    ...InsetStyle,
                    borderRadius: Radius.md,
                    borderTopColor: `${palette.black}40`,
                    borderLeftColor: `${palette.black}20`,
                    borderRightColor: `${palette.white}06`,
                    borderBottomColor: `${palette.white}08`,
                },
                statLabel: {
                    fontSize: 10,
                    color: palette.textSecondary,
                    textTransform: 'uppercase',
                    marginBottom: 2,
                },
                statValue: {
                    fontSize: FontSize.sm,
                    color: palette.white,
                    fontWeight: '600',
                },
                trainButton: {
                    backgroundColor: palette.accentPrimary,
                    paddingVertical: Spacing.sm,
                    alignItems: 'center',
                    ...ButtonRaisedStyle,
                    borderRadius: Radius.md,
                },
                trainButtonActive: { backgroundColor: palette.redDim },
                trainButtonLocked: {
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                trainButtonText: {
                    color: palette.white,
                    fontWeight: 'bold',
                    fontSize: FontSize.base,
                },
                xpRow: { width: '100%', marginTop: Spacing.md, gap: 4 },
                xpBarBg: {
                    height: 6,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.full,
                    overflow: 'hidden',
                    width: '100%',
                },
                xpBarFill: {
                    height: '100%',
                    borderRadius: Radius.full,
                    backgroundColor: palette.skillMining,
                },
                xpText: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    textAlign: 'center',
                },
                nodeProgressBg: {
                    height: 4,
                    backgroundColor: palette.bgApp,
                    borderRadius: 2,
                    marginTop: Spacing.sm,
                    overflow: 'hidden',
                },
                nodeProgressFill: { height: '100%', backgroundColor: palette.accentPrimary },
            }),
        [palette]
    );

    // XP progress for header
    const clvXP = xpForLevel(miningSkill.level);
    const nlvXP = xpForLevel(miningSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(miningSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = miningSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleNodePress = (node: MiningNode) => {
        const meetsReq = meetsNarrativeRequirement(mockPlayerForNarrative as any, node.requirement);
        if (!meetsReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: 'You must progress further in the story to interact with this.',
            });
            return;
        }

        if (miningSkill.level < node.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Mining Level ${node.levelReq}`,
            });
            return;
        }

        if (activeNodeId === node.id) {
            // Stop if already training this node
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'mining',
                actionId: node.id,
                intervalMs: node.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }, { transform: [{ translateX: shakeX }] }]}>
            <Stack.Screen
                options={{
                    title: 'Mining',
                    headerShown: false, // Use our custom back button layout
                }}
            />

            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
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
                            router.replace(`/skills/${getPrevSkill('mining')}` as any);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.titleContent}>
                        <View style={styles.enhancedBadge}>
                            <Text style={styles.enhancedBadgeText}>Enhanced!</Text>
                        </View>
                        <Text style={styles.miningTitle}>Mining</Text>
                        <View style={styles.levelTag}>
                            <Text style={styles.levelTagText}>Lv. {miningSkill.level}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getNextSkill('mining')}` as any);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.miningSub}>Swing your pickaxe and gather ores.</Text>

                <MasteryBadges skillId="mining" />

                {/* XP progress [current/next] */}
                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse
                            progress={pct}
                            fillColor={palette.skillMining}
                            widthPercent={pct}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.xpText}>
                            {miningSkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {miningSkill.level >= 99
                                ? `${formatNumber(miningSkill.xp)} XP — MAX`
                                : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    {/* XP Pop-up VFX */}
                    <FloatingXpPop
                        amount={lastGain.current}
                        emoji={activeNode?.emoji || '⛏️'}
                        triggerKey={popTrigger}
                    />
                </View>

                {/* Unlockable Icon Bar */}
                <View style={styles.iconBarContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.iconBarScroll}
                    >
                        {MINING_NODES.map((node) => {
                            const meetsReq = meetsNarrativeRequirement(mockPlayerForNarrative as any, node.requirement);
                            const isUnlocked = miningSkill.level >= node.levelReq && meetsReq;

                            return (
                                <View key={node.id} style={[styles.iconWrapper, isUnlocked && styles.iconUnlocked]}>
                                    <Text style={[styles.iconEmoji, !isUnlocked && styles.iconLocked]}>
                                        {node.emoji}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {MINING_NODES.map((node) => {
                    const meetsReq = meetsNarrativeRequirement(mockPlayerForNarrative as any, node.requirement);
                    const isLocked = miningSkill.level < node.levelReq || !meetsReq;
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
                            accessibilityLabel={`${node.name}. ${isLocked ? `Unlocks at level ${node.levelReq}` : `Mine for ${node.xpPerTick} XP`}`}
                        >
                            {!isLocked && (
                                <LinearGradient
                                    colors={getGlassCardGradientColors(palette)}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            {isActive && <ActivePulseGlow color={palette.skillMining} />}
                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.5 }]}>{node.emoji}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLocked && styles.textLocked]}>
                                        {!meetsReq ? '???' : node.name}
                                    </Text>
                                    <Text style={styles.nodeReq}>
                                        {!meetsReq ? 'Requires narrative progression' : isLocked ? `Unlocks at Lv. ${node.levelReq}` : `Lv. ${node.levelReq} required`}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.nodeStats, isLocked && { opacity: 0.5 }]}>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/Drop</Text>
                                    <Text style={styles.statValue}>{formatNumber(node.xpPerTick)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/hr</Text>
                                    <Text style={[styles.statValue, { color: palette.gold }]}>
                                        {formatXpHr(node.xpPerTick, node.baseTickMs, node.successRate)}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>To Level</Text>
                                    <Text style={[styles.statValue, { color: palette.green }]}>
                                        {miningSkill.level >= 99
                                            ? 'MAX'
                                            : `~${Math.ceil((nlvXP - miningSkill.xp) / node.xpPerTick)}`}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Time</Text>
                                    <Text style={styles.statValue}>{(node.baseTickMs / 1000).toFixed(1)}s</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Success</Text>
                                    <Text style={styles.statValue}>{Math.round(node.successRate * 100)}%</Text>
                                </View>
                            </View>

                            {!isLocked && (
                                <View style={[styles.trainButton, isActive && styles.trainButtonActive]}>
                                    <Text style={styles.trainButtonText}>{isActive ? 'Stop Mining' : 'Mine'}</Text>
                                </View>
                            )}
                            {isActive && activeTaskBase && (
                                <SmoothProgressBar
                                    fillColor={palette.skillMining}
                                />
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

