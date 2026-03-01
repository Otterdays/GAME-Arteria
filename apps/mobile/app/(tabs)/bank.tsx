/**
 * bank.tsx — Phase 1.3
 *
 * Full Bank & Inventory UI.
 * Z. Search + filters (Ore, Bar, Other).
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Modal,
    Pressable,
    ListRenderItemInfo,
    TextInput,
} from 'react-native';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { INVENTORY_SLOT_CAP_F2P, INVENTORY_SLOT_CAP_PATRON } from '@/constants/game';
import { getItemMeta, type ItemType } from '@/constants/items';
import { useFocusEffect } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, InventoryItem } from '@/store/gameSlice';
import { AnimatedNumber } from '@/components/AnimatedNumber';

// ── Item Cell ────────────────────────────────────────────────────────────────
function ItemCell({ item, onPress }: { item: InventoryItem; onPress: (itemId: string) => void }) {
    const meta = getItemMeta(item.id);
    return (
        <TouchableOpacity style={styles.cell} onPress={() => onPress(item.id)} activeOpacity={0.7}>
            {item.isLocked && <Text style={styles.cellLocked}>🔒</Text>}
            <Text style={styles.cellEmoji}>{meta.emoji}</Text>
            <Text style={styles.cellQty}>{item.quantity >= 1000
                ? `${(item.quantity / 1000).toFixed(1)}k`
                : item.quantity.toLocaleString()}
            </Text>
            <Text style={styles.cellLabel} numberOfLines={2}>{meta.label}</Text>
        </TouchableOpacity>
    );
}

// ── Item Detail Modal ────────────────────────────────────────────────────────
function ItemDetailModal({ itemId, onClose }: { itemId: string | null; onClose: () => void }) {
    const dispatch = useAppDispatch();
    const item = useAppSelector((s) => s.game.player.inventory.find((i) => i.id === itemId));
    if (!item) return null;
    const meta = getItemMeta(item.id);
    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.detailOverlay} onPress={onClose}>
                <Pressable style={styles.detailCard} onPress={() => {/* stop propagation */ }}>
                    <Text style={styles.detailEmoji}>{meta.emoji}</Text>
                    <Text style={styles.detailName}>{meta.label}</Text>
                    <Text style={styles.detailDesc}>{meta.description}</Text>

                    <View style={styles.detailSeparator} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailStatLabel}>Owned</Text>
                        <Text style={styles.detailStatValue}>{item.quantity.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailStatLabel}>Sell Value</Text>
                        <Text style={[styles.detailStatValue, { color: Palette.gold }]}>
                            💰 {meta.sellValue.toLocaleString()} each
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailStatLabel}>Total Value</Text>
                        <Text style={[styles.detailStatValue, { color: Palette.gold }]}>
                            💰 {(meta.sellValue * item.quantity).toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.detailSeparator} />
                    <Text style={styles.detailRecipeHint}>⚗️ Used in recipes: Coming in Phase 1.3+</Text>

                    <View style={styles.detailActionRow}>
                        <TouchableOpacity
                            style={[styles.detailSellButton, item.isLocked && styles.detailSellButtonDisabled]}
                            disabled={item.isLocked}
                            onPress={() => dispatch(gameActions.sellItem({ id: item.id, quantity: 1, pricePer: meta.sellValue }))}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.detailSellText}>Sell 1</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.detailSellButton, item.isLocked && styles.detailSellButtonDisabled]}
                            disabled={item.isLocked}
                            onPress={() => {
                                dispatch(gameActions.sellItem({ id: item.id, quantity: item.quantity, pricePer: meta.sellValue }));
                                onClose();
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.detailSellText}>Sell All</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.detailLockButton, item.isLocked && styles.detailLockButtonActive]}
                        onPress={() => dispatch(gameActions.toggleItemLock(item.id))}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.detailLockText, item.isLocked && styles.detailLockTextActive]}>
                            {item.isLocked ? '🔒 Item Locked' : '🔓 Unlocked (Tap to Lock)'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.detailClose} onPress={onClose} activeOpacity={0.8}>
                        <Text style={styles.detailCloseText}>Close</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

// ── Bank Screen ──────────────────────────────────────────────────────────────
const FILTER_OPTIONS: { key: ItemType | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ore', label: 'Ores' },
    { key: 'bar', label: 'Bars' },
    { key: 'log', label: 'Logs' },
    { key: 'other', label: 'Other' },
];

