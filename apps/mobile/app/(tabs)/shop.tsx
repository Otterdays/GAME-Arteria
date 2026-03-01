/**
 * Shop screen — Nick's merchant. Buy/sell items for gold.
 * [TRACE: ROADMAP 2.3, PEOPLE_TO_ADD.md]
 */
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ListRenderItemInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { getItemMeta, SHOP_CATALOG, type ItemType } from '@/constants/items';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, type InventoryItem } from '@/store/gameSlice';

type TabMode = 'buy' | 'sell';

const SELL_FILTERS: { key: ItemType | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ore', label: 'Ores' },
    { key: 'bar', label: 'Bars' },
    { key: 'log', label: 'Logs' },
    { key: 'other', label: 'Other' },
];

const BUY_QUANTITIES = [1, 5, 10];

// ─── Buy row ─────────────────────────────────────────────────────────────────
function BuyRow({
    itemId,
    buyPrice,
    playerGold,
    onBuy,
}: {
    itemId: string;
    buyPrice: number;
    playerGold: number;
    onBuy: (qty: number, cost: number) => void;
}) {
    const meta = getItemMeta(itemId);
    const [qty, setQty] = useState(1);
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
}: {
    item: InventoryItem;
    onSell1: () => void;
    onSellAll: () => void;
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
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const gold = useAppSelector((s) => s.game.player.gold);
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

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Shop</Text>
                    <Text style={styles.subtitle}>Nick — Merchant</Text>
                </View>
                <View style={styles.goldBadge}>
                    <Text style={styles.goldEmoji}>💰</Text>
                    <Text style={styles.goldText}>{gold.toLocaleString()}</Text>
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
                            itemId={entry.id}
                            buyPrice={entry.buyPrice}
                            playerGold={gold}
                            onBuy={(qty, cost) => handleBuy(entry.id, qty, cost)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Palette.bgApp },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Palette.border,
    },
    title: { fontSize: FontSize.xl, fontWeight: '700', color: Palette.textPrimary },
    subtitle: { fontSize: FontSize.sm, color: Palette.textSecondary, marginTop: 2 },
    goldBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.bgCard,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    goldEmoji: { fontSize: FontSize.base, marginRight: 4 },
    goldText: { fontSize: FontSize.base, fontWeight: '600', color: Palette.gold },

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
        backgroundColor: Palette.bgCard,
        borderWidth: 1,
        borderColor: Palette.border,
        alignItems: 'center',
    },
    toggleBtnActive: { backgroundColor: Palette.accentPrimary, borderColor: Palette.accentPrimary },
    toggleText: { fontSize: FontSize.base, fontWeight: '600', color: Palette.textSecondary },
    toggleTextActive: { color: Palette.white },

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
        backgroundColor: Palette.bgCard,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    filterChipActive: { borderColor: Palette.accentPrimary, backgroundColor: 'rgba(74,144,226,0.15)' },
    filterChipText: { fontSize: FontSize.sm, color: Palette.textSecondary },
    filterChipTextActive: { color: Palette.accentPrimary, fontWeight: '600' },

    listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.bgCard,
        padding: Spacing.sm,
        marginBottom: Spacing.sm,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    rowLocked: { opacity: 0.75 },
    rowEmoji: { fontSize: 28, marginRight: Spacing.sm },
    rowBody: { flex: 1 },
    rowLabel: { fontSize: FontSize.base, fontWeight: '600', color: Palette.textPrimary },
    rowPrice: { fontSize: FontSize.sm, color: Palette.textSecondary, marginTop: 2 },

    qtyRow: { flexDirection: 'row', gap: 4, marginRight: Spacing.sm },
    qtyChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: Radius.sm,
        backgroundColor: Palette.bgInput,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    qtyChipActive: { borderColor: Palette.accentPrimary, backgroundColor: 'rgba(74,144,226,0.2)' },
    qtyChipText: { fontSize: FontSize.sm, color: Palette.textSecondary },
    qtyChipTextActive: { color: Palette.accentPrimary, fontWeight: '600' },

    buyButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        backgroundColor: Palette.green,
        borderWidth: 1,
        borderColor: Palette.greenDim,
        alignItems: 'center',
        minWidth: 72,
    },
    buyButtonDisabled: { backgroundColor: Palette.bgInput, borderColor: Palette.border, opacity: 0.7 },
    buyButtonText: { fontSize: FontSize.sm, fontWeight: '700', color: Palette.white },
    buyButtonSub: { fontSize: 11, color: 'rgba(255,255,255,0.9)', marginTop: 1 },

    sellButtons: { flexDirection: 'row', gap: 6 },
    sellBtn: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.sm,
        backgroundColor: Palette.gold,
        borderWidth: 1,
        borderColor: Palette.goldDim,
    },
    sellBtnText: { fontSize: FontSize.sm, fontWeight: '600', color: Palette.bgApp },
    sellBtnDisabled: { opacity: 0.5 },

    empty: { paddingVertical: Spacing.xl, alignItems: 'center' },
    emptyText: { fontSize: FontSize.base, color: Palette.textSecondary },
});
