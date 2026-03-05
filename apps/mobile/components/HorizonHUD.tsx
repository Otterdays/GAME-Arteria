import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { formatNumber } from '@/utils/formatNumber';
import { SkillId } from '@/store/gameSlice';
import { LinearGradient } from 'expo-linear-gradient';

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

const SKILL_EMOJIS: Record<string, string> = {
    mining: '⛏️',
    logging: '🪓',
    fishing: '🎣',
    runecrafting: '✨',
    smithing: '🔨',
    forging: '⚒️',
    cooking: '🍳',
    herblore: '🧪',
    harvesting: '🪴',
    scavenging: '🏕️',
    attack: '⚔️',
    strength: '💪',
    defence: '🛡️',
    hitpoints: '❤️',
};

export const HorizonHUD = () => {
    const { palette } = useTheme();
    const player = useAppSelector((s) => s.game.player);
    const activeTask = player.activeTask;

    const immediateGoal = activeTask ? {
        label: 'Immediate',
        name: activeTask.actionId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        emoji: activeTask.skillId ? SKILL_EMOJIS[activeTask.skillId] || '⚙️' : '⚙️',
        progress: (activeTask.partialTickMs / (activeTask.intervalMs || 1)) * 100,
        subtext: 'Next drop imminent...',
    } : {
        label: 'Immediate',
        name: 'Idle',
        emoji: '💤',
        progress: 0,
        subtext: 'Awaiting activity',
    };

    const activeSkillId = activeTask?.skillId as SkillId;
    const targetSkillId = activeSkillId || 'mining';
    const skillState = player.skills[targetSkillId];

    const clvXP = xpForLevel(skillState.level);
    const nlvXP = xpForLevel(skillState.level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(skillState.xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const sessionProgress = skillState.level >= 99 ? 100 : (xpIntoLevel / xpNeeded) * 100;

    const sessionGoal = {
        label: 'Session',
        name: `Level ${skillState.level + 1} ${targetSkillId.charAt(0).toUpperCase() + targetSkillId.slice(1)}`,
        emoji: '⭐',
        progress: sessionProgress,
        subtext: `${formatNumber(xpNeeded - xpIntoLevel)} XP to go`,
    };

    const nextDecade = Math.ceil((skillState.level + 1) / 10) * 10;
    const targetLevel = Math.min(99, nextDecade > skillState.level ? nextDecade : skillState.level + 10);
    const grindGoal = {
        label: 'The Grind',
        name: `Lv. ${skillState.level} → Lv. ${targetLevel}`,
        emoji: '🏆',
        progress: (skillState.level / targetLevel) * 100,
        subtext: `${skillState.level}/${targetLevel} levels`,
    };

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    paddingVertical: Spacing.sm,
                    backgroundColor: palette.bgCard,
                },
                scrollContent: {
                    paddingHorizontal: Spacing.sm,
                    gap: Spacing.xs,
                    paddingBottom: 2,
                },
                cardContainer: {
                    width: 140,
                    minHeight: 88,
                    borderRadius: Radius.md,
                    overflow: 'hidden',
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                },
                cardGradient: {
                    flex: 1,
                    padding: 1,
                },
                glassInner: {
                    flex: 1,
                    backgroundColor: 'rgba(27, 30, 41, 0.85)',
                    borderRadius: Radius.md - 1,
                    padding: Spacing.sm,
                },
                cardHeader: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: Spacing.xs,
                },
                goalLabel: {
                    fontSize: 9,
                    fontWeight: '900',
                    color: palette.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                },
                emojiCircle: {
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                goalEmoji: { fontSize: 10 },
                goalName: {
                    fontSize: FontSize.sm,
                    fontWeight: 'bold',
                    color: palette.white,
                    marginBottom: 6,
                },
                progressWrapper: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 4,
                },
                progressBg: {
                    flex: 1,
                    height: 4,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 2,
                    overflow: 'hidden',
                },
                progressFill: {
                    height: '100%',
                    backgroundColor: palette.white,
                    borderRadius: 2,
                    shadowColor: '#fff',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                },
                progressText: {
                    fontSize: 9,
                    color: palette.white,
                    fontWeight: '900',
                    width: 22,
                },
                subtext: {
                    fontSize: 9,
                    color: palette.textSecondary,
                    fontStyle: 'italic',
                    opacity: 0.8,
                },
            }),
        [palette]
    );

    const GoalCard = ({ goal, colors }: { goal: any, colors: readonly [string, string, ...string[]] }) => (
        <View style={styles.cardContainer}>
            <LinearGradient colors={colors} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.glassInner}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.goalLabel}>{goal.label}</Text>
                        <View style={styles.emojiCircle}>
                            <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                        </View>
                    </View>
                    <Text style={styles.goalName} numberOfLines={1}>{goal.name}</Text>

                    <View style={styles.progressWrapper}>
                        <View style={styles.progressBg}>
                            <View style={[styles.progressFill, { width: `${Math.max(2, goal.progress)}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{Math.floor(goal.progress)}%</Text>
                    </View>

                    <Text style={styles.subtext}>{goal.subtext}</Text>
                </View>
            </LinearGradient>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={140 + Spacing.xs}
                decelerationRate="fast"
            >
                <GoalCard goal={immediateGoal} colors={[palette.accentPrimary, palette.accentDim] as const} />
                <GoalCard goal={sessionGoal} colors={[palette.gold, palette.goldDim] as const} />
                <GoalCard goal={grindGoal} colors={[palette.purple, '#6c3483'] as const} />
            </ScrollView>
        </View>
    );
};

