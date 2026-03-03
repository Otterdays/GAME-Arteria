/**
 * Forging Screen — Forge bars into weapons and armour at the anvil.
 * [TRACE: ROADMAP 3.2 — Smithing split: Smithing = bars, Forging = equipment]
 *
 * Groups craftables by metal tier: Bronze, Iron, Steel, Mithril, Adamant.
 */

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
import { FORGING_RECIPES, METAL_TIERS, ForgingRecipe } from '@/constants/forging';
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

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

function canAffordRecipe(inventory: { id: string; quantity: number }[], recipe: ForgingRecipe): boolean {
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        if (owned < consumed.quantity) return false;
    }
    return true;
}

function minBatchesAffordable(inventory: { id: string; quantity: number }[], recipe: ForgingRecipe): number {
    let min = Infinity;
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        const batches = consumed.quantity > 0 ? Math.floor(owned / consumed.quantity) : Infinity;
        min = Math.min(min, batches);
    }
    return min === Infinity ? 0 : min;
}

const METAL_TIER_LABELS: Record<string, string> = {
    bronze: 'Bronze',
    iron: 'Iron',
    steel: 'Steel',
    mithril: 'Mithril',
    adamant: 'Adamant',
};

export default function ForgingScreen() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const { showFeedbackToast } = useFeedbackToast();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const forgeSkill = player.skills.forging;
    const inventory = player.inventory;
    const activeTask = player.activeTask;

    const isForging = activeTask?.skillId === 'forging';
    const activeRecipeId = isForging ? activeTask.actionId : null;
    const activeRecipe = FORGING_RECIPES.find((r) => r.id === activeRecipeId);

    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(forgeSkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (forgeSkill.xp > lastXp.current) {
            const gain = forgeSkill.xp - lastXp.current;
            lastXp.current = forgeSkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            glowAnim.setValue(0);
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
                glowAnim.setValue(0)
            );
        } else {
            lastXp.current = forgeSkill.xp;
        }
    }, [forgeSkill.xp, glowAnim]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.12, 0] });
    const forgeColor = palette.skillForging;

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
                listContent: { padding: Spacing.md, paddingBottom: Spacing['2xl'] },
                tierSection: { marginBottom: Spacing.lg },
                tierHeader: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Spacing.sm,
                    paddingHorizontal: Spacing.xs,
                },
                tierLabel: {
                    fontSize: FontSize.md,
                    fontWeight: 'bold',
                    color: palette.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                },
                tierDivider: {
                    flex: 1,
                    height: 1,
                    backgroundColor: palette.border,
                    marginLeft: Spacing.sm,
                },
                nodeCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.sm,
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

    const clvXP = xpForLevel(forgeSkill.level);
    const nlvXP = xpForLevel(forgeSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(forgeSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = forgeSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleRecipePress = (recipe: ForgingRecipe) => {
        if (forgeSkill.level < recipe.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Forging Level ${recipe.levelReq}`,
            });
            return;
        }
        if (!canAffordRecipe(inventory, recipe)) {
            showFeedbackToast({
                type: 'warning',
                title: 'No Materials',
                message: `You need the required bars to forge ${recipe.name}. Smelt some first!`,
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
                skillId: 'forging',
                actionId: recipe.id,
                intervalMs: recipe.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    const recipesByTier = useMemo(() => {
        const map: Record<string, ForgingRecipe[]> = {};
        for (const tier of METAL_TIERS) {
            map[tier] = FORGING_RECIPES.filter((r) => r.metalTier === tier);
        }
        return map;
    }, []);

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: forgeColor, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Forging', headerShown: false }} />

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

            <View style={styles.infoSection}>
                <View style={[styles.levelBadge, { backgroundColor: forgeColor + '33', borderColor: forgeColor }]}>
                    <Text style={[styles.levelBadgeText, { color: forgeColor }]}>Lv. {forgeSkill.level}</Text>
                </View>
                <Text style={styles.screenTitle}>Forging</Text>
                <Text style={styles.screenSub}>Forge bars into weapons and armour at the anvil.</Text>

                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={forgeColor} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.xpText}>
                            {forgeSkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {forgeSkill.level >= 99
                                ? `${formatNumber(forgeSkill.xp)} XP — MAX`
                                : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop
                        amount={lastGain.current}
                        emoji={activeRecipe?.emoji || '⚒️'}
                        triggerKey={popTrigger}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {METAL_TIERS.map((tier) => {
                    const recipes = recipesByTier[tier];
                    if (!recipes.length) return null;

                    return (
                        <View key={tier} style={styles.tierSection}>
                            <View style={styles.tierHeader}>
                                <Text style={styles.tierLabel}>{METAL_TIER_LABELS[tier]}</Text>
                                <View style={styles.tierDivider} />
                            </View>

                            {recipes.map((recipe) => {
                                const isLevelLocked = forgeSkill.level < recipe.levelReq;
                                const isLocked = isLevelLocked;
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
                                                { borderColor: forgeColor, backgroundColor: forgeColor + '11' },
                                            ],
                                            outOfMaterials && styles.nodeCardEmpty,
                                        ]}
                                        scaleTo={0.98}
                                        onPress={() => handleRecipePress(recipe)}
                                        accessibilityRole="button"
                                        accessibilityState={{ disabled: isLocked || outOfMaterials, selected: isActive }}
                                        accessibilityLabel={`${recipe.name}. ${isLocked ? `Unlocks at level ${recipe.levelReq}` : `Forge for ${recipe.xpPerTick} XP`}`}
                                    >
                                        {isActive && <ActivePulseGlow color={forgeColor} />}

                                        <View style={styles.nodeHeader}>
                                            <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.4 }]}>{recipe.emoji}</Text>
                                            <View style={styles.nodeTitleContainer}>
                                                <Text style={[styles.nodeName, isLocked && styles.textLocked]}>
                                                    {recipe.name}
                                                </Text>
                                                <Text style={styles.nodeReq}>
                                                    {isLevelLocked
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
                                                </View>
                                            </View>
                                        </View>

                                        <View style={[styles.nodeStats, isLocked && { opacity: 0.4 }]}>
                                            <View style={styles.statPill}>
                                                <Text style={styles.statLabel}>XP</Text>
                                                <Text style={styles.statValue}>{recipe.xpPerTick}</Text>
                                            </View>
                                            <View style={styles.statPill}>
                                                <Text style={styles.statLabel}>XP/hr</Text>
                                                <Text style={[styles.statValue, { color: palette.gold }]}>
                                                    {formatXpHr(recipe.xpPerTick, recipe.baseTickMs, recipe.successRate)}
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
                                        </View>

                                        {!isLocked && (
                                            <View style={[
                                                styles.trainButton,
                                                isActive && styles.trainButtonActive,
                                                outOfMaterials && styles.trainButtonEmpty,
                                            ]}>
                                                <Text style={styles.trainButtonText}>
                                                    {isActive ? 'Stop Forging' : outOfMaterials ? 'No Bars' : 'Forge'}
                                                </Text>
                                            </View>
                                        )}
                                        {isActive && activeTask && (
                                            <SmoothProgressBar
                                                partialTickMs={activeTask.partialTickMs}
                                                intervalMs={activeTask.intervalMs}
                                                fillColor={forgeColor}
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
                    );
                })}
            </ScrollView>
        </Animated.View>
    );
}
