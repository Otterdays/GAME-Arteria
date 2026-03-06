/**
 * Smithing Screen — Smelt ore into bars.
 * [TRACE: ROADMAP 3.2 — Smithing]
 */

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
import { SMELTING_RECIPES, SmeltingRecipe } from '@/constants/smithing';
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

// @ts-ignore
import { meetsNarrativeRequirement } from '../../../../packages/engine/src/utils/narrative';

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

function canAffordRecipe(inventory: { id: string; quantity: number }[], recipe: SmeltingRecipe): boolean {
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        if (owned < consumed.quantity) return false;
    }
    return true;
}

function minBatchesAffordable(inventory: { id: string; quantity: number }[], recipe: SmeltingRecipe): number {
    let min = Infinity;
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        const batches = consumed.quantity > 0 ? Math.floor(owned / consumed.quantity) : Infinity;
        min = Math.min(min, batches);
    }
    return min === Infinity ? 0 : min;
}

export default function SmithingScreen() {
    useIdleSoundscape('smithing');
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const { showFeedbackToast } = useFeedbackToast();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const smithSkill = player.skills.smithing;
    const inventory = player.inventory;
    const activeTask = player.activeTask;

    const isSmithing = activeTask?.skillId === 'smithing';
    const activeRecipeId = isSmithing ? activeTask.actionId : null;
    const activeRecipe = SMELTING_RECIPES.find((r) => r.id === activeRecipeId);

    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(smithSkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (smithSkill.xp > lastXp.current) {
            const gain = smithSkill.xp - lastXp.current;
            lastXp.current = smithSkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            glowAnim.setValue(0);
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
                glowAnim.setValue(0)
            );
        } else {
            lastXp.current = smithSkill.xp;
        }
    }, [smithSkill.xp, glowAnim]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.12, 0] });
    const smithColor = palette.skillSmithing;

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
                levelTag: {
                    backgroundColor: `${palette.skillSmithing || smithColor}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: `${palette.skillSmithing || smithColor}50`,
                },
                levelTagText: {
                    color: palette.skillSmithing || smithColor,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                ...getLevelBadgeStyles(palette, smithColor),
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
                screenTitle: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.xl,
                    color: palette.textPrimary,
                },
                screenSub: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginBottom: Spacing.md,
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
                ...getNodeCardBaseStyles(palette),
                nodeCard: {
                    ...getNodeCardBaseStyles(palette).nodeCard,
                    marginBottom: Spacing.md,
                },
                nodeCardLocked: {
                    ...getNodeCardBaseStyles(palette).nodeCardLocked,
                    opacity: 0.7,
                },
                nodeCardActive: { borderColor: smithColor, borderWidth: 1 },
                nodeCardEmpty: { borderColor: palette.redDim },
                nodeHeader: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Spacing.md,
                },
                nodeEmoji: {
                    fontSize: 32,
                    marginRight: Spacing.md,
                    textShadowColor: smithColor,
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
                reqBadgeLocked: { borderColor: palette.textDisabled, opacity: 0.8 },
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

    const clvXP = xpForLevel(smithSkill.level);
    const nlvXP = xpForLevel(smithSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(smithSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = smithSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleRecipePress = (recipe: SmeltingRecipe) => {
        const meetsReq = meetsNarrativeRequirement(player, recipe.requirement);
        if (!meetsReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: 'You must progress further in the story to smelt this.',
            });
            return;
        }
        if (smithSkill.level < recipe.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Smithing Level ${recipe.levelReq}`,
            });
            return;
        }
        if (!canAffordRecipe(inventory, recipe)) {
            showFeedbackToast({
                type: 'warning',
                title: 'No Materials',
                message: `You need the required ores to smelt ${recipe.name}. Mine some first!`,
            });
            return;
        }

        if (activeRecipeId === recipe.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'smithing',
                actionId: recipe.id,
                intervalMs: recipe.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: smithColor, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Smithing', headerShown: false }} />

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
                            router.replace(`/skills/${getPrevSkill('smithing')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.titleContent}>
                        <Text style={styles.screenTitle}>Smithing</Text>
                        <View style={styles.levelTag}>
                            <Text style={styles.levelTagText}>Lv. {smithSkill.level}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getNextSkill('smithing')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.screenSub}>Smelt ore into bars at the furnace.</Text>
                <MasteryBadges skillId="smithing" />

                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={smithColor} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.xpText}>
                            {smithSkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {smithSkill.level >= 99
                                ? `${formatNumber(smithSkill.xp)} XP — MAX`
                                : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop
                        amount={lastGain.current}
                        emoji={activeRecipe?.emoji || '🔨'}
                        triggerKey={popTrigger}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {SMELTING_RECIPES.map((recipe) => {
                    const meetsReq = meetsNarrativeRequirement(player, recipe.requirement);
                    const isLevelLocked = smithSkill.level < recipe.levelReq;
                    const isLocked = isLevelLocked || !meetsReq;
                    const isActive = activeRecipeId === recipe.id;
                    const outOfMaterials = !isLocked && !canAffordRecipe(inventory, recipe);
                    const batches = minBatchesAffordable(inventory, recipe);
                    const outputMeta = getItemMeta(recipe.items[0]?.id ?? '');

                    return (
                        <BouncyButton
                            key={recipe.id}
                            style={[
                                styles.nodeCard,
                                isLocked && styles.nodeCardLocked,
                                isActive && [
                                    styles.nodeCardActive,
                                    { borderColor: smithColor, backgroundColor: smithColor + '11' },
                                ],
                                outOfMaterials && styles.nodeCardEmpty,
                            ]}
                            scaleTo={0.98}
                            onPress={() => handleRecipePress(recipe)}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: isLocked || outOfMaterials, selected: isActive }}
                            accessibilityLabel={`${recipe.name}. ${isLocked ? `Unlocks at level ${recipe.levelReq}` : `Smelt for ${recipe.xpPerTick} XP`}`}
                        >
                            {!isLocked && (
                                <LinearGradient
                                    colors={getGlassCardGradientColors(palette)}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            {isActive && <ActivePulseGlow color={smithColor} />}

                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.4 }]}>{recipe.emoji}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLocked && styles.textLocked]}>
                                        {!meetsReq ? '???' : recipe.name}
                                    </Text>
                                    <Text style={styles.nodeReq}>
                                        {!meetsReq
                                            ? 'Requires narrative progression'
                                            : isLevelLocked
                                                ? `Unlocks at Lv. ${recipe.levelReq}`
                                                : `Lv. ${recipe.levelReq} · Produces ${outputMeta.label}`}
                                    </Text>
                                    <View style={styles.reqBadges}>
                                        <View style={[styles.reqBadge, isLevelLocked && styles.reqBadgeLocked]}>
                                            <Text style={[styles.reqBadgeText, isLevelLocked && styles.reqBadgeTextLocked]}>
                                                Lv. {recipe.levelReq} {!isLevelLocked ? '✓' : ''}
                                            </Text>
                                        </View>
                                        {recipe.consumedItems.map((c) => {
                                            const meta = getItemMeta(c.id);
                                            const owned = inventory.find((i) => i.id === c.id)?.quantity ?? 0;
                                            const low = !isLocked && owned < c.quantity;
                                            return (
                                                <View
                                                    key={c.id}
                                                    style={[
                                                        styles.reqBadge,
                                                        low && styles.reqBadgeEmpty,
                                                    ]}
                                                >
                                                    <Text style={styles.reqBadgeText}>
                                                        {meta.emoji} {owned}/{c.quantity}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                        {recipe.requirement && !meetsReq && (
                                            <View style={[styles.reqBadge, styles.reqBadgeLocked]}>
                                                <Text style={styles.reqBadgeText}>📖 Story</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.nodeStats, isLocked && { opacity: 0.4 }]}>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/Bar</Text>
                                    <Text style={styles.statValue}>{recipe.xpPerTick}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/hr</Text>
                                    <Text style={[styles.statValue, { color: palette.gold }]}>
                                        {formatXpHr(recipe.xpPerTick, recipe.baseTickMs, recipe.successRate)}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>To Level</Text>
                                    <Text style={[styles.statValue, { color: palette.green }]}>
                                        {smithSkill.level >= 99
                                            ? 'MAX'
                                            : `~${Math.ceil((nlvXP - smithSkill.xp) / recipe.xpPerTick)}`}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Batches</Text>
                                    <Text style={[styles.statValue, { color: outOfMaterials ? palette.red : palette.white }]}>
                                        {formatNumber(batches)}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Time</Text>
                                    <Text style={styles.statValue}>{(recipe.baseTickMs / 1000).toFixed(1)}s</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Success</Text>
                                    <Text style={styles.statValue}>{Math.round(recipe.successRate * 100)}%</Text>
                                </View>
                            </View>

                            {!isLocked && (
                                <View style={[
                                    styles.trainButton,
                                    isActive && styles.trainButtonActive,
                                    outOfMaterials && styles.trainButtonEmpty,
                                ]}>
                                    <Text style={styles.trainButtonText}>
                                        {isActive ? 'Stop Smelting' : outOfMaterials ? 'No Materials' : 'Smelt'}
                                    </Text>
                                </View>
                            )}
                            {isActive && activeTask && (
                                <SmoothProgressBar
                                    partialTickMs={activeTask.partialTickMs}
                                    intervalMs={activeTask.intervalMs}
                                    fillColor={smithColor}
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
