/**
 * Location detail screen — NPCs, Shop, Quests per location.
 * [TRACE: DOCU/WORLD_EXPLORATION.md]
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Spacing, FontSize, Radius, CardStyle, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { BouncyButton } from '@/components/BouncyButton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getLocationById, meetsLocationRequirement } from '@/constants/locations';
import { isFeatureInProgress, LOCATION_TO_FEATURE } from '@/constants/comingSoon';
import { ComingSoonBadge } from '@/components/ComingSoonBadge';

const TOWN_NPCS: { id: string; name: string; emoji: string; treeId: string }[] = [
    { id: 'guard', name: 'Confused Gate Guard', emoji: '🛡️', treeId: 'dt_guard_intro' },
    { id: 'nick', name: 'Nick — Merchant', emoji: '🏪', treeId: 'dt_nick_shop' },
    { id: 'bianca', name: 'Bianca the Herbalist', emoji: '🌿', treeId: 'dt_bianca_herbalist' },
    { id: 'kate', name: 'Kate the Traveler', emoji: '🧭', treeId: 'dt_kate_traveler' },
];

function ComingSoonBanner({
    label,
    locationId,
    styles,
}: {
    label: string;
    locationId?: string;
    styles: ReturnType<typeof createStyles>;
}) {
    const { palette } = useTheme();
    const featureId = locationId ? LOCATION_TO_FEATURE[locationId] : undefined;
    const inProgress = featureId ? isFeatureInProgress(featureId) : false;
    return (
        <View style={[styles.comingSoonBanner, { backgroundColor: palette.bgCardHover, borderColor: palette.border }]}>
            <ComingSoonBadge inProgress={inProgress} size="md" />
            <Text style={[styles.comingSoonText, { color: palette.textMuted, marginLeft: Spacing.sm }]}>{label}</Text>
        </View>
    );
}

function createStyles(palette: Record<string, string>) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: palette.bgApp },
        scroll: { flex: 1 },
        scrollContent: { padding: Spacing.md, paddingBottom: Spacing['2xl'] },
        header: {
            paddingBottom: Spacing.md,
            marginBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: palette.border,
        },
        headerEmoji: { fontSize: 48, marginBottom: 4 },
        headerTitle: {
            fontFamily: FontCinzelBold,
            fontSize: FontSize.xl,
            color: palette.textPrimary,
        },
        headerDesc: {
            fontSize: FontSize.sm,
            color: palette.textSecondary,
            marginTop: 4,
        },
        section: { marginBottom: Spacing.xl },
        sectionTitle: {
            fontFamily: FontCinzelBold,
            fontSize: FontSize.md,
            color: palette.accentWeb,
            letterSpacing: 1.2,
            marginBottom: Spacing.sm,
        },
        card: {
            backgroundColor: palette.bgCard,
            ...CardStyle,
            borderColor: palette.border,
            padding: Spacing.md,
            marginBottom: Spacing.sm,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
        },
        cardTitle: {
            fontSize: FontSize.lg,
            fontWeight: '700',
            color: palette.textPrimary,
        },
        comingSoonBanner: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            padding: Spacing.md,
            borderRadius: Radius.sm,
            borderWidth: 1,
            marginBottom: Spacing.sm,
        },
        comingSoonText: {
            fontSize: FontSize.sm,
            fontStyle: 'italic',
        },
        backBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingVertical: Spacing.sm,
            paddingHorizontal: 0,
        },
    });
}

export default function LocationScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { palette } = useTheme();
    const player = useAppSelector((s) => s.game.player);
    const styles = useMemo(() => createStyles(palette), [palette]);

    const location = id ? getLocationById(id) : null;
    const unlocked = location ? meetsLocationRequirement(player, location) : false;

    if (!location) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <Pressable
                    onPress={() => {
                        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                    style={styles.backBtn}
                >
                    <IconSymbol name="chevron.left" size={24} color={palette.accentPrimary} />
                    <Text style={{ color: palette.accentPrimary, fontSize: FontSize.sm }}>Back</Text>
                </Pressable>
                <Text style={[styles.headerTitle, { padding: Spacing.md }]}>Unknown location</Text>
            </View>
        );
    }

    const isCrownlands = location.id === 'crownlands';
    const hasNpcs = location.npcIds.length > 0;
    const hasShop = location.shopId !== null;
    const hasQuests = location.questIds.length > 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Pressable
                onPress={() => {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.back();
                }}
                style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
                <IconSymbol name="chevron.left" size={24} color={palette.accentPrimary} />
                <Text style={{ color: palette.accentPrimary, fontSize: FontSize.sm }}>World Map</Text>
            </Pressable>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>{location.emoji}</Text>
                    <Text style={styles.headerTitle}>{location.name}</Text>
                    <Text style={styles.headerDesc}>{location.description}</Text>
                </View>

                {!unlocked ? (
                    <View style={[styles.comingSoonBanner, { backgroundColor: palette.bgCardHover, borderColor: palette.border }]}>
                        <IconSymbol name="lock.fill" size={20} color={palette.textMuted} />
                        <Text style={[styles.comingSoonText, { color: palette.textMuted }]}>
                            Locked. Complete requirements to unlock.
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* NPCs */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>NPCs</Text>
                            {isCrownlands && hasNpcs ? (
                                TOWN_NPCS.map((npc) => (
                                    <View key={npc.id} style={styles.card}>
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.cardTitle}>{npc.emoji} {npc.name}</Text>
                                        </View>
                                        <BouncyButton
                                            style={{ alignSelf: 'flex-start' }}
                                            onPress={() =>
                                                dispatch(gameActions.startDialogue({ treeId: npc.treeId, startNodeId: 'node_1' }))
                                            }
                                        >
                                            <Text style={{ color: palette.white, fontWeight: '700', fontSize: FontSize.sm }}>
                                                💬 Talk
                                            </Text>
                                        </BouncyButton>
                                    </View>
                                ))
                            ) : (
                                <ComingSoonBanner label="NPCs" locationId={location.id} styles={styles} />
                            )}
                        </View>

                        {/* Shop */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Shop</Text>
                            {isCrownlands && hasShop ? (
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>🏪 Nick's Stall</Text>
                                    <Text style={{ fontSize: FontSize.sm, color: palette.textSecondary, marginTop: 4 }}>
                                        Buy supplies, sell loot. Visit the Shop tab.
                                    </Text>
                                    <BouncyButton
                                        style={{ alignSelf: 'flex-start', marginTop: Spacing.sm }}
                                        onPress={() => router.replace('/(tabs)/shop')}
                                    >
                                        <Text style={{ color: palette.white, fontWeight: '700', fontSize: FontSize.sm }}>
                                            Go to Shop
                                        </Text>
                                    </BouncyButton>
                                </View>
                            ) : (
                                <ComingSoonBanner label="Shop" locationId={location.id} styles={styles} />
                            )}
                        </View>

                        {/* Quests */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Quests</Text>
                            <ComingSoonBanner label="Location quests" locationId={location.id} styles={styles} />
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}
