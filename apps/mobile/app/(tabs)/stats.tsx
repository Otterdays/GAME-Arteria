/**
 * Detailed stats screen — total gathered by type, first/last play, etc.
 * [TRACE: ROADMAP QoL — Detailed Statistics]
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector } from '@/store/hooks';

const STAT_LABELS: Record<string, string> = {
    ore: 'Ores mined',
    log: 'Logs chopped',
    fish: 'Fish caught',
    food: 'Food cooked',
    potion: 'Potions brewed',
    rune: 'Runes crafted',
    bar: 'Bars smelted',
    equipment: 'Equipment forged',
    other: 'Other items',
};

function formatDate(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function daysBetween(a: number, b: number): number {
    return Math.floor((b - a) / (24 * 60 * 60 * 1000));
}

export default function StatsScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const player = useAppSelector((s) => s.game.player);
    const stats = player.stats ?? { byType: {}, firstPlayedAt: Date.now(), lastPlayedAt: Date.now() };
    const now = Date.now();

    const sortedStats = useMemo(() => {
        const entries = Object.entries(stats.byType ?? {}).filter(([, v]) => v > 0);
        return entries.sort((a, b) => b[1] - a[1]);
    }, [stats.byType]);

    const totalItems = useMemo(() => {
        return Object.values(stats.byType ?? {}).reduce((s, n) => s + n, 0);
    }, [stats.byType]);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                scroll: { padding: Spacing.md, paddingBottom: Spacing['2xl'] },
                header: {
                    padding: Spacing.md,
                    paddingBottom: Spacing.sm,
                    backgroundColor: palette.bgCard,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                title: {
                    fontSize: FontSize.xl,
                    fontWeight: '800',
                    color: palette.textPrimary,
                },
                subtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 4,
                },
                section: { marginTop: Spacing.xl },
                sectionTitle: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.accentPrimary,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginBottom: Spacing.sm,
                },
                row: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.md,
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.md,
                    marginBottom: Spacing.xs,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                rowLabel: { fontSize: FontSize.base, color: palette.textPrimary },
                rowValue: { fontSize: FontSize.base, fontWeight: '700', color: palette.gold },
            }),
        [palette]
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Statistics</Text>
                <Text style={styles.subtitle}>Lifetime gathering and play time</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Play time</Text>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>First played</Text>
                    <Text style={styles.rowValue}>{formatDate(stats.firstPlayedAt)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Last played</Text>
                    <Text style={styles.rowValue}>{formatDate(stats.lastPlayedAt)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Days since first play</Text>
                    <Text style={styles.rowValue}>{daysBetween(stats.firstPlayedAt, now)} days</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Total items gathered</Text>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>All items</Text>
                    <Text style={styles.rowValue}>{totalItems.toLocaleString()}</Text>
                </View>
                {sortedStats.map(([type, count]) => (
                    <View key={type} style={styles.row}>
                        <Text style={styles.rowLabel}>{STAT_LABELS[type] ?? type}</Text>
                        <Text style={styles.rowValue}>{count.toLocaleString()}</Text>
                    </View>
                ))}
            </View>
            </ScrollView>
        </View>
    );
}
