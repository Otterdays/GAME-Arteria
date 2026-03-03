import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { RUNE_ALTARS, RuneAltar } from '@/constants/runecrafting';
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

// @ts-ignore
import { meetsNarrativeRequirement } from '../../../../packages/engine/src/utils/narrative';

const ESSENCE_LABEL: Record<string, string> = {
    rune_essence: '💠 Rune Essence',
    pure_essence: '🔮 Pure Essence',
    cosmic_shard: '🌌 Cosmic Shard',
};

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

// Group altars into tiers by essence type
type Tier = { label: string; altars: RuneAltar[] };
function groupByEssence(altars: RuneAltar[]): Tier[] {
    const order = ['rune_essence', 'pure_essence', 'cosmic_shard'];
    const tierLabels: Record<string, string> = {
        rune_essence: 'Standard Runes',
        pure_essence: 'Elemental Runes',
        cosmic_shard: 'Cosmic Runes',
    };
    const map: Record<string, RuneAltar[]> = {};
    for (const a of altars) {
        if (!map[a.essenceType]) map[a.essenceType] = [];
        map[a.essenceType].push(a);
    }
    return order.filter((k) => map[k]).map((k) => ({ label: tierLabels[k], altars: map[k] }));
}

const TIERS = groupByEssence(RUNE_ALTARS);

