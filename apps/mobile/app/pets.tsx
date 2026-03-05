import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { SKILL_PETS, ALL_PET_IDS } from '@/constants/pets';
import * as Haptics from 'expo-haptics';

export default function PetsScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const unlockedPets = useAppSelector((s) => s.game.player.pets?.unlocked ?? []);
    const activePetId = useAppSelector((s) => s.game.player.pets?.activePetId ?? null);

    const handleEquip = (petId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (activePetId === petId) {
            dispatch(gameActions.setActivePet(null));
        } else {
            dispatch(gameActions.setActivePet(petId));
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
                    fontFamily: FontCinzelBold,
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
                emptyState: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 60,
                },
                emptyEmoji: {
                    fontSize: 48,
                    marginBottom: Spacing.md,
                    opacity: 0.5,
                },
                emptyText: {
                    fontSize: FontSize.lg,
                    color: palette.textSecondary,
                    fontWeight: '600',
                },
                emptySubtext: {
                    fontSize: FontSize.sm,
                    color: palette.textMuted,
                    textAlign: 'center',
                    marginTop: Spacing.sm,
                    paddingHorizontal: Spacing.xl,
                },
                petCard: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    padding: Spacing.md,
                    marginBottom: Spacing.md,
                },
                petCardActive: {
                    borderColor: palette.gold,
                    backgroundColor: 'rgba(255, 202, 40, 0.05)',
                },
                petEmojiContainer: {
                    width: 50,
                    height: 50,
                    borderRadius: Radius.full,
                    backgroundColor: palette.bgInput,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                petEmoji: {
                    fontSize: 28,
                },
                petInfo: {
                    flex: 1,
                },
                petName: {
                    fontSize: FontSize.lg,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                petDesc: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 4,
                },
                equipButton: {
                    paddingVertical: 6,
                    paddingHorizontal: Spacing.md,
                    borderRadius: Radius.sm,
                    backgroundColor: palette.accentPrimary,
                    justifyContent: 'center',
                },
                unequipButton: {
                    backgroundColor: palette.bgInput,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                equipText: {
                    color: palette.white,
                    fontWeight: '700',
                    fontSize: FontSize.sm,
                },
                unequipText: {
                    color: palette.textSecondary,
                },
                lockedCard: {
                    opacity: 0.5,
                },
                lockedName: {
                    color: palette.textMuted,
                },
            }),
        [palette]
    );

    const unlockedSet = new Set(unlockedPets);

    // Sort so unlocked are first, then alphabetical
    const sortedPets = [...ALL_PET_IDS].sort((a, b) => {
        const aUnlocked = unlockedSet.has(a);
        const bUnlocked = unlockedSet.has(b);
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return SKILL_PETS[a].name.localeCompare(SKILL_PETS[b].name);
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                >
                    <Text style={styles.backText}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Skill Pets</Text>
                <Text style={styles.subtitle}>Rare companions found while gathering and crafting.</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {sortedPets.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🥚</Text>
                        <Text style={styles.emptyText}>No pets available.</Text>
                    </View>
                ) : (
                    sortedPets.map((id) => {
                        const pet = SKILL_PETS[id];
                        const isUnlocked = unlockedSet.has(id);
                        const isActive = activePetId === id;

                        return (
                            <View
                                key={id}
                                style={[
                                    styles.petCard,
                                    isActive && styles.petCardActive,
                                    !isUnlocked && styles.lockedCard
                                ]}
                            >
                                <View style={styles.petEmojiContainer}>
                                    <Text style={styles.petEmoji}>{isUnlocked ? pet.emoji : '❓'}</Text>
                                </View>
                                <View style={styles.petInfo}>
                                    <Text style={[styles.petName, !isUnlocked && styles.lockedName]}>
                                        {isUnlocked ? pet.name : 'Unknown Pet'}
                                    </Text>
                                    <Text style={styles.petDesc}>
                                        {isUnlocked ? pet.description : `Keep training ${pet.skillId} to discover this pet.`}
                                    </Text>
                                </View>

                                {isUnlocked && (
                                    <TouchableOpacity
                                        style={[styles.equipButton, isActive && styles.unequipButton]}
                                        onPress={() => handleEquip(id)}
                                    >
                                        <Text style={[styles.equipText, isActive && styles.unequipText]}>
                                            {isActive ? 'Unequip' : 'Equip'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}
