/**
 * Shop screen — Nick's merchant. Buy/sell items for gold.
 * [TRACE: ROADMAP 2.3, PEOPLE_TO_ADD.md]
 */
import React, { useState, useMemo } from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ListRenderItemInfo,
    Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, Radius, FontCinzelBold, FontCinzel, ShadowSubtle } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { getItemMeta, SHOP_CATALOG, type ItemType } from '@/constants/items';
import { LUMINA_SHOP_ITEMS } from '@/constants/luminaShop';
import { getNextMidnight, generateDailyQuests } from '@/constants/dailyQuests';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, type InventoryItem } from '@/store/gameSlice';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { BouncyButton } from '@/components/BouncyButton';
import { IMPLEMENTED_SKILLS } from '@/constants/skills';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

type TabMode = 'buy' | 'sell';

const SELL_FILTERS: { key: ItemType | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ore', label: 'Ores' },
    { key: 'bar', label: 'Bars' },
    { key: 'log', label: 'Logs' },
    { key: 'fish', label: 'Fish' },
    { key: 'food', label: 'Food' },
    { key: 'rune', label: 'Runes' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'other', label: 'Other' },
];

const BUY_QUANTITIES = [1, 5, 10, 25, 50];

// ─── Lumina Shop row ─────────────────────────────────────────────────────────
function LuminaShopRow({
    item,
    lumina,
    rerollsUsedToday,
    rerollDate,
    xpBoostExpiresAt,
    onPurchase,
    styles,
}: {
    item: (typeof LUMINA_SHOP_ITEMS)[0];
    lumina: number;
    rerollsUsedToday: number;
    rerollDate?: string;
    xpBoostExpiresAt?: number;
    onPurchase: () => void;
    styles: Record<string, any>;
}) {
    const canAfford = lumina >= item.cost;
    const today = new Date().toISOString().slice(0, 10);
    const rerollsReset = rerollDate !== today;
    const usedToday = rerollsReset ? 0 : rerollsUsedToday;
    const atRerollCap = item.maxPerDay != null && usedToday >= item.maxPerDay;
    const xpBoostActive = item.effect === 'xp_boost_1h' && xpBoostExpiresAt != null && xpBoostExpiresAt > Date.now();
    const canBuy = canAfford && !atRerollCap && !xpBoostActive;

    return (
        <View style={styles.card}>
            <LinearGradient colors={['rgba(139,92,246,0.1)', 'transparent']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            <View style={styles.cardInner}>
                <View style={[styles.emojiBox, { backgroundColor: 'rgba(139,92,246,0.2)' }]}>
                    <Text style={styles.rowEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.rowBody}>
                    <Text style={[styles.rowLabel, { color: '#e0d4f7' }]}>{item.label}</Text>
                    <Text style={[styles.rowPrice, { color: '#a78bfa' }]}>
                        ✨ {item.cost} Lumina
                        {item.maxPerDay != null && ` · ${item.maxPerDay - usedToday}/${item.maxPerDay} left today`}
                        {xpBoostActive && ' · Active!'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.luminaBuyBtn, !canBuy && styles.buyButtonDisabled]}
                    onPress={() => canBuy && onPurchase()}
                    disabled={!canBuy}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.luminaBuyBtnText, !canBuy && styles.buyButtonDisabledText]}>
                        {xpBoostActive ? 'Active' : atRerollCap ? 'Limit' : canAfford ? 'Buy' : '—'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Buy row ─────────────────────────────────────────────────────────────────
function BuyRow({
    styles,
    itemId,
    buyPrice,
    playerGold,
    onBuy,
}: {
    styles: Record<string, any>;
    itemId: string;
    buyPrice: number;
    playerGold: number;
    onBuy: (qty: number, cost: number) => void;
}) {
    const meta = getItemMeta(itemId);
    const maxAfford = buyPrice > 0 ? Math.min(999, Math.floor(playerGold / buyPrice)) : 0;
    const [qty, setQty] = useState(1);
    const isMax = qty === maxAfford && maxAfford > 0;
    const cost = qty * buyPrice;
    const canAfford = playerGold >= cost;

    return (
        <View style={styles.card}>
            <LinearGradient colors={['rgba(212,175,55,0.05)', 'transparent']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            <View style={styles.cardInner}>
                <View style={styles.emojiBox}>
                    <Text style={styles.rowEmoji}>{meta.emoji}</Text>
                </View>
                <View style={styles.rowBody}>
                    <Text style={styles.rowLabel}>{meta.label}</Text>
                    <Text style={styles.rowPrice}>💰 {buyPrice.toLocaleString()} each</Text>
                </View>
            </View>
            <View style={styles.buyActionRow}>
                <View style={styles.qtyRow}>
                    {BUY_QUANTITIES.map((n) => (
                        <TouchableOpacity
                            key={n}
                            style={[styles.qtyChip, qty === n && styles.qtyChipActive]}
                            onPress={() => {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setQty(n);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.qtyChipText, qty === n && styles.qtyChipTextActive]}>{n}</Text>
                        </TouchableOpacity>
                    ))}
                    {maxAfford > 0 && (
                        <TouchableOpacity
                            style={[styles.qtyChip, isMax && styles.qtyChipActive]}
                            onPress={() => {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setQty(maxAfford);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.qtyChipText, isMax && styles.qtyChipTextActive]}>Max</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.buyButton, !canAfford && styles.buyButtonDisabled]}
                    onPress={() => {
                        if (canAfford) {
                            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onBuy(qty, cost);
                        }
                    }}
                    disabled={!canAfford}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buyButtonText}>Buy {qty}</Text>
                    <Text style={styles.buyButtonSub}>{cost.toLocaleString()} gp</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Sell row ─────────────────────────────────────────────────────────────────
function SellRow({
    item,
    onSell1,
    onSellAll,
    styles,
}: {
    item: InventoryItem;
    onSell1: () => void;
    onSellAll: () => void;
    styles: Record<string, any>;
}) {
    const meta = getItemMeta(item.id);
    const locked = !!item.isLocked;

    return (
        <View style={[styles.card, locked && styles.rowLocked]}>
            <View style={styles.cardInner}>
                <View style={styles.emojiBox}>
                    <Text style={styles.rowEmoji}>{meta.emoji}</Text>
                </View>
                <View style={styles.rowBody}>
                    <Text style={styles.rowLabel}>{meta.label}{locked ? ' 🔒' : ''}</Text>
                    <Text style={styles.rowPrice}>
                        💰 {meta.sellValue} each · {(item.quantity >= 1000 ? `${(item.quantity / 1000).toFixed(1)}k` : item.quantity)} owned
                    </Text>
                </View>
                <View style={styles.sellButtons}>
                    <TouchableOpacity
                        style={[styles.sellBtnLight, locked && styles.sellBtnDisabled]}
                        onPress={() => {
                            if (!locked) {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onSell1();
                            }
                        }}
                        disabled={locked}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.sellBtnLightText}>Sell 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sellBtnStrong, locked && styles.sellBtnDisabled]}
                        onPress={() => {
                            if (!locked) {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                onSellAll();
                            }
                        }}
                        disabled={locked}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.sellBtnStrongText}>Sell All</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function ShopScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const gold = useAppSelector((s) => s.game.player.gold);
    const lumina = useAppSelector((s) => s.game.player.lumina ?? 0);
    const luminaShopRerollsUsedToday = useAppSelector((s) => s.game.player.luminaShopRerollsUsedToday ?? 0);
    const luminaShopRerollDate = useAppSelector((s) => s.game.player.luminaShopRerollDate);
    const xpBoostExpiresAt = useAppSelector((s) => s.game.player.xpBoostExpiresAt);
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const skills = useAppSelector((s) => s.game.player.skills);
    const [tab, setTab] = useState<TabMode>('buy');
    const [sellFilter, setSellFilter] = useState<ItemType | 'all'>('all');

    const eligibleCapes = useMemo(() => {
        return Array.from(IMPLEMENTED_SKILLS)
            .filter(skillId => (skills[skillId]?.level ?? 1) >= 99)
            .map(skillId => `skill_cape_${skillId}`);
    }, [skills]);

    const filteredSellList = useMemo(() => {
        if (sellFilter === 'all') return inventory;
        return inventory.filter((item) => getItemMeta(item.id).type === sellFilter);
    }, [inventory, sellFilter]);

    const handleBuy = (id: string, quantity: number, totalCost: number) => {
        dispatch(gameActions.buyItem({ id, quantity, totalCost }));
    };

    const handleSell1 = (id: string) => {
        const meta = getItemMeta(id);
        const shopSellValue = Math.floor(meta.sellValue * 0.5); // 50% merchant ratio
        dispatch(gameActions.sellItem({ id, quantity: 1, pricePer: shopSellValue }));
    };

    const handleSellAll = (id: string) => {
        const item = inventory.find((i) => i.id === id);
        if (!item) return;
        const meta = getItemMeta(id);
        const shopSellValue = Math.floor(meta.sellValue * 0.5); // 50% merchant ratio
        dispatch(gameActions.sellItem({ id, quantity: item.quantity, pricePer: shopSellValue }));
    };

    const handlePurchaseLumina = (lumItem: (typeof LUMINA_SHOP_ITEMS)[0]) => {
        if (lumina < lumItem.cost) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        dispatch(gameActions.spendLumina(lumItem.cost));
        if (lumItem.effect === 'reroll_daily') {
            dispatch(gameActions.setDailyQuests({
                resetAt: getNextMidnight(),
                quests: generateDailyQuests(3),
            }));
            dispatch(gameActions.incrementLuminaRerollsUsed());
        } else if (lumItem.effect === 'xp_boost_1h') {
            dispatch(gameActions.setXpBoostExpiresAt(Date.now() + 60 * 60 * 1000));
        }
    };

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                headerBox: {
                    paddingTop: Spacing.xl,
                    paddingHorizontal: Spacing.xl,
                    paddingBottom: Spacing.lg,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                    position: 'relative',
                    overflow: 'hidden',
                },
                headerTop: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                },
                title: {
                    fontSize: 32,
                    color: palette.gold,
                    fontFamily: FontCinzelBold,
                    textShadowColor: 'rgba(212,175,55,0.3)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 8,
                },
                subtitleRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4,
                    gap: 12,
                },
                subtitle: { 
                    fontSize: FontSize.sm, 
                    color: palette.textSecondary,
                    fontFamily: FontCinzelBold,
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                },
                chatButton: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(212,175,55,0.15)',
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: 'rgba(212,175,55,0.3)',
                    gap: 4,
                },
                chatButtonText: {
                    fontSize: 12,
                    color: palette.gold,
                    fontWeight: '700',
                },
                wealthBox: {
                    alignItems: 'flex-end',
                    gap: Spacing.xs,
                },
                goldBadge: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 6,
                    borderRadius: Radius.lg,
                    borderWidth: 1,
                    borderColor: palette.border,
                    minWidth: 100,
                    justifyContent: 'flex-end',
                },
                goldEmoji: { fontSize: FontSize.sm, marginRight: 6 },
                goldText: {
                    fontSize: FontSize.md,
                    fontWeight: '800',
                    color: palette.gold,
                    textShadowColor: 'rgba(0,0,0,0.5)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                },
                tabsRow: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.xl,
                    paddingTop: Spacing.md,
                    paddingBottom: Spacing.sm,
                    backgroundColor: palette.bgApp,
                },
                segmentedControl: {
                    flexDirection: 'row',
                    backgroundColor: palette.bgInput,
                    borderRadius: Radius.lg,
                    padding: 4,
                    flex: 1,
                },
                tabBtn: {
                    flex: 1,
                    paddingVertical: 10,
                    alignItems: 'center',
                    borderRadius: Radius.md,
                },
                tabBtnActive: {
                    backgroundColor: palette.bgCard,
                    ...ShadowSubtle,
                    shadowColor: palette.black,
                },
                tabText: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.textSecondary,
                },
                tabTextActive: {
                    color: palette.textPrimary,
                },
                filterRowWrap: {
                    backgroundColor: palette.bgApp,
                    paddingHorizontal: Spacing.md,
                    paddingBottom: Spacing.sm,
                },
                filterRow: {
                    flexDirection: 'row',
                    gap: 8,
                    paddingHorizontal: Spacing.sm,
                },
                filterChip: {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: Radius.full,
                    backgroundColor: palette.bgInput,
                    borderWidth: 1,
                    borderColor: 'transparent',
                },
                filterChipActive: {
                    backgroundColor: palette.bgCard,
                    borderColor: palette.gold,
                },
                filterChipText: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    fontWeight: '600',
                },
                filterChipTextActive: {
                    color: palette.gold,
                },
                listContent: {
                    paddingHorizontal: Spacing.lg,
                    paddingTop: Spacing.sm,
                    paddingBottom: Spacing['2xl'],
                },
                card: {
                    backgroundColor: palette.bgCardHover,
                    borderRadius: Radius.lg,
                    marginBottom: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    overflow: 'hidden',
                    ...ShadowSubtle,
                },
                cardInner: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: Spacing.md,
                },
                emojiBox: {
                    width: 48,
                    height: 48,
                    borderRadius: Radius.md,
                    backgroundColor: palette.bgInput,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: Spacing.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                rowEmoji: { fontSize: 24 },
                rowBody: { flex: 1, justifyContent: 'center' },
                rowLabel: {
                    fontSize: FontSize.md,
                    fontWeight: '700',
                    color: palette.textPrimary,
                    marginBottom: 2,
                },
                rowPrice: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    fontWeight: '500',
                },
                buyActionRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: Spacing.md,
                    paddingBottom: Spacing.md,
                    paddingTop: 4,
                },
                qtyRow: {
                    flexDirection: 'row',
                    gap: 6,
                    flexWrap: 'wrap',
                    flex: 1,
                    marginRight: Spacing.md,
                },
                qtyChip: {
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: Radius.sm,
                    backgroundColor: palette.bgInput,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                qtyChipActive: {
                    backgroundColor: 'rgba(212,175,55,0.1)',
                    borderColor: palette.gold,
                },
                qtyChipText: {
                    fontSize: FontSize.xs,
                    fontWeight: '600',
                    color: palette.textSecondary,
                },
                qtyChipTextActive: {
                    color: palette.gold,
                },
                buyButton: {
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: 10,
                    borderRadius: Radius.md,
                    backgroundColor: palette.green,
                    borderWidth: 1,
                    borderColor: palette.greenDim,
                    alignItems: 'center',
                    minWidth: 96,
                    ...ShadowSubtle,
                    shadowColor: palette.green,
                },
                buyButtonDisabled: {
                    backgroundColor: palette.bgInput,
                    borderColor: palette.border,
                    shadowOpacity: 0,
                    opacity: 0.7,
                },
                buyButtonDisabledText: { color: palette.textDisabled },
                buyButtonText: {
                    fontSize: FontSize.sm,
                    fontWeight: '800',
                    color: palette.bgApp, // Contrast text
                },
                buyButtonSub: {
                    fontSize: 10,
                    color: 'rgba(0,0,0,0.6)',
                    fontWeight: '600',
                    marginTop: 2,
                },
                sellButtons: { flexDirection: 'row', gap: 8 },
                sellBtnLight: {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 8,
                    borderRadius: Radius.md,
                    backgroundColor: palette.bgInput,
                    borderWidth: 1,
                    borderColor: palette.border,
                    minWidth: 70,
                    alignItems: 'center',
                },
                sellBtnStrong: {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 8,
                    borderRadius: Radius.md,
                    backgroundColor: palette.gold,
                    borderWidth: 1,
                    borderColor: palette.goldDim,
                    minWidth: 80,
                    alignItems: 'center',
                    ...ShadowSubtle,
                    shadowColor: palette.gold,
                },
                sellBtnLightText: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                sellBtnStrongText: {
                    fontSize: FontSize.sm,
                    fontWeight: '800',
                    color: palette.bgApp,
                },
                sellBtnDisabled: { opacity: 0.4, shadowOpacity: 0 },
                luminaBuyBtn: {
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: 10,
                    borderRadius: Radius.md,
                    backgroundColor: '#8b5cf6', // Violet/Lumina color
                    borderWidth: 1,
                    borderColor: '#a78bfa',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...ShadowSubtle,
                    shadowColor: '#8b5cf6',
                },
                luminaBuyBtnText: {
                    fontSize: FontSize.sm,
                    fontWeight: '800',
                    color: palette.white,
                },
                sectionHeader: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.lg,
                    color: palette.gold,
                    marginTop: Spacing.md,
                    marginBottom: Spacing.sm,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                },
                rowLocked: { opacity: 0.6 },
                empty: {
                    paddingVertical: Spacing['2xl'],
                    alignItems: 'center',
                },
                emptyText: {
                    fontSize: FontSize.base,
                    color: palette.textSecondary,
                    fontFamily: FontCinzel,
                },
            }),
        [palette]
    );

    return (
        <View style={styles.container}>
            <View style={[styles.headerBox, { paddingTop: insets.top + Spacing.lg }]}>
                <LinearGradient
                    colors={[palette.bgCard, palette.bgApp]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />
                
                <View style={styles.headerTop}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>The Agora</Text>
                        <View style={styles.subtitleRow}>
                            <Text style={styles.subtitle}>Nick • Merchant</Text>
                            <BouncyButton
                                style={styles.chatButton}
                                onPress={() => dispatch(gameActions.startDialogue({ treeId: 'dt_nick_shop', startNodeId: 'node_1' }))}
                            >
                                <IconSymbol name="bubble.left.fill" size={10} color={palette.gold} />
                                <Text style={styles.chatButtonText}>Talk</Text>
                            </BouncyButton>
                        </View>
                    </View>
                    
                    <View style={styles.wealthBox}>
                        <View style={styles.goldBadge}>
                            <Text style={styles.goldEmoji}>💰</Text>
                            <AnimatedNumber
                                value={gold}
                                style={styles.goldText}
                                formatValue={(v) => v.toLocaleString()}
                            />
                        </View>
                        <View style={[styles.goldBadge, { borderColor: 'rgba(139,92,246,0.5)' }]}>
                            <Text style={styles.goldEmoji}>✨</Text>
                            <AnimatedNumber
                                value={lumina}
                                style={[styles.goldText, { color: '#c4b5fd' }]}
                                formatValue={(v) => v.toLocaleString()}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.tabsRow}>
                <View style={styles.segmentedControl}>
                    <TouchableOpacity
                        style={[styles.tabBtn, tab === 'buy' && styles.tabBtnActive]}
                        onPress={() => setTab('buy')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, tab === 'buy' && styles.tabTextActive]}>Buy Items</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabBtn, tab === 'sell' && styles.tabBtnActive]}
                        onPress={() => setTab('sell')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, tab === 'sell' && styles.tabTextActive]}>Sell Vault</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {tab === 'sell' && (
                <View style={styles.filterRowWrap}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={SELL_FILTERS}
                        contentContainerStyle={styles.filterRow}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item: opt }) => {
                            const isActive = sellFilter === opt.key;
                            return (
                                <TouchableOpacity
                                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                                    onPress={() => setSellFilter(opt.key)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            )}

            {tab === 'buy' && (
                <FlatList
                    data={SHOP_CATALOG}
                    keyExtractor={(entry) => entry.id}
                    renderItem={({ item: entry }: ListRenderItemInfo<{ id: string; buyPrice: number }>) => (
                        <BuyRow
                            styles={styles}
                            itemId={entry.id}
                            buyPrice={entry.buyPrice}
                            playerGold={gold}
                            onBuy={(qty, cost) => handleBuy(entry.id, qty, cost)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <View style={{ marginBottom: Spacing.lg }}>
                            <Text style={styles.sectionHeader}>Cosmic Wares</Text>
                            {LUMINA_SHOP_ITEMS.map((lumItem) => (
                                <LuminaShopRow
                                    key={lumItem.id}
                                    item={lumItem}
                                    lumina={lumina}
                                    rerollsUsedToday={luminaShopRerollsUsedToday}
                                    rerollDate={luminaShopRerollDate}
                                    xpBoostExpiresAt={xpBoostExpiresAt}
                                    onPurchase={() => handlePurchaseLumina(lumItem)}
                                    styles={styles}
                                />
                            ))}
                            
                            {eligibleCapes.length > 0 && (
                                <View style={{ marginTop: Spacing.md }}>
                                    <Text style={[styles.sectionHeader, { color: palette.gold }]}>Mastery Capes</Text>
                                    {eligibleCapes.map((capeId) => (
                                        <BuyRow
                                            key={capeId}
                                            styles={styles}
                                            itemId={capeId}
                                            buyPrice={99000}
                                            playerGold={gold}
                                            onBuy={(qty, cost) => handleBuy(capeId, qty, cost)}
                                        />
                                    ))}
                                </View>
                            )}

                            <Text style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>General Stock</Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>No items for sale.</Text>
                        </View>
                    }
                />
            )}

            {tab === 'sell' && (
                <FlatList
                    data={filteredSellList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }: ListRenderItemInfo<InventoryItem>) => (
                        <SellRow
                            item={item}
                            onSell1={() => handleSell1(item.id)}
                            onSellAll={() => handleSellAll(item.id)}
                            styles={styles}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>
                                {inventory.length === 0 ? 'Your vault is empty.' : 'No items match this filter.'}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
