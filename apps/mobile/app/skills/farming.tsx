/**
 * Farming — Plant seeds, wait for growth, harvest crops.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md §1]
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { getLevelBadgeStyles, getNodeCardBaseStyles, getGlassCardGradientColors } from '@/constants/skillPageStyles';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { FARMING_PATCHES, FARMING_CROPS, getCropById } from '@/constants/farming';
import { getItemMeta } from '@/constants/items';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { formatNumber } from '@/utils/formatNumber';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { BouncyButton } from '@/components/BouncyButton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { MasteryBadges } from '@/components/MasteryBadges';
import { useIdleSoundscape } from '@/hooks/useIdleSoundscape';
import { QuickSwitchToggle } from '@/components/QuickSwitchToggle';

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

function formatTimeRemaining(ms: number): string {
    if (ms <= 0) return 'Ready!';
    const s = Math.ceil(ms / 1000);
    if (s >= 60) return `${Math.floor(s / 60)}m ${s % 60}s`;
    return `${s}s`;
}

export default function FarmingScreen() {
    useIdleSoundscape('farming');
    const { palette } = useTheme();
    const { showFeedbackToast } = useFeedbackToast();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const farmingSkill = useAppSelector((s) => s.game.player.skills.farming);
    const farmingPatches = useAppSelector((s) => s.game.player.farmingPatches ?? {});
    const inventory = useAppSelector((s) => s.game.player.inventory);

    const [plantModalPatch, setPlantModalPatch] = useState<string | null>(null);

    const farmingLevel = farmingSkill?.level ?? 1;
    const seedCount = useCallback(
        (seedId: string) => inventory.find((i) => i.id === seedId)?.quantity ?? 0,
        [inventory]
    );

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
                    backgroundColor: `${palette.skillFarming}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: `${palette.skillFarming}50`,
                },
                levelTagText: {
                    color: palette.skillFarming,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                miningTitle: { fontFamily: FontCinzelBold, fontSize: FontSize.xl, color: palette.textPrimary },
                miningSub: { fontSize: FontSize.sm, color: palette.textSecondary },
                listContent: { padding: Spacing.md, gap: Spacing.md },
                nodeCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                nodeCardLocked: { backgroundColor: palette.bgApp, borderColor: 'transparent' },
                nodeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
                nodeEmoji: {
                    fontSize: 32,
                    marginRight: Spacing.md,
                    textShadowColor: palette.skillFarming,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                },
                nodeTitleContainer: { flex: 1 },
                nodeName: { fontFamily: FontCinzelBold, fontSize: FontSize.lg, color: palette.textPrimary, marginBottom: 2 },
                textLocked: { color: palette.textDisabled },
                nodeReq: { fontSize: FontSize.xs, color: palette.textSecondary },
                trainButton: {
                    backgroundColor: palette.accentPrimary,
                    paddingVertical: Spacing.sm,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                },
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
                progressBar: {
                    height: 6,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.full,
                    overflow: 'hidden',
                    marginBottom: Spacing.sm,
                },
                modalOverlay: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: Spacing.lg,
                },
                modalContent: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.lg,
                    width: '100%',
                    maxWidth: 340,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                modalTitle: { fontFamily: FontCinzelBold, fontSize: FontSize.lg, color: palette.textPrimary, marginBottom: Spacing.md },
                cropRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.md,
                    borderRadius: Radius.md,
                    marginBottom: Spacing.xs,
                    backgroundColor: palette.bgApp,
                },
                cropRowDisabled: { opacity: 0.5 },
                cropEmoji: { fontSize: 24, marginRight: Spacing.sm },
                cropName: { flex: 1, fontSize: FontSize.base, color: palette.textPrimary },
                cropReq: { fontSize: FontSize.xs, color: palette.textSecondary },
                cropSeed: { fontSize: FontSize.xs, color: palette.gold },
                modalCancel: { marginTop: Spacing.md, paddingVertical: Spacing.sm, alignItems: 'center' },
                modalCancelText: { color: palette.textSecondary, fontSize: FontSize.sm },
            }),
        [palette]
    );

    const clvXP = xpForLevel(farmingLevel);
    const nlvXP = xpForLevel(farmingLevel + 1);
    const xpIntoLevel = Math.max(0, Math.floor((farmingSkill?.xp ?? 0) - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = farmingLevel >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handlePlant = (patchId: string, cropId: string) => {
        const patch = FARMING_PATCHES.find((p) => p.id === patchId);
        const crop = getCropById(cropId);
        if (!patch || !crop) return;
        if (farmingLevel < patch.levelReq) {
            showFeedbackToast({ type: 'locked', title: 'Locked', message: `Requires Farming Level ${patch.levelReq}` });
            return;
        }
        if (farmingLevel < crop.levelReq) {
            showFeedbackToast({ type: 'locked', title: 'Locked', message: `Requires Farming Level ${crop.levelReq}` });
            return;
        }
        if (seedCount(crop.seedId) < 1) {
            showFeedbackToast({ type: 'warning', title: 'No Seeds', message: `You need ${crop.seedId}. Buy from Nick's shop.` });
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        dispatch(gameActions.plantSeed({ patchId, cropId }));
        setPlantModalPatch(null);
    };

    const handleHarvest = (patchId: string) => {
        const planted = farmingPatches[patchId];
        if (!planted) return;
        const crop = getCropById(planted.cropId);
        if (!crop) return;
        const elapsed = Date.now() - planted.plantedAt;
        if (elapsed < crop.growthMs) {
            showFeedbackToast({ type: 'locked', title: 'Not Ready', message: `Ready in ${formatTimeRemaining(crop.growthMs - elapsed)}` });
            return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch(gameActions.harvestPatch({ patchId }));
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ title: 'Farming', headerShown: false }} />
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
                            router.replace(`/skills/${getPrevSkill('farming')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.titleContent}>
                        <Text style={styles.miningTitle}>Farming</Text>
                        <View style={styles.levelTag}>
                            <Text style={styles.levelTagText}>Lv. {farmingLevel}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.replace(`/skills/${getNextSkill('farming')}`);
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.miningSub}>Plant seeds, wait for growth, harvest crops.</Text>
                <MasteryBadges skillId="farming" />
                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse progress={pct} fillColor={palette.skillFarming} widthPercent={pct} />
                    </View>
                    <Text style={styles.xpText}>
                        {farmingLevel >= 99 ? `${formatNumber(farmingSkill?.xp ?? 0)} XP — MAX` : `${formatNumber(xpIntoLevel)} / ${formatNumber(xpNeeded)} XP`}
                    </Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.listContent}>
                {FARMING_PATCHES.map((patch) => {
                    const isLocked = farmingLevel < patch.levelReq;
                    const planted = farmingPatches[patch.id];
                    const crop = planted ? getCropById(planted.cropId) : null;
                    const elapsed = crop ? Date.now() - planted.plantedAt : 0;
                    const isReady = crop && elapsed >= crop.growthMs;
                    const progressPct = crop ? Math.min(100, (elapsed / crop.growthMs) * 100) : 0;

                    return (
                        <View
                            key={patch.id}
                            style={[
                                styles.nodeCard,
                                isLocked && styles.nodeCardLocked,
                            ]}
                        >
                            {!isLocked && (
                                <LinearGradient
                                    colors={getGlassCardGradientColors(palette)}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.5 }]}>{crop?.emoji ?? '🪱'}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLocked && styles.textLocked]}>{patch.name}</Text>
                                    <Text style={styles.nodeReq}>
                                        {isLocked ? `Unlocks at Lv. ${patch.levelReq}` : crop ? `${crop.emoji} ${crop.id}` : 'Empty patch'}
                                    </Text>
                                </View>
                            </View>
                            {!isLocked && (
                                <>
                                    {!planted ? (
                                        <BouncyButton
                                            style={styles.trainButton}
                                            scaleTo={0.98}
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                                setPlantModalPatch(patch.id);
                                            }}
                                        >
                                            <Text style={styles.trainButtonText}>Plant</Text>
                                        </BouncyButton>
                                    ) : (
                                        <>
                                            <View style={styles.progressBar}>
                                                <ProgressBarWithPulse
                                                    progress={progressPct}
                                                    fillColor={isReady ? palette.green : palette.skillFarming}
                                                    widthPercent={progressPct}
                                                />
                                            </View>
                                            <Text style={[styles.nodeReq, { marginBottom: Spacing.sm }]}>
                                                {isReady ? 'Ready to harvest!' : `Ready in ${formatTimeRemaining(crop.growthMs - elapsed)}`}
                                            </Text>
                                            <BouncyButton
                                                style={[styles.trainButton, !isReady && styles.trainButtonLocked]}
                                                scaleTo={0.98}
                                                onPress={() => isReady && handleHarvest(patch.id)}
                                            >
                                                <Text style={[styles.trainButtonText, !isReady && { color: palette.textSecondary }]}>Harvest</Text>
                                            </BouncyButton>
                                        </>
                                    )}
                                </>
                            )}
                            {isLocked && (
                                <View style={[styles.trainButton, styles.trainButtonLocked]}>
                                    <IconSymbol name="lock.fill" size={16} color={palette.textDisabled} />
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            <Modal visible={!!plantModalPatch} transparent animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setPlantModalPatch(null)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Choose crop</Text>
                        {plantModalPatch &&
                            FARMING_CROPS.map((crop) => {
                                const canPlant = farmingLevel >= crop.levelReq && seedCount(crop.seedId) >= 1;
                                return (
                                    <BouncyButton
                                        key={crop.id}
                                        style={[styles.cropRow, !canPlant && styles.cropRowDisabled]}
                                        scaleTo={0.98}
                                        onPress={() => canPlant && handlePlant(plantModalPatch, crop.id)}
                                    >
                                        <Text style={styles.cropEmoji}>{crop.emoji}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cropName}>{getItemMeta(crop.outputId).label}</Text>
                                            <Text style={styles.cropReq}>Lv. {crop.levelReq} • {crop.xpPerHarvest} XP • {(crop.growthMs / 60000).toFixed(1)} min</Text>
                                            <Text style={styles.cropSeed}>Seeds: {seedCount(crop.seedId)}</Text>
                                        </View>
                                    </BouncyButton>
                                );
                            })}
                        <TouchableOpacity style={styles.modalCancel} onPress={() => setPlantModalPatch(null)}>
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
