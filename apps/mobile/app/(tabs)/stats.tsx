/**
 * Detailed Stats screen — "The Tome of Records"
 * Premium overhaul with 6 themed sections and achievement tracking.
 */
import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector } from '@/store/hooks';
import { getItemMeta } from '@/constants/items';
import { ACHIEVEMENTS } from '@/constants/achievements';
import { ENEMIES } from '@/constants/enemies';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { FloatingParticles } from '@/components/FloatingParticles';

const { width } = Dimensions.get('window');

const STAT_LABELS: Record<string, { label: string; icon: string }> = {
    ore: { label: 'Ores Mined', icon: '🪨' },
    log: { label: 'Logs Chopped', icon: '🌳' },
    fish: { label: 'Fish Caught', icon: '🐟' },
    food: { label: 'Food Cooked', icon: '🍤' },
    potion: { label: 'Potions Brewed', icon: '🧪' },
    rune: { label: 'Runes Crafted', icon: '✨' },
    bar: { label: 'Bars Smelted', icon: '⚙️' },
    equipment: { label: 'Equipment Forged', icon: '⚔️' },
    harvest: { label: 'Crops Harvested', icon: '🌾' }, // Future-proofing
    scavenge: { label: 'Scrap Scavenged', icon: '🔩' }, // Future-proofing
    other: { label: 'Other Activities', icon: '📦' },
};

