import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, Radius, CardStyle, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, EquipSlot, CombatStyle } from '@/store/gameSlice';
import { ENEMIES } from '@/constants/enemies';
import { getItemMeta } from '@/constants/items';
import { PRAYERS, PRAYER_MAP } from '@/constants/prayers';
import { isFeatureInProgress } from '@/constants/comingSoon';
import { ComingSoonBadge } from '@/components/ComingSoonBadge';
import * as Haptics from 'expo-haptics';

const EQUIPMENT_SLOTS: { key: EquipSlot; label: string; icon: string }[] = [
    { key: 'head', label: 'Head', icon: '⛑️' },
    { key: 'amulet', label: 'Amulet', icon: '📿' },
    { key: 'body', label: 'Body', icon: '👕' },
    { key: 'weapon', label: 'Weapon', icon: '⚔️' },
    { key: 'shield', label: 'Shield', icon: '🛡️' },
    { key: 'legs', label: 'Legs', icon: '👖' },
    { key: 'feet', label: 'Feet', icon: '👢' },
    { key: 'ring', label: 'Ring', icon: '💍' },
];

const COMBAT_STYLES: { id: CombatStyle; name: string; emoji: string; desc: string }[] = [
    { id: 'controlled', name: 'Cont.', emoji: '⚖️', desc: 'All' },
    { id: 'accurate', name: 'Acc.', emoji: '🎯', desc: 'Atk' },
    { id: 'aggressive', name: 'Agg.', emoji: '💢', desc: 'Str' },
    { id: 'defensive', name: 'Def.', emoji: '🛡️', desc: 'Def' },
];

const COMBAT_ZONES = [
    { id: 'sunny_meadows_farm', name: 'Sunny Meadows Farm', icon: '🌾', description: 'A peaceful farm overrun by feral livestock. Great for early training.', tier: 1 },
    { id: 'goblin_house', name: 'Goblin House', icon: '🏚️', description: 'A rundown shack infested with thieving goblins.', tier: 1 },
    { id: 'whispering_woods_forest', name: 'Whispering Woods Forest', icon: '🌲', description: 'A dense forest home to packs of hunting woodland wolves.', tier: 1 },
    { id: 'frostfall_mountain', name: 'Frostfall Mountain', icon: '⛰️', description: 'A freezing peak roamed by fierce arctic wolves. Bring warm clothes.', tier: 2 },
];

