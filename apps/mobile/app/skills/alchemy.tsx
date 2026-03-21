/**
 * Alchemy Screen — Potions, Bombs, Transmutations.
 * Pioneering Crafty UI with "Catching Volatility" mechanic.
 * [TRACE: ROADMAP 3.2 — Alchemy; MASTER_DESIGN_DOC §2.4]
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, FontCinzelBold } from '@/constants/theme';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import {
    ALCHEMY_RECIPES,
    ALCHEMY_CATEGORIES,
    type AlchemyRecipe,
    type AlchemyCategory,
} from '@/constants/alchemy';
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
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ALCHEMY_CATEGORY_LABELS: Record<AlchemyCategory, string> = {
    potions: 'Potions',
    bombs: 'Bombs',
    transmutation: 'Transmute',
};

function canAffordRecipe(inventory: { id: string; quantity: number }[], recipe: AlchemyRecipe): boolean {
    for (const consumed of recipe.consumedItems) {
        const owned = inventory.find((i) => i.id === consumed.id)?.quantity ?? 0;
        if (owned < consumed.quantity) return false;
    }
    return true;
}

/**
 * Volatility Reaction — A pioneering "Catching Volatility" minigame element.
 * Floating bubbles that provide bonuses when tapped during alchemy.
 */
function VolatilityBubble({ onCatch, color }: { onCatch: () => void; color: string }) {
    const anim = React.useRef(new Animated.Value(0)).current;
    const [pos] = useState({
        x: Math.random() * (SCREEN_WIDTH - 100) + 50,
        y: Math.random() * 200 + 100,
    });

    useEffect(() => {
        Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, [anim]);

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100],
    });

    const scale = anim.interpolate({
        inputRange: [0, 0.2, 0.8, 1],
        outputRange: [0, 1.2, 1, 0],
    });

    const opacity = anim.interpolate({
        inputRange: [0, 0.1, 0.9, 1],
        outputRange: [0, 1, 1, 0],
    });

    return (
        <Animated.View
            style={[
                styles.bubble,
                {
                    transform: [{ translateX: pos.x }, { translateY: pos.y }, { translateY }, { scale }],
                    opacity,
                    backgroundColor: color + '44',
                    borderColor: color,
                },
            ]}
        >
            <TouchableOpacity
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onCatch();
                }}
                style={StyleSheet.absoluteFill}
            >
                <View style={styles.bubbleInner}>
                    <Text style={styles.bubbleEmoji}>✨</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function AlchemyScreen() {
    useIdleSoundscape('alchemy');
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const { showFeedbackToast } = useFeedbackToast();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const alchemySkill = player.skills.alchemy;
    const inventory = player.inventory;
    const activeTask = player.activeTask;

    const [selectedCategory, setSelectedCategory] = useState<AlchemyCategory>('potions');
    const [volatilities, setVolatilities] = useState<{ id: number }[]>([]);
    const [volatilityBonus, setVolatilityBonus] = useState(0);

    const isAlchemy = activeTask?.skillId === 'alchemy';
    const activeRecipeId = isAlchemy ? activeTask.actionId : null;
    const activeRecipe = ALCHEMY_RECIPES.find((r) => r.id === activeRecipeId);

    const [popTrigger, setPopTrigger] = useState(0);
    const lastXp = React.useRef(alchemySkill.xp);
    const lastGain = React.useRef(0);
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    // React to XP gain
    useEffect(() => {
        if (alchemySkill.xp > lastXp.current) {
            const gain = alchemySkill.xp - lastXp.current;
            lastXp.current = alchemySkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            glowAnim.setValue(0);
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() =>
                glowAnim.setValue(0)
            );

            // Roll for volatility spawn during active task
            if (isAlchemy && Math.random() > 0.7) {
                setVolatilities((v) => [...v, { id: Date.now() }]);
            }
        } else {
            lastXp.current = alchemySkill.xp;
        }
    }, [alchemySkill.xp, glowAnim, isAlchemy]);

    const handleCatchVolatility = useCallback(() => {
        setVolatilityBonus((b) => b + 1);
        showFeedbackToast({
            type: 'success',
            title: 'Unstable Reaction Caught!',
            message: '+1% Absolute Potency',
        });
    }, [showFeedbackToast]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.12, 0] });
    const alchemyColor = palette.skillAlchemy || '#A78BFA'; // Violet/Purple for Alchemy

    const filteredRecipes = useMemo(
        () => ALCHEMY_RECIPES.filter((r) => r.category === selectedCategory),
        [selectedCategory]
    );

    const anyAffordable = useMemo(
        () => filteredRecipes.some((r) => alchemySkill.level >= r.levelReq && canAffordRecipe(inventory, r)),
        [filteredRecipes, alchemySkill.level, inventory]
    );

    const handleRecipePress = (recipe: AlchemyRecipe) => {
        if (alchemySkill.level < recipe.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Alchemy Level ${recipe.levelReq}`,
            });
            return;
        }
        if (!canAffordRecipe(inventory, recipe)) {
            showFeedbackToast({
                type: 'warning',
                title: 'Need Materials',
                message: `Gather herbs and reagents first.`,
            });
            return;
        }

        if (activeRecipeId === recipe.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
            setVolatilityBonus(0);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'alchemy',
                actionId: recipe.id,
                intervalMs: recipe.baseTickMs,
                partialTickMs: 0,
            });
            setVolatilityBonus(0);
        }
    };

    const handleDockStop = () => {
        if (isAlchemy) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
            setVolatilityBonus(0);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: palette.bgApp }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: alchemyColor, opacity: glowOpacity, zIndex: 10 }]}
                pointerEvents="none"
            />
            <Stack.Screen options={{ title: 'Alchemy', headerShown: false }} />

            {/* Volatility Layer */}
            {volatilities.map((v) => (
                <VolatilityBubble
                    key={v.id}
                    color={alchemyColor}
                    onCatch={() => {
                        handleCatchVolatility();
                        setVolatilities((curr) => curr.filter((item) => item.id !== v.id));
                    }}
                />
            ))}

            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <Text style={[styles.backButtonText, { color: palette.accentPrimary }]}>‹ Back</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <QuickSwitchToggle />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, marginBottom: Spacing.xs }}>
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.replace(`/skills/${getPrevSkill('alchemy')}`);
                    }}
                    style={{ padding: Spacing.xs, opacity: 0.5 }}
                >
                    <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.replace(`/skills/${getNextSkill('alchemy')}`);
                    }}
                    style={{ padding: Spacing.xs, opacity: 0.5 }}
                >
                    <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                </TouchableOpacity>
            </View>

            <SkillHeroHeader
                skillId="alchemy"
                title="Alchemy"
                subtitle="Master unstable transmutations and powerful concoctions. Catch reactions for bonus potency."
                level={alchemySkill.level}
                xp={alchemySkill.xp}
                skillColor={alchemyColor}
                activeRecipeName={activeRecipe?.name}
                activeXpPerTick={activeRecipe?.xpPerTick}
                activeTickMs={activeRecipe?.baseTickMs}
                activeSuccessRate={activeRecipe?.successRate}
                xpGain={lastGain.current}
                xpPopTrigger={popTrigger}
                xpPopEmoji={activeRecipe?.emoji ?? '⚗️'}
            />

            {volatilityBonus > 0 && (
                <View style={styles.bonusBanner}>
                    <Text style={styles.bonusText}>
                        ✨ Volatility Bonus: +{volatilityBonus}% Potency
                    </Text>
                </View>
            )}

            <SkillCategoryRail
                categories={ALCHEMY_CATEGORIES}
                labels={ALCHEMY_CATEGORY_LABELS}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                accentColor={alchemyColor}
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
                        skillColor={alchemyColor}
                        playerLevel={alchemySkill.level}
                        inventory={inventory}
                        isActive={activeRecipeId === recipe.id}
                        activeTask={activeTask}
                        onPress={() => handleRecipePress(recipe)}
                    />
                ))}
            </ScrollView>

            <StickyTaskDock
                isActive={isAlchemy}
                canCraft={false}
                summaryText={
                    isAlchemy && activeRecipe
                        ? `Brewing ${activeRecipe.name}`
                        : anyAffordable
                            ? 'Tap a recipe to start brewing'
                            : undefined
                }
                onPrimaryAction={handleDockStop}
                primaryLabel="Brew"
                activeLabel="Stop"
                accentColor={alchemyColor}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
    },
    backButton: { paddingHorizontal: Spacing.sm, paddingVertical: 6 },
    backButtonText: { fontSize: FontSize.md, fontWeight: '600' },
    listContent: {
        padding: Spacing.md,
        paddingBottom: Spacing.xl * 4,
    },
    bonusBanner: {
        backgroundColor: '#1E1B4B', // Dark indigo
        paddingVertical: 4,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#A78BFA44',
    },
    bonusText: {
        color: '#A78BFA',
        fontSize: FontSize.xs,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    bubble: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    bubbleInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubbleEmoji: {
        fontSize: 24,
    },
});
