import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, Radius, CardStyle, FontCinzel, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { BouncyButton } from '@/components/BouncyButton';

// NOTE: Hardcoded import until alias is linked properly across monorepo
import { ALL_QUESTS } from '../../../../packages/engine/src/data/quests';
import { Quest } from '../../../../packages/engine/src/data/story';
import { meetsNarrativeRequirement } from '../../../../packages/engine/src/utils/narrative';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function QuestsScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const player = useAppSelector((s) => s.game.player);
    const narrative = player.narrative;

    const { activeQuests, completedQuests, availableQuests } = useMemo(() => {
        const active: Quest[] = [];
        const completed: Quest[] = [];
        const available: Quest[] = [];

        Object.values(ALL_QUESTS).forEach(q => {
            if (narrative.completedQuests.includes(q.id)) {
                completed.push(q);
            } else if (narrative.activeQuests[q.id]) {
                active.push(q);
            } else if (meetsNarrativeRequirement(player, q.requirements)) {
                available.push(q);
            }
        });

        return { activeQuests: active, completedQuests: completed, availableQuests: available };
    }, [player]);

    const handleStartQuest = (questId: string) => {
        dispatch(gameActions.startQuest(questId));
    };

    const handleCompleteQuestMock = (questId: string) => {
        // For testing narrative flow only
        dispatch(gameActions.completeQuest(questId));
    };

    const handleTestDialogue = () => {
        dispatch(gameActions.startDialogue({ treeId: 'dt_guard_intro', startNodeId: 'node_1' }));
    };

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                header: {
                    paddingHorizontal: Spacing.md,
                    paddingBottom: Spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                headerTitle: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.xl,
                    color: palette.textPrimary,
                },
                headerSubtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 2,
                },
                scrollContent: {
                    padding: Spacing.md,
                    paddingBottom: Spacing['2xl'],
                },
                section: { marginBottom: Spacing.xl },
                sectionTitle: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.md,
                    color: palette.accentWeb,
                    letterSpacing: 1.2,
                    marginBottom: Spacing.sm,
                },
                questCard: {
                    backgroundColor: palette.bgCard,
                    ...CardStyle,
                    borderColor: palette.border,
                    padding: Spacing.md,
                    marginBottom: Spacing.sm,
                },
                questActive: {
                    borderColor: palette.accentWeb,
                    backgroundColor: palette.bgCardHover,
                },
                questCompleted: { opacity: 0.6 },
                questHeader: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                },
                questTitle: {
                    fontSize: FontSize.lg,
                    fontWeight: '700',
                    color: palette.textPrimary,
                    marginBottom: 4,
                },
                badgeRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                },
                difficultyBadge: {
                    fontSize: FontSize.xs,
                    fontWeight: '700',
                    textTransform: 'capitalize',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                },
                diff_novice: {
                    backgroundColor: palette.green + '40',
                    color: palette.green,
                },
                diff_intermediate: {
                    backgroundColor: palette.gold + '40',
                    color: palette.gold,
                },
                diff_experienced: {
                    backgroundColor: palette.accentPrimary + '40',
                    color: palette.accentPrimary,
                },
                diff_master: { backgroundColor: '#6a0dad40', color: '#b794f6' },
                actTag: {
                    fontSize: FontSize.xs,
                    color: palette.accentPrimary,
                    fontWeight: '800',
                },
                questDesc: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    lineHeight: 20,
                    marginBottom: Spacing.md,
                },
                stepsContainer: {
                    backgroundColor: palette.bgApp,
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
                    color: palette.textSecondary,
                },
                stepCompleted: {
                    textDecorationLine: 'line-through',
                    color: palette.textMuted,
                },
                startButton: {
                    backgroundColor: palette.accentPrimary,
                    paddingVertical: 10,
                    borderRadius: Radius.sm,
                    alignItems: 'center',
                },
                startBtnText: {
                    color: palette.white,
                    fontWeight: '700',
                    fontSize: FontSize.sm,
                },
                devButton: {
                    backgroundColor: '#332b22',
                    borderWidth: 1,
                    borderColor: palette.gold,
                    paddingVertical: 8,
                    borderRadius: Radius.sm,
                    alignItems: 'center',
                },
                devBtnText: {
                    color: palette.gold,
                    fontWeight: '700',
                    fontSize: FontSize.xs,
                },
            }),
        [palette]
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Lore & Quests</Text>
                <Text style={styles.headerSubtitle}>The Cosmic Comedy Unfolds...</Text>
                <BouncyButton
                    style={[styles.devButton, { marginTop: Spacing.sm, alignSelf: 'flex-start' }]}
                    onPress={handleTestDialogue}
                >
                    <Text style={styles.devBtnText}>[DEV] Play "Guard Intro" Dialogue</Text>
                </BouncyButton>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

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
                                                    <IconSymbol name={isDone ? "checkmark.circle.fill" : "circle"} size={16} color={isDone ? palette.green : palette.textMuted} />
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
                                    <View style={styles.badgeRow}>
                                        {q.difficulty && (
                                            <Text style={[styles.difficultyBadge, styles[`diff_${q.difficulty}` as keyof typeof styles]]}>
                                                {q.difficulty}
                                            </Text>
                                        )}
                                        <Text style={styles.actTag}>ACT {q.act}</Text>
                                    </View>
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
                                    <Text style={[styles.questTitle, { color: palette.textMuted }]}>{q.title}</Text>
                                    <IconSymbol name="checkmark.seal.fill" size={20} color={palette.gold} />
                                </View>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>
        </View>
    );
}

