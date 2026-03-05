/**
 * Cooking Screen — Cook raw fish into food.
 * [TRACE: DOCU/ROADMAP 3.2 — Cooking; v0.4.1 The Anchor Man]
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
import { COOKING_RECIPES, CookingRecipe } from '@/constants/cooking';
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
import { useIdleSoundscape } from '@/hooks/useIdleSoundscape';

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

function canAffordRecipe(inventory: { id: string; quantity: number }[], recipe: CookingRecipe): boolean {
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        if (owned < consumed.quantity) return false;
    }
    return true;
}

function minBatchesAffordable(inventory: { id: string; quantity: number }[], recipe: CookingRecipe): number {
    let min = Infinity;
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        const batches = consumed.quantity > 0 ? Math.floor(owned / consumed.quantity) : Infinity;
        min = Math.min(min, batches);
    }
    return min === Infinity ? 0 : min;
}

export default function CookingScreen() {
    useIdleSoundscape('cooking');
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const { showFeedbackToast } = useFeedbackToast();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const cookSkill = player.skills.cooking;
    const inventory = player.inventory;
    const activeTask = player.activeTask;

    const isCooking = activeTask?.skillId === 'cooking';
    const activeRecipeId = isCooking ? activeTask.actionId : null;
    const activeRecipe = COOKING_RECIPES.find((r) => r.id === activeRecipeId);

    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(cookSkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (cookSkill.xp > lastXp.current) {
            const gain = cookSkill.xp - lastXp.current;
            lastXp.current = cookSkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            glowAnim.setValue(0);
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
                glowAnim.setValue(0)
            );
        } else {
            lastXp.current = cookSkill.xp;
        }
    }, [cookSkill.xp, glowAnim]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.12, 0] });
    const cookColor = palette.skillCooking;

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
                levelBadge: {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.xs,
                    borderRadius: Radius.full,
                    marginBottom: Spacing.sm,
                    borderWidth: 1,
                },
                levelBadgeText: { fontWeight: 'bold', fontSize: FontSize.sm },
                screenTitle: { fontSize: FontSize.xl, fontWeight: 'bold', color: palette.textPrimary, marginBottom: 4 },
                screenSub: { fontSize: FontSize.sm, color: palette.textSecondary, marginBottom: Spacing.md },
                xpRow: { width: '100%', gap: 4 },
                xpBarBg: { height: 6, backgroundColor: palette.bgApp, borderRadius: 999, overflow: 'hidden', width: '100%' },
                xpText: { fontSize: FontSize.xs, color: palette.textSecondary, textAlign: 'center' },
                listContent: { padding: Spacing.md, gap: Spacing.sm },
                nodeCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.md,
                },
                nodeCardLocked: { backgroundColor: palette.bgApp, borderColor: 'transparent', opacity: 0.7 },
                nodeCardActive: {},
                nodeCardEmpty: { borderColor: palette.redDim },
                nodeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
                nodeEmoji: { fontSize: 32, marginRight: Spacing.md },
                nodeTitleContainer: { flex: 1 },
                nodeName: { fontSize: FontSize.lg, fontWeight: 'bold', color: palette.textPrimary, marginBottom: 2 },
                textLocked: { color: palette.textDisabled },
                nodeReq: { fontSize: FontSize.xs, color: palette.textSecondary },
                reqBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
                reqBadge: {
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.sm,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                reqBadgeEmpty: { borderColor: palette.redDim, backgroundColor: palette.redDim + '22' },
                reqBadgeText: { fontSize: FontSize.xs, color: palette.textPrimary, fontWeight: '600' },
                nodeStats: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md, flexWrap: 'wrap' },
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
                statLabel: { fontSize: 9, color: palette.textSecondary, textTransform: 'uppercase', marginBottom: 2 },
                statValue: { fontSize: FontSize.sm, color: palette.white, fontWeight: '600' },
                trainButton: { backgroundColor: palette.accentPrimary, paddingVertical: Spacing.sm, borderRadius: Radius.md, alignItems: 'center' },
                trainButtonActive: { backgroundColor: palette.redDim },
                trainButtonEmpty: { backgroundColor: palette.bgCard, borderWidth: 1, borderColor: palette.redDim },
                trainButtonLocked: { backgroundColor: palette.bgCard, borderWidth: 1, borderColor: palette.border },
                trainButtonText: { color: palette.white, fontWeight: 'bold', fontSize: FontSize.base },
            }),
        [palette]
    );

    const clvXP = xpForLevel(cookSkill.level);
    const nlvXP = xpForLevel(cookSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(cookSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = cookSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleRecipePress = (recipe: CookingRecipe) => {
        if (cookSkill.level < recipe.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Cooking Level ${recipe.levelReq}`,
            });
            return;
        }
        if (!canAffordRecipe(inventory, recipe)) {
            showFeedbackToast({
                type: 'warning',
                title: 'No Materials',
                message: `You need raw fish to cook ${recipe.name}. Go fishing first!`,
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
                skillId: 'cooking',
                actionId: recipe.id,
                intervalMs: recipe.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: cookColor, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Cooking', headerShown: false }} />

            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
                    <Text style={styles.backButtonText}>‹ Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
                <View style={[styles.levelBadge, { backgroundColor: cookColor + '33', borderColor: cookColor }]}>
                    <Text style={[styles.levelBadgeText, { color: cookColor }]}>Lv. {cookSkill.level}</Text>
                </View>
                <Text style={styles.screenTitle}>Cooking</Text>
                <Text style={styles.screenSub}>Turn raw fish into nourishing food for the road.</Text>

                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={cookColor} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.xpText}>
                            {cookSkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {cookSkill.level >= 99 ? `${formatNumber(cookSkill.xp)} XP — MAX` : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop amount={lastGain.current} emoji={activeRecipe?.emoji || '🍳'} triggerKey={popTrigger} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {COOKING_RECIPES.map((recipe) => {
                    const isLevelLocked = cookSkill.level < recipe.levelReq;
                    const isActive = activeRecipeId === recipe.id;
                    const outOfMaterials = !isLevelLocked && !canAffordRecipe(inventory, recipe);
                    const batches = minBatchesAffordable(inventory, recipe);
                    const outputMeta = getItemMeta(recipe.items[0]?.id ?? '');

                    return (
                        <BouncyButton
                            key={recipe.id}
                            style={[
                                styles.nodeCard,
                                isLevelLocked && styles.nodeCardLocked,
                                isActive && [styles.nodeCardActive, { borderColor: cookColor, backgroundColor: cookColor + '11' }],
                                outOfMaterials && styles.nodeCardEmpty,
                            ]}
                            scaleTo={0.98}
                            onPress={() => handleRecipePress(recipe)}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: isLevelLocked || outOfMaterials, selected: isActive }}
                            accessibilityLabel={`${recipe.name}. ${isLevelLocked ? `Unlocks at level ${recipe.levelReq}` : `Cook for ${recipe.xpPerTick} XP`}`}
                        >
                            {isActive && <ActivePulseGlow color={cookColor} />}

                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLevelLocked && { opacity: 0.4 }]}>{recipe.emoji}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLevelLocked && styles.textLocked]}>{recipe.name}</Text>
                                    <Text style={styles.nodeReq}>
                                        {isLevelLocked ? `Unlocks at Lv. ${recipe.levelReq}` : `Lv. ${recipe.levelReq} · Produces ${outputMeta.label}`}
                                    </Text>
                                    <View style={styles.reqBadges}>
                                        <View style={[styles.reqBadge, isLevelLocked && { borderColor: palette.textDisabled, opacity: 0.8 }]}>
                                            <Text style={[styles.reqBadgeText, isLevelLocked && { color: palette.textDisabled }]}>
                                                Lv. {recipe.levelReq} {!isLevelLocked ? '✓' : ''}
                                            </Text>
                                        </View>
                                        {recipe.consumedItems.map((c) => {
                                            const meta = getItemMeta(c.id);
                                            const owned = inventory.find((i) => i.id === c.id)?.quantity ?? 0;
                                            const low = !isLevelLocked && owned < c.quantity;
                                            return (
                                                <View key={c.id} style={[styles.reqBadge, low && styles.reqBadgeEmpty]}>
                                                    <Text style={styles.reqBadgeText}>{meta.emoji} {owned}/{c.quantity}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.nodeStats, isLevelLocked && { opacity: 0.4 }]}>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/Item</Text>
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
                                        {cookSkill.level >= 99 ? 'MAX' : `~${Math.ceil((nlvXP - cookSkill.xp) / recipe.xpPerTick)}`}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Batches</Text>
                                    <Text style={[styles.statValue, { color: outOfMaterials ? palette.red : palette.white }]}>{formatNumber(batches)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Success</Text>
                                    <Text style={styles.statValue}>{Math.round(recipe.successRate * 100)}%</Text>
                                </View>
                            </View>

                            {!isLevelLocked && (
                                <View style={[
                                    styles.trainButton,
                                    isActive && styles.trainButtonActive,
                                    outOfMaterials && styles.trainButtonEmpty,
                                ]}>
                                    <Text style={styles.trainButtonText}>
                                        {isActive ? 'Stop Cooking' : outOfMaterials ? 'No Fish' : 'Cook'}
                                    </Text>
                                </View>
                            )}
                            {isActive && activeTask && (
                                <SmoothProgressBar
                                    partialTickMs={activeTask.partialTickMs}
                                    intervalMs={activeTask.intervalMs}
                                    fillColor={cookColor}
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
