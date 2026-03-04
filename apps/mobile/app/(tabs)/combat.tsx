import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Spacing, FontSize, Radius, CardStyle } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector } from '@/store/hooks';
import { ENEMIES } from '@/constants/enemies';

export default function CombatScreen() {
    const { palette } = useTheme();
    const seenEnemies = useAppSelector((s) => s.game.player.seenEnemies ?? []);
    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                header: {
                    paddingHorizontal: Spacing.md,
                    paddingTop: Spacing.xl,
                    paddingBottom: Spacing.md,
                },
                title: {
                    fontSize: FontSize.xl,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                content: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.xl,
                },
                emoji: { fontSize: 64, marginBottom: Spacing.md },
                comingSoon: {
                    fontSize: FontSize.lg,
                    fontWeight: '700',
                    color: palette.accentPrimary,
                    marginBottom: Spacing.sm,
                },
                description: {
                    fontSize: FontSize.base,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    lineHeight: 22,
                },
                teaserCard: {
                    marginTop: Spacing.xl,
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor: palette.border,
                    maxWidth: 320,
                    ...CardStyle,
                },
                teaserTitle: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.accentWeb,
                    marginBottom: 4,
                },
                teaserText: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    lineHeight: 20,
                },
                bestiarySection: {
                    marginTop: Spacing.xl,
                    width: '100%',
                    maxWidth: 320,
                },
                bestiaryTitle: {
                    fontSize: FontSize.md,
                    fontWeight: '700',
                    color: palette.accentWeb,
                    marginBottom: Spacing.sm,
                },
                bestiaryCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.md,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.sm,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                },
                bestiaryEmpty: {
                    fontSize: FontSize.sm,
                    color: palette.textMuted,
                    fontStyle: 'italic',
                },
            }),
        [palette]
    );

    const spottedEnemies = seenEnemies
        .map((id) => ENEMIES[id])
        .filter(Boolean);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Combat</Text>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl }}>
                <Text style={styles.emoji}>⚔️</Text>
                <Text style={styles.comingSoon}>Coming Soon</Text>
                <Text style={styles.description}>
                    Auto-battler combat with melee, ranged, and magic styles.
                    Defeat enemies, collect loot, and conquer dungeons.
                </Text>
                <View style={styles.teaserCard}>
                    <Text style={styles.teaserTitle}>Phase 4 — Combat Alpha</Text>
                    <Text style={styles.teaserText}>
                        Loadouts, weapon stats, and first enemies are in the roadmap. Stay tuned.
                    </Text>
                </View>

                {spottedEnemies.length > 0 && (
                    <View style={styles.bestiarySection}>
                        <Text style={styles.bestiaryTitle}>📖 Enemies Spotted</Text>
                        {spottedEnemies.map((e) => (
                            <View key={e.id} style={styles.bestiaryCard}>
                                <Text style={{ fontSize: 28 }}>👹</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: FontSize.base, fontWeight: '700', color: palette.textPrimary }}>{e.name}</Text>
                                    <Text style={{ fontSize: FontSize.xs, color: palette.textSecondary }}>
                                        Lv. {e.level ?? 1} · {e.description ?? 'First seen during skilling.'}
                                    </Text>
                                    {e.locations && e.locations.length > 0 && (
                                        <Text style={{ fontSize: FontSize.xs, color: palette.textMuted, marginTop: 2 }}>
                                            Found in: {e.locations.map((l) => l.name).join(', ')}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                {spottedEnemies.length === 0 && (
                    <View style={styles.bestiarySection}>
                        <Text style={styles.bestiaryTitle}>📖 Enemies Spotted</Text>
                        <Text style={styles.bestiaryEmpty}>No enemies spotted yet. Keep training — they may peek out from the shadows.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

