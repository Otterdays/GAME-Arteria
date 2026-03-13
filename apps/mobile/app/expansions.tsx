import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { EXPANSION_PACKS, ExpansionId } from '@/constants/expansions';
import { useTheme } from '@/contexts/ThemeContext';

export default function ExpansionsScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    
    const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
    const unlockedExpansions = useAppSelector((s) => s.game.player.settings?.unlockedExpansions ?? {});

    const handleUnlock = (id: ExpansionId) => {
        if (id === 'exp1') {
            dispatch(gameActions.setPatron(true));
        } else {
            dispatch(gameActions.unlockExpansion(id));
        }
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
                backButton: {
                    alignSelf: 'flex-start',
                    paddingVertical: Spacing.sm,
                    paddingRight: Spacing.md,
                },
                backText: {
                    fontSize: FontSize.base,
                    color: palette.accentPrimary,
                    fontWeight: '600',
                },
                title: {
                    fontSize: FontSize.xl,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                subtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 2,
                },
                scroll: { flex: 1 },
                scrollContent: {
                    padding: Spacing.md,
                    paddingBottom: Spacing['2xl'],
                },
                expansionCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    borderWidth: 1,
                    borderColor: palette.border,
                    padding: Spacing.xl,
                    marginBottom: Spacing.xl,
                },
                expansionTitle: {
                    fontSize: FontSize.xl,
                    fontWeight: '700',
                    color: palette.textPrimary,
                    marginBottom: Spacing.xs,
                },
                expansionDesc: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginBottom: Spacing.md,
                },
                featureList: {
                    marginBottom: Spacing.md,
                },
                featureItem: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginBottom: Spacing.xs,
                },
                expansionPrice: {
                    fontSize: FontSize.lg,
                    color: palette.gold,
                    fontWeight: '600',
                    marginBottom: Spacing.md,
                },
                activeBadge: {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.xs,
                    borderRadius: Radius.full,
                    backgroundColor: 'rgba(255,202,40,0.2)',
                    borderWidth: 1,
                    borderColor: palette.gold,
                    alignSelf: 'flex-start',
                },
                activeBadgeText: {
                    color: palette.gold,
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                },
                buyButton: {
                    backgroundColor: palette.gold,
                    paddingVertical: Spacing.md,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                },
                buyButtonText: {
                    color: '#000',
                    fontSize: FontSize.base,
                    fontWeight: '700',
                },
            }),
        [palette]
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backText}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Expansions</Text>
                <Text style={styles.subtitle}>Unlock new horizons in Aetheria.</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {Object.values(EXPANSION_PACKS).map((pack) => {
                    const isUnlocked = pack.id === 'exp1' ? isPatron : unlockedExpansions[pack.id];

                    return (
                        <View key={pack.id} style={styles.expansionCard}>
                            <Text style={styles.expansionTitle}>{pack.title}</Text>
                            <Text style={styles.expansionDesc}>{pack.description}</Text>
                            
                            <View style={styles.featureList}>
                                {pack.features.map((feat, idx) => (
                                    <Text key={idx} style={styles.featureItem}>• {feat}</Text>
                                ))}
                            </View>

                            <Text style={styles.expansionPrice}>{pack.price}</Text>

                            {isUnlocked ? (
                                <View style={styles.activeBadge}>
                                    <Text style={styles.activeBadgeText}>Unlocked</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.buyButton}
                                    onPress={() => handleUnlock(pack.id as ExpansionId)}
                                >
                                    <Text style={styles.buyButtonText}>Purchase {pack.title}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
