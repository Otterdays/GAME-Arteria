/**
 * Sorcery skill — Raw mana channeling. Consume runes to cast spells for XP.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md §11, sorcery wizardry plan]
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { getGlassCardGradientColors } from '@/constants/skillPageStyles';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useRequestStartTask } from '@/hooks/useRequestStartTask';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { SORCERY_SPELLS, SorcerySpell } from '@/constants/sorcery';
import { ITEM_META } from '@/constants/items';
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

const colorSorcery = '#6a0dad';

function getItemCount(inventory: { id: string; quantity: number }[], itemId: string): number {
    return inventory.find((i) => i.id === itemId)?.quantity ?? 0;
}

function canAffordSpell(inventory: { id: string; quantity: number }[], spell: SorcerySpell): boolean {
    return spell.consumedItems.every((c) => getItemCount(inventory, c.id) >= c.quantity);
}

export default function SorceryScreen() {
    useIdleSoundscape('sorcery');
    const { palette } = useTheme();
    const { showFeedbackToast } = useFeedbackToast();
    const dispatch = useAppDispatch();
    const requestStartTask = useRequestStartTask();
    const insets = useSafeAreaInsets();
    const sorcerySkill = useAppSelector((s) => s.game.player.skills.sorcery) || { xp: 0, level: 1, mastery: {} };
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const activeTask = useAppSelector((s) => s.game.player.activeTask);

    const isSorcery = activeTask?.skillId === 'sorcery';
    const activeNodeId = isSorcery ? activeTask.actionId : null;
    const activeNode = SORCERY_SPELLS.find((n) => n.id === activeNodeId);

    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(sorcerySkill.xp);
    const lastGain = React.useRef(0);
    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (sorcerySkill.xp > lastXp.current) {
            const gain = sorcerySkill.xp - lastXp.current;
            lastXp.current = sorcerySkill.xp;
            lastGain.current = gain;
            setPopTrigger((t) => t + 1);
            shakeAnim.setValue(0);
            Animated.timing(shakeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => shakeAnim.setValue(0));
        } else {
            lastXp.current = sorcerySkill.xp;
        }
    }, [sorcerySkill.xp, shakeAnim]);

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
                },
                headerRow: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.md,
                    paddingTop: Spacing.sm,
                    paddingBottom: Spacing.xs,
                    backgroundColor: palette.bgApp,
                },
                backButton: { paddingHorizontal: Spacing.sm, paddingVertical: 6 },
                backButtonText: { color: palette.accentPrimary, fontSize: FontSize.md, fontWeight: '600' },
                titleRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: Spacing.sm,
                    marginBottom: 4,
                },
                navButton: { padding: Spacing.xs, opacity: 0.5 },
                titleContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
                levelTag: {
                    backgroundColor: `${colorSorcery}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: `${colorSorcery}50`,
                },
                levelTagText: {
                    color: colorSorcery,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                sorceryTitle: { fontFamily: FontCinzelBold, fontSize: FontSize.xl, color: palette.textPrimary },
                sorcerySub: { fontSize: FontSize.sm, color: palette.textSecondary },
                listContent: { padding: Spacing.md, gap: Spacing.md },
                nodeCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                nodeCardLocked: { backgroundColor: palette.bgApp, borderColor: 'transparent' },
                nodeCardActive: {},
                nodeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
                nodeEmoji: {
                    fontSize: 32,
                    marginRight: Spacing.md,
                    textShadowColor: colorSorcery,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                },
                nodeTitleContainer: { flex: 1 },
                nodeName: { fontFamily: FontCinzelBold, fontSize: FontSize.lg, color: palette.textPrimary, marginBottom: 2 },
                textLocked: { color: palette.textDisabled },
                nodeReq: { fontSize: FontSize.xs, color: palette.textSecondary },
                runeCostRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.md },
                runePill: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: palette.bgApp,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                runePillShort: { fontSize: FontSize.xs, color: palette.textSecondary },
                nodeStats: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
                statPill: {
                    flex: 1,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    padding: Spacing.sm,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                statLabel: { fontSize: 10, color: palette.textSecondary, textTransform: 'uppercase', marginBottom: 2 },
                statValue: { fontSize: FontSize.sm, color: palette.white, fontWeight: '600' },
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
                trainButtonText: { color: palette.white, fontWeight: 'bold', fontSize: FontSize.base },
                xpRow: { width: '100%', marginTop: Spacing.md, gap: 4 },
                xpBarBg: {
                    height: 6,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.full,
                    overflow: 'hidden',
                    width: '100%',
                },
                xpText: { fontSize: FontSize.xs, color: palette.textSecondary, textAlign: 'center' },
            }),
        [palette]
    );

    const clvXP = xpForLevel(sorcerySkill.level);
    const nlvXP = xpForLevel(sorcerySkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(sorcerySkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = sorcerySkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleSpellPress = (spell: SorcerySpell) => {
        if (sorcerySkill.level < spell.levelReq) {
            showFeedbackToast({
                type: 'locked',
                title: 'Locked',
                message: `Requires Sorcery Level ${spell.levelReq}`,
            });
            return;
        }
        if (!canAffordSpell(inventory, spell)) {
            showFeedbackToast({
                type: 'error',
                title: 'Missing Runes',
                message: 'Craft runes at Runecrafting altars first.',
            });
            return;
        }
        if (activeNodeId === spell.id) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            requestStartTask({
                type: 'skilling',
                skillId: 'sorcery',
                actionId: spell.id,
                intervalMs: spell.baseTickMs,
                partialTickMs: 0,
            });
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }, { transform: [{ translateX: shakeX }] }]}>
            <Stack.Screen options={{ title: 'Sorcery', headerShown: false }} />
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
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
                            router.replace(`/skills/${getPrevSkill('sorcery')}` as any);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.titleContent}>
                        <Text style={styles.sorceryTitle}>Sorcery</Text>
                        <View style={styles.levelTag}>
                            <Text style={styles.levelTagText}>Lv. {sorcerySkill.level}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getNextSkill('sorcery')}` as any);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.sorcerySub}>Channel runes into offensive spells. Craft runes at Runecrafting first.</Text>
                <MasteryBadges skillId="sorcery" />
                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={colorSorcery} widthPercent={pct} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.xpText}>
                            {sorcerySkill.level >= 99 ? '' : <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />}
                            {sorcerySkill.level >= 99 ? `${formatNumber(sorcerySkill.xp)} XP — MAX` : ` / ${formatNumber(xpNeeded)} XP`}
                        </Text>
                    </View>
                    <FloatingXpPop amount={lastGain.current} emoji={activeNode?.emoji || '✨'} triggerKey={popTrigger} />
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.listContent}>
                {SORCERY_SPELLS.map((spell) => {
                    const isLocked = sorcerySkill.level < spell.levelReq;
                    const isActive = activeNodeId === spell.id;
                    const canAfford = canAffordSpell(inventory, spell);
                    const isDisabled = isLocked || !canAfford;
                    return (
                        <BouncyButton
                            key={spell.id}
                            style={[styles.nodeCard, isLocked && styles.nodeCardLocked, isActive && styles.nodeCardActive]}
                            scaleTo={0.98}
                            onPress={() => handleSpellPress(spell)}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: isDisabled, selected: isActive }}
                            accessibilityLabel={`${spell.name}. ${isLocked ? `Unlocks at level ${spell.levelReq}` : `Cast for ${spell.xpPerTick} XP`}`}
                        >
                            {!isLocked && (
                                <LinearGradient
                                    colors={getGlassCardGradientColors(palette)}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            {isActive && <ActivePulseGlow color={colorSorcery} />}
                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.5 }]}>{spell.emoji}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLocked && styles.textLocked]}>{spell.name}</Text>
                                    <Text style={styles.nodeReq}>
                                        {isLocked ? `Unlocks at Lv. ${spell.levelReq}` : `Lv. ${spell.levelReq} required`}
                                    </Text>
                                </View>
                            </View>
                            {!isLocked && (
                                <View style={styles.runeCostRow}>
                                    {spell.consumedItems.map((c) => {
                                        const meta = ITEM_META[c.id];
                                        const owned = getItemCount(inventory, c.id);
                                        const ok = owned >= c.quantity;
                                        return (
                                            <View key={c.id} style={[styles.runePill, !ok && { borderColor: palette.redDim }]}>
                                                <Text>{meta?.emoji ?? '?'}</Text>
                                                <Text style={[styles.runePillShort, !ok && { color: palette.redDim }]}>
                                                    {owned}/{c.quantity}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                            <View style={[styles.nodeStats, isLocked && { opacity: 0.5 }]}>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/Tick</Text>
                                    <Text style={styles.statValue}>{formatNumber(spell.xpPerTick)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/hr</Text>
                                    <Text style={[styles.statValue, { color: palette.gold }]}>{formatXpHr(spell.xpPerTick, spell.baseTickMs, spell.successRate)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>To Level</Text>
                                    <Text style={[styles.statValue, { color: palette.green }]}>
                                        {sorcerySkill.level >= 99 ? 'MAX' : `~${Math.ceil((nlvXP - sorcerySkill.xp) / spell.xpPerTick)}`}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Interval</Text>
                                    <Text style={styles.statValue}>{(spell.baseTickMs / 1000).toFixed(1)}s</Text>
                                </View>
                            </View>
                            {!isLocked && (
                                <View style={[styles.trainButton, isActive && styles.trainButtonActive, !canAfford && styles.trainButtonLocked]}>
                                    <Text style={styles.trainButtonText}>
                                        {isActive ? 'Stop Casting' : !canAfford ? 'Need Runes' : 'Cast Spell'}
                                    </Text>
                                </View>
                            )}
                            {isActive && activeTask && (
                                <SmoothProgressBar partialTickMs={activeTask.partialTickMs} intervalMs={activeTask.intervalMs} fillColor={colorSorcery} />
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
