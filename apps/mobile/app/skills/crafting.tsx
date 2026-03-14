/**
 * Crafting Screen — Radial Mastery UI v2.0
 * Competing design: Circular recipe wheel with gestural selection.
 * [TRACE: UI_COMPETITOR_DESIGN.md — Radial vs Workbench paradigm]
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { meetsNarrativeRequirement } from '../../../../packages/engine/src/utils/narrative';
import { CRAFTING_RECIPES, CraftingRecipe } from '@/constants/crafting';
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

const { width: SCREEN_W } = Dimensions.get('window');
const WHEEL_SIZE = SCREEN_W * 0.85;
const CENTER_SIZE = 120;

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

function getRecipeTier(levelReq: number): number {
    if (levelReq <= 10) return 1;
    if (levelReq <= 25) return 2;
    if (levelReq <= 40) return 3;
    return 4;
}

function getTierColor(tier: number, palette: any): string {
    const colors = [palette.accentPrimary, palette.gold, '#ff6b35', palette.skillCrafting];
    return colors[tier - 1] || palette.skillCrafting;
}

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

    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(
        activeRecipeId ?? CRAFTING_RECIPES[0]?.id ?? null
    );
    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(craftSkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

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

    const selectedRecipe = selectedRecipeId ? CRAFTING_RECIPES.find((r) => r.id === selectedRecipeId) : null;

    const handleRecipeSelect = useCallback((recipe: CraftingRecipe) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedRecipeId(recipe.id);
    }, []);

    const handleCraftPress = useCallback(() => {
        if (!selectedRecipe) return;

        const meetsReq = !selectedRecipe.requirement || meetsNarrativeRequirement(player, selectedRecipe.requirement);
        if (!meetsReq) {
            showFeedbackToast({ type: 'locked', title: 'Locked', message: 'Progress further in the story.' });
            return;
        }
        if (craftSkill.level < selectedRecipe.levelReq) {
            showFeedbackToast({ type: 'locked', title: 'Locked', message: `Requires Level ${selectedRecipe.levelReq}` });
            return;
        }
        if (!canAffordRecipe(inventory, selectedRecipe)) {
            showFeedbackToast({ type: 'warning', title: 'No Materials', message: 'Gather more resources first.' });
            return;
        }

        if (activeRecipeId === selectedRecipe.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'crafting',
                actionId: selectedRecipe.id,
                intervalMs: selectedRecipe.baseTickMs,
                partialTickMs: 0,
            });
        }
    }, [selectedRecipe, activeRecipeId, craftSkill.level, inventory, player, showFeedbackToast, dispatch, requestStartTask]);

    // Group recipes into tiers for the radial layout
    const recipesByTier = useMemo(() => {
        const tiers: CraftingRecipe[][] = [[], [], [], []];
        CRAFTING_RECIPES.forEach((r) => {
            const tier = getRecipeTier(r.levelReq) - 1;
            tiers[tier].push(r);
        });
        return tiers;
    }, []);

    const clvXP = xpForLevel(craftSkill.level);
    const nlvXP = xpForLevel(craftSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(craftSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const xpPct = craftSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                headerRow: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.md,
                    paddingTop: Spacing.sm,
                    backgroundColor: palette.bgApp,
                    zIndex: 100,
                },
                backButton: { paddingHorizontal: Spacing.sm, paddingVertical: 6 },
                backButtonText: { color: palette.accentPrimary, fontSize: FontSize.md, fontWeight: '600' },

                // Hero section with circular XP
                heroSection: {
                    alignItems: 'center',
                    paddingVertical: Spacing.md,
                },
                levelBadge: {
                    position: 'absolute',
                    top: 0,
                    backgroundColor: `${craftColor}40`,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: 4,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: craftColor,
                    zIndex: 10,
                },
                levelBadgeText: {
                    color: craftColor,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                },
                skillTitle: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.xl,
                    color: palette.textPrimary,
                    marginTop: Spacing.sm,
                },
                skillSubtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 2,
                },

                // Circular progress container
                orbitContainer: {
                    width: WHEEL_SIZE,
                    height: WHEEL_SIZE,
                    alignSelf: 'center',
                    marginTop: Spacing.lg,
                },
                centerOrb: {
                    position: 'absolute',
                    left: (WHEEL_SIZE - CENTER_SIZE) / 2,
                    top: (WHEEL_SIZE - CENTER_SIZE) / 2,
                    width: CENTER_SIZE,
                    height: CENTER_SIZE,
                    borderRadius: CENTER_SIZE / 2,
                    backgroundColor: palette.bgCard,
                    borderWidth: 3,
                    borderColor: craftColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    shadowColor: craftColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 10,
                },
                centerOrbActive: {
                    borderColor: palette.gold,
                    shadowColor: palette.gold,
                },
                centerEmoji: {
                    fontSize: 48,
                },
                centerLevel: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    marginTop: 2,
                },
                xpRing: {
                    position: 'absolute',
                    left: 10,
                    top: 10,
                    right: 10,
                    bottom: 10,
                    borderRadius: WHEEL_SIZE / 2,
                    borderWidth: 4,
                    borderColor: `${craftColor}30`,
                },

                // Recipe nodes positioned around the wheel
                recipeNode: {
                    position: 'absolute',
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: palette.bgCard,
                    borderWidth: 2,
                    borderColor: palette.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 40,
                },
                recipeNodeSelected: {
                    borderColor: palette.gold,
                    backgroundColor: `${palette.gold}20`,
                    transform: [{ scale: 1.15 }],
                    shadowColor: palette.gold,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 10,
                },
                recipeNodeLocked: {
                    borderColor: palette.textDisabled,
                    backgroundColor: palette.bgApp,
                    opacity: 0.5,
                },
                recipeNodeActive: {
                    borderColor: craftColor,
                    backgroundColor: `${craftColor}30`,
                    shadowColor: craftColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 15,
                },
                recipeNodeAffordable: {
                    borderColor: '#4caf50',
                },
                recipeEmoji: {
                    fontSize: 24,
                },
                recipeLevelBadge: {
                    position: 'absolute',
                    bottom: -4,
                    backgroundColor: palette.bgCard,
                    paddingHorizontal: 4,
                    paddingVertical: 1,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                recipeLevelText: {
                    fontSize: 8,
                    color: palette.textSecondary,
                    fontWeight: 'bold',
                },

                // Detail panel at bottom
                detailPanel: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: palette.bgCard,
                    borderTopLeftRadius: Radius.xl,
                    borderTopRightRadius: Radius.xl,
                    borderTopWidth: 1,
                    borderColor: palette.border,
                    padding: Spacing.lg,
                    paddingBottom: Spacing.xl + insets.bottom,
                    minHeight: 220,
                },
                detailPanelEmpty: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 120,
                },
                detailHeader: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Spacing.md,
                },
                detailEmoji: {
                    fontSize: 40,
                    marginRight: Spacing.md,
                },
                detailTitleBlock: {},
                detailName: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.lg,
                    color: palette.textPrimary,
                },
                detailSubtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                },
                matsRow: {
                    flexDirection: 'row',
                    gap: Spacing.md,
                    marginBottom: Spacing.md,
                },
                matChip: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgApp,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 6,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    gap: 4,
                },
                matChipAffordable: {
                    borderColor: '#4caf5080',
                },
                matChipText: {
                    fontSize: FontSize.sm,
                    color: palette.textPrimary,
                },
                matChipTextAffordable: {
                    color: '#4caf50',
                },
                statsRow: {
                    flexDirection: 'row',
                    gap: Spacing.sm,
                    marginBottom: Spacing.md,
                },
                statChip: {
                    backgroundColor: palette.bgApp,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: Radius.sm,
                },
                statLabel: {
                    fontSize: 10,
                    color: palette.textMuted,
                },
                statValue: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                craftButton: {
                    backgroundColor: craftColor,
                    paddingVertical: Spacing.md,
                    borderRadius: Radius.lg,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: Spacing.sm,
                },
                craftButtonDisabled: {
                    backgroundColor: palette.bgApp,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                craftButtonActive: {
                    backgroundColor: palette.redDim,
                },
                craftButtonText: {
                    color: palette.white,
                    fontWeight: 'bold',
                    fontSize: FontSize.base,
                },
                navRow: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: Spacing.lg,
                    marginBottom: 240, // Space for detail panel
                },
                navChevron: {
                    padding: Spacing.sm,
                    opacity: 0.6,
                },
                tierLegend: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: Spacing.md,
                    marginTop: Spacing.sm,
                    marginBottom: 200,
                },
                tierDot: {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                },
                tierLabel: {
                    fontSize: 10,
                    color: palette.textSecondary,
                },
            }),
        [palette, craftColor, insets.bottom]
    );

    // Calculate positions for recipes in concentric circles (tiers 2 and 3 had same radius — caused overlap)
    const getNodePosition = (index: number, total: number, tier: number): { left: number; top: number } => {
        const radius = tier === 0 ? WHEEL_SIZE * 0.28 : tier === 1 ? WHEEL_SIZE * 0.38 : tier === 2 ? WHEEL_SIZE * 0.42 : WHEEL_SIZE * 0.48;
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
        const center = WHEEL_SIZE / 2 - 28; // node size/2
        return {
            left: center + radius * Math.cos(angle),
            top: center + radius * Math.sin(angle),
        };
    };

    const renderRecipeNode = (recipe: CraftingRecipe, index: number, tier: number, total: number) => {
        const pos = getNodePosition(index, total, tier);
        const isSelected = selectedRecipeId === recipe.id;
        const isActive = activeRecipeId === recipe.id;
        const isLocked = craftSkill.level < recipe.levelReq;
        const meetsReq = !recipe.requirement || meetsNarrativeRequirement(player, recipe.requirement);
        const isFullyLocked = isLocked || !meetsReq;
        const canAfford = !isFullyLocked && canAffordRecipe(inventory, recipe);

        return (
            <BouncyButton
                key={recipe.id}
                style={[
                    styles.recipeNode,
                    { left: pos.left, top: pos.top },
                    isSelected && styles.recipeNodeSelected,
                isActive && styles.recipeNodeActive,
                    isFullyLocked && styles.recipeNodeLocked,
                    canAfford && !isSelected && styles.recipeNodeAffordable,
                ]}
                scaleTo={0.9}
                onPress={() => handleRecipeSelect(recipe)}
            >
                <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>
                <View style={styles.recipeLevelBadge}>
                    <Text style={styles.recipeLevelText}>{recipe.levelReq}</Text>
                </View>
                {isActive && (
                    <View style={{ position: 'absolute', bottom: -8 }}>
                        <SmoothProgressBar
                            partialTickMs={activeTask?.partialTickMs ?? 0}
                            intervalMs={recipe.baseTickMs}
                            fillColor={craftColor}
                            height={3}
                        />
                    </View>
                )}
            </BouncyButton>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: craftColor, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Crafting', headerShown: false }} />

            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>‹ Back</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <QuickSwitchToggle />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.heroSection}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>CRAFTING Lv. {craftSkill.level}</Text>
                    </View>
                    <Text style={styles.skillTitle}>⚒️ The Forge</Text>
                    <Text style={styles.skillSubtitle}>Tan leather, craft armour, forge jewelry</Text>
                    <MasteryBadges skillId="crafting" />
                </View>

                {/* Navigation chevrons */}
                <View style={styles.navRow}>
                    <TouchableOpacity
                        onPress={() => router.replace(`/skills/${getPrevSkill('crafting')}` as any)}
                        style={styles.navChevron}
                    >
                        <IconSymbol name="chevron.left" size={32} color={palette.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.replace(`/skills/${getNextSkill('crafting')}` as any)}
                        style={styles.navChevron}
                    >
                        <IconSymbol name="chevron.right" size={32} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Radial Recipe Wheel */}
                <View style={styles.orbitContainer}>
                    {/* XP Ring */}
                    <View style={styles.xpRing}>
                        <ProgressBarWithPulse
                            progress={xpPct}
                            fillColor={craftColor}
                            widthPercent={xpPct}
                            style={{ transform: [{ rotate: '-90deg' }] }}
                        />
                    </View>

                    {/* Center Orb */}
                    <View style={[styles.centerOrb, isCrafting && styles.centerOrbActive]}>
                        <Text style={styles.centerEmoji}>{activeRecipe?.emoji || '⚒️'}</Text>
                        <Text style={styles.centerLevel}>Lv. {craftSkill.level}</Text>
                        <FloatingXpPop
                            amount={lastGain.current}
                            emoji={activeRecipe?.emoji || '⚒️'}
                            triggerKey={popTrigger}
                        />
                    </View>

                    {/* Recipe Nodes by Tier */}
                    {recipesByTier.map((tierRecipes, tier) =>
                        tierRecipes.map((recipe, idx) =>
                            renderRecipeNode(recipe, idx, tier, tierRecipes.length || 1)
                        )
                    )}
                </View>

                {/* Tier Legend */}
                <View style={styles.tierLegend}>
                    {['Novice', 'Apprentice', 'Journeyman', 'Expert'].map((label, i) => (
                        <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <View style={[styles.tierDot, { backgroundColor: getTierColor(i + 1, palette) }]} />
                            <Text style={styles.tierLabel}>{label}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Detail Panel */}
            <View style={styles.detailPanel}>
                {selectedRecipe ? (
                    <>
                        <View style={styles.detailHeader}>
                            <Text style={styles.detailEmoji}>{selectedRecipe.emoji}</Text>
                            <View style={styles.detailTitleBlock}>
                                <Text style={styles.detailName}>{selectedRecipe.name}</Text>
                                <Text style={styles.detailSubtitle}>
                                    Requires Level {selectedRecipe.levelReq} • {selectedRecipe.baseTickMs / 1000}s craft time
                                </Text>
                            </View>
                        </View>

                        <View style={styles.matsRow}>
                            {selectedRecipe.consumedItems.map((c) => {
                                const meta = getItemMeta(c.id);
                                const owned = inventory.find((i) => i.id === c.id)?.quantity ?? 0;
                                const hasEnough = owned >= c.quantity;
                                return (
                                    <View key={c.id} style={[styles.matChip, hasEnough && styles.matChipAffordable]}>
                                        <Text>{meta.emoji}</Text>
                                        <Text style={[styles.matChipText, hasEnough && styles.matChipTextAffordable]}>
                                            {owned}/{c.quantity}
                                        </Text>
                                    </View>
                                );
                            })}
                            <Text style={{ color: palette.textMuted }}>→</Text>
                            {selectedRecipe.items.map((o) => {
                                const meta = getItemMeta(o.id);
                                return (
                                    <View key={o.id} style={styles.matChip}>
                                        <Text>{meta.emoji}</Text>
                                        <Text style={styles.matChipText}>×{o.quantity}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statChip}>
                                <Text style={styles.statLabel}>XP</Text>
                                <Text style={styles.statValue}>{selectedRecipe.xpPerTick}</Text>
                            </View>
                            <View style={styles.statChip}>
                                <Text style={styles.statLabel}>XP/hr</Text>
                                <Text style={[styles.statValue, { color: palette.gold }]}>
                                    {formatXpHr(selectedRecipe.xpPerTick, selectedRecipe.baseTickMs, selectedRecipe.successRate)}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.craftButton,
                                activeRecipeId !== selectedRecipe.id &&
                                    (craftSkill.level < selectedRecipe.levelReq || !canAffordRecipe(inventory, selectedRecipe)) &&
                                    styles.craftButtonDisabled,
                                activeRecipeId === selectedRecipe.id && styles.craftButtonActive,
                            ]}
                            onPress={handleCraftPress}
                            disabled={
                                craftSkill.level < selectedRecipe.levelReq ||
                                (!!selectedRecipe.requirement && !meetsNarrativeRequirement(player, selectedRecipe.requirement))
                            }
                        >
                            <IconSymbol
                                name={activeRecipeId === selectedRecipe.id ? 'stop.fill' : 'hammer.fill'}
                                size={18}
                                color={palette.white}
                            />
                            <Text style={styles.craftButtonText}>
                                {activeRecipeId === selectedRecipe.id
                                    ? 'Stop Crafting'
                                    : craftSkill.level < selectedRecipe.levelReq
                                        ? `Unlock at Lv. ${selectedRecipe.levelReq}`
                                        : selectedRecipe.requirement && !meetsNarrativeRequirement(player, selectedRecipe.requirement)
                                            ? 'Locked'
                                            : 'Start Crafting'}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.detailPanelEmpty}>
                        <Text style={{ color: palette.textSecondary, fontSize: FontSize.md }}>
                            Tap a recipe on the wheel to begin
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}
