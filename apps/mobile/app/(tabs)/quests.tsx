import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { BouncyButton } from '@/components/BouncyButton';

// NOTE: Hardcoded import until alias is linked properly across monorepo
import { ALL_QUESTS } from '../../../../packages/engine/src/data/quests';
import { Quest } from '../../../../packages/engine/src/data/story';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function QuestsScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const narrative = useAppSelector((s) => s.game.player.narrative);

    const { activeQuests, completedQuests, availableQuests } = useMemo(() => {
        const active: Quest[] = [];
        const completed: Quest[] = [];
        const available: Quest[] = [];

        Object.values(ALL_QUESTS).forEach(q => {
            if (narrative.completedQuests.includes(q.id)) {
                completed.push(q);
            } else if (narrative.activeQuests[q.id]) {
                active.push(q);
            } else {
                // Quick check for availability: No hard reqs implemented yet to gate
                available.push(q);
            }
        });

        return { activeQuests: active, completedQuests: completed, availableQuests: available };
    }, [narrative]);

    const handleStartQuest = (questId: string) => {
        dispatch(gameActions.startQuest(questId));
    };

    const handleCompleteQuestMock = (questId: string) => {
        // For testing narrative flow only
        dispatch(gameActions.completeQuest(questId));
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Lore & Quests</Text>
                <Text style={styles.headerSubtitle}>The Cosmic Comedy Unfolds...</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Active Quests */}
                {activeQuests.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Active Expeditions</Text>
                        {activeQuests.map(q => {
                            const completedSteps = narrative.activeQuests[q.id] || [];
                            return (
                                <View key={q.id} style={[styles.questCard, styles.questActive]}>
                                    <Text style={styles.questTitle}>{q.title} <Text style={styles.actTag}>ACT {q.act}</Text></Text>
                                    <Text style={styles.questDesc}>{q.description}</Text>

                                    <View style={styles.stepsContainer}>
                                        {q.steps.map(step => {
                                            const isDone = completedSteps.includes(step.id);
                                            return (
                                                <View key={step.id} style={styles.stepRow}>
                                                    <IconSymbol name={isDone ? "checkmark.circle.fill" : "circle"} size={16} color={isDone ? Palette.green : Palette.textMuted} />
                                                    <Text style={[styles.stepText, isDone && styles.stepCompleted]}>{step.description}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>

                                    <BouncyButton
                                        style={styles.devButton}
                                        onPress={() => handleCompleteQuestMock(q.id)}
                                    >
                                        <Text style={styles.devBtnText}>[DEV] Complete Quest</Text>
                                    </BouncyButton>
                                </View>
                            )
                        })}
                    </View>
                )}

                {/* Available Quests */}
                {availableQuests.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Available</Text>
                        {availableQuests.map(q => (
                            <View key={q.id} style={styles.questCard}>
                                <View style={styles.questHeader}>
                                    <Text style={styles.questTitle}>{q.title}</Text>
                                    <Text style={styles.actTag}>ACT {q.act}</Text>
                                </View>
                                <Text style={styles.questDesc}>{q.description}</Text>

                                <BouncyButton
                                    style={styles.startButton}
                                    onPress={() => handleStartQuest(q.id)}
                                >
                                    <Text style={styles.startBtnText}>Begin Quest</Text>
                                </BouncyButton>
                            </View>
                        ))}
                    </View>
                )}

                {/* Completed Quests */}
                {completedQuests.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>The Archives (Completed)</Text>
                        {completedQuests.map(q => (
                            <View key={q.id} style={[styles.questCard, styles.questCompleted]}>
                                <View style={styles.questHeader}>
                                    <Text style={[styles.questTitle, { color: Palette.textMuted }]}>{q.title}</Text>
                                    <IconSymbol name="checkmark.seal.fill" size={20} color={Palette.gold} />
                                </View>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.bgApp,
    },
    header: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Palette.border,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Palette.textPrimary,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
        marginTop: 2,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: Spacing['2xl'],
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Palette.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: Spacing.sm,
    },
    questCard: {
        backgroundColor: Palette.bgCard,
        borderRadius: Radius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Palette.border,
        marginBottom: Spacing.sm,
    },
    questActive: {
        borderColor: Palette.accentPrimary,
        backgroundColor: Palette.bgCardHover,
    },
    questCompleted: {
        opacity: 0.6,
    },
    questHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    questTitle: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Palette.textPrimary,
        marginBottom: 4,
    },
    actTag: {
        fontSize: FontSize.xs,
        color: Palette.accentPrimary,
        fontWeight: '800',
    },
    questDesc: {
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
        lineHeight: 20,
        marginBottom: Spacing.md,
    },
    stepsContainer: {
        backgroundColor: Palette.bgApp,
        borderRadius: Radius.sm,
        padding: Spacing.sm,
        gap: 8,
        marginBottom: Spacing.md,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
    },
    stepCompleted: {
        textDecorationLine: 'line-through',
        color: Palette.textMuted,
    },
    startButton: {
        backgroundColor: Palette.accentPrimary,
        paddingVertical: 10,
        borderRadius: Radius.sm,
        alignItems: 'center',
    },
    startBtnText: {
        color: Palette.white,
        fontWeight: '700',
        fontSize: FontSize.sm,
    },
    devButton: {
        backgroundColor: '#332b22',
        borderWidth: 1,
        borderColor: Palette.gold,
        paddingVertical: 8,
        borderRadius: Radius.sm,
        alignItems: 'center',
    },
    devBtnText: {
        color: Palette.gold,
        fontWeight: '700',
        fontSize: FontSize.xs,
    }
});
