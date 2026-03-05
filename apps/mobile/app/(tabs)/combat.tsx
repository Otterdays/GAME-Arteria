import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, Radius, CardStyle } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector } from '@/store/hooks';
import { ENEMIES } from '@/constants/enemies';
import { isFeatureInProgress } from '@/constants/comingSoon';
import { ComingSoonBadge } from '@/components/ComingSoonBadge';

export default function CombatScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const seenEnemies = useAppSelector((s) => s.game.player.seenEnemies ?? []);
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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Combat</Text>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl }}>
                <Text style={styles.emoji}>⚔️</Text>
                <View style={{ marginBottom: Spacing.sm }}>
                    <ComingSoonBadge inProgress={isFeatureInProgress('combat_phase4')} size="md" />
                </View>
                <Text style={styles.description}>
                    Auto-battler combat with melee, ranged, and magic styles.
                    Defeat enemies, collect loot, and conquer dungeons.
                </Text>
                <View style={styles.teaserCard}>
                    <Text style={styles.teaserTitle}>Phase 4 — Combat Alpha</Text>
                    <Text style={styles.teaserText}>
                        Goblin spotted first. Loadouts, weapon stats, and more enemies coming soon.
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
        </View>
    );
}

