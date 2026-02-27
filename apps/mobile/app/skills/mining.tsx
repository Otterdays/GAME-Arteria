import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { MINING_NODES, MiningNode } from '@/constants/mining';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';

export default function MiningScreen() {
    const dispatch = useAppDispatch();
    const miningSkill = useAppSelector((s) => s.game.player.skills.mining);
    const activeTask = useAppSelector((s) => s.game.player.activeTask);

    const isMining = activeTask?.skillId === 'mining';
    const activeNodeId = isMining ? activeTask.actionId : null;

    const handleNodePress = (node: MiningNode) => {
        if (miningSkill.level < node.levelReq) {
            Alert.alert("Locked", `Requires Mining Level ${node.levelReq}`);
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (activeNodeId === node.id) {
            // Stop if already training this node
            dispatch(gameActions.stopTask());
        } else {
            // Start this node
            dispatch(
                gameActions.startTask({
                    type: 'skilling',
                    skillId: 'mining',
                    actionId: node.id,
                    intervalMs: node.baseTickMs,
                    partialTickMs: 0,
                })
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Mining',
                    headerStyle: { backgroundColor: Palette.bgApp },
                    headerTintColor: Palette.textPrimary,
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: Spacing.sm }}>
                            <IconSymbol name="chevron.left" size={24} color={Palette.accentPrimary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            {/* Header / Info Section */}
            <View style={styles.infoSection}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>Lv. {miningSkill.level}</Text>
                </View>
                <Text style={styles.miningTitle}>Mining</Text>
                <Text style={styles.miningSub}>Swing your pickaxe and gather ores.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {MINING_NODES.map((node) => {
                    const isLocked = miningSkill.level < node.levelReq;
                    const isActive = activeNodeId === node.id;

                    return (
                        <TouchableOpacity
                            key={node.id}
                            style={[
                                styles.nodeCard,
                                isLocked && styles.nodeCardLocked,
                                isActive && styles.nodeCardActive,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => handleNodePress(node)}
                        >
                            <View style={styles.nodeHeader}>
                                <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.5 }]}>{node.emoji}</Text>
                                <View style={styles.nodeTitleContainer}>
                                    <Text style={[styles.nodeName, isLocked && styles.textLocked]}>
                                        {node.name}
                                    </Text>
                                    <Text style={styles.nodeReq}>
                                        {isLocked ? `Unlocks at Lv. ${node.levelReq}` : `Lv. ${node.levelReq} required`}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.nodeStats, isLocked && { opacity: 0.5 }]}>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/Drop</Text>
                                    <Text style={styles.statValue}>{node.xpPerTick}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Time</Text>
                                    <Text style={styles.statValue}>{(node.baseTickMs / 1000).toFixed(1)}s</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>Success</Text>
                                    <Text style={styles.statValue}>{Math.round(node.successRate * 100)}%</Text>
                                </View>
                            </View>

                            {!isLocked && (
                                <View style={[styles.trainButton, isActive && styles.trainButtonActive]}>
                                    <Text style={styles.trainButtonText}>{isActive ? 'Stop Mining' : 'Mine'}</Text>
                                </View>
                            )}
                            {isLocked && (
                                <View style={[styles.trainButton, styles.trainButtonLocked]}>
                                    <IconSymbol name="lock.fill" size={16} color={Palette.textDisabled} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.bgApp,
    },
    infoSection: {
        padding: Spacing.lg,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Palette.border,
        backgroundColor: Palette.bgCard,
    },
    levelBadge: {
        backgroundColor: Palette.skillMining + '33', // slightly transparent
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Palette.skillMining,
    },
    levelBadgeText: {
        color: Palette.skillMining,
        fontWeight: 'bold',
        fontSize: FontSize.sm,
    },
    miningTitle: {
        fontSize: FontSize.xl,
        fontWeight: 'bold',
        color: Palette.textPrimary,
        marginBottom: 4,
    },
    miningSub: {
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
    },
    listContent: {
        padding: Spacing.md,
        gap: Spacing.md,
    },
    nodeCard: {
        backgroundColor: Palette.bgCard,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    nodeCardLocked: {
        backgroundColor: Palette.bgApp,
        borderColor: 'transparent',
    },
    nodeCardActive: {
        borderColor: Palette.skillMining,
        backgroundColor: Palette.skillMining + '11',
    },
    nodeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    nodeEmoji: {
        fontSize: 32,
        marginRight: Spacing.md,
    },
    nodeTitleContainer: {
        flex: 1,
    },
    nodeName: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Palette.textPrimary,
        marginBottom: 2,
    },
    textLocked: {
        color: Palette.textDisabled,
    },
    nodeReq: {
        fontSize: FontSize.xs,
        color: Palette.textSecondary,
    },
    nodeStats: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    statPill: {
        flex: 1,
        backgroundColor: Palette.bgApp,
        borderRadius: Radius.md,
        padding: Spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Palette.border,
    },
    statLabel: {
        fontSize: 10,
        color: Palette.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    statValue: {
        fontSize: FontSize.sm,
        color: Palette.white,
        fontWeight: '600',
    },
    trainButton: {
        backgroundColor: Palette.accentPrimary,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    trainButtonActive: {
        backgroundColor: Palette.error,
    },
    trainButtonLocked: {
        backgroundColor: Palette.bgCard,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    trainButtonText: {
        color: Palette.white,
        fontWeight: 'bold',
        fontSize: FontSize.base,
    },
});
