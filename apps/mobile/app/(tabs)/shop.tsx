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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { getItemMeta, SHOP_CATALOG, type ItemType } from '@/constants/items';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, type InventoryItem } from '@/store/gameSlice';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { BouncyButton } from '@/components/BouncyButton';

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

// ─── Buy row ─────────────────────────────────────────────────────────────────
function BuyRow({
    styles,
    itemId,
    buyPrice,
    playerGold,
    onBuy,
}: {
    styles: Record<string, StyleProp<ViewStyle | TextStyle>>;
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
        <View style={styles.row}>
            <Text style={styles.rowEmoji}>{meta.emoji}</Text>
            <View style={styles.rowBody}>
                <Text style={styles.rowLabel}>{meta.label}</Text>
                <Text style={styles.rowPrice}>💰 {buyPrice.toLocaleString()} each</Text>
            </View>
            <View style={styles.qtyRow}>
                {BUY_QUANTITIES.map((n) => (
                    <TouchableOpacity
                        key={n}
                        style={[styles.qtyChip, qty === n && styles.qtyChipActive]}
                        onPress={() => setQty(n)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.qtyChipText, qty === n && styles.qtyChipTextActive]}>{n}</Text>
                    </TouchableOpacity>
                ))}
                {maxAfford > 0 && (
                    <TouchableOpacity
                        style={[styles.qtyChip, isMax && styles.qtyChipActive]}
                        onPress={() => setQty(maxAfford)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.qtyChipText, isMax && styles.qtyChipTextActive]}>Max</Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity
                style={[styles.buyButton, !canAfford && styles.buyButtonDisabled]}
                onPress={() => canAfford && onBuy(qty, cost)}
                disabled={!canAfford}
                activeOpacity={0.8}
            >
                <Text style={styles.buyButtonText}>Buy {qty}</Text>
                <Text style={styles.buyButtonSub}>{cost.toLocaleString()} gp</Text>
            </TouchableOpacity>
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
    styles: Record<string, StyleProp<ViewStyle | TextStyle>>;
}) {
    const meta = getItemMeta(item.id);
    const locked = !!item.isLocked;

    return (
        <View style={[styles.row, locked && styles.rowLocked]}>
            <Text style={styles.rowEmoji}>{meta.emoji}</Text>
            <View style={styles.rowBody}>
                <Text style={styles.rowLabel}>{meta.label}{locked ? ' 🔒' : ''}</Text>
                <Text style={styles.rowPrice}>
                    💰 {meta.sellValue} each · {(item.quantity >= 1000 ? `${(item.quantity / 1000).toFixed(1)}k` : item.quantity)} owned
                </Text>
            </View>
            <View style={styles.sellButtons}>
                <TouchableOpacity
                    style={[styles.sellBtn, locked && styles.sellBtnDisabled]}
                    onPress={() => !locked && onSell1()}
                    disabled={locked}
                    activeOpacity={0.8}
                >
                    <Text style={styles.sellBtnText}>Sell 1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.sellBtn, locked && styles.sellBtnDisabled]}
                    onPress={() => !locked && onSellAll()}
                    disabled={locked}
                    activeOpacity={0.8}
                >
                    <Text style={styles.sellBtnText}>Sell All</Text>
                </TouchableOpacity>
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
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const [tab, setTab] = useState<TabMode>('buy');
    const [sellFilter, setSellFilter] = useState<ItemType | 'all'>('all');

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

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                title: {
                    fontSize: FontSize.xl,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                subtitleRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 2,
                    gap: 8,
                },
                subtitle: { fontSize: FontSize.sm, color: palette.textSecondary },
                chatButton: {
                    backgroundColor: palette.bgInput,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                chatButtonText: {
                    fontSize: 12,
                    color: palette.textPrimary,
                    fontWeight: '600',
                },
                goldBadge: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgCard,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                goldEmoji: { fontSize: FontSize.base, marginRight: 4 },
                goldText: {
                    fontSize: FontSize.base,
                    fontWeight: '600',
                    color: palette.gold,
                },
                toggleRow: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    gap: Spacing.sm,
                },
                toggleBtn: {
                    flex: 1,
                    paddingVertical: Spacing.sm,
                    borderRadius: Radius.md,
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                    alignItems: 'center',
                },
                toggleBtnActive: {
                    backgroundColor: palette.accentPrimary,
                    borderColor: palette.accentPrimary,
                },
                toggleText: {
                    fontSize: FontSize.base,
                    fontWeight: '600',
                    color: palette.textSecondary,
                },
                toggleTextActive: { color: palette.white },
                filterRow: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingHorizontal: Spacing.md,
                    paddingBottom: Spacing.sm,
                    gap: 6,
                },
                filterChip: {
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: Radius.full,
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                filterChipActive: {
                    borderColor: palette.accentPrimary,
                    backgroundColor: 'rgba(74,144,226,0.15)',
                },
                filterChipText: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                },
                filterChipTextActive: {
                    color: palette.accentPrimary,
                    fontWeight: '600',
                },
                listContent: {
                    paddingHorizontal: Spacing.md,
                    paddingBottom: Spacing.xl,
                },
                row: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgCard,
                    padding: Spacing.sm,
                    marginBottom: Spacing.sm,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                rowLocked: { opacity: 0.75 },
                rowEmoji: { fontSize: 28, marginRight: Spacing.sm },
                rowBody: { flex: 1 },
                rowLabel: {
                    fontSize: FontSize.base,
                    fontWeight: '600',
                    color: palette.textPrimary,
                },
                rowPrice: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 2,
                },
                qtyRow: {
                    flexDirection: 'row',
                    gap: 4,
                    marginRight: Spacing.sm,
                },
                qtyChip: {
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: Radius.sm,
                    backgroundColor: palette.bgInput,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                qtyChipActive: {
                    borderColor: palette.accentPrimary,
                    backgroundColor: 'rgba(74,144,226,0.2)',
                },
                qtyChipText: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                },
                qtyChipTextActive: {
                    color: palette.accentPrimary,
                    fontWeight: '600',
                },
                buyButton: {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    borderRadius: Radius.md,
                    backgroundColor: palette.green,
                    borderWidth: 1,
                    borderColor: palette.greenDim,
                    alignItems: 'center',
                    minWidth: 72,
                },
                buyButtonDisabled: {
                    backgroundColor: palette.bgInput,
                    borderColor: palette.border,
                    opacity: 0.7,
                },
                buyButtonText: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.white,
                },
                buyButtonSub: {
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.9)',
                    marginTop: 1,
                },
                sellButtons: { flexDirection: 'row', gap: 6 },
                sellBtn: {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.sm,
                    borderRadius: Radius.sm,
                    backgroundColor: palette.gold,
                    borderWidth: 1,
                    borderColor: palette.goldDim,
                },
                sellBtnText: {
                    fontSize: FontSize.sm,
                    fontWeight: '600',
                    color: palette.bgApp,
                },
                sellBtnDisabled: { opacity: 0.5 },
                empty: {
                    paddingVertical: Spacing.xl,
                    alignItems: 'center',
                },
                emptyText: {
                    fontSize: FontSize.base,
                    color: palette.textSecondary,
                },
            }),
        [palette]
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Shop</Text>
                    <View style={styles.subtitleRow}>
                        <Text style={styles.subtitle}>Nick — Merchant</Text>
                        <BouncyButton
                            style={styles.chatButton}
                            onPress={() => dispatch(gameActions.startDialogue({ treeId: 'dt_nick_shop', startNodeId: 'node_1' }))}
                        >
                            <Text style={styles.chatButtonText}>💬 Talk</Text>
                        </BouncyButton>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={styles.goldBadge}>
                        <Text style={styles.goldEmoji}>💰</Text>
                        <AnimatedNumber
                            value={gold}
                            style={styles.goldText}
                            formatValue={(v) => v.toLocaleString()}
                        />
                    </View>
                    <View style={[styles.goldBadge, { borderColor: palette.accentPrimary }]}>
                        <Text style={styles.goldEmoji}>✨</Text>
                        <AnimatedNumber
                            value={lumina}
                            style={[styles.goldText, { color: palette.accentPrimary }]}
                            formatValue={(v) => v.toLocaleString()}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[styles.toggleBtn, tab === 'buy' && styles.toggleBtnActive]}
                    onPress={() => setTab('buy')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.toggleText, tab === 'buy' && styles.toggleTextActive]}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, tab === 'sell' && styles.toggleBtnActive]}
                    onPress={() => setTab('sell')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.toggleText, tab === 'sell' && styles.toggleTextActive]}>Sell</Text>
                </TouchableOpacity>
            </View>

            {tab === 'sell' && (
                <View style={styles.filterRow}>
                    {SELL_FILTERS.map((opt) => {
                        const isActive = sellFilter === opt.key;
                        return (
                            <TouchableOpacity
                                key={opt.key}
                                style={[styles.filterChip, isActive && styles.filterChipActive]}
                                onPress={() => setSellFilter(opt.key)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
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
                        <View style={[styles.row, { marginBottom: Spacing.md, borderColor: palette.accentPrimary + '44', backgroundColor: palette.accentPrimary + '0c' }]}>
                            <Text style={styles.rowEmoji}>✨</Text>
                            <View style={styles.rowBody}>
                                <Text style={styles.rowLabel}>Lumina Shop</Text>
                                <Text style={styles.rowPrice}>Coming soon — rerolls, cosmetics, boosts</Text>
                            </View>
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
                                {inventory.length === 0 ? 'Bank is empty — gather items first.' : 'No matching items.'}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

