import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { LOGGING_NODES, LoggingNode } from '@/constants/logging';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { formatNumber, formatXpHr } from '@/utils/formatNumber';
import { FloatingXpPop } from '@/components/FloatingXpPop';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { SmoothProgressBar } from '@/components/SmoothProgressBar';

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

export default function LoggingScreen() {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const loggingSkill = useAppSelector((s) => s.game.player.skills.logging);
    const activeTask = useAppSelector((s) => s.game.player.activeTask);

    const isLogging = activeTask?.skillId === 'logging';
    const activeNodeId = isLogging ? activeTask.actionId : null;
    const activeNode = LOGGING_NODES.find(n => n.id === activeNodeId);

    // XP floating pop-up logic + screen shake on tick complete
    const [popTrigger, setPopTrigger] = React.useState(0);
    const lastXp = React.useRef(loggingSkill.xp);
    const lastGain = React.useRef(0);
    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (loggingSkill.xp > lastXp.current) {
            const gain = loggingSkill.xp - lastXp.current;
            lastXp.current = loggingSkill.xp;
            lastGain.current = gain;
            setPopTrigger(t => t + 1);
            // Gentle screen shake when completing a logging tick
            shakeAnim.setValue(0);
            Animated.timing(shakeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => shakeAnim.setValue(0));
        } else {
            lastXp.current = loggingSkill.xp;
        }
    }, [loggingSkill.xp, shakeAnim]);

    const shakeX = shakeAnim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, 4, -4, 4, 0] });

    // XP progress for header
    const clvXP = xpForLevel(loggingSkill.level);
    const nlvXP = xpForLevel(loggingSkill.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(loggingSkill.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = loggingSkill.level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const handleNodePress = (node: LoggingNode) => {
        if (loggingSkill.level < node.levelReq) {
            Alert.alert("Locked", `Requires Logging Level ${node.levelReq}`);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        if (activeNodeId === node.id) {
            // Stop if already training this node
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            dispatch(gameActions.stopTask());
        } else {
            // Start this node
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            dispatch(
                gameActions.startTask({
                    type: 'skilling',
                    skillId: 'logging',
                    actionId: node.id,
                    intervalMs: node.baseTickMs,
                    partialTickMs: 0,
                })
            );
        }
    };

    return (
        <Animated.View style={[styles.container, { paddingTop: insets.top }, { transform: [{ translateX: shakeX }] }]}>
            <Stack.Screen
                options={{
                    title: 'Logging',
                    headerShown: false, // Use our custom back button layout
                }}
            />

            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <Text style={styles.backButtonText}>‹ Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
                <View style={[styles.levelBadge, { backgroundColor: Palette.skillLogging + '33', borderColor: Palette.skillLogging }]}>
                    <Text style={[styles.levelBadgeText, { color: Palette.skillLogging }]}>Lv. {loggingSkill.level}</Text>
                </View>
                <Text style={styles.miningTitle}>Logging</Text>
                <Text style={styles.miningSub}>Chop down trees to collect wood.</Text>
                {/* XP progress [current/next] */}
                <View style={styles.xpRow}>
                    <View style={styles.xpBarBg}>
                        <ProgressBarWithPulse
                            progress={pct}
                            fillColor={Palette.skillLogging}
                            widthPercent={pct}
                        />
                    </View>
                    <Text style={styles.xpText}>
                        {loggingSkill.level >= 99
                            ? `${formatNumber(loggingSkill.xp)} XP — MAX`
                            : `${formatNumber(xpIntoLevel)} / ${formatNumber(xpNeeded)} XP`}
                    </Text>
                    {/* XP Pop-up VFX */}
                    <FloatingXpPop
                        amount={lastGain.current}
                        emoji={activeNode?.emoji || '🪓'}
                        triggerKey={popTrigger}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {LOGGING_NODES.map((node) => {
                    const isLocked = loggingSkill.level < node.levelReq;
                    const isActive = activeNodeId === node.id;

                    return (
                        <TouchableOpacity
                            key={node.id}
                            style={[
                                styles.nodeCard,
                                isLocked && styles.nodeCardLocked,
                                isActive && [styles.nodeCardActive, { borderColor: Palette.skillLogging, backgroundColor: Palette.skillLogging + '11' }],
                            ]}
                            activeOpacity={0.7}
                            onPress={() => handleNodePress(node)}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: isLocked, selected: isActive }}
                            accessibilityLabel={`${node.name}. ${isLocked ? `Unlocks at level ${node.levelReq}` : `Chop for ${node.xpPerTick} XP`}`}
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
                                    <Text style={styles.statValue}>{formatNumber(node.xpPerTick)}</Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>XP/hr</Text>
                                    <Text style={[styles.statValue, { color: Palette.gold }]}>
                                        {formatXpHr(node.xpPerTick, node.baseTickMs, node.successRate)}
                                    </Text>
                                </View>
                                <View style={styles.statPill}>
                                    <Text style={styles.statLabel}>To Level</Text>
                                    <Text style={[styles.statValue, { color: Palette.green }]}>
                                        {loggingSkill.level >= 99
                                            ? 'MAX'
                                            : `~${Math.ceil((nlvXP - loggingSkill.xp) / node.xpPerTick)}`}
                                    </Text>
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
                                    <Text style={styles.trainButtonText}>{isActive ? 'Stop Chopping' : 'Chop'}</Text>
                                </View>
                            )}
                            {isActive && activeTask && (
                                <SmoothProgressBar
                                    partialTickMs={activeTask.partialTickMs}
                                    intervalMs={activeTask.intervalMs}
                                    fillColor={Palette.skillLogging}
                                />
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
        </Animated.View>
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
    headerRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
        backgroundColor: Palette.bgApp,
    },
    backButton: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
    },
    backButtonText: {
        color: Palette.accentPrimary,
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    levelBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        marginBottom: Spacing.sm,
        borderWidth: 1,
    },
    levelBadgeText: {
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
        // Will be merged dynamically with inline styles in render block for logging-specific colors
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
        backgroundColor: Palette.redDim,
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
    xpRow: {
        width: '100%',
        marginTop: Spacing.md,
        gap: 4,
    },
    xpBarBg: {
        height: 6,
        backgroundColor: Palette.bgApp,
        borderRadius: Radius.full,
        overflow: 'hidden',
        width: '100%',
    },
    xpBarFill: {
        height: '100%',
        borderRadius: Radius.full,
    },
    xpText: {
        fontSize: FontSize.xs,
        color: Palette.textSecondary,
        textAlign: 'center',
    },
    nodeProgressBg: {
        height: 4,
        backgroundColor: Palette.bgApp,
        borderRadius: 2,
        marginTop: Spacing.sm,
        overflow: 'hidden',
    },
    nodeProgressFill: {
        height: '100%',
    },
});
