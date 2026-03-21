/**
 * CraftingQueueHub — Pioneering UI for managing the task queue.
 * Displays current and upcoming tasks with progress, cancellation, and ETA.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { getItemMeta } from '@/constants/items';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BouncyButton } from '@/components/BouncyButton';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { formatNumber } from '@/utils/formatNumber';

export function CraftingQueueHub() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const queuedTasks = useAppSelector((s) => s.game.player.queuedTasks || []);
    const activeTask = useAppSelector((s) => s.game.player.activeTask);

    if (queuedTasks.length === 0) return null;

    const totalTimeMs = queuedTasks.reduce((sum, q) => {
        const remainingTicks = q.targetQty - q.completedQty;
        return sum + (remainingTicks * q.intervalMs) - q.partialTickMs;
    }, 0);

    const formatTimeRemaining = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${m}m ${s}s`;
    };

    const handleCancel = (id: string, actionId: string, remainingQty: number) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        // In a real implementation, we'd calculate refund items based on the recipe
        // For now, the reducer expects refundItems. 
        // We'll need a helper to get recipe inputs.
        dispatch(gameActions.cancelQueuedTask({ id, refundItems: [] }));
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['transparent', palette.bgApp]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.2 }}
            />
            <View style={[styles.content, { backgroundColor: palette.bgCard, borderTopColor: palette.border }]}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <IconSymbol name="stack" size={18} color={palette.accentPrimary} />
                        <Text style={styles.title}>Crafting Queue</Text>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{queuedTasks.length}</Text>
                        </View>
                    </View>
                    <Text style={styles.etaText}>ETA: {formatTimeRemaining(totalTimeMs)}</Text>
                </View>

                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.queueList}
                >
                    {queuedTasks.map((task, index) => {
                        const meta = getItemMeta(task.actionId.replace(/_recipe$/, '')); // Simple heuristic for item id
                        const isFirst = index === 0;
                        const progress = (task.completedQty / task.targetQty) * 100;
                        
                        return (
                            <View key={task.id} style={styles.taskCard}>
                                <LinearGradient
                                    colors={[palette.bgApp, palette.bgCard]}
                                    style={StyleSheet.absoluteFill}
                                    borderRadius={Radius.md}
                                />
                                <View style={styles.taskInfo}>
                                    <Text style={styles.taskEmoji}>{meta.emoji}</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.taskName} numberOfLines={1}>
                                            {formatNumber(task.targetQty - task.completedQty)}x {meta.label}
                                        </Text>
                                        <Text style={styles.taskSub}>
                                            {isFirst ? 'Processing...' : 'Waiting'}
                                        </Text>
                                    </View>
                                    <BouncyButton 
                                        onPress={() => handleCancel(task.id, task.actionId, task.targetQty - task.completedQty)}
                                        style={styles.cancelBtn}
                                    >
                                        <IconSymbol name="trash" size={14} color={palette.red} />
                                    </BouncyButton>
                                </View>
                                
                                <View style={styles.progressContainer}>
                                    <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: palette.accentPrimary }]} />
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    content: {
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xl,
        borderTopWidth: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    title: {
        fontFamily: FontCinzelBold,
        fontSize: FontSize.base,
        color: '#e8e9ed', // Using hardcoded textPrimary for now to match DARK_PALETTE
    },
    countBadge: {
        backgroundColor: '#4a90e2', // accentPrimary
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 10,
    },
    countText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    etaText: {
        fontSize: FontSize.xs,
        color: '#8b8fa3', // textSecondary
    },
    queueList: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
        paddingBottom: Spacing.xs,
    },
    taskCard: {
        width: 160,
        padding: Spacing.sm,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    taskInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    taskEmoji: {
        fontSize: 20,
    },
    taskName: {
        fontSize: 11,
        fontWeight: '700',
        color: '#e8e9ed',
    },
    taskSub: {
        fontSize: 9,
        color: '#8b8fa3',
    },
    cancelBtn: {
        padding: 4,
    },
    progressContainer: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
});
