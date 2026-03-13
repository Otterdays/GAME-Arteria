/**
 * MasteryModal — Modal for spending mastery points (XP, yield, speed per skill).
 * Opened from Skills header. Includes short copy on how to earn points.
 */

import React, { useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions, type SkillId } from '@/store/gameSlice';
import { MASTERY_UPGRADES } from '@/constants/mastery';
import { SKILL_META } from '@/constants/skills';
import type { PaletteShape } from '@/constants/theme';

const MASTERY_GATHERING: SkillId[] = ['mining', 'logging', 'fishing', 'harvesting', 'scavenging'];
const MASTERY_CRAFTING: SkillId[] = ['runecrafting', 'smithing', 'forging', 'cooking', 'herblore', 'woodworking'];

function chunkPairs<T>(arr: T[]): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
    return out;
}

export function MasteryModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { palette } = useTheme();
    const masteryPoints = useAppSelector((s) => s.game.player.masteryPoints ?? {});
    const masterySpent = useAppSelector((s) => s.game.player.masterySpent ?? {});

    const styles = useMemo(() => createMasteryStyles(palette), [palette]);

    const renderSkillCard = (skillId: SkillId) => {
        const upgrades = MASTERY_UPGRADES[skillId];
        if (!upgrades) return null;
        const points = masteryPoints[skillId] ?? 0;
        const spent = masterySpent[skillId] ?? {};
        const meta = SKILL_META[skillId];
        return (
            <View key={skillId} style={styles.masterySkillCardHalf}>
                <View style={styles.masterySkillHeader}>
                    <Text style={styles.masterySkillEmoji}>{meta?.emoji}</Text>
                    <Text style={styles.masterySkillName} numberOfLines={1}>{meta?.label}</Text>
                    <View style={[styles.masteryPointsBadge, points > 0 && styles.masteryPointsBadgeActive]}>
                        <Text style={[styles.masteryPointsText, points > 0 && styles.masteryPointsBadgeActiveText]}>{points}</Text>
                    </View>
                </View>
                {upgrades.map((u) => {
                    const level = spent[u.id] ?? 0;
                    const canSpend = points >= u.cost && level < u.maxLevel;
                    const isMax = level >= u.maxLevel;
                    return (
                        <View key={u.id} style={styles.masteryUpgradeRow}>
                            <View style={styles.masteryUpgradeInfo}>
                                <Text style={styles.masteryUpgradeLabel} numberOfLines={1}>{u.label}</Text>
                                <Text style={styles.masteryLevelText}>{level}/{u.maxLevel}</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.masterySpendBtn, !canSpend && styles.masterySpendBtnDisabled, isMax && styles.masterySpendBtnMax]}
                                onPress={() => canSpend && (Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), dispatch(gameActions.spendMastery({ skillId, upgradeId: u.id, cost: u.cost, maxLevel: u.maxLevel })))}
                                disabled={!canSpend}
                                activeOpacity={0.8}
                                delayPressIn={50}
                            >
                                <Text style={[styles.masterySpendText, !canSpend && styles.masterySpendTextDisabled, isMax && styles.masterySpendTextMax]}>
                                    {isMax ? 'Max' : canSpend ? u.cost : '—'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        );
    };

    const renderPillar = (title: string, skillIds: SkillId[]) => (
        <View style={styles.masteryPillar} key={title}>
            <Text style={styles.masteryPillarTitle}>{title}</Text>
            {chunkPairs(skillIds).map((pair, rowIndex) => (
                <View key={rowIndex} style={styles.masteryRow}>
                    {pair.map((skillId) => (
                        <View key={skillId} style={styles.masterySkillCardWrapper}>
                            {renderSkillCard(skillId)}
                        </View>
                    ))}
                    {pair.length === 1 && <View style={styles.masterySkillCardWrapper} />}
                </View>
            ))}
        </View>
    );

    if (!visible) return null;

    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.masteryModalBackdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={styles.masteryModalContent}>
                    <View style={styles.masteryModalHeader}>
                        <Text style={styles.masteryModalTitle}>Mastery</Text>
                        <TouchableOpacity
                            onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }}
                            style={styles.masteryModalCloseBtn}
                            hitSlop={12}
                        >
                            <Text style={styles.masteryModalCloseText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.masteryModalInfo}>
                        Earn 1 mastery point each time you level up in any skill. Spend them below for permanent bonuses (XP, yield, speed).
                    </Text>
                    <ScrollView style={styles.masteryModalBody} contentContainerStyle={styles.masteryModalScrollContent} showsVerticalScrollIndicator={false}>
                        {renderPillar('Gathering', MASTERY_GATHERING)}
                        {renderPillar('Crafting', MASTERY_CRAFTING)}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function createMasteryStyles(palette: PaletteShape) {
    return StyleSheet.create({
        masteryModalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: Spacing.lg,
        },
        masteryModalContent: {
            width: '100%',
            maxWidth: 480,
            maxHeight: '85%',
            flexShrink: 1,
            backgroundColor: palette.bgCard,
            borderRadius: Radius.lg,
            borderWidth: 1,
            borderColor: palette.border,
            overflow: 'hidden',
        },
        masteryModalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
        },
        masteryModalTitle: {
            fontSize: FontSize.lg,
            fontWeight: '700',
            color: palette.textPrimary,
            fontFamily: FontCinzelBold,
        },
        masteryModalCloseBtn: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
        masteryModalCloseText: { fontSize: FontSize.sm, fontWeight: '600', color: palette.accentPrimary },
        masteryModalInfo: {
            fontSize: FontSize.sm,
            color: palette.textSecondary,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
        },
        masteryModalBody: { flexShrink: 1 },
        masteryModalScrollContent: { padding: Spacing.sm, paddingBottom: Spacing.lg, gap: Spacing.lg },
        masteryRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
        masterySkillCardWrapper: { flex: 1, minWidth: 0 },
        masterySkillCardHalf: {
            backgroundColor: palette.bgApp,
            borderRadius: Radius.sm,
            padding: Spacing.sm,
            borderWidth: 1,
            borderColor: palette.border,
            alignSelf: 'stretch',
        },
        masterySkillHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.sm,
            paddingBottom: Spacing.xs,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
        },
        masterySkillEmoji: { fontSize: 20, marginRight: Spacing.sm },
        masterySkillName: { flex: 1, fontSize: FontSize.base, fontWeight: '600', color: palette.textPrimary },
        masteryPointsBadge: {
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: Radius.sm,
            backgroundColor: palette.bgInput,
            borderWidth: 1,
            borderColor: palette.border,
        },
        masteryPointsBadgeActive: { borderColor: palette.gold, backgroundColor: palette.gold + '22' },
        masteryPointsText: { fontSize: FontSize.xs, fontWeight: '700', color: palette.textSecondary },
        masteryPointsBadgeActiveText: { color: palette.gold },
        masteryUpgradeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Spacing.xs,
            gap: Spacing.sm,
        },
        masteryUpgradeInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: Spacing.sm },
        masteryUpgradeLabel: { fontSize: FontSize.sm, color: palette.textSecondary, flex: 1 },
        masteryLevelText: { fontSize: FontSize.xs, fontWeight: '700', color: palette.textMuted, minWidth: 28 },
        masteryPillar: { gap: Spacing.sm },
        masteryPillarTitle: {
            fontSize: FontSize.xs,
            fontWeight: '700',
            color: palette.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: Spacing.xs,
            marginLeft: Spacing.xs,
        },
        masterySpendBtn: {
            paddingVertical: 6,
            paddingHorizontal: Spacing.md,
            borderRadius: Radius.sm,
            backgroundColor: palette.accentPrimary,
            justifyContent: 'center',
        },
        masterySpendBtnDisabled: { backgroundColor: palette.bgApp, borderWidth: 1, borderColor: palette.border, opacity: 0.7 },
        masterySpendBtnMax: { backgroundColor: palette.green + '33', borderColor: palette.green, borderWidth: 1 },
        masterySpendText: { fontSize: FontSize.sm, fontWeight: '700', color: palette.white },
        masterySpendTextDisabled: { color: palette.textMuted },
        masterySpendTextMax: { color: palette.green },
    });
}
