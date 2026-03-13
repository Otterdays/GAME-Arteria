/**
 * World Map — Explore Valdoria. Tap a location to travel (instant).
 * [TRACE: DOCU/WORLD_EXPLORATION.md]
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Spacing, FontSize, Radius, CardStyle, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector } from '@/store/hooks';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LOCATIONS, meetsLocationRequirement } from '@/constants/locations';
import { isFeatureInProgress, LOCATION_TO_FEATURE } from '@/constants/comingSoon';
import { ComingSoonBadge } from '@/components/ComingSoonBadge';

function getLockReason(loc: (typeof LOCATIONS)[0]): string {
    switch (loc.unlockType) {
        case 'quest':
            return `Requires: ${loc.unlockValue}`;
        case 'level':
            return `Requires Exploration level ${loc.unlockValue}`;
        case 'calendar':
            return loc.unlockValue === 'dec' ? 'Visit during Voidmas (December)' : 'Seasonal';
        case 'event':
            return 'Opens during events';
        default:
            return '';
    }
}

function createStyles(palette: Record<string, string>) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: palette.bgApp },
        header: {
            padding: Spacing.md,
            paddingBottom: Spacing.sm,
            backgroundColor: palette.bgCard,
            borderBottomWidth: 1,
            borderBottomColor: palette.border,
        },
        headerTitle: {
            fontFamily: FontCinzelBold,
            fontSize: FontSize.xl,
            color: palette.textPrimary,
        },
        headerSubtitle: {
            fontSize: FontSize.sm,
            color: palette.textSecondary,
            marginTop: 2,
        },
        scrollContent: {
            padding: Spacing.md,
            paddingBottom: Spacing['2xl'],
        },
        locationCard: {
            backgroundColor: palette.bgCard,
            ...CardStyle,
            borderColor: palette.border,
            padding: Spacing.md,
            marginBottom: Spacing.sm,
        },
        locationCardLocked: {
            opacity: 0.7,
            borderStyle: 'dashed',
        },
        locationHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            marginBottom: 4,
        },
        locationEmoji: { fontSize: 32 },
        locationName: {
            fontFamily: FontCinzelBold,
            fontSize: FontSize.lg,
            color: palette.textPrimary,
            flex: 1,
        },
        locationDesc: {
            fontSize: FontSize.sm,
            color: palette.textSecondary,
            marginBottom: 4,
        },
        lockBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
        },
        lockText: {
            fontSize: FontSize.xs,
            color: palette.textMuted,
            fontStyle: 'italic',
        },
        youAreHere: {
            fontSize: FontSize.xs,
            fontWeight: '700',
            color: palette.accentPrimary,
            marginTop: 4,
        },
    });
}

export default function ExploreScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { palette } = useTheme();
    const player = useAppSelector((s) => s.game.player);
    const styles = useMemo(() => createStyles(palette), [palette]);

    const explorationLevel = player.skills?.exploration?.level ?? 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>World Map</Text>
                <Text style={styles.headerSubtitle}>Tap a location to travel. Where do you want to be?</Text>
            </View>

            <View style={[styles.header, { marginHorizontal: Spacing.md, marginTop: 0, marginBottom: Spacing.sm, borderRadius: Radius.lg }]}>
                <Text style={styles.headerTitle}>Exploration Lv. {explorationLevel}</Text>
                <Text style={styles.headerSubtitle}>Train Exploration to survey tougher regions and unlock new locations.</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {LOCATIONS.map((loc) => {
                    const unlocked = meetsLocationRequirement(player, loc);
                    const isCrownlands = loc.id === 'crownlands';

                    return (
                        <Pressable
                            key={loc.id}
                            style={({ pressed }) => [
                                styles.locationCard,
                                !unlocked && styles.locationCardLocked,
                                { opacity: pressed ? 0.85 : 1 },
                            ]}
                            onPress={() => {
                                if (Platform.OS !== 'web') {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }
                                router.push(`/location/${loc.id}`);
                            }}
                        >
                            <View style={styles.locationHeader}>
                                <Text style={styles.locationEmoji}>{loc.emoji}</Text>
                                <Text style={styles.locationName}>{loc.name}</Text>
                                {!unlocked && (
                                    <IconSymbol name="lock.fill" size={18} color={palette.textMuted} />
                                )}
                            </View>
                            <Text style={styles.locationDesc}>{loc.description}</Text>
                            {unlocked && isCrownlands && (
                                <Text style={styles.youAreHere}>You are here</Text>
                            )}
                            {!unlocked && (
                                <View style={styles.lockBadge}>
                                    <ComingSoonBadge
                                        inProgress={!!(LOCATION_TO_FEATURE[loc.id] && isFeatureInProgress(LOCATION_TO_FEATURE[loc.id]))}
                                        size="sm"
                                    />
                                    <Text style={styles.lockText}>{getLockReason(loc)}</Text>
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}
