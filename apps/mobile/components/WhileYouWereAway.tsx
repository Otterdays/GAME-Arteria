/**
 * WhileYouWereAway.tsx
 *
 * Phase 1.4 — Offline catch-up summary modal.
 * Automatically shown after offline progression is calculated.
 * Dismissed by the player and then cleared from Redux state.
 */
import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { Palette, Spacing, Radius, FontSize } from '@/constants/theme';
import { logger } from '@/utils/logger';

const SKILL_NAMES: Partial<Record<SkillId, string>> = {
    mining: '⛏️ Mining',
    woodcutting: '🪓 Woodcutting',
    fishing: '🎣 Fishing',
    cooking: '🍳 Cooking',
    smithing: '🔨 Smithing',
    crafting: '✂️ Crafting',
    farming: '🌾 Farming',
    herblore: '🧪 Herblore',
    agility: '🏃 Agility',
    attack: '⚔️ Attack',
    strength: '💪 Strength',
    defence: '🛡️ Defence',
    hitpoints: '❤️ Hitpoints',
};

function formatElapsed(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

export default function WhileYouWereAway() {
    const dispatch = useAppDispatch();
    const report = useAppSelector((s) => s.game.offlineReport);

    if (!report) return null;

    const handleDismiss = () => {
        logger.debug('UI', 'WYWA modal dismissed');
        dispatch(gameActions.clearOfflineReport());
    };

    const xpEntries = Object.entries(report.xpGained) as [SkillId, number][];
    const hasLoot = report.itemsGained.length > 0;
    const hasXP = xpEntries.length > 0;

    return (
        <Modal visible transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    {/* Header */}
                    <Text style={styles.icon}>⏳</Text>
                    <Text style={styles.title}>While You Were Away</Text>
                    <Text style={styles.time}>{formatElapsed(report.elapsedMs)} of progress</Text>
                    {report.wasCapped && (
                        <View style={styles.capBanner}>
                            <Text style={styles.capText}>⚠️ Capped at 24h (F2P limit)</Text>
                        </View>
                    )}

                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                        {/* XP Gained */}
                        {hasXP && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>XP Gained</Text>
                                {xpEntries.map(([skillId, xp]) => (
                                    <View key={skillId} style={styles.row}>
                                        <Text style={styles.rowLabel}>
                                            {SKILL_NAMES[skillId] ?? skillId}
                                        </Text>
                                        <Text style={styles.rowValue}>+{Math.floor(xp).toLocaleString()} XP</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Items Gained */}
                        {hasLoot && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Items Gathered</Text>
                                <View style={styles.itemGrid}>
                                    {report.itemsGained.map((item) => (
                                        <View key={item.id} style={styles.itemChip}>
                                            <Text style={styles.itemName}>
                                                {item.id.replace(/_/g, ' ')}
                                            </Text>
                                            <Text style={styles.itemQty}>x{item.quantity.toLocaleString()}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {!hasXP && !hasLoot && (
                            <Text style={styles.noActivity}>
                                No active task was set — nothing gathered while you were away.
                            </Text>
                        )}
                    </ScrollView>

                    <TouchableOpacity style={styles.button} onPress={handleDismiss} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Collect & Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'flex-end',
    },
    card: {
        backgroundColor: Palette.bgCard,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: Spacing.lg,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: Palette.border,
        maxHeight: '82%',
    },
    icon: {
        fontSize: 40,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Palette.textPrimary,
        textAlign: 'center',
        marginBottom: 4,
    },
    time: {
        fontSize: FontSize.base,
        color: Palette.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    capBanner: {
        backgroundColor: Palette.goldDim + '33',
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Palette.goldDim,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        marginBottom: Spacing.md,
        alignItems: 'center',
    },
    capText: {
        fontSize: FontSize.sm,
        color: Palette.gold,
        fontWeight: '600',
    },
    scroll: { maxHeight: 400 },
    scrollContent: { gap: Spacing.md },
    section: {
        backgroundColor: Palette.bgApp,
        borderRadius: Radius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Palette.border,
        gap: Spacing.sm,
    },
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Palette.accentPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowLabel: {
        fontSize: FontSize.base,
        color: Palette.textPrimary,
    },
    rowValue: {
        fontSize: FontSize.base,
        color: Palette.green,
        fontWeight: '700',
    },
    itemGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    itemChip: {
        backgroundColor: Palette.bgCard,
        borderRadius: Radius.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderWidth: 1,
        borderColor: Palette.border,
        alignItems: 'center',
    },
    itemName: {
        fontSize: FontSize.xs,
        color: Palette.textPrimary,
        textTransform: 'capitalize',
        marginBottom: 2,
    },
    itemQty: {
        fontSize: FontSize.sm,
        color: Palette.gold,
        fontWeight: '700',
    },
    noActivity: {
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
        textAlign: 'center',
        paddingVertical: Spacing.lg,
    },
    button: {
        marginTop: Spacing.lg,
        backgroundColor: Palette.accentPrimary,
        paddingVertical: 14,
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    buttonText: {
        color: Palette.white,
        fontSize: FontSize.base,
        fontWeight: '700',
    },
});
