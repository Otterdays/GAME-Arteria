/**
 * Woodworking Screen — Logs → Furniture, Shields, Staves.
 * Flagship workbench-style UI with SkillHeroHeader, SkillCategoryRail, RecipeWorkbenchCard, StickyTaskDock.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE §10; Woodworking Flagship Plan]
 */

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize } from '@/constants/theme';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import {
    WOODWORKING_RECIPES,
    WOODWORKING_CATEGORIES,
    type WoodworkingRecipe,
    type WoodworkingCategory,
} from '@/constants/woodworking';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { useIdleSoundscape } from '@/hooks/useIdleSoundscape';
import { QuickSwitchToggle } from '@/components/QuickSwitchToggle';
import {
    SkillHeroHeader,
    SkillCategoryRail,
    RecipeWorkbenchCard,
    StickyTaskDock,
} from '@/components/skill';

const WOODWORKING_CATEGORY_LABELS: Record<WoodworkingCategory, string> = {
    furniture: 'Furniture',
    combat: 'Combat',
    utility: 'Utility',
};

function canAffordRecipe(inventory: { id: string; quantity: number }[], recipe: WoodworkingRecipe): boolean {
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        if (owned < consumed.quantity) return false;
    }
    return true;
}

export default function WoodworkingScreen() {
    useIdleSoundscape('woodworking');
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const { showFeedbackToast } = useFeedbackToast();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const wwSkill = player.skills.woodworking;
    const inventory = player.inventory;
    const activeTask = player.activeTask;

    const [selectedCategory, setSelectedCategory] = useState<WoodworkingCategory>('furniture');

    const isWoodworking = activeTask?.skillId === 'woodworking';
    const activeRecipeId = isWoodworking ? activeTask.actionId : null;
    const activeRecipe = WOODWORKING_RECIPES.find((r) => r.id === activeRecipeId);

    const [popTrigger, setPopTrigger] = useState(0);
    const lastXp = React.useRef(wwSkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (wwSkill.xp > lastXp.current) {
            const gain = wwSkill.xp - lastXp.current;
            lastXp.current = wwSkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            glowAnim.setValue(0);
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
                glowAnim.setValue(0)
            );
        } else {
            lastXp.current = wwSkill.xp;
        }
    }, [wwSkill.xp, glowAnim]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.12, 0] });
    const wwColor = palette.skillWoodworking;

    const filteredRecipes = useMemo(
        () => WOODWORKING_RECIPES.filter((r) => r.category === selectedCategory),
        [selectedCategory]
    );

    const anyAffordable = useMemo(
        () => filteredRecipes.some((r) => wwSkill.level >= r.levelReq && canAffordRecipe(inventory, r)),
        [filteredRecipes, wwSkill.level, inventory]
    );

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
                listContent: {
                    padding: Spacing.md,
                    paddingBottom: Spacing.xl * 3,
                },
            }),
        [palette]
    );

    const handleRecipePress = (recipe: WoodworkingRecipe) => {
        if (wwSkill.level < recipe.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Woodworking Level ${recipe.levelReq}`,
            });
            return;
        }
        if (!canAffordRecipe(inventory, recipe)) {
            showFeedbackToast({
                type: 'warning',
                title: 'Need Materials',
                message: `Gather logs from Logging first.`,
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
                skillId: 'woodworking',
                actionId: recipe.id,
                intervalMs: recipe.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    const handleDockStop = () => {
        if (isWoodworking) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: wwColor, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Woodworking', headerShown: false }} />

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

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, marginBottom: Spacing.xs }}>
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.replace(`/skills/${getPrevSkill('woodworking')}`);
                    }}
                    style={{ padding: Spacing.xs, opacity: 0.5 }}
                >
                    <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.replace(`/skills/${getNextSkill('woodworking')}`);
                    }}
                    style={{ padding: Spacing.xs, opacity: 0.5 }}
                >
                    <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                </TouchableOpacity>
            </View>

            <SkillHeroHeader
                skillId="woodworking"
                title="Woodworking"
                subtitle="Turn logs into furniture, shields, and staves. The Wood Chain feeds Construction and Combat."
                level={wwSkill.level}
                xp={wwSkill.xp}
                skillColor={wwColor}
                activeRecipeName={activeRecipe?.name}
                activeXpPerTick={activeRecipe?.xpPerTick}
                activeTickMs={activeRecipe?.baseTickMs}
                activeSuccessRate={activeRecipe?.successRate}
                xpGain={lastGain.current}
                xpPopTrigger={popTrigger}
                xpPopEmoji={activeRecipe?.emoji ?? '🪵'}
            />

            <SkillCategoryRail
                categories={WOODWORKING_CATEGORIES}
                labels={WOODWORKING_CATEGORY_LABELS}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                accentColor={wwColor}
            />

            <ScrollView contentContainerStyle={styles.listContent}>
                {filteredRecipes.map((recipe) => (
                    <RecipeWorkbenchCard
                        key={recipe.id}
                        id={recipe.id}
                        name={recipe.name}
                        emoji={recipe.emoji}
                        levelReq={recipe.levelReq}
                        xpPerTick={recipe.xpPerTick}
                        baseTickMs={recipe.baseTickMs}
                        successRate={recipe.successRate}
                        consumedItems={recipe.consumedItems}
                        items={recipe.items}
                        skillColor={wwColor}
                        playerLevel={wwSkill.level}
                        inventory={inventory}
                        isActive={activeRecipeId === recipe.id}
                        activeTask={activeTask}
                        onPress={() => handleRecipePress(recipe)}
                    />
                ))}
            </ScrollView>

            <StickyTaskDock
                isActive={isWoodworking}
                canCraft={false}
                summaryText={
                    isWoodworking && activeRecipe
                        ? `Crafting ${activeRecipe.name}`
                        : anyAffordable
                            ? 'Tap a recipe above to craft'
                            : undefined
                }
                onPrimaryAction={handleDockStop}
                primaryLabel="Craft"
                activeLabel="Stop"
                accentColor={wwColor}
            />
        </Animated.View>
    );
}