export default function BankScreen() {
    const dispatch = useAppDispatch();
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const gold = useAppSelector((s) => s.game.player.gold);
    const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
    const slotCap = isPatron ? INVENTORY_SLOT_CAP_PATRON : INVENTORY_SLOT_CAP_F2P;

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<ItemType | 'all'>('all');

    const filteredInventory = useMemo(() => {
        let list = inventory;
        if (filter !== 'all') {
            list = list.filter((item) => getItemMeta(item.id).type === filter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((item) => getItemMeta(item.id).label.toLowerCase().includes(q));
        }
        return list;
    }, [inventory, filter, searchQuery]);

    useFocusEffect(useCallback(() => {
        dispatch(gameActions.clearPulseTab('bank'));
    }, [dispatch]));

    const renderItem = ({ item }: ListRenderItemInfo<InventoryItem>) => (
        <ItemCell item={item} onPress={setSelectedId} />
    );

    const totalWorth = inventory.reduce((acc, item) => {
        const meta = getItemMeta(item.id);
        return acc + meta.sellValue * item.quantity;
    }, 0);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.screenTitle}>Bank</Text>
                    <Text style={[styles.screenSub, inventory.length >= slotCap && styles.screenSubWarning]}>
                        {inventory.length} / {slotCap} slots
                        {inventory.length >= slotCap && ' — Full!'}
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.goldBadge}>
                        <Text style={styles.goldEmoji}>💰</Text>
                        <AnimatedNumber
                            value={gold}
                            style={styles.goldText}
                            formatValue={(v) => v.toLocaleString()}
                        />
                    </View>
                    {inventory.length > 0 && (
                        <Text style={styles.worthText}>
                            Worth ~<AnimatedNumber
                                value={totalWorth}
                                formatValue={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString()}
                            /> gp
                        </Text>
                    )}
                </View>
            </View>

            {/* Z. Search + Filters */}
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items..."
                    placeholderTextColor={Palette.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <View style={styles.filterRow}>
                {FILTER_OPTIONS.map((opt) => {
                    const isActive = filter === opt.key;
                    return (
                        <TouchableOpacity
                            key={opt.key}
                            style={[styles.filterChip, isActive && styles.filterChipActive]}
                            onPress={() => setFilter(opt.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Grid */}
            {filteredInventory.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyEmoji}>📦</Text>
                    <Text style={styles.emptyTitle}>
                        {inventory.length === 0 ? 'Bank is empty' : 'No matching items'}
                    </Text>
                    <Text style={styles.emptyHint}>
                        {inventory.length === 0 ? 'Train Mining to gather ores!' : 'Try a different filter or search.'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredInventory}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={4}
                    contentContainerStyle={styles.grid}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Item Detail Modal */}
            <ItemDetailModal itemId={selectedId} onClose={() => setSelectedId(null)} />
        </SafeAreaView>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const CELL_SIZE = 80;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Palette.bgApp },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Palette.border,
    },
    screenTitle: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Palette.textPrimary,
    },
    screenSub: {
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
        marginTop: 2,
    },
    screenSubWarning: {
        color: Palette.red,
        fontWeight: '600',
    },
    headerRight: { alignItems: 'flex-end', gap: 4 },
    goldBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.bgCard,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Palette.gold,
        gap: 4,
    },
    goldEmoji: { fontSize: 14 },
    goldText: { fontSize: FontSize.sm, fontWeight: '700', color: Palette.gold },
    worthText: { fontSize: FontSize.xs, color: Palette.textMuted },

    // Z. Search
    searchRow: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Palette.border,
    },
    searchInput: {
        backgroundColor: Palette.bgCard,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        fontSize: FontSize.base,
        color: Palette.textPrimary,
        borderWidth: 1,
        borderColor: Palette.border,
    },

    // Filter row
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Palette.border,
    },
    filterChip: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    filterChipActive: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Palette.accentPrimary,
        backgroundColor: Palette.accentPrimary + '22',
    },
    filterChipText: { fontSize: FontSize.sm, color: Palette.textSecondary },
    filterChipTextActive: { fontSize: FontSize.sm, color: Palette.accentPrimary, fontWeight: '600' },

    // Grid
    grid: { padding: Spacing.md, gap: Spacing.sm },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE + 24,
        backgroundColor: Palette.bgCard,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Palette.border,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
        padding: Spacing.xs,
    },
    cellEmoji: { fontSize: 28, marginBottom: 2 },
    cellLocked: {
        fontSize: FontSize.xs,
        position: 'absolute',
        top: 6,
        left: 6,
    },
    cellQty: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Palette.gold,
        position: 'absolute',
        top: 4,
        right: 6,
    },
    cellLabel: {
        fontSize: 9,
        color: Palette.textSecondary,
        textAlign: 'center',
        textTransform: 'capitalize',
        lineHeight: 11,
    },

    // Empty state
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm },
    emptyEmoji: { fontSize: 64 },
    emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Palette.textPrimary },
    emptyHint: { fontSize: FontSize.base, color: Palette.textSecondary },

    // Item detail modal
    detailOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    detailCard: {
        backgroundColor: Palette.bgCard,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        width: '100%',
        maxWidth: 360,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    detailEmoji: { fontSize: 48, textAlign: 'center', marginBottom: Spacing.sm },
    detailName: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Palette.textPrimary,
        textAlign: 'center',
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    detailDesc: {
        fontSize: FontSize.sm,
        color: Palette.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.md,
        lineHeight: 18,
    },
    detailSeparator: {
        height: 1,
        backgroundColor: Palette.border,
        marginVertical: Spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    detailStatLabel: { fontSize: FontSize.sm, color: Palette.textSecondary },
    detailStatValue: { fontSize: FontSize.sm, fontWeight: '700', color: Palette.textPrimary },
    detailRecipeHint: {
        fontSize: FontSize.sm,
        color: Palette.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: Spacing.md,
    },
    detailActionRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    detailSellButton: {
        flex: 1,
        backgroundColor: Palette.bgCard,
        paddingVertical: 10,
        borderRadius: Radius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Palette.gold,
    },
    detailSellButtonDisabled: {
        borderColor: Palette.border,
        opacity: 0.5,
    },
    detailSellText: { color: Palette.gold, fontWeight: '700', fontSize: FontSize.sm },
    detailLockButton: {
        marginTop: Spacing.md,
        backgroundColor: Palette.bgApp,
        paddingVertical: 10,
        borderRadius: Radius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Palette.border,
    },
    detailLockButtonActive: {
        borderColor: Palette.red,
        backgroundColor: Palette.red + '11',
    },
    detailLockText: { color: Palette.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
    detailLockTextActive: { color: Palette.red },
    detailClose: {
        marginTop: Spacing.md,
        backgroundColor: Palette.accentPrimary,
        paddingVertical: 12,
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    detailCloseText: { color: Palette.white, fontWeight: '700', fontSize: FontSize.base },
});
