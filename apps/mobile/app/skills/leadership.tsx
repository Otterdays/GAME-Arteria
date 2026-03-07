import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { BouncyButton } from '@/components/BouncyButton';
import { useIdleSoundscape } from '@/hooks/useIdleSoundscape';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { SKILL_META } from '@/constants/skills';
import { COMPANIONS, CompanionDef } from '@/constants/companions';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { gameActions } from '@/store/gameSlice';
import { Spacing, Radius, FontSize } from '@/constants/theme';
import { MINING_NODES } from '@/constants/mining';
import { LOGGING_NODES } from '@/constants/logging';
import { SCAVENGING_NODES } from '@/constants/scavenging';

/**
 * Leadership Screen (Companion System)
 * [TRACE: DOCU/COMPANIONS.md]
 */
export default function LeadershipScreen() {
    const { palette } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const player = useAppSelector((s) => s.game.player);
    const skill = player.skills['leadership'];
    const meta = SKILL_META['leadership'];

    useIdleSoundscape('leadership');

    const onNext = () => router.replace(`/skills/${getNextSkill('leadership')}`);
    const onPrev = () => router.replace(`/skills/${getPrevSkill('leadership')}`);

    const activeCompanionsCount = Object.values(player.companions || {}).filter(c => c.isActive).length;
    // Leadership 20 -> 1, 35 -> 2, 50 -> 3
    const maxCompanions = skill.level >= 50 ? 3 : skill.level >= 35 ? 2 : skill.level >= 20 ? 1 : 0;

    const [selectedCompanionId, setSelectedCompanionId] = React.useState<string | null>(null);

    const ALL_TASKS = [...MINING_NODES, ...LOGGING_NODES, ...SCAVENGING_NODES];

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
                        <Text style={[styles.rosterText, { color: palette.textSecondary }]}>
                            Active Roster: {activeCompanionsCount} / {maxCompanions}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: palette.textSecondary }]}>Available Wandering Souls</Text>

                {COMPANIONS.map((companion: CompanionDef) => {
                    const isUnlocked = skill.level >= companion.levelReq;
                    const isHired = player.companions && !!player.companions[companion.id];

                    return (
                        <View
                            key={companion.id}
                            style={[
                                styles.companionCard,
                                { backgroundColor: palette.bgCard, borderColor: isUnlocked ? meta.color : palette.border },
                                !isUnlocked && styles.lockedCard
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.companionEmoji}>{companion.emoji}</Text>
                                <View style={styles.cardTitleWrap}>
                                    <Text style={[styles.companionName, { color: isUnlocked ? palette.textPrimary : palette.textSecondary }]}>
                                        {companion.name}
                                    </Text>
                                    <Text style={[styles.companionReq, { color: isUnlocked ? meta.color : palette.red }]}>
                                        Lv. {companion.levelReq} Leadership Required
                                    </Text>
                                </View>
                                {isUnlocked && (
                                    <View style={[styles.statusBadge, { backgroundColor: isHired ? '#10b981' : '#3b82f6' }]}>
                                        <Text style={styles.statusText}>{isHired ? 'HIRED' : 'AVAIL'}</Text>
                                    </View>
                                )}
                            </View>

                            <Text style={[styles.companionDesc, { color: palette.textSecondary }]}>
                                {companion.description}
                            </Text>

                            <View style={[styles.traitBox, { backgroundColor: palette.bgApp, borderLeftColor: meta.color }]}>
                                <Text style={[styles.traitLabel, { color: meta.color }]}>PRIMARY TRAIT</Text>
                                <Text style={[styles.traitText, { color: palette.textPrimary }]}>{companion.trait}</Text>
                            </View>

                            <BouncyButton
                                disabled={!isUnlocked}
                                style={[
                                    styles.actionButton,
                                    { backgroundColor: isUnlocked ? (isHired ? '#10b981' : meta.color) : palette.border }
                                ]}
                                onPress={() => {
                                    if (!isHired) {
                                        dispatch(gameActions.hireCompanion({ companionId: companion.id }));
                                    } else {
                                        dispatch(gameActions.toggleCompanionActive({ companionId: companion.id }));
                                    }
                                }}
                            >
                                <Text style={styles.actionButtonText}>
                                    {!isUnlocked ? 'Locked' : !isHired ? 'Hire Soul' : player.companions?.[companion.id]?.isActive ? 'Dismiss From Roster' : 'Activate Soul'}
                                </Text>
                            </BouncyButton>

                            {isHired && player.companions?.[companion.id]?.isActive && (
                                <View style={styles.missionRow}>
                                    <View style={styles.missionStatus}>
                                        <Text style={[styles.missionLabel, { color: palette.textSecondary }]}>CURRENT TASK</Text>
                                        <Text style={[styles.missionValue, { color: palette.textPrimary }]}>
                                            {player.companions?.[companion.id]?.assignedTaskId
                                                ? ALL_TASKS.find(t => t.id === player.companions?.[companion.id]?.assignedTaskId)?.name || 'Processing...'
                                                : 'Idle'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.assignButton, { borderColor: meta.color }]}
                                        onPress={() => setSelectedCompanionId(companion.id)}
                                    >
                                        <Text style={[styles.assignText, { color: meta.color }]}>ASSIGN</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}

                <View style={styles.footerInfo}>
                    <Text style={[styles.footerText, { color: palette.textSecondary }]}>
                        Companions level up their own skills while active. Higher Leadership levels unlock more concurrent soul slots.
                    </Text>
                </View>
            </ScrollView>

            <Modal visible={!!selectedCompanionId} transparent animationType="slide">
                <Pressable style={styles.modalOverlay} onPress={() => setSelectedCompanionId(null)}>
                    <View style={[styles.modalContent, { backgroundColor: palette.bgCard }]}>
                        <Text style={[styles.modalTitle, { color: palette.textPrimary }]}>Assign Passive Task</Text>
                        <Text style={[styles.modalSubtitle, { color: palette.textSecondary }]}>
                            Companions work at reduced efficiency but consume no items.
                        </Text>

                        <ScrollView style={styles.taskList}>
                            {ALL_TASKS.map(task => {
                                const comp = player.companions?.[selectedCompanionId!];
                                const isCurrent = comp?.assignedTaskId === task.id;
                                const canDo = (comp?.skills as any)?.[task.id.includes('ore') ? 'mining' : task.id.includes('log') ? 'logging' : 'scavenging']?.level >= task.levelReq;

                                return (
                                    <TouchableOpacity
                                        key={task.id}
                                        disabled={!canDo}
                                        style={[
                                            styles.taskItem,
                                            { borderColor: palette.border },
                                            isCurrent && { borderColor: meta.color, backgroundColor: meta.color + '11' },
                                            !canDo && { opacity: 0.4 }
                                        ]}
                                        onPress={() => {
                                            dispatch(gameActions.assignCompanionTask({ companionId: selectedCompanionId!, taskId: task.id }));
                                            setSelectedCompanionId(null);
                                        }}
                                    >
                                        <Text style={styles.taskEmoji}>{task.emoji}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.taskName, { color: palette.textPrimary }]}>{task.name}</Text>
                                            <Text style={[styles.taskReq, { color: canDo ? palette.textSecondary : palette.red }]}>
                                                Req. Lv. {task.levelReq} {task.id.includes('ore') ? 'Mining' : task.id.includes('log') ? 'Logging' : 'Scavenging'}
                                            </Text>
                                        </View>
                                        {isCurrent && <Text style={{ color: meta.color, fontWeight: 'bold' }}>ACTIVE</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <BouncyButton style={styles.closeButton} onPress={() => setSelectedCompanionId(null)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </BouncyButton>
                    </View>
                </Pressable>
            </Modal>
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
    rosterText: { fontSize: 14, fontWeight: '600' },
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    companionCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
    },
    lockedCard: { opacity: 0.6 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    companionEmoji: { fontSize: 32, marginRight: 12 },
    cardTitleWrap: { flex: 1 },
    companionName: { fontSize: 18, fontWeight: 'bold' },
    companionReq: { fontSize: 12, fontWeight: '600', marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    companionDesc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
    traitBox: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderLeftWidth: 3,
    },
    traitLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 4, letterSpacing: 0.5 },
    traitText: { fontSize: 13, fontWeight: '600' },
    missionRow: {
        marginTop: Spacing.md,
        padding: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: Radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    missionStatus: { flex: 1 },
    missionLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
    missionValue: { fontSize: 14, fontWeight: 'bold' },
    assignButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
    },
    assignText: { fontSize: 12, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        padding: Spacing.xl,
        height: '70%',
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
    modalSubtitle: { fontSize: 14, marginBottom: Spacing.lg },
    taskList: { flex: 1 },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1,
        marginBottom: Spacing.sm,
    },
    taskEmoji: { fontSize: 24, marginRight: Spacing.md },
    taskName: { fontSize: 16, fontWeight: 'bold' },
    taskReq: { fontSize: 12, marginTop: 2 },
    closeButton: {
        backgroundColor: '#ef4444',
        padding: Spacing.md,
        borderRadius: Radius.md,
        marginTop: Spacing.md,
        alignItems: 'center',
    },
    closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    actionButton: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    footerInfo: { marginTop: 10, paddingBottom: 40 },
    footerText: { textAlign: 'center', fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
});
