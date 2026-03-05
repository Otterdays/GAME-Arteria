import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Spacing, FontSize, Radius, CardStyle, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, type SkillId } from '@/store/gameSlice';
import { BouncyButton } from '@/components/BouncyButton';
import { getNextMidnight, generateDailyQuests } from '@/constants/dailyQuests';
import { getItemMeta } from '@/constants/items';
import { IconSymbol } from '@/components/ui/icon-symbol';

// NOTE: Hardcoded import until alias is linked properly across monorepo
import { ALL_QUESTS } from '../../../../packages/engine/src/data/quests';
import { Quest } from '../../../../packages/engine/src/data/story';
import { meetsNarrativeRequirement } from '../../../../packages/engine/src/utils/narrative';

export default function QuestsScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const player = useAppSelector((s) => s.game.player);
    const narrative = player.narrative;
    const dailyQuests = player.dailyQuests;

    useFocusEffect(
        useCallback(() => {
            const now = Date.now();
            const resetAt = dailyQuests?.resetAt ?? 0;
            if (!dailyQuests || now >= resetAt) {
                dispatch(gameActions.setDailyQuests({
                    resetAt: getNextMidnight(),
                    quests: generateDailyQuests(3),
                }));
            }
        }, [dispatch, dailyQuests?.resetAt])
    );

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

    const handleCompleteQuest = (questId: string) => {
        const quest = ALL_QUESTS[questId];
        if (!quest) return;
        const completedSteps = narrative.activeQuests[questId] || [];
        if (completedSteps.length < quest.steps.length) return;

        const r = quest.rewards;
        if (r.gold && r.gold > 0) dispatch(gameActions.addGold(r.gold));
        if (r.xp) {
            (Object.entries(r.xp) as [string, number][]).forEach(([skillId, xp]) => {
                if (xp > 0) dispatch(gameActions.applyXP({ skillId: skillId as SkillId, xp }));
            });
        }
        if (r.setFlags?.length) r.setFlags.forEach((flag) => dispatch(gameActions.setNarrativeFlag(flag)));
        if (r.items?.length) dispatch(gameActions.addItems(r.items));
        dispatch(gameActions.completeQuest(questId));
    };

    const handleTestDialogue = () => {
        dispatch(gameActions.startDialogue({ treeId: 'dt_guard_intro', startNodeId: 'node_1' }));
    };

    const TOWN_NPCS: { id: string; name: string; emoji: string; treeId: string }[] = [
        { id: 'guard', name: 'Confused Gate Guard', emoji: '🛡️', treeId: 'dt_guard_intro' },
        { id: 'nick', name: 'Nick — Merchant', emoji: '🏪', treeId: 'dt_nick_shop' },
        { id: 'bianca', name: 'Bianca the Herbalist', emoji: '🌿', treeId: 'dt_bianca_herbalist' },
        { id: 'kate', name: 'Kate the Traveler', emoji: '🧭', treeId: 'dt_kate_traveler' },
    ];

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                header: {
                    padding: Spacing.md,
                    paddingBottom: Spacing.sm,
                    backgroundColor: palette.bgCard,
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
                {__DEV__ && (
                    <BouncyButton
                        style={[styles.devButton, { marginTop: Spacing.sm, alignSelf: 'flex-start' }]}
                        onPress={handleTestDialogue}
                    >
                        <Text style={styles.devBtnText}>[DEV] Play "Guard Intro" Dialogue</Text>
                    </BouncyButton>
                )}
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* NPCs in Town */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>NPCs in Town</Text>
                    <Text style={[styles.questDesc, { marginBottom: Spacing.sm }]}>
                        Talk to locals for lore and tips.
                    </Text>
                    {TOWN_NPCS.map((npc) => (
                        <View key={npc.id} style={styles.questCard}>
                            <View style={styles.questHeader}>
                                <Text style={styles.questTitle}>{npc.emoji} {npc.name}</Text>
                            </View>
                            <BouncyButton
                                style={[styles.startButton, { alignSelf: 'flex-start' }]}
                                onPress={() => dispatch(gameActions.startDialogue({ treeId: npc.treeId, startNodeId: 'node_1' }))}
                            >
                                <Text style={styles.startBtnText}>💬 Talk</Text>
                            </BouncyButton>
                        </View>
                    ))}
                </View>

                {/* Daily Quests */}
                {dailyQuests && dailyQuests.quests.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Daily Quests</Text>
                        <Text style={[styles.questDesc, { marginBottom: Spacing.sm }]}>
                            Resets at midnight. Complete for gold and Lumina.
                        </Text>
                        {dailyQuests.quests.map((dq) => {
                            const meta = getItemMeta(dq.objective.itemId);
                            const done = dq.completed || dq.current >= dq.objective.quantity;
                            return (
                                <View key={dq.id} style={[styles.questCard, dq.completed && styles.questCompleted]}>
                                    <View style={styles.questHeader}>
                                        <Text style={styles.questTitle}>{dq.label}</Text>
                                        <Text style={styles.actTag}>
                                            {dq.current} / {dq.objective.quantity} {meta.emoji}
                                        </Text>
                                    </View>
                                    <View style={styles.stepRow}>
                                        <Text style={styles.stepText}>
                                            Reward: 💰 {dq.rewardGold} gp{dq.rewardLumina ? ` · ✨ ${dq.rewardLumina} Lumina` : ''}
                                        </Text>
                                    </View>
                                    {done && !dq.completed && (
                                        <BouncyButton
                                            style={styles.startButton}
                                            onPress={() => dispatch(gameActions.completeDailyQuest(dq.id))}
                                        >
                                            <Text style={styles.startBtnText}>Claim Reward</Text>
                                        </BouncyButton>
                                    )}
                                    {dq.completed && (
                                        <View style={styles.stepRow}>
                                            <IconSymbol name="checkmark.seal.fill" size={18} color={palette.green} />
                                            <Text style={[styles.stepText, styles.stepCompleted]}>Claimed</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

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

                                    {completedSteps.length >= q.steps.length && (
                                        <BouncyButton
                                            style={styles.startButton}
                                            onPress={() => handleCompleteQuest(q.id)}
                                        >
                                            <Text style={styles.startBtnText}>Complete Quest</Text>
                                        </BouncyButton>
                                    )}
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

