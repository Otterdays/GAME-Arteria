import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
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
    harvesting: '🪴',
    scavenging: '🏕️',
    attack: '⚔️',
    strength: '💪',
    defence: '🛡️',
    hitpoints: '❤️',
};

export const HorizonHUD = () => {
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
        name: `Reach Lv. ${targetLevel}`,
        emoji: '🏆',
        progress: (skillState.level / targetLevel) * 100,
        subtext: 'Chapter Milestone',
    };

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
                snapToInterval={180 + Spacing.sm}
                decelerationRate="fast"
            >
                <GoalCard goal={immediateGoal} colors={[Palette.accentPrimary, Palette.accentDim] as const} />
                <GoalCard goal={sessionGoal} colors={[Palette.gold, Palette.goldDim] as const} />
                <GoalCard goal={grindGoal} colors={[Palette.purple, '#6c3483'] as const} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.sm,
        backgroundColor: Palette.bgCard,
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
        paddingBottom: 4,
    },
    cardContainer: {
        width: 180,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    cardGradient: {
        flex: 1,
        padding: 1, // Border effect
    },
    glassInner: {
        flex: 1,
        backgroundColor: 'rgba(27, 30, 41, 0.85)',
        borderRadius: Radius.lg - 1,
        padding: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: Palette.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    emojiCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalEmoji: {
        fontSize: 12,
    },
    goalName: {
        fontSize: FontSize.base,
        fontWeight: 'bold',
        color: Palette.white,
        marginBottom: 12,
    },
    progressWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    progressBg: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Palette.white,
        borderRadius: 3,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    progressText: {
        fontSize: 10,
        color: Palette.white,
        fontWeight: '900',
        width: 26,
    },
    subtext: {
        fontSize: 10,
        color: Palette.textSecondary,
        fontStyle: 'italic',
        opacity: 0.8,
    },
});
