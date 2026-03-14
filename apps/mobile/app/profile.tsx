/**
 * Profile screen — local-first account hub.
 * Identity, progress snapshot, rewards/entitlements, quick actions.
 * [TRACE: account-screen-plan]
 */

import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Pressable,
    Platform,
    Modal,
    TextInput,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { getDisplayName, PROTAGONIST_CANONICAL_NAME } from '@/constants/character';
import { getLoginBonusStatus } from '@/constants/loginBonus';
import { SKILL_PETS } from '@/constants/pets';

function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function formatNumber(n: number): string {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
    return n.toLocaleString();
}

export default function ProfileScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const player = useAppSelector((s) => s.game.player);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [nicknameEdit, setNicknameEdit] = useState('');

    const displayName = getDisplayName(player.name);
    const isPatron = player.settings?.isPatron ?? false;
    const activePetId = player.pets?.activePetId ?? null;
    const activePetEmoji = activePetId ? SKILL_PETS[activePetId]?.emoji : null;
    const unlockedTitles = player.unlockedTitles ?? [];
    const selectedTitle = player.selectedTitle;
    const displayTitle = selectedTitle && unlockedTitles.includes(selectedTitle)
        ? selectedTitle
        : unlockedTitles[0] ?? null;
    const lumina = player.lumina ?? 0;
    const stats = player.stats ?? { byType: {}, firstPlayedAt: Date.now(), lastPlayedAt: Date.now() };
    const lifetime = player.lifetimeStats ?? {
        enemiesDefeated: 0,
        totalGoldEarned: 0,
        totalDeaths: 0,
        highestHit: 0,
        totalItemsProduced: 0,
        byItem: {},
    };
    const loginBonus = player.loginBonus ?? { lastClaimDate: null, consecutiveDays: 0 };
    const loginStatus = getLoginBonusStatus(loginBonus.lastClaimDate, loginBonus.consecutiveDays);
    const unlockedExpansions = player.settings?.unlockedExpansions ?? {};
    const expansionCount = Object.values(unlockedExpansions).filter(Boolean).length + (isPatron ? 1 : 0);
    const xpBoostExpiresAt = player.xpBoostExpiresAt ?? 0;
    const hasXpBoost = xpBoostExpiresAt > Date.now();

    const totalLevel = useMemo(
        () => Object.values(player.skills).reduce((acc, s) => acc + s.level, 0),
        [player.skills]
    );

    const openNicknameModal = () => {
        setNicknameEdit(player.name || '');
        setNicknameModalOpen(true);
    };

    const saveNickname = () => {
        dispatch(gameActions.setPlayerName(nicknameEdit.trim()));
        setNicknameModalOpen(false);
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                backButton: { alignSelf: 'flex-start', paddingVertical: Spacing.sm, paddingRight: Spacing.md },
                backText: { fontSize: FontSize.base, color: palette.accentPrimary, fontWeight: '600' },
                title: { fontSize: FontSize.xl, fontFamily: FontCinzelBold, color: palette.textPrimary },
                subtitle: { fontSize: FontSize.sm, color: palette.textSecondary, marginTop: 2 },
                scroll: { flex: 1 },
                scrollContent: { padding: Spacing.md, paddingBottom: Spacing['2xl'] },
                sectionTitle: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.md,
                    color: palette.accentWeb,
                    marginBottom: Spacing.sm,
                    marginTop: Spacing.lg,
                },
                heroCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    borderWidth: 1,
                    borderColor: palette.border,
                    padding: Spacing.lg,
                    alignItems: 'center',
                },
                heroName: { fontFamily: FontCinzelBold, fontSize: FontSize.xl, color: palette.textPrimary },
                heroSub: { fontSize: FontSize.sm, color: palette.textSecondary, marginTop: 2 },
                heroBadges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.sm, marginTop: Spacing.md },
                badge: {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: Radius.full,
                    backgroundColor: palette.bgInput,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                badgeText: { fontSize: FontSize.xs, color: palette.textSecondary, fontWeight: '600' },
                badgeGold: { borderColor: palette.gold, backgroundColor: `${palette.gold}20` },
                badgeGoldText: { color: palette.gold },
                statCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    padding: Spacing.md,
                    marginBottom: Spacing.md,
                },
                statRow: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.divider,
                },
                statRowLast: { borderBottomWidth: 0 },
                statLabel: { fontSize: FontSize.sm, color: palette.textSecondary },
                statValue: { fontSize: FontSize.sm, fontWeight: '700', color: palette.textPrimary },
                actionRow: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: palette.bgCard,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.divider,
                },
                actionRowFirst: { borderTopLeftRadius: Radius.md, borderTopRightRadius: Radius.md },
                actionRowLast: { borderBottomLeftRadius: Radius.md, borderBottomRightRadius: Radius.md, borderBottomWidth: 0 },
                actionCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    overflow: 'hidden',
                    marginBottom: Spacing.md,
                },
                rowInfo: { flex: 1, marginRight: Spacing.md },
                rowLabel: { fontSize: FontSize.base, color: palette.textPrimary, fontWeight: '500' },
                rowDesc: { fontSize: FontSize.xs, color: palette.textSecondary, marginTop: 2 },
                arrow: { fontSize: 20, color: palette.textSecondary, fontWeight: '600' },
                modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: Spacing.lg },
                modalCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                input: {
                    backgroundColor: palette.bgInput,
                    borderRadius: Radius.md,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    fontSize: FontSize.base,
                    color: palette.textPrimary,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.md,
                },
                modalBtnRow: { flexDirection: 'row', gap: Spacing.sm },
                modalBtn: { flex: 1, paddingVertical: 12, borderRadius: Radius.md, alignItems: 'center' },
                modalBtnPrimary: { backgroundColor: palette.accentPrimary },
                modalBtnSecondary: { borderWidth: 1, borderColor: palette.border },
                modalBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: palette.white },
                modalBtnTextSecondary: { color: palette.textSecondary },
            }),
        [palette]
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ title: 'Profile', headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
                    <Text style={styles.backText}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.subtitle}>Your identity and progress in Aetheria.</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Hero */}
                <Text style={styles.sectionTitle}>Identity</Text>
                <View style={styles.heroCard}>
                    <Text style={styles.heroName}>{displayName}</Text>
                    <Text style={styles.heroSub}>You are {PROTAGONIST_CANONICAL_NAME}</Text>
                    <View style={styles.heroBadges}>
                        {activePetEmoji && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{activePetEmoji} Pet</Text>
                            </View>
                        )}
                        {isPatron && (
                            <View style={[styles.badge, styles.badgeGold]}>
                                <Text style={[styles.badgeText, styles.badgeGoldText]}>Patron</Text>
                            </View>
                        )}
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Total Lv. {totalLevel}</Text>
                        </View>
                        {displayTitle && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{displayTitle}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Progress Snapshot */}
                <Text style={styles.sectionTitle}>Progress</Text>
                <View style={styles.statCard}>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Total gold earned</Text>
                        <Text style={styles.statValue}>{formatNumber(lifetime.totalGoldEarned)}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Lumina</Text>
                        <Text style={[styles.statValue, { color: palette.gold }]}>{lumina.toLocaleString()}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Enemies defeated</Text>
                        <Text style={styles.statValue}>{formatNumber(lifetime.enemiesDefeated)}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Highest hit</Text>
                        <Text style={styles.statValue}>{lifetime.highestHit}</Text>
                    </View>
                    <View style={[styles.statRow, styles.statRowLast]}>
                        <Text style={styles.statLabel}>Items produced</Text>
                        <Text style={styles.statValue}>{formatNumber(lifetime.totalItemsProduced)}</Text>
                    </View>
                </View>
                <View style={styles.statCard}>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>First played</Text>
                        <Text style={styles.statValue}>{formatDate(stats.firstPlayedAt)}</Text>
                    </View>
                    <View style={[styles.statRow, styles.statRowLast]}>
                        <Text style={styles.statLabel}>Last played</Text>
                        <Text style={styles.statValue}>{formatDate(stats.lastPlayedAt)}</Text>
                    </View>
                </View>

                {/* Rewards & Entitlements */}
                <Text style={styles.sectionTitle}>Rewards & Entitlements</Text>
                <View style={styles.statCard}>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Login streak</Text>
                        <Text style={styles.statValue}>
                            Day {loginBonus.consecutiveDays}/7
                            {loginStatus.canClaim ? ' · Claim now!' : ''}
                        </Text>
                    </View>
                    {hasXpBoost && (
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>XP boost</Text>
                            <Text style={[styles.statValue, { color: palette.gold }]}>Active</Text>
                        </View>
                    )}
                    <View style={[styles.statRow, styles.statRowLast]}>
                        <Text style={styles.statLabel}>Expansions unlocked</Text>
                        <Text style={styles.statValue}>{expansionCount}</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionCard}>
                    <Pressable
                        style={[styles.actionRow, styles.actionRowFirst]}
                        onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); openNicknameModal(); }}
                        android_ripple={{ color: palette.bgCardHover }}
                    >
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowLabel}>Edit nickname</Text>
                            <Text style={styles.rowDesc}>Change what friends call you</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </Pressable>
                    <Pressable
                        style={styles.actionRow}
                        onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/pets'); }}
                        android_ripple={{ color: palette.bgCardHover }}
                    >
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowLabel}>Pets</Text>
                            <Text style={styles.rowDesc}>Manage skill pets</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </Pressable>
                    <Pressable
                        style={styles.actionRow}
                        onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/expansions'); }}
                        android_ripple={{ color: palette.bgCardHover }}
                    >
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowLabel}>Expansions</Text>
                            <Text style={styles.rowDesc}>Unlock new content</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.actionRow, styles.actionRowLast]}
                        onPress={() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/patch-notes'); }}
                        android_ripple={{ color: palette.bgCardHover }}
                    >
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowLabel}>Patch notes</Text>
                            <Text style={styles.rowDesc}>Version history</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Nickname edit modal */}
            <Modal visible={nicknameModalOpen} transparent animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setNicknameModalOpen(false)}>
                    <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                        <Text style={[styles.rowLabel, { marginBottom: Spacing.sm }]}>Change nickname</Text>
                        <Text style={[styles.rowDesc, { marginBottom: Spacing.md }]}>
                            You are {PROTAGONIST_CANONICAL_NAME}. What should friends call you?
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nickname"
                            placeholderTextColor={palette.textMuted}
                            value={nicknameEdit}
                            onChangeText={setNicknameEdit}
                            autoCapitalize="words"
                            maxLength={24}
                        />
                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnPrimary]}
                                onPress={saveNickname}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.modalBtnText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnSecondary]}
                                onPress={() => setNicknameModalOpen(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.modalBtnText, styles.modalBtnTextSecondary]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
