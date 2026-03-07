import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { BouncyButton } from '@/components/BouncyButton';
import { useIdleSoundscape } from '@/hooks/useIdleSoundscape';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { SKILL_META } from '@/constants/skills';
import { SLAYER_MONSTERS, SlayerMonster } from '@/constants/slayer';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { XP_TABLE, gameActions } from '@/store/gameSlice';

/**
 * Slayer Screen (Task-based monster hunting)
 * [TRACE: ROADMAP Phase 4 Groundwork]
 */
export default function SlayerScreen() {
    const { palette } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const player = useAppSelector((s) => s.game.player);
    const skill = player.skills['slayer'];
    const meta = SKILL_META['slayer'];
    const currentTask = player.slayerTask;

    useIdleSoundscape('slayer');

    const onNext = () => router.replace(`/skills/${getNextSkill('slayer')}`);
    const onPrev = () => router.replace(`/skills/${getPrevSkill('slayer')}`);

    const currentLevelXp = XP_TABLE[skill.level - 1] || 0;
    const nextLevelXp = XP_TABLE[skill.level] || XP_TABLE[98];
    const progressInLevel = skill.xp - currentLevelXp;
    const xpNeededForLevel = nextLevelXp - currentLevelXp;
    const progressPercent = Math.min(100, Math.max(0, (progressInLevel / xpNeededForLevel) * 100));

    return (
        <View style={[styles.container, { backgroundColor: palette.bgApp }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header with Navigation */}
            <View style={[styles.header, { backgroundColor: palette.bgCard }]}>
                <View style={styles.headerTop}>
                    <BouncyButton onPress={onPrev} style={styles.navButton}>
                        <Text style={[styles.navArrow, { color: palette.textSecondary }]}>←</Text>
                    </BouncyButton>

                    <View style={styles.titleContainer}>
                        <Text style={styles.emojiText}>{meta.emoji}</Text>
                        <Text style={[styles.titleText, { color: palette.textPrimary }]}>{meta.label}</Text>
                    </View>

                    <BouncyButton onPress={onNext} style={styles.navButton}>
                        <Text style={[styles.navArrow, { color: palette.textSecondary }]}>→</Text>
                    </BouncyButton>
                </View>

                <View style={styles.xpInfo}>
                    <View style={[styles.levelBadge, { borderColor: meta.color }]}>
                        <Text style={[styles.levelText, { color: meta.color }]}>{skill.level}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={{ height: 6 }}>
                            <ProgressBarWithPulse
                                progress={skill.xp}
                                fillColor={meta.color}
                                widthPercent={progressPercent}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Active Task Section */}
                <View style={styles.activeTaskSection}>
                    <Text style={[styles.sectionTitle, { color: palette.textSecondary }]}>Your Current Bounty</Text>
                    <View style={[styles.taskCard, { backgroundColor: palette.bgCard, borderColor: meta.color }]}>
                        {!currentTask ? (
                            <View style={styles.noTaskWrap}>
                                <Text style={styles.noTaskEmoji}>🎯</Text>
                                <Text style={[styles.noTaskTitle, { color: palette.textPrimary }]}>No Slayer Task</Text>
                                <Text style={[styles.noTaskSubtitle, { color: palette.textSecondary }]}>
                                    Find a Slayer Master in the world to receive a monster bounty.
                                </Text>
                                <BouncyButton
                                    onPress={() => dispatch(gameActions.startDialogue({ treeId: 'dt_slayer_master', startNodeId: 'node_1' }))}
                                >
                                    <Text style={styles.actionButtonText}>Seek Master Mark</Text>
                                </BouncyButton>
                            </View>
                        ) : (
                            <View style={styles.activeTaskWrap}>
                                <View style={styles.taskLabelRow}>
                                    <Text style={[styles.taskMonsterName, { color: palette.textPrimary }]}>
                                        {SLAYER_MONSTERS.find(m => m.id === currentTask.monsterId)?.name || 'Unknown Monster'}
                                    </Text>
                                    <Text style={[styles.taskAmount, { color: meta.color }]}>
                                        {currentTask.currentAmount} / {currentTask.targetAmount}
                                    </Text>
                                </View>
                                <View style={{ height: 12 }}>
                                    <ProgressBarWithPulse
                                        progress={currentTask.currentAmount}
                                        fillColor={meta.color}
                                        widthPercent={(currentTask.currentAmount / currentTask.targetAmount) * 100}
                                    />
                                </View>
                                <Text style={[styles.taskNote, { color: palette.textSecondary }]}>
                                    Kills in combat contribute to your Slayer bounty.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Master's Bestiary Section */}
                <Text style={[styles.sectionTitle, { color: palette.textSecondary }]}>The Slayer's Bestiary</Text>
                {SLAYER_MONSTERS.map((monster: SlayerMonster) => {
                    const isUnlocked = skill.level >= monster.levelReq;
                    return (
                        <View
                            key={monster.id}
                            style={[
                                styles.monsterRow,
                                { backgroundColor: palette.bgCard, borderLeftWidth: 4, borderLeftColor: isUnlocked ? meta.color : palette.border },
                                !isUnlocked && styles.lockedMonster
                            ]}
                        >
                            <View style={styles.monsterMain}>
                                <Text style={[styles.monsterName, { color: isUnlocked ? palette.textPrimary : palette.textSecondary }]}>
                                    {monster.name}
                                </Text>
                                <Text style={[styles.monsterLocations, { color: palette.textSecondary }]}>
                                    {monster.locations.join(', ')}
                                </Text>
                            </View>
                            <View style={styles.monsterStats}>
                                <Text style={[styles.monsterLevelReq, { color: isUnlocked ? meta.color : palette.red }]}>
                                    Lv. {monster.levelReq}
                                </Text>
                                <Text style={[styles.monsterXp, { color: palette.textSecondary }]}>
                                    {monster.slayerXpPerKill} XP
                                </Text>
                            </View>
                        </View>
                    );
                })}

                <View style={styles.footerNote}>
                    <Text style={[styles.footerText, { color: palette.textSecondary }]}>
                        Slayer tasks grant Slayer XP and Slayer Coins upon completion. Exclusive combat instances are locked behind Slayer levels.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    navArrow: { fontSize: 24, fontWeight: 'bold' },
    titleContainer: { flexDirection: 'row', alignItems: 'center' },
    emojiText: { fontSize: 28, marginRight: 10 },
    titleText: { fontSize: 22, fontWeight: 'bold', letterSpacing: 0.5 },
    xpInfo: { flexDirection: 'row', alignItems: 'center' },
    levelBadge: {
        backgroundColor: '#000',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginRight: 10,
    },
    levelText: { fontWeight: 'bold', fontSize: 16 },
    progressContainer: { flex: 1 },
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    activeTaskSection: { marginBottom: 30 },
    taskCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    noTaskWrap: { alignItems: 'center', paddingVertical: 10 },
    noTaskEmoji: { fontSize: 48, marginBottom: 12 },
    noTaskTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    noTaskSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 16, paddingHorizontal: 20 },
    activeTaskWrap: { paddingVertical: 5 },
    taskLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
    taskMonsterName: { fontSize: 20, fontWeight: 'bold' },
    taskAmount: { fontSize: 18, fontWeight: '800' },
    taskNote: { fontSize: 12, marginTop: 12, fontStyle: 'italic', textAlign: 'center' },
    monsterRow: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    monsterMain: { flex: 1 },
    monsterName: { fontSize: 16, fontWeight: 'bold' },
    monsterLocations: { fontSize: 12, marginTop: 2 },
    monsterStats: { alignItems: 'flex-end' },
    monsterLevelReq: { fontSize: 14, fontWeight: '800' },
    monsterXp: { fontSize: 11, fontWeight: '600', marginTop: 2 },
    lockedMonster: { opacity: 0.4 },
    actionButton: {
        height: 48,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    footerNote: { marginTop: 20, padding: 20, opacity: 0.7 },
    footerText: { textAlign: 'center', fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
});