export default function RunecraftingScreen() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const { showFeedbackToast } = useFeedbackToast();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const rcSkill = player.skills.runecrafting;
    const inventory = player.inventory;
    const activeTask = player.activeTask;

    const isRunecrafting = activeTask?.skillId === 'runecrafting';
    const activeAltarId = isRunecrafting ? activeTask.actionId : null;
    const activeAltar = RUNE_ALTARS.find((a) => a.id === activeAltarId);

    // Helper: how much essence of a given type does the player own?
    const essenceOwned = (type: string) =>
        inventory.find((i) => i.id === type)?.quantity ?? 0;

    // XP float pop + arcane shimmer pulse on craft
    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(rcSkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (rcSkill.xp > lastXp.current) {
            const gain = rcSkill.xp - lastXp.current;
            lastXp.current = rcSkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            glowAnim.setValue(0);
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
                glowAnim.setValue(0)
            );
        } else {
            lastXp.current = rcSkill.xp;
        }
    }, [rcSkill.xp, glowAnim]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.18, 0] });

    const rcColor = palette.purple;

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
                levelBadge: {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.xs,
                    borderRadius: Radius.full,
                    marginBottom: Spacing.sm,
                    borderWidth: 1,
                },
                levelBadgeText: { fontWeight: 'bold', fontSize: FontSize.sm },
                screenTitle: {
                    fontSize: FontSize.xl,
                    fontWeight: 'bold',
                    color: palette.textPrimary,
                    marginBottom: 4,
                },
                screenSub: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginBottom: Spacing.md,
                },
                essenceRow: {
                    flexDirection: 'row',
                    gap: Spacing.sm,
                    marginBottom: Spacing.md,
                },
                essencePill: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.full,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: palette.border,
                    gap: 4,
                },
                essencePillEmoji: { fontSize: 14 },
                essencePillQty: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                xpRow: { width: '100%', gap: 4 },
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
                listContent: { padding: Spacing.md, gap: Spacing.sm },
                tierHeader: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: rcColor,
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
                    opacity: 0.7,
                },
                nodeCardActive: {},
                nodeCardEmpty: { borderColor: palette.redDim },
                nodeHeader: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Spacing.md,
                },
                nodeEmoji: { fontSize: 32, marginRight: Spacing.md },
                nodeTitleContainer: { flex: 1 },
                nodeName: {
                    fontSize: FontSize.lg,
                    fontWeight: 'bold',
                    color: palette.textPrimary,
                    marginBottom: 2,
                },
                textLocked: { color: palette.textDisabled },
                nodeReq: { fontSize: FontSize.xs, color: palette.textSecondary },
                reqBadges: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 6,
                },
                reqBadge: {
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.sm,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                reqBadgeLocked: {
                    borderColor: palette.textDisabled,
                    opacity: 0.8,
                },
                reqBadgeEmpty: {
                    borderColor: palette.redDim,
                    backgroundColor: palette.redDim + '22',
                },
                reqBadgeText: {
                    fontSize: FontSize.xs,
                    color: palette.textPrimary,
                    fontWeight: '600',
                },
                reqBadgeTextLocked: { color: palette.textDisabled },
                outputPill: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: rcColor + '22',
                    borderRadius: Radius.full,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: rcColor + '55',
                    gap: 2,
                },
                outputEmoji: { fontSize: 16 },
                outputLabel: {
                    fontSize: FontSize.sm,
                    color: rcColor,
                    fontWeight: '700',
                },
                nodeStats: {
                    flexDirection: 'row',
                    gap: Spacing.sm,
                    marginBottom: Spacing.md,
                    flexWrap: 'wrap',
                },
                statPill: {
                    flex: 1,
                    minWidth: 55,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    padding: Spacing.sm,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                statLabel: {
                    fontSize: 9,
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
                trainButtonEmpty: {
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.redDim,
                },
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

    // XP header progress
    const clvXP = xpForLevel(rcSkill.level);
    const nlvXP = xpForLevel(rcSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(rcSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = rcSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleAltarPress = (altar: RuneAltar) => {
        const meetsReq = meetsNarrativeRequirement(player, altar.requirement);
        if (!meetsReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: 'You must progress further in the story to use this altar.',
            });
            return;
        }
        if (rcSkill.level < altar.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Runecrafting Level ${altar.levelReq}`,
            });
            return;
        }
        const stock = essenceOwned(altar.essenceType);
        if (stock < altar.essencePerBatch) {
            showFeedbackToast({
                type: 'warning',
                title: 'No Essence',
                message: `You need ${ESSENCE_LABEL[altar.essenceType]} to use this altar. Mine some first!`,
            });
            return;
        }

        if (activeAltarId === altar.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'runecrafting',
                actionId: altar.id,
                intervalMs: altar.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Purple flash overlay on craft */}
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: SKILL_COLOR, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Runecrafting', headerShown: false }} />

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

            {/* Skill Header */}
            <View style={styles.infoSection}>
                <View style={[styles.levelBadge, { backgroundColor: SKILL_COLOR + '33', borderColor: SKILL_COLOR }]}>
                    <Text style={[styles.levelBadgeText, { color: SKILL_COLOR }]}>Lv. {rcSkill.level}</Text>
                </View>
                <Text style={styles.screenTitle}>Runecrafting</Text>
                <Text style={styles.screenSub}>Bind essence at the altars to forge powerful runes.</Text>

                {/* Essence stock row */}
                <View style={styles.essenceRow}>
                    {(['rune_essence', 'pure_essence', 'cosmic_shard'] as const).map((e) => (
                        <View key={e} style={styles.essencePill}>
                            <Text style={styles.essencePillEmoji}>{getItemMeta(e).emoji}</Text>
                            <Text style={styles.essencePillQty}>{formatNumber(essenceOwned(e))}</Text>
                        </View>
                    ))}
                </View>

                {/* XP progress bar */}
                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={SKILL_COLOR} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.xpText}>
                            {rcSkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {rcSkill.level >= 99
                                ? `${formatNumber(rcSkill.xp)} XP — MAX`
                                : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop
                        amount={lastGain.current}
                        emoji={activeAltar?.emoji || '✨'}
                        triggerKey={popTrigger}
                    />
                </View>
            </View>

            {/* Altar list grouped by tier */}
            <ScrollView contentContainerStyle={styles.listContent}>
                {TIERS.map(({ label, altars }) => (
                    <View key={label}>
                        <Text style={styles.tierHeader}>{label}</Text>
                        {altars.map((altar) => {
                            const meetsReq = meetsNarrativeRequirement(player, altar.requirement);
                            const isLevelLocked = rcSkill.level < altar.levelReq;
                            const isLocked = isLevelLocked || !meetsReq;
                            const isActive = activeAltarId === altar.id;
                            const stock = essenceOwned(altar.essenceType);
                            const outOfEssence = !isLocked && stock < altar.essencePerBatch;
                            const runeMeta = getItemMeta(altar.outputRuneId);

                            return (
                                <BouncyButton
                                    key={altar.id}
                                    style={[
                                        styles.nodeCard,
                                        isLocked && styles.nodeCardLocked,
                                        isActive && [
                                            styles.nodeCardActive,
                                            { borderColor: SKILL_COLOR, backgroundColor: SKILL_COLOR + '11' },
                                        ],
                                        outOfEssence && styles.nodeCardEmpty,
                                    ]}
                                    scaleTo={0.98}
                                    onPress={() => handleAltarPress(altar)}
                                    accessibilityRole="button"
                                    accessibilityState={{ disabled: isLocked || outOfEssence, selected: isActive }}
                                    accessibilityLabel={`${altar.name}. ${isLocked ? `Unlocks at level ${altar.levelReq}` : `Craft for ${altar.xpPerEssence} XP per essence`}`}
                                >
                                    {isActive && <ActivePulseGlow color={SKILL_COLOR} />}

                                    <View style={styles.nodeHeader}>
                                        <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.4 }]}>{altar.emoji}</Text>
                                        <View style={styles.nodeTitleContainer}>
                                            <Text style={[styles.nodeName, isLocked && styles.textLocked]}>
                                                {!meetsReq ? '???' : altar.name}
                                            </Text>
                                            <Text style={styles.nodeReq}>
                                                {!meetsReq
                                                    ? 'Requires narrative progression'
                                                    : isLevelLocked
                                                        ? `Unlocks at Lv. ${altar.levelReq}`
                                                        : `Lv. ${altar.levelReq} · Produces ${runeMeta.label}`}
                                            </Text>
                                            {/* Requirements indicator */}
                                            <View style={styles.reqBadges}>
                                                <View style={[styles.reqBadge, isLevelLocked && styles.reqBadgeLocked]}>
                                                    <Text style={[styles.reqBadgeText, isLevelLocked && styles.reqBadgeTextLocked]}>
                                                        Lv. {altar.levelReq} {!isLevelLocked ? '✓' : ''}
                                                    </Text>
                                                </View>
                                                <View style={[styles.reqBadge, outOfEssence && !isLocked && styles.reqBadgeEmpty]}>
                                                    <Text style={styles.reqBadgeText}>
                                                        {getItemMeta(altar.essenceType).emoji} {altar.essencePerBatch}/batch
                                                    </Text>
                                                </View>
                                                {altar.requirement && !meetsReq && (
                                                    <View style={[styles.reqBadge, styles.reqBadgeLocked]}>
                                                        <Text style={styles.reqBadgeText}>📖 Story</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        {/* Rune output preview */}
                                        {!isLocked && (
                                            <View style={styles.outputPill}>
                                                <Text style={styles.outputEmoji}>{runeMeta.emoji}</Text>
                                                <Text style={styles.outputLabel}>×{altar.runesPerBatch}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={[styles.nodeStats, isLocked && { opacity: 0.4 }]}>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>XP/Essence</Text>
                                            <Text style={styles.statValue}>{altar.xpPerEssence}</Text>
                                        </View>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>XP/hr</Text>
                                            <Text style={[styles.statValue, { color: palette.gold }]}>
                                                {formatXpHr(altar.xpPerEssence * altar.essencePerBatch, altar.baseTickMs, 1)}
                                            </Text>
                                        </View>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>To Level</Text>
                                            <Text style={[styles.statValue, { color: palette.green }]}>
                                                {rcSkill.level >= 99
                                                    ? 'MAX'
                                                    : `~${Math.ceil((nlvXP - rcSkill.xp) / (altar.xpPerEssence * altar.essencePerBatch))}`}
                                            </Text>
                                        </View>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>Have</Text>
                                            <Text style={[styles.statValue, { color: outOfEssence ? palette.red : palette.white }]}>
                                                {formatNumber(stock)} ess
                                            </Text>
                                        </View>
                                        <View style={styles.statPill}>
                                            <Text style={styles.statLabel}>Time</Text>
                                            <Text style={styles.statValue}>{(altar.baseTickMs / 1000).toFixed(1)}s</Text>
                                        </View>
                                    </View>

                                    {!isLocked && (
                                        <View style={[
                                            styles.trainButton,
                                            isActive && styles.trainButtonActive,
                                            outOfEssence && styles.trainButtonEmpty,
                                        ]}>
                                            <Text style={styles.trainButtonText}>
                                                {isActive ? 'Stop Binding' : outOfEssence ? 'No Essence' : 'Bind Runes'}
                                            </Text>
                                        </View>
                                    )}
                                    {isActive && activeTask && (
                                        <SmoothProgressBar
                                            partialTickMs={activeTask.partialTickMs}
                                            intervalMs={activeTask.intervalMs}
                                            fillColor={rcColor}
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

