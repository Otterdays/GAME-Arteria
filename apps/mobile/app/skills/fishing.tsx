import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { getLevelBadgeStyles, getNodeCardBaseStyles, getGlassCardGradientColors } from '@/constants/skillPageStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { FISHING_SPOTS, FishingSpot } from '@/constants/fishing';
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

const TOOL_LABEL: Record<FishingSpot['tool'], string> = {
    net: 'Small Net',
    rod: 'Fishing Rod',
    harpoon: 'Harpoon',
    bare_hands: 'Bare Hands',
};

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

// Group spots by area so the UI renders area headers
function groupByArea(spots: FishingSpot[]): { area: string; spots: FishingSpot[] }[] {
    const map: Record<string, FishingSpot[]> = {};
    for (const spot of spots) {
        if (!map[spot.areaLabel]) map[spot.areaLabel] = [];
        map[spot.areaLabel].push(spot);
    }
    return Object.entries(map).map(([area, spots]) => ({ area, spots }));
}

const AREA_GROUPS = groupByArea(FISHING_SPOTS);

export default function FishingScreen() {
    useIdleSoundscape('fishing');
    const { palette } = useTheme();
    const { showFeedbackToast } = useFeedbackToast();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const insets = useSafeAreaInsets();
    const fishingSkill = useAppSelector((s) => s.game.player.skills.fishing);
    const activeTask = useAppSelector((s) => s.game.player.activeTask);

    const isFishing = activeTask?.skillId === 'fishing';
    const activeNodeId = isFishing ? activeTask.actionId : null;
    const activeSpot = FISHING_SPOTS.find((s) => s.id === activeNodeId);

    // XP floating pop-up + screen bob on catch
    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(fishingSkill.xp);
    const lastGain = React.useRef(0);
    const bobAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (fishingSkill.xp > lastXp.current) {
            const gain = fishingSkill.xp - lastXp.current;
            lastXp.current = fishingSkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            // Gentle vertical bob when a fish is caught
            bobAnim.setValue(0);
            Animated.timing(bobAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start(() => bobAnim.setValue(0));
        } else {
            lastXp.current = fishingSkill.xp;
        }
    }, [fishingSkill.xp, bobAnim]);

    const bobY = bobAnim.interpolate({
        inputRange: [0, 0.3, 0.6, 1],
        outputRange: [0, -5, 3, 0],
    });

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
                backButtonText: {
                    color: palette.accentPrimary,
                    fontSize: FontSize.md,
                    fontWeight: '600',
                },
                infoSection: {
                    padding: Spacing.lg,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                    backgroundColor: palette.bgCard,
                },
                ...getLevelBadgeStyles(palette, palette.skillFishing),
                screenTitle: {
                    fontSize: FontSize.xl,
                    fontWeight: 'bold',
                    color: palette.textPrimary,
                    marginBottom: 4,
                },
                screenSub: { fontSize: FontSize.sm, color: palette.textSecondary },
                xpRow: { width: '100%', marginTop: Spacing.md, gap: 4 },
                xpBarBg: {
                    height: 6,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.full,
                    overflow: 'hidden',
                    width: '100%',
                },
                xpText: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    textAlign: 'center',
                },
                listContent: { padding: Spacing.md, gap: Spacing.md },
                areaHeader: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.skillFishing,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginTop: Spacing.sm,
                    marginBottom: Spacing.sm,
                    paddingLeft: 2,
                },
                nodeCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.md,
                },
                nodeCardLocked: {
                    backgroundColor: palette.bgApp,
                    borderColor: 'transparent',
                },
                nodeCardActive: {},
                nodeHeader: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Spacing.md,
                },
                nodeEmoji: {
                    fontSize: 32,
                    marginRight: Spacing.md,
                    textShadowColor: palette.skillFishing,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                },
                nodeTitleContainer: { flex: 1 },
                nodeName: {
                    fontSize: FontSize.lg,
                    fontWeight: 'bold',
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
                    borderRadius: Radius.md,
                    padding: Spacing.sm,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: palette.border,
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
                    borderRadius: Radius.md,
                    alignItems: 'center',
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
            }),
        [palette]
    );

    // XP progress for header
    const clvXP = xpForLevel(fishingSkill.level);
    const nlvXP = xpForLevel(fishingSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(fishingSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = fishingSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleSpotPress = (spot: FishingSpot) => {
        if (fishingSkill.level < spot.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Fishing Level ${spot.levelReq}`,
            });
            return;
        }

        if (activeNodeId === spot.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'fishing',
                actionId: spot.id,
                intervalMs: spot.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }, { transform: [{ translateY: bobY }] }]}>
            <Stack.Screen options={{ title: 'Fishing', headerShown: false }} />

            {/* Back row */}
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <Text style={styles.backButtonText}>‹ Back</Text>
                </TouchableOpacity>
            </View>

            {/* Skill header */}
            <View style={styles.infoSection}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>Lv. {fishingSkill.level}</Text>
                </View>
                <Text style={styles.screenTitle}>Fishing</Text>
                <Text style={styles.screenSub}>Cast your line and reel in the catch of the day.</Text>
                <MasteryBadges skillId="fishing" />
                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse
                            progress={pct}
                            fillColor={palette.skillFishing}
                            widthPercent={pct}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.xpText}>
                            {fishingSkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {fishingSkill.level >= 99
                                ? `${formatNumber(fishingSkill.xp)} XP — MAX`
                                : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop
                        amount={lastGain.current}
                        emoji={activeSpot?.emoji || '🎣'}
                        triggerKey={popTrigger}
                    />
                </View>
            </View>

            {/* Spot list grouped by area */}
            <ScrollView contentContainerStyle={styles.listContent}>
                {AREA_GROUPS.map(({ area, spots }) => (
                    <View key={area}>
                        <Text style={styles.areaHeader}>{area}</Text>
                        {spots.map((spot) => {
                            const isLocked = fishingSkill.level < spot.levelReq;
                            const isActive = activeNodeId === spot.id;

                            return (
                                <BouncyButton
                                    key={spot.id}
                                    style={[
                                        styles.nodeCard,
                                        isLocked && styles.nodeCardLocked,
                                        isActive && [
                                            styles.nodeCardActive,
                                            { borderColor: palette.skillFishing, backgroundColor: palette.skillFishing + '11' },
                                        ],
                                    ]}
                                    scaleTo={0.98}
                                    onPress={() => handleSpotPress(spot)}
                                    accessibilityRole="button"
                                    accessibilityState={{ disabled: isLocked, selected: isActive }}
                                    accessibilityLabel={`${spot.name}. ${isLocked ? `Unlocks at level ${spot.levelReq}` : `Fish for ${spot.xpPerTick} XP`}`}
                                >
                                    {!isLocked && (
                                        <LinearGradient
                                            colors={getGlassCardGradientColors(palette)}
                                            style={StyleSheet.absoluteFill}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        />
                                    )}
                                    {isActive && <ActivePulseGlow color={palette.skillFishing} />}
                                    <View style={styles.nodeHeader}>
                                        <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.5 }]}>{spot.emoji}</Text>
                                        <View style={styles.nodeTitleContainer}>
                                            <Text style={[styles.nodeName, isLocked && styles.textLocked]}>{spot.name}</Text>
                                            <Text style={styles.nodeReq}>
                                                {isLocked
                                                    ? `Unlocks at Lv. ${spot.levelReq}`
                                                    : `Lv. ${spot.levelReq} · ${TOOL_LABEL[spot.tool]}`}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={[styles.nodeStats, isLocked && { opacity: 0.5 }]}>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>XP/Catch</Text>
                                            <Text style={styles.statValue}>{formatNumber(spot.xpPerTick)}</Text>
                                        </View>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>XP/hr</Text>
                                            <Text style={[styles.statValue, { color: palette.gold }]}>
                                                {formatXpHr(spot.xpPerTick, spot.baseTickMs, spot.successRate)}
                                            </Text>
                                        </View>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>To Level</Text>
                                            <Text style={[styles.statValue, { color: palette.green }]}>
                                                {fishingSkill.level >= 99
                                                    ? 'MAX'
                                                    : `~${Math.ceil((nlvXP - fishingSkill.xp) / spot.xpPerTick)}`}
                                            </Text>
                                        </View>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>Time</Text>
                                            <Text style={styles.statValue}>{(spot.baseTickMs / 1000).toFixed(1)}s</Text>
                                        </View>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>Success</Text>
                                            <Text style={styles.statValue}>{Math.round(spot.successRate * 100)}%</Text>
                                        </View>
                                    </View>

                                    {!isLocked && (
                                        <View style={[styles.trainButton, isActive && styles.trainButtonActive]}>
                                            <Text style={styles.trainButtonText}>{isActive ? 'Stop Fishing' : 'Fish'}</Text>
                                        </View>
                                    )}
                                    {isActive && activeTask && (
                                        <SmoothProgressBar
                                            partialTickMs={activeTask.partialTickMs}
                                            intervalMs={activeTask.intervalMs}
                                            fillColor={palette.skillFishing}
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
                    </View>
                ))}
            </ScrollView>
        </Animated.View>
    );
}