export default function CombatScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const player = useAppSelector((s) => s.game.player);
    const seenEnemies = player.seenEnemies ?? [];
    const activeCombat = useAppSelector((s) => s.game.player.activeCombat);
    const combatLog = useAppSelector((s) => s.game.combatLog);
    const combatLogScrollRef = useRef<ScrollView>(null);

    const [activeTab, setActiveTab] = useState<'loadout' | 'battle' | 'bestiary' | 'prayer'>('loadout');
    const [selectedZone, setSelectedZone] = useState<string | null>(null);

    const prayerPoints = useAppSelector((s) => s.game.player.prayerPoints ?? 0);
    const maxPrayerPoints = useAppSelector((s) => s.game.player.maxPrayerPoints ?? 10);
    const activePrayerIds = useAppSelector((s) => s.game.player.activePrayers ?? []);
    const prayerLevel = useAppSelector((s) => s.game.player.skills?.prayer?.level ?? 1);

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
                    color: palette.textPrimary,
                    fontFamily: FontCinzelBold,
                },
                tabBar: {
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                tabButton: {
                    flex: 1,
                    paddingVertical: Spacing.md,
                    alignItems: 'center',
                },
                tabButtonActive: {
                    borderBottomWidth: 2,
                    borderBottomColor: palette.accentPrimary,
                },
                tabText: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.textSecondary,
                },
                tabTextActive: {
                    color: palette.accentPrimary,
                },
                scrollContent: {
                    flexGrow: 1,
                    padding: Spacing.md,
                    paddingBottom: Spacing.xl * 2,
                },

                // Loadout styles
                statsCard: {
                    ...CardStyle,
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.md,
                },
                statsTitle: {
                    fontSize: FontSize.md,
                    fontWeight: '700',
                    color: palette.accentPrimary,
                    fontFamily: FontCinzelBold,
                    marginBottom: Spacing.sm,
                },
                statsGrid: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                },
                statBox: {
                    width: '48%',
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    padding: Spacing.sm,
                    marginBottom: Spacing.sm,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                statLabel: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    marginBottom: 2,
                },
                statValue: {
                    fontSize: FontSize.md,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },

                slotCard: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.sm,
                },
                slotIcon: {
                    fontSize: 28,
                    width: 40,
                    textAlign: 'center',
                    marginRight: Spacing.md,
                },
                slotInfo: {
                    flex: 1,
                },
                slotLabel: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    textTransform: 'uppercase',
                    marginBottom: 2,
                },
                slotItemName: {
                    fontSize: FontSize.base,
                    fontWeight: '600',
                    color: palette.textPrimary,
                },
                slotEmptyText: {
                    fontSize: FontSize.base,
                    color: palette.textMuted,
                    fontStyle: 'italic',
                },
                unequipBtn: {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: 8,
                    borderRadius: Radius.md,
                    backgroundColor: palette.bgApp,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                unequipBtnText: {
                    fontSize: FontSize.xs,
                    fontWeight: '700',
                    color: palette.textSecondary,
                },

                // Bestiary & Battle styles
                placeholderCenter: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: Spacing.xl,
                },
                emoji: { fontSize: 64, marginBottom: Spacing.md },
                description: {
                    fontSize: FontSize.base,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    lineHeight: 22,
                    marginTop: Spacing.md,
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
                teaserCard: {
                    ...CardStyle,
                    marginTop: Spacing.xl,
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor: palette.border,
                    maxWidth: 320,
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

                // Zone Selection Styles
                zoneCard: {
                    ...CardStyle,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.sm,
                },
                zoneIcon: { fontSize: 32, marginRight: Spacing.md },
                zoneInfo: { flex: 1 },
                zoneName: { fontSize: FontSize.base, fontWeight: '700', color: palette.textPrimary },
                zoneDesc: { fontSize: FontSize.xs, color: palette.textSecondary, marginTop: 2 },
                zoneTier: { fontSize: FontSize.xs, fontWeight: '700', color: palette.gold, marginTop: 4 },
                zoneChevron: { fontSize: 24, color: palette.textMuted, marginLeft: Spacing.sm },

                backBtn: { alignSelf: 'flex-start', paddingVertical: Spacing.sm, paddingRight: Spacing.lg, marginBottom: Spacing.sm },
                backBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: palette.accentPrimary },

                zoneHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
                zoneHeaderIcon: { fontSize: 28, marginRight: Spacing.sm },
                zoneHeaderTitle: { fontSize: FontSize.lg, color: palette.textPrimary, fontFamily: FontCinzelBold },

                enemyCardContent: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
                enemyName: { fontSize: FontSize.base, fontWeight: '700', color: palette.textPrimary },
                enemyLevel: { fontSize: FontSize.xs, color: palette.textMuted, fontWeight: '400' },
                enemyDesc: { fontSize: FontSize.xs, color: palette.textSecondary, marginTop: 2, marginBottom: 4 },
                enemyStats: { fontSize: 10, fontWeight: '700', color: palette.accentWeb, letterSpacing: 0.5 },

                engageBtn: {
                    backgroundColor: palette.red + '22',
                    borderWidth: 1,
                    borderColor: palette.red,
                    paddingVertical: 10,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                },
                engageBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: palette.red },

                // Active Fight Styles
                fightContainer: { flex: 1, padding: Spacing.md },
                hpBarOuter: {
                    height: 20,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    overflow: 'hidden' as const,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginTop: 4,
                },
                hpBarInner: {
                    height: '100%' as any,
                    borderRadius: Radius.md,
                },
                hpLabel: { fontSize: FontSize.xs, fontWeight: '700', color: palette.textPrimary, marginTop: 2, textAlign: 'center' as const },
                atkTimerOuter: {
                    height: 6,
                    backgroundColor: palette.bgApp,
                    borderRadius: 3,
                    overflow: 'hidden' as const,
                    marginTop: 4,
                },
                atkTimerInner: {
                    height: '100%' as any,
                    borderRadius: 3,
                },
                fightHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: Spacing.sm },
                fleeBtn: {
                    backgroundColor: palette.red + '22',
                    borderWidth: 1,
                    borderColor: palette.red,
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: 8,
                    borderRadius: Radius.md,
                },
                fleeBtnText: { fontSize: FontSize.xs, fontWeight: '700', color: palette.red },
                killBadge: { fontSize: FontSize.xs, fontWeight: '700', color: palette.gold, textAlign: 'center' as const, marginTop: 4 },
                combatLogBox: {
                    flex: 1,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginTop: Spacing.md,
                    padding: Spacing.sm,
                    maxHeight: 200,
                },
                combatLogMsg: { fontSize: 11, lineHeight: 16 },
                vsText: { fontSize: FontSize.lg, fontWeight: '700', color: palette.textMuted, textAlign: 'center' as const, marginVertical: Spacing.sm },

                // Interactions (Style + Food)
                interactionsRow: {
                    flexDirection: 'row',
                    gap: Spacing.sm,
                    marginTop: Spacing.md,
                },
                styleCard: {
                    flex: 1,
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                    borderRadius: Radius.md,
                    padding: Spacing.sm,
                    alignItems: 'center',
                },
                styleCardActive: {
                    borderColor: palette.accentPrimary,
                    backgroundColor: palette.accentPrimary + '11',
                },
                styleEmoji: { fontSize: 20 },
                styleLabel: { fontSize: 10, fontWeight: '700', color: palette.textSecondary, marginTop: 4 },
                foodScroll: {
                    flexGrow: 0,
                    marginBottom: Spacing.sm,
                },
                foodCard: {
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                    borderRadius: Radius.md,
                    padding: Spacing.sm,
                    alignItems: 'center',
                    marginRight: Spacing.sm,
                    minWidth: 60,
                },
                foodEmoji: { fontSize: 24 },
                foodQty: { fontSize: 10, fontWeight: '700', color: palette.textPrimary, marginTop: 4 },
                foodHeal: { fontSize: 9, color: palette.green },

                // Prayer styles
                prayerSection: {
                    marginTop: Spacing.md,
                },
                prayerPointsBarOuter: {
                    height: 14,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    overflow: 'hidden' as const,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginTop: 4,
                    marginBottom: Spacing.sm,
                },
                prayerPointsBarInner: {
                    height: '100%' as any,
                    borderRadius: Radius.md,
                    backgroundColor: '#eab308',
                },
                prayerPointsLabel: {
                    fontSize: FontSize.xs,
                    fontWeight: '700' as const,
                    color: '#eab308',
                    textAlign: 'center' as const,
                    marginBottom: 2,
                },
                prayerGrid: {
                    flexDirection: 'row' as const,
                    flexWrap: 'wrap' as const,
                    gap: 6,
                },
                prayerCard: {
                    width: '31%' as any,
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                    borderRadius: Radius.md,
                    padding: 6,
                    alignItems: 'center' as const,
                },
                prayerCardActive: {
                    borderColor: '#eab308',
                    backgroundColor: 'rgba(234,179,8,0.12)',
                },
                prayerCardLocked: {
                    opacity: 0.35,
                },
                prayerEmoji: { fontSize: 20 },
                prayerLabel: { fontSize: 9, fontWeight: '700' as const, color: palette.textSecondary, textAlign: 'center' as const, marginTop: 2 },
                prayerDesc: { fontSize: 8, color: palette.textMuted, textAlign: 'center' as const },
                prayerReq: { fontSize: 7, color: palette.gold, fontWeight: '600' as const, marginTop: 1 },
            }),
        [palette]
    );

    const spottedEnemies = seenEnemies
        .map((id) => ENEMIES[id])
        .filter(Boolean);

    const handleUnequip = (slot: EquipSlot) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dispatch(gameActions.unequipItem({ slot }));
    };

    const renderLoadout = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>Combat Stats</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Hitpoints</Text>
                        <Text style={[styles.statValue, { color: palette.green }]}>
                            {player.combatStats.currentHitpoints} / {player.combatStats.maxHitpoints}
                        </Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Accuracy</Text>
                        <Text style={styles.statValue}>{player.combatStats.accuracy}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Max Hit</Text>
                        <Text style={[styles.statValue, { color: palette.red }]}>{player.combatStats.maxHit}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Atk Speed</Text>
                        <Text style={styles.statValue}>{(player.combatStats.attackSpeed / 1000).toFixed(1)}s</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Melee Def</Text>
                        <Text style={styles.statValue}>{player.combatStats.meleeDefence}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Ranged Def</Text>
                        <Text style={styles.statValue}>{player.combatStats.rangedDefence}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Magic Def</Text>
                        <Text style={styles.statValue}>{player.combatStats.magicDefence}</Text>
                    </View>
                </View>
            </View>

            <Text style={[styles.statsTitle, { marginLeft: Spacing.sm, marginTop: Spacing.sm }]}>Equipment</Text>
            {EQUIPMENT_SLOTS.map((slot) => {
                const equippedItemId = player.equipment[slot.key];
                const meta = equippedItemId ? getItemMeta(equippedItemId) : null;

                return (
                    <View key={slot.key} style={styles.slotCard}>
                        <Text style={styles.slotIcon}>{meta ? meta.emoji : slot.icon}</Text>
                        <View style={styles.slotInfo}>
                            <Text style={styles.slotLabel}>{slot.label}</Text>
                            {meta ? (
                                <Text style={styles.slotItemName}>{meta.label}</Text>
                            ) : (
                                <Text style={styles.slotEmptyText}>Empty</Text>
                            )}
                        </View>
                        {equippedItemId && (
                            <TouchableOpacity style={styles.unequipBtn} onPress={() => handleUnequip(slot.key)} activeOpacity={0.7}>
                                <Text style={styles.unequipBtnText}>Unequip</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );

    const renderBattle = () => {
        // === Active Fight View ===
        if (activeCombat) {
            const pHp = player.combatStats.currentHitpoints;
            const pMaxHp = player.combatStats.maxHitpoints;
            const eHp = activeCombat.enemyCurrentHp;
            const eMaxHp = activeCombat.enemyMaxHp;
            const pAtkProg = Math.min(1, activeCombat.playerAttackTimerMs / (player.combatStats.attackSpeed || 2400));
            const eAtkProg = Math.min(1, activeCombat.enemyAttackTimerMs / 2400);

            const logColorMap: Record<string, string> = {
                player_hit: palette.green,
                enemy_hit: palette.red,
                player_miss: palette.textMuted,
                enemy_miss: palette.textMuted,
                kill: palette.gold,
                loot: palette.accentPrimary,
                died: palette.red,
                info: palette.textSecondary,
            };

            return (
                <View style={styles.fightContainer}>
                    <View style={styles.fightHeader}>
                        <Text style={styles.statsTitle}>⚔️ Fighting</Text>
                        <TouchableOpacity style={styles.fleeBtn} onPress={() => {
                            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            dispatch(gameActions.fleeCombat());
                        }} activeOpacity={0.7}>
                            <Text style={styles.fleeBtnText}>🏃 FLEE</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Player HP */}
                    <Text style={{ fontSize: FontSize.xs, color: palette.textSecondary, fontWeight: '700' }}>You</Text>
                    <View style={styles.hpBarOuter}>
                        <View style={[styles.hpBarInner, {
                            width: `${Math.max(0, (pHp / pMaxHp) * 100)}%`,
                            backgroundColor: pHp / pMaxHp > 0.5 ? palette.green : pHp / pMaxHp > 0.25 ? '#f59e0b' : palette.red,
                        }]} />
                    </View>
                    <Text style={styles.hpLabel}>{pHp} / {pMaxHp}</Text>
                    <View style={styles.atkTimerOuter}>
                        <View style={[styles.atkTimerInner, { width: `${pAtkProg * 100}%`, backgroundColor: palette.accentPrimary }]} />
                    </View>

                    <Text style={styles.vsText}>⚔️</Text>

                    {/* Enemy HP */}
                    <Text style={{ fontSize: FontSize.xs, color: palette.textSecondary, fontWeight: '700' }}>{activeCombat.enemyName} (Lv. {ENEMIES[activeCombat.enemyId]?.level ?? '?'})</Text>
                    <View style={styles.hpBarOuter}>
                        <View style={[styles.hpBarInner, {
                            width: `${Math.max(0, (eHp / eMaxHp) * 100)}%`,
                            backgroundColor: palette.red,
                        }]} />
                    </View>
                    <Text style={styles.hpLabel}>{eHp} / {eMaxHp}</Text>
                    <View style={styles.atkTimerOuter}>
                        <View style={[styles.atkTimerInner, { width: `${eAtkProg * 100}%`, backgroundColor: palette.red }]} />
                    </View>

                    <Text style={styles.killBadge}>Kills: {activeCombat.killCount}  ·  Gold: {player.gold}</Text>

                    {/* Food Tray */}
                    <View style={{ marginTop: Spacing.md }}>
                        <Text style={{ fontSize: FontSize.xs, color: palette.textSecondary, fontWeight: '700', marginBottom: 4 }}>Food (Tap to eat)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foodScroll}>
                            {player.inventory
                                .map(item => ({ item, meta: getItemMeta(item.id) }))
                                .filter(i => i.meta?.type === 'food' && (i.meta.healAmount ?? 0) > 0)
                                .map(({ item, meta }) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.foodCard}
                                        onPress={() => {
                                            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            dispatch(gameActions.eatFood({ itemId: item.id, healAmount: meta?.healAmount ?? 0 }));
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.foodEmoji}>{meta?.emoji}</Text>
                                        <Text style={styles.foodQty}>x{item.quantity}</Text>
                                        <Text style={styles.foodHeal}>+{meta?.healAmount} HP</Text>
                                    </TouchableOpacity>
                                ))}
                            {player.inventory.filter(i => getItemMeta(i.id)?.type === 'food').length === 0 && (
                                <Text style={{ fontSize: FontSize.xs, color: palette.textMuted, fontStyle: 'italic', paddingVertical: Spacing.sm }}>
                                    No food left! Cook some or flee.
                                </Text>
                            )}
                        </ScrollView>
                    </View>

                    {/* Prayer Section in Combat */}
                    <View style={styles.prayerSection}>
                        <Text style={{ fontSize: FontSize.xs, color: '#eab308', fontWeight: '700', marginBottom: 4 }}>✨ Prayer ({Math.floor(prayerPoints)} / {maxPrayerPoints})</Text>
                        <View style={styles.prayerPointsBarOuter}>
                            <View style={[styles.prayerPointsBarInner, {
                                width: `${maxPrayerPoints > 0 ? Math.max(0, (prayerPoints / maxPrayerPoints) * 100) : 0}%`,
                            }]} />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.prayerGrid}>
                                {PRAYERS.filter(p => p.levelRequired <= prayerLevel).map(p => {
                                    const isActive = activePrayerIds.includes(p.id);
                                    return (
                                        <TouchableOpacity
                                            key={p.id}
                                            style={[styles.prayerCard, isActive && styles.prayerCardActive]}
                                            onPress={() => {
                                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                dispatch(gameActions.togglePrayer({ prayerId: p.id }));
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.prayerEmoji}>{p.emoji}</Text>
                                            <Text style={styles.prayerLabel}>{p.label}</Text>
                                            <Text style={styles.prayerDesc}>{p.description}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                                {PRAYERS.filter(p => p.levelRequired <= prayerLevel).length === 0 && (
                                    <Text style={{ fontSize: FontSize.xs, color: palette.textMuted, fontStyle: 'italic', paddingVertical: Spacing.sm }}>
                                        Train Prayer to unlock prayers.
                                    </Text>
                                )}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Combat Style Selector */}
                    <Text style={{ fontSize: FontSize.xs, color: palette.textSecondary, fontWeight: '700', marginBottom: 4 }}>Combat Style</Text>
                    <View style={styles.interactionsRow}>
                        {COMBAT_STYLES.map(style => {
                            const isActive = activeCombat.combatStyle === style.id;
                            return (
                                <TouchableOpacity
                                    key={style.id}
                                    style={[styles.styleCard, isActive && styles.styleCardActive]}
                                    onPress={() => {
                                        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        dispatch(gameActions.setCombatStyle(style.id));
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.styleEmoji}>{style.emoji}</Text>
                                    <Text style={[styles.styleLabel, isActive && { color: palette.accentPrimary }]}>{style.name}</Text>
                                    <Text style={{ fontSize: 9, color: palette.textMuted }}>{style.desc}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Combat Log */}
                    <ScrollView
                        ref={combatLogScrollRef}
                        style={styles.combatLogBox}
                        onContentSizeChange={() => combatLogScrollRef.current?.scrollToEnd({ animated: true })}
                    >
                        {combatLog.map((entry, index) => (
                            <Text key={`${entry.id} -${index} `} style={[styles.combatLogMsg, { color: logColorMap[entry.type] || palette.textSecondary }]}>
                                {entry.message}
                            </Text>
                        ))}
                    </ScrollView>
                </View>
            );
        }

        // === Zone Selection ===
        if (!selectedZone) {
            return (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.statsTitle}>Select Combat Zone</Text>
                    {COMBAT_ZONES.map(z => (
                        <TouchableOpacity key={z.id} style={styles.zoneCard} onPress={() => setSelectedZone(z.id)} activeOpacity={0.8}>
                            <Text style={styles.zoneIcon}>{z.icon}</Text>
                            <View style={styles.zoneInfo}>
                                <Text style={styles.zoneName}>{z.name}</Text>
                                <Text style={styles.zoneDesc}>{z.description}</Text>
                                <Text style={styles.zoneTier}>Tier {z.tier}</Text>
                            </View>
                            <Text style={styles.zoneChevron}>›</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            );
        }

        // === Enemy list inside a zone ===
        const zone = COMBAT_ZONES.find(z => z.id === selectedZone);
        const enemiesInZone = Object.values(ENEMIES).filter(e => e.locations?.some(l => l.id === selectedZone));

        return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedZone(null)} activeOpacity={0.7}>
                    <Text style={styles.backBtnText}>‹ Back to Zones</Text>
                </TouchableOpacity>

                <View style={styles.zoneHeader}>
                    <Text style={styles.zoneHeaderIcon}>{zone?.icon}</Text>
                    <Text style={styles.zoneHeaderTitle}>{zone?.name}</Text>
                </View>

                {enemiesInZone.map(e => (
                    <View key={e.id} style={styles.bestiaryCard}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.enemyCardContent}>
                                <Text style={{ fontSize: 32, width: 40, textAlign: 'center' }}>👹</Text>
                                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                                    <Text style={styles.enemyName}>{e.name} <Text style={styles.enemyLevel}>Lv. {e.level ?? 1}</Text></Text>
                                    <Text style={styles.enemyDesc}>{e.description}</Text>
                                    {e.combat && (
                                        <Text style={styles.enemyStats}>
                                            HP: {e.combat.hp}  ·  ATK: {e.combat.attack}  ·  DEF: {e.combat.defense}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity style={styles.engageBtn} onPress={() => {
                                if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                                dispatch(gameActions.startCombat({ enemyId: e.id, zoneId: selectedZone }));
                            }} activeOpacity={0.8}>
                                <Text style={styles.engageBtnText}>ENGAGE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    };

    const renderBestiary = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {spottedEnemies.length > 0 ? (
                spottedEnemies.map((e) => (
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
                ))
            ) : (
                <View style={styles.placeholderCenter}>
                    <Text style={[styles.statsTitle, { textAlign: 'center' }]}>No Enemies Spotted</Text>
                    <Text style={styles.description}>
                        Keep training—enemies may peek out from the shadows while you work!
                    </Text>
                </View>
            )}
        </ScrollView>
    );

    const renderPrayer = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.statsTitle}>✨ Prayer</Text>
            <Text style={{ fontSize: FontSize.xs, color: palette.textSecondary, marginBottom: Spacing.md, lineHeight: 18 }}>
                Bury bones to gain Prayer XP and restore prayer points. Activate prayers during combat for powerful bonuses.
            </Text>

            {/* Prayer Points */}
            <View style={styles.statsCard}>
                <Text style={[styles.statsTitle, { color: '#eab308' }]}>Prayer Points</Text>
                <Text style={styles.prayerPointsLabel}>{Math.floor(prayerPoints)} / {maxPrayerPoints}</Text>
                <View style={styles.prayerPointsBarOuter}>
                    <View style={[styles.prayerPointsBarInner, {
                        width: `${maxPrayerPoints > 0 ? Math.max(0, (prayerPoints / maxPrayerPoints) * 100) : 0}%`,
                    }]} />
                </View>
                <Text style={{ fontSize: FontSize.xs, color: palette.textMuted, marginTop: 4 }}>
                    Prayer Level: {prayerLevel} · Max Points: {maxPrayerPoints}
                </Text>
            </View>

            {/* All Prayers */}
            <Text style={[styles.statsTitle, { marginTop: Spacing.md }]}>Available Prayers</Text>
            {PRAYERS.map(p => {
                const unlocked = prayerLevel >= p.levelRequired;
                const isActive = activePrayerIds.includes(p.id);
                return (
                    <TouchableOpacity
                        key={p.id}
                        style={[styles.bestiaryCard, !unlocked && { opacity: 0.4 }, isActive && { borderColor: '#eab308', borderWidth: 2 }]}
                        disabled={!unlocked}
                        onPress={() => {
                            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            dispatch(gameActions.togglePrayer({ prayerId: p.id }));
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={{ fontSize: 28, width: 40, textAlign: 'center' }}>{p.emoji}</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: FontSize.base, fontWeight: '700', color: unlocked ? palette.textPrimary : palette.textMuted }}>
                                {p.label} {isActive && <Text style={{ color: '#eab308' }}>● ON</Text>}
                            </Text>
                            <Text style={{ fontSize: FontSize.xs, color: palette.textSecondary }}>
                                {p.description}
                            </Text>
                            <Text style={{ fontSize: 10, color: unlocked ? palette.gold : palette.textMuted, fontWeight: '600', marginTop: 2 }}>
                                Lv. {p.levelRequired} · Drain: {p.drainPerTick}/tick
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Combat</Text>
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'loadout' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('loadout')}
                >
                    <Text style={[styles.tabText, activeTab === 'loadout' && styles.tabTextActive]}>Loadout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'prayer' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('prayer')}
                >
                    <Text style={[styles.tabText, activeTab === 'prayer' && styles.tabTextActive]}>Prayer ✨</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'bestiary' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('bestiary')}
                >
                    <Text style={[styles.tabText, activeTab === 'bestiary' && styles.tabTextActive]}>Bestiary</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'battle' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('battle')}
                >
                    <Text style={[styles.tabText, activeTab === 'battle' && styles.tabTextActive]}>Battle ⚔️</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'loadout' && renderLoadout()}
            {activeTab === 'battle' && renderBattle()}
            {activeTab === 'bestiary' && renderBestiary()}
            {activeTab === 'prayer' && renderPrayer()}
        </View>
    );
}


