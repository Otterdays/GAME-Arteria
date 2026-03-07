/**
 * Crafting Screen — Craft materials into usable equipment.
 * [TRACE: ROADMAP 3.2 — Smithing split: Smithing = bars, Crafting = equipment]
 *
 * Groups craftables by category: Materials, Armour, Jewelry.
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
import { meetsNarrativeRequirement } from '../../../../packages/engine/src/utils/narrative';
import { CRAFTING_RECIPES, CRAFTING_CATEGORIES, CraftingRecipe } from '@/constants/crafting';
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

function canAffordRecipe(inventory: { id: string; quantity: number }[], recipe: CraftingRecipe): boolean {
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        if (owned < consumed.quantity) return false;
    }
    return true;
}

function minBatchesAffordable(inventory: { id: string; quantity: number }[], recipe: CraftingRecipe): number {
    let min = Infinity;
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        const batches = consumed.quantity > 0 ? Math.floor(owned / consumed.quantity) : Infinity;
        min = Math.min(min, batches);
    }
    return min === Infinity ? 0 : min;
}

const CRAFTING_CATEGORY_LABELS: Record<string, string> = { materials: 'Materials', armour: 'Armour', jewelry: 'Jewelry' };

export default function CraftingScreen() {
    useIdleSoundscape('crafting');
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const { showFeedbackToast } = useFeedbackToast();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const craftSkill = player.skills.crafting;
    const inventory = player.inventory;
    const activeTask = player.activeTask;

    const isCrafting = activeTask?.skillId === 'crafting';
    const activeRecipeId = isCrafting ? activeTask.actionId : null;
    const activeRecipe = CRAFTING_RECIPES.find((r) => r.id === activeRecipeId);

    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(craftSkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (craftSkill.xp > lastXp.current) {
            const gain = craftSkill.xp - lastXp.current;
            lastXp.current = craftSkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            glowAnim.setValue(0);
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
                glowAnim.setValue(0)
            );
        } else {
            lastXp.current = craftSkill.xp;
        }
    }, [craftSkill.xp, glowAnim]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.12, 0] });
    const craftColor = palette.skillCrafting;

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
                    backgroundColor: `${palette.skillCrafting || craftColor}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: `${palette.skillCrafting || craftColor}50`,
                },
                levelTagText: {
                    color: palette.skillCrafting || craftColor,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                ...getLevelBadgeStyles(palette, craftColor),
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
                nodeEmoji: {
                    fontSize: 32,
                    marginRight: Spacing.md,
                    textShadowColor: craftColor,
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

    const clvXP = xpForLevel(craftSkill.level);
    const nlvXP = xpForLevel(craftSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(craftSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = craftSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleRecipePress = (recipe: CraftingRecipe) => {
        const meetsReq = !recipe.requirement || meetsNarrativeRequirement(player, recipe.requirement);
        if (!meetsReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: 'You must progress further in the story to forge this.',
            });
            return;
        }
        if (craftSkill.level < recipe.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Crafting Level ${recipe.levelReq}`,
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
                skillId: 'crafting',
                actionId: recipe.id,
                intervalMs: recipe.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    const recipesByCategory = useMemo(() => {
        const map: Record<string, CraftingRecipe[]> = {};
        for (const tier of CRAFTING_CATEGORIES) {
            map[tier] = CRAFTING_RECIPES.filter((r) => r.category === tier);
        }
        return map;
    }, []);

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: craftColor, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Crafting', headerShown: false }} />

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
                            router.replace(`/skills/${getPrevSkill('crafting')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.titleContent}>
                        <Text style={styles.screenTitle}>Crafting</Text>
                        <View style={styles.levelTag}>
                            <Text style={styles.levelTagText}>Lv. {craftSkill.level}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getNextSkill('crafting')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.screenSub}>Craft materials into usable equipment.</Text>
                <MasteryBadges skillId="crafting" />

                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={craftColor} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.xpText}>
                            {craftSkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {craftSkill.level >= 99
                                ? `${formatNumber(craftSkill.xp)} XP — MAX`
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
                {CRAFTING_CATEGORIES.map((tier) => {
                    const recipes = recipesByCategory[tier];
                    if (!recipes.length) return null;

                    return (
                        <View key={tier} style={styles.tierSection}>
                            <View style={styles.tierHeader}>
                                <Text style={styles.tierLabel}>{CRAFTING_CATEGORY_LABELS[tier]}</Text>
                                <View style={styles.tierDivider} />
                            </View>

                            {recipes.map((recipe) => {
                                const meetsReq = !recipe.requirement || meetsNarrativeRequirement(player, recipe.requirement);
                                const isLevelLocked = craftSkill.level < recipe.levelReq;
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
                                            isActive && styles.nodeCardActive,
                                            outOfMaterials && styles.nodeCardEmpty,
                                        ]}
                                        scaleTo={0.98}
                                        onPress={() => handleRecipePress(recipe)}
                                        accessibilityRole="button"
                                        accessibilityState={{ disabled: isLocked || outOfMaterials, selected: isActive }}
                                        accessibilityLabel={`${recipe.name}. ${isLocked ? `Unlocks at level ${recipe.levelReq}` : `Forge for ${recipe.xpPerTick} XP`}`}
                                    >
                                        {!isLocked && (
                                            <LinearGradient
                                                colors={getGlassCardGradientColors(palette)}
                                                style={StyleSheet.absoluteFill}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                            />
                                        )}
                                        {isActive && <ActivePulseGlow color={craftColor} />}

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
                                                    {isActive ? 'Stop Crafting' : outOfMaterials ? 'No Mats' : 'Forge'}
                                                </Text>
                                            </View>
                                        )}
                                        {isActive && activeTask && (
                                            <SmoothProgressBar
                                                partialTickMs={activeTask.partialTickMs}
                                                intervalMs={activeTask.intervalMs}
                                                fillColor={craftColor}
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