function formatDate(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function daysBetween(a: number, b: number): number {
    return Math.floor((b - a) / (24 * 60 * 60 * 1000));
}

export default function StatsScreen() {
    const { palette, themeId } = useTheme();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const scrollRef = useRef<ScrollView>(null);
    const sectionLayouts = useRef<Record<string, number>>({});

    const stats = player.stats ?? { byType: {}, firstPlayedAt: Date.now(), lastPlayedAt: Date.now() };
    const lifetime = player.lifetimeStats ?? {
        enemiesDefeated: 0,
        totalGoldEarned: 0,
        totalDeaths: 0,
        highestHit: 0,
        totalItemsProduced: 0,
        byItem: {},
        totalXpGained: 0,
        totalFoodEaten: 0,
        totalBonesBuried: 0,
        totalSlayerTasksCompleted: 0,
        highestRefineLevel: 0
    };
    const now = Date.now();

    // --- Data Calculations ---

    const totalLevel = useMemo(() => {
        return Object.values(player.skills).reduce((acc, s) => acc + s.level, 0);
    }, [player.skills]);

    const totalXp = useMemo(() => {
        return Object.values(player.skills).reduce((acc, s) => acc + s.xp, 0);
    }, [player.skills]);

    const bestiaryProgress = useMemo(() => {
        const seen = player.seenEnemies?.length ?? 0;
        const total = Object.keys(ENEMIES).length;
        return { seen, total };
    }, [player.seenEnemies]);

    const sortedGathering = useMemo(() => {
        const entries = Object.entries(stats.byType ?? {}).filter(([, v]) => (v ?? 0) > 0);
        return entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    }, [stats.byType]);

    const topProduced = useMemo(() => {
        const entries = Object.entries(lifetime.byItem ?? {}).filter(([, v]) => (v ?? 0) > 0);
        return entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)).slice(0, 8);
    }, [lifetime.byItem]);

    const scrollToSection = (id: string) => {
        const y = sectionLayouts.current[id];
        if (y !== undefined) {
            scrollRef.current?.scrollTo({ y: y - 20, animated: true });
        }
    };

    const styles = useMemo(() => StyleSheet.create({
        container: { flex: 1, backgroundColor: palette.bgApp },
        header: {
            padding: Spacing.xl,
            paddingBottom: Spacing.md,
            backgroundColor: palette.bgCard,
            borderBottomWidth: 1,
            borderBottomColor: palette.border,
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: FontSize.lg,
            color: palette.gold,
            fontFamily: FontCinzelBold,
            textShadowColor: 'rgba(212, 175, 55, 0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        headerSubtitle: {
            fontSize: FontSize.xs,
            color: palette.textSecondary,
            marginTop: 4,
            letterSpacing: 0.5,
        },
        pillsScroll: {
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            backgroundColor: palette.bgCard,
            borderBottomWidth: 1,
            borderBottomColor: palette.border,
        },
        pill: {
            paddingHorizontal: Spacing.md,
            paddingVertical: 6,
            borderRadius: Radius.full,
            backgroundColor: palette.bgCardHover,
            marginRight: Spacing.xs,
            borderWidth: 1,
            borderColor: palette.border,
        },
        pillText: {
            fontSize: FontSize.xs,
            color: palette.textSecondary,
            fontFamily: FontCinzelBold,
        },
        scroll: { paddingBottom: insets.bottom + Spacing['2xl'] },
        section: {
            margin: Spacing.md,
            marginBottom: Spacing.sm,
            backgroundColor: palette.glassBg,
            borderRadius: Radius.lg,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: palette.glassBorder,
        },
        sectionHeader: {
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            flexDirection: 'row',
            alignItems: 'center',
        },
        sectionTitle: {
            fontSize: FontSize.sm,
            color: '#FFFFFF',
            fontFamily: FontCinzelBold,
            marginLeft: 8,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        sectionContent: {
            padding: Spacing.md,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: Spacing.xs,
        },
        rowLabel: { fontSize: FontSize.sm, color: palette.textSecondary },
        rowValue: { fontSize: FontSize.sm, color: palette.textPrimary, fontWeight: '700' },
        rowValueGold: { fontSize: FontSize.sm, color: palette.gold, fontWeight: '700' },

        // Items Display
        itemRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: palette.bgCardHover,
            padding: 10,
            borderRadius: Radius.md,
            marginBottom: Spacing.xs,
            borderWidth: 1,
            borderColor: palette.border,
        },
        itemLabelWrap: { flexDirection: 'row', alignItems: 'center' },
        itemEmoji: { fontSize: FontSize.base, marginRight: 8 },
        itemLabel: { fontSize: FontSize.sm, color: palette.textPrimary },
        itemCount: { fontSize: FontSize.sm, color: palette.gold, fontWeight: '700' },

        // Quests
        questCard: {
            backgroundColor: palette.bgCardHover,
            padding: 12,
            borderRadius: Radius.md,
            borderWidth: 1,
            borderColor: palette.border,
            marginBottom: Spacing.sm,
        },
        questHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
        questTitle: { fontSize: FontSize.sm, color: palette.textPrimary, fontWeight: '600', flex: 1 },
        questStatus: { fontSize: FontSize.xs, fontWeight: 'bold' },
        progressBarBg: { height: 6, backgroundColor: palette.bgApp, borderRadius: 3, overflow: 'hidden' },
        progressBarFill: { height: '100%', backgroundColor: palette.accentPrimary },
        questProgressText: { fontSize: FontSize.xs, color: palette.textSecondary, marginTop: 4, textAlign: 'right' },

        // Achievements
        achievementsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        achievementCardBase: {
            width: (width - Spacing.md * 4 - 8) / 2,
            aspectRatio: 1,
            backgroundColor: palette.bgCardHover,
            borderRadius: Radius.md,
            padding: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
            borderWidth: 1,
            borderColor: palette.border,
        },
        achievementEmoji: { fontSize: 32, marginBottom: 8 },
        achievementTitle: { fontSize: FontSize.xs, color: palette.textPrimary, fontFamily: FontCinzelBold, textAlign: 'center' },
        achievementLocked: { opacity: 0.4 },
        achievementLockIcon: { position: 'absolute', top: 4, right: 4 },
    }), [palette, insets]);

    const renderRow = (label: string, value: string | number, isGold = false) => (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            {typeof value === 'number' ? (
                <AnimatedNumber
                    style={isGold ? styles.rowValueGold : styles.rowValue}
                    value={value}
                    formatValue={(v) => v.toLocaleString() + (isGold ? ' gp' : '')}
                />
            ) : (
                <Text style={isGold ? styles.rowValueGold : styles.rowValue}>{value}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
                <FloatingParticles color={palette.gold} count={8} />
                <Text style={styles.headerTitle}>📖 The Anchor's Tome of Records</Text>
                <Text style={styles.headerSubtitle}>Character Biography & Lifetime History</Text>
            </View>

            {/* Quick-jump pills */}
            <View style={styles.pillsScroll}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['Overview', 'Gathering', 'Production', 'Combat', 'Quests', 'Achievements'].map((t) => (
                        <TouchableOpacity key={t} style={styles.pill} onPress={() => scrollToSection(t)}>
                            <Text style={styles.pillText}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Overview */}
                <View
                    style={styles.section}
                    onLayout={(e) => sectionLayouts.current['Overview'] = e.nativeEvent.layout.y}
                >
                    <LinearGradient colors={['#4a4a4a', '#2a2a2a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>⚔️ Adventurer Overview</Text>
                    </LinearGradient>
                    <View style={styles.sectionContent}>
                        {renderRow('Total Level', `${totalLevel} / 2475`)}
                        {renderRow('Total Experience', totalXp)}
                        {renderRow('Lifetime Gold', lifetime.totalGoldEarned, true)}
                        {renderRow('Lumina Balance', player.lumina ?? 0)}
                        {renderRow('Cosmic Weight', `${((player.cosmicWeightXPBonus ?? 0) * 100).toFixed(2)}%`)}
                        {renderRow('First Played', formatDate(stats.firstPlayedAt))}
                        {renderRow('Days Active', `${daysBetween(stats.firstPlayedAt, now)} days`)}
                    </View>
                </View>

                {/* 2. Gathering */}
                <View
                    style={styles.section}
                    onLayout={(e) => sectionLayouts.current['Gathering'] = e.nativeEvent.layout.y}
                >
                    <LinearGradient colors={['#27ae60', '#1e8449']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🌱 Gathering Records</Text>
                    </LinearGradient>
                    <View style={styles.sectionContent}>
                        {sortedGathering.length === 0 ? (
                            <Text style={[styles.rowLabel, { textAlign: 'center' }]}>No gathering data found.</Text>
                        ) : (
                            sortedGathering.map(([type, count]) => {
                                const meta = STAT_LABELS[type] ?? STAT_LABELS.other;
                                return (
                                    <View key={type} style={styles.itemRow}>
                                        <View style={styles.itemLabelWrap}>
                                            <Text style={styles.itemEmoji}>{meta.icon}</Text>
                                            <Text style={styles.itemLabel}>{meta.label}</Text>
                                        </View>
                                        <AnimatedNumber value={count ?? 0} style={styles.itemCount} formatValue={(v) => v.toLocaleString()} />
                                    </View>
                                );
                            })
                        )}
                    </View>
                </View>

                {/* 3. Production */}
                <View
                    style={styles.section}
                    onLayout={(e) => sectionLayouts.current['Production'] = e.nativeEvent.layout.y}
                >
                    <LinearGradient colors={['#e67e22', '#d35400']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🔨 Crafting & Production</Text>
                    </LinearGradient>
                    <View style={styles.sectionContent}>
                        {topProduced.length === 0 ? (
                            <Text style={[styles.rowLabel, { textAlign: 'center' }]}>No production data yet.</Text>
                        ) : (
                            topProduced.map(([id, qty]) => {
                                const meta = getItemMeta(id);
                                return (
                                    <View key={id} style={styles.itemRow}>
                                        <View style={styles.itemLabelWrap}>
                                            <Text style={styles.itemEmoji}>{meta.emoji}</Text>
                                            <Text style={styles.itemLabel}>{meta.label}</Text>
                                        </View>
                                        <AnimatedNumber value={qty ?? 0} style={styles.itemCount} formatValue={(v) => v.toLocaleString()} />
                                    </View>
                                );
                            })
                        )}
                    </View>
                </View>

                {/* 4. Combat */}
                <View
                    style={styles.section}
                    onLayout={(e) => sectionLayouts.current['Combat'] = e.nativeEvent.layout.y}
                >
                    <LinearGradient colors={['#c0392b', '#922b21']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>☠️ Combat Records</Text>
                    </LinearGradient>
                    <View style={styles.sectionContent}>
                        {renderRow('Enemies Defeated', lifetime.enemiesDefeated)}
                        {renderRow('Slayer Tasks Done', lifetime.totalSlayerTasksCompleted ?? 0)}
                        {renderRow('Total Deaths', lifetime.totalDeaths)}
                        {renderRow('Highest Hit', lifetime.highestHit)}
                        {renderRow('Highest Refinement', `+${lifetime.highestRefineLevel ?? 0}`)}
                        {renderRow('Bestiary Progress', `${bestiaryProgress.seen} / ${bestiaryProgress.total}`)}
                        {player.activeCombat && renderRow('Session Kills', player.activeCombat.killCount)}
                    </View>
                </View>

                {/* 5. Quests */}
                <View
                    style={styles.section}
                    onLayout={(e) => sectionLayouts.current['Quests'] = e.nativeEvent.layout.y}
                >
                    <LinearGradient colors={['#3498db', '#2980b9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📅 Daily Quest Tracker</Text>
                    </LinearGradient>
                    <View style={styles.sectionContent}>
                        {renderRow('All-time Daily Quests', player.totalDailyQuestsCompleted ?? 0)}
                        {renderRow('Bones Buried', lifetime.totalBonesBuried ?? 0)}
                        {renderRow('Food Consumed', lifetime.totalFoodEaten ?? 0)}

                        <Text style={[styles.sectionTitle, { color: palette.textSecondary, marginBottom: 8, marginLeft: 0, marginTop: 12 }]}>Today's Progress</Text>
                        {!player.dailyQuests?.quests || player.dailyQuests.quests.length === 0 ? (
                            <Text style={[styles.rowLabel, { textAlign: 'center' }]}>No active quests today.</Text>
                        ) : (
                            player.dailyQuests.quests.map((q) => {
                                const progress = Math.min(1, q.current / q.objective.quantity);
                                return (
                                    <View key={q.id} style={styles.questCard}>
                                        <View style={styles.questHeader}>
                                            <Text style={styles.questTitle} numberOfLines={1}>{q.label}</Text>
                                            <Text style={[styles.questStatus, { color: q.completed ? palette.green : palette.textSecondary }]}>
                                                {q.completed ? '✓ DONE' : 'IN PROGRESS'}
                                            </Text>
                                        </View>
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: q.completed ? palette.green : palette.accentPrimary }]} />
                                        </View>
                                        <Text style={styles.questProgressText}>{q.current} / {q.objective.quantity}</Text>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </View>

                {/* 6. Achievements */}
                <View
                    style={styles.section}
                    onLayout={(e) => sectionLayouts.current['Achievements'] = e.nativeEvent.layout.y}
                >
                    <LinearGradient colors={['#f1c40f', '#f39c12']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🏆 Titles & Achievements</Text>
                    </LinearGradient>
                    <View style={styles.sectionContent}>
                        <View style={styles.achievementsGrid}>
                            {ACHIEVEMENTS.map((ach) => {
                                const isUnlocked = ach.check(player);
                                return (
                                    <View
                                        key={ach.id}
                                        style={[
                                            styles.achievementCardBase,
                                            !isUnlocked && styles.achievementLocked,
                                            isUnlocked && { borderColor: palette.gold, shadowColor: palette.gold, shadowOpacity: 0.3, shadowRadius: 5, elevation: 3 }
                                        ]}
                                    >
                                        {!isUnlocked && <Text style={styles.achievementLockIcon}>🔒</Text>}
                                        <Text style={styles.achievementEmoji}>{ach.emoji}</Text>
                                        <Text style={styles.achievementTitle}>{isUnlocked ? ach.title : '???'}</Text>
                                        <Text style={[styles.rowLabel, { fontSize: 10, textAlign: 'center', marginTop: 4 }]} numberOfLines={2}>
                                            {isUnlocked ? ach.description : 'Undiscovered'}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}
