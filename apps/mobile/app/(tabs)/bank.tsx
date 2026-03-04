/**
 * bank.tsx — Phase 1.3
 *
 * Full Bank & Inventory UI.
 * Z. Search + filters (Ore, Bar, Other).
 */
import React, { useState, useMemo, useCallback } from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Modal,
    Pressable,
    ListRenderItemInfo,
    TextInput,
} from 'react-native';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { INVENTORY_SLOT_CAP_F2P, INVENTORY_SLOT_CAP_PATRON } from '@/constants/game';
import { getItemMeta, type ItemType } from '@/constants/items';
import { useFocusEffect } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, InventoryItem } from '@/store/gameSlice';
import { AnimatedNumber } from '@/components/AnimatedNumber';

// ── Item Cell ────────────────────────────────────────────────────────────────
function ItemCell({
    item,
    onPress,
    styles,
}: {
    item: InventoryItem;
    onPress: (itemId: string) => void;
    styles: Record<string, StyleProp<ViewStyle | TextStyle>>;
}) {
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
function ItemDetailModal({
    itemId,
    onClose,
    styles,
}: {
    itemId: string | null;
    onClose: () => void;
    styles: Record<string, StyleProp<ViewStyle | TextStyle>>;
}) {
    const dispatch = useAppDispatch();
    const item = useAppSelector((s) => s.game.player.inventory.find((i) => i.id === itemId));
    const customBankTabs = useAppSelector((s) => s.game.player.customBankTabs ?? []);
    const junkItemIds = useAppSelector((s) => s.game.player.junkItemIds ?? []);
    if (!item) return null;
    const meta = getItemMeta(item.id);
    const isJunk = junkItemIds.includes(item.id);
    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.detailOverlay} onPress={onClose}>
                <Pressable style={styles.detailCard} onPress={() => {}}>
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
                        <Text style={[styles.detailStatValue, styles.detailStatValueGold]}>
                            💰 {meta.sellValue.toLocaleString()} each
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailStatLabel}>Total Value</Text>
                        <Text style={[styles.detailStatValue, styles.detailStatValueGold]}>
                            💰 {(meta.sellValue * item.quantity).toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.detailSeparator} />

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

                    <TouchableOpacity
                        style={[styles.detailLockButton, isJunk && styles.detailLockButtonActive]}
                        onPress={() => dispatch(gameActions.toggleJunk(item.id))}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.detailLockText, isJunk && styles.detailLockTextActive]}>
                            {isJunk ? '🗑️ Marked as Junk' : 'Mark as Junk (Sell All Junk)'}
                        </Text>
                    </TouchableOpacity>

                    {customBankTabs.length > 0 && (
                        <>
                            <View style={styles.detailSeparator} />
                            <Text style={[styles.detailStatLabel, { marginBottom: 4 }]}>Add to tab</Text>
                            <View style={styles.detailActionRow}>
                                {customBankTabs.map((tab) => {
                                    const inTab = tab.itemIds.includes(item.id);
                                    return (
                                        <TouchableOpacity
                                            key={tab.id}
                                            style={[styles.detailSellButton, inTab && styles.detailLockButtonActive]}
                                            onPress={() => dispatch(gameActions.assignItemToTab({ tabId: tab.id, itemId: item.id, add: !inTab }))}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.detailSellText}>{tab.emoji} {tab.name}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </>
                    )}

                    <TouchableOpacity style={styles.detailClose} onPress={onClose} activeOpacity={0.8}>
                        <Text style={styles.detailCloseText}>Close</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

// ── Manage Tab Form ───────────────────────────────────────────────────────────
function ManageTabForm({
    onAdd,
    styles,
    palette,
}: {
    onAdd: (name: string, emoji: string) => void;
    styles: Record<string, StyleProp<ViewStyle | TextStyle>>;
    palette: Record<string, string>;
}) {
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('📁');
    const handleAdd = () => {
        const n = name.trim() || 'Tab';
        const e = emoji.trim() || '📁';
        onAdd(n, e);
        setName('');
        setEmoji('📁');
    };
    return (
        <>
            <TextInput
                style={[styles.searchInput, { marginBottom: Spacing.sm }]}
                placeholder="Tab name"
                placeholderTextColor={palette.textMuted}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[styles.searchInput, { marginBottom: Spacing.sm }]}
                placeholder="Emoji (e.g. 📁)"
                placeholderTextColor={palette.textMuted}
                value={emoji}
                onChangeText={setEmoji}
            />
            <TouchableOpacity style={styles.detailSellButton} onPress={handleAdd} activeOpacity={0.8}>
                <Text style={styles.detailSellText}>Add tab</Text>
            </TouchableOpacity>
        </>
    );
}

// ── Bank Screen ──────────────────────────────────────────────────────────────
const FILTER_OPTIONS: { key: ItemType | 'all'; label: string }[] = [
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

export default function BankScreen() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const gold = useAppSelector((s) => s.game.player.gold);
    const lumina = useAppSelector((s) => s.game.player.lumina ?? 0);
    const customBankTabs = useAppSelector((s) => s.game.player.customBankTabs ?? []);
    const junkItemIds = useAppSelector((s) => s.game.player.junkItemIds ?? []);
    const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
    const slotCap = isPatron ? INVENTORY_SLOT_CAP_PATRON : INVENTORY_SLOT_CAP_F2P;

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<ItemType | 'all' | string>('all');
    const [manageTabsOpen, setManageTabsOpen] = useState(false);
    type SortKey = 'name' | 'qty' | 'value';
    const [sortBy, setSortBy] = useState<SortKey>('name');

    const customTab = filter !== 'all' && !FILTER_OPTIONS.some((o) => o.key === filter)
        ? customBankTabs.find((t) => t.id === filter)
        : null;

    const filteredInventory = useMemo(() => {
        let list = inventory;
        if (customTab) {
            const ids = new Set(customTab.itemIds);
            list = list.filter((item) => ids.has(item.id));
        } else if (filter !== 'all') {
            list = list.filter((item) => getItemMeta(item.id).type === filter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((item) => getItemMeta(item.id).label.toLowerCase().includes(q));
        }
        const meta = (id: string) => getItemMeta(id);
        if (sortBy === 'name') {
            list = [...list].sort((a, b) => meta(a.id).label.localeCompare(meta(b.id).label));
        } else if (sortBy === 'qty') {
            list = [...list].sort((a, b) => b.quantity - a.quantity);
        } else {
            list = [...list].sort((a, b) => (meta(b.id).sellValue * b.quantity) - (meta(a.id).sellValue * a.quantity));
        }
        return list;
    }, [inventory, filter, customTab, searchQuery, sortBy]);

    const hasJunkToSell = useMemo(() => {
        const junkSet = new Set(junkItemIds);
        return inventory.some((i) => junkSet.has(i.id) && !i.isLocked && i.quantity > 0);
    }, [inventory, junkItemIds]);

    useFocusEffect(useCallback(() => {
        dispatch(gameActions.clearPulseTab('bank'));
    }, [dispatch]));

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: { flex: 1, backgroundColor: palette.bgApp },
                header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    paddingHorizontal: Spacing.md,
                    paddingTop: Spacing.xl,
                    paddingBottom: Spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                screenTitle: {
                    fontSize: FontSize.xl,
                    fontWeight: '800',
                    color: palette.textPrimary,
                },
                screenSub: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 2,
                },
                screenSubWarning: {
                    color: palette.red,
                    fontWeight: '600',
                },
                headerRight: { alignItems: 'flex-end', gap: 4 },
                goldBadge: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgCard,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: palette.gold,
                    gap: 4,
                },
                goldEmoji: { fontSize: 14 },
                goldText: { fontSize: FontSize.sm, fontWeight: '700', color: palette.gold },
                worthText: { fontSize: FontSize.xs, color: palette.textMuted },
                searchRow: {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                searchInput: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.md,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    fontSize: FontSize.base,
                    color: palette.textPrimary,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                filterScroll: {
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                filterRow: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    gap: Spacing.sm,
                },
                filterChip: {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                filterChipActive: {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: palette.accentPrimary,
                    backgroundColor: palette.accentPrimary + '22',
                },
                filterChipText: { fontSize: FontSize.sm, color: palette.textSecondary },
                filterChipTextActive: {
                    fontSize: FontSize.sm,
                    color: palette.accentPrimary,
                    fontWeight: '600',
                },
                sortRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.xs,
                    gap: Spacing.sm,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                sortLabel: { fontSize: FontSize.xs, color: palette.textMuted, marginRight: 4 },
                sortChip: {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                sortChipActive: {
                    borderColor: palette.accentPrimary,
                    backgroundColor: palette.accentPrimary + '22',
                },
                sortChipText: { fontSize: FontSize.xs, color: palette.textSecondary },
                sortChipTextActive: { fontSize: FontSize.xs, color: palette.accentPrimary, fontWeight: '600' },
                emptyClearBtn: {
                    marginTop: Spacing.md,
                    paddingVertical: 10,
                    paddingHorizontal: Spacing.lg,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.accentPrimary,
                    backgroundColor: palette.accentPrimary + '22',
                },
                emptyClearBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: palette.accentPrimary },
                grid: { padding: Spacing.md, gap: Spacing.sm },
                cell: {
                    width: CELL_SIZE,
                    height: CELL_SIZE + 24,
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
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
                    color: palette.gold,
                    position: 'absolute',
                    top: 4,
                    right: 6,
                },
                cellLabel: {
                    fontSize: 9,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    textTransform: 'capitalize',
                    lineHeight: 11,
                },
                empty: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: Spacing.sm,
                },
                emptyEmoji: { fontSize: 64 },
                emptyTitle: {
                    fontSize: FontSize.lg,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                emptyHint: {
                    fontSize: FontSize.base,
                    color: palette.textSecondary,
                },
                detailOverlay: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: Spacing.lg,
                },
                detailCard: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.xl,
                    padding: Spacing.lg,
                    width: '100%',
                    maxWidth: 360,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                detailEmoji: { fontSize: 48, textAlign: 'center', marginBottom: Spacing.sm },
                detailName: {
                    fontSize: FontSize.xl,
                    fontWeight: '800',
                    color: palette.textPrimary,
                    textAlign: 'center',
                    marginBottom: 4,
                    textTransform: 'capitalize',
                },
                detailDesc: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    marginBottom: Spacing.md,
                    lineHeight: 18,
                },
                detailSeparator: {
                    height: 1,
                    backgroundColor: palette.border,
                    marginVertical: Spacing.md,
                },
                detailRow: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: Spacing.sm,
                },
                detailStatLabel: { fontSize: FontSize.sm, color: palette.textSecondary },
                detailStatValue: {
                    fontSize: FontSize.sm,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                detailStatValueGold: { color: palette.gold },
                detailActionRow: {
                    flexDirection: 'row',
                    gap: Spacing.sm,
                    marginTop: Spacing.xs,
                },
                detailSellButton: {
                    flex: 1,
                    backgroundColor: palette.bgCard,
                    paddingVertical: 10,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: palette.gold,
                },
                detailSellButtonDisabled: {
                    borderColor: palette.border,
                    opacity: 0.5,
                },
                detailSellText: {
                    color: palette.gold,
                    fontWeight: '700',
                    fontSize: FontSize.sm,
                },
                detailLockButton: {
                    marginTop: Spacing.md,
                    backgroundColor: palette.bgApp,
                    paddingVertical: 10,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                detailLockButtonActive: {
                    borderColor: palette.red,
                    backgroundColor: palette.red + '11',
                },
                detailLockText: {
                    color: palette.textSecondary,
                    fontWeight: '600',
                    fontSize: FontSize.sm,
                },
                detailLockTextActive: { color: palette.red },
                detailClose: {
                    marginTop: Spacing.md,
                    backgroundColor: palette.accentPrimary,
                    paddingVertical: 12,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                },
                detailCloseText: {
                    color: palette.white,
                    fontWeight: '700',
                    fontSize: FontSize.base,
                },
            }),
        [palette]
    );

    const renderItem = ({ item }: ListRenderItemInfo<InventoryItem>) => (
        <ItemCell item={item} onPress={setSelectedId} styles={styles} />
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
                    {hasJunkToSell && (
                        <TouchableOpacity
                            style={[styles.goldBadge, { borderColor: palette.red, marginBottom: 4 }]}
                            onPress={() => dispatch(gameActions.sellAllJunk())}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.goldText, { color: palette.red }]}>Sell All Junk</Text>
                        </TouchableOpacity>
                    )}
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
                    placeholderTextColor={palette.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
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
                    {customBankTabs.map((tab) => {
                        const isActive = filter === tab.id;
                        return (
                            <TouchableOpacity
                                key={tab.id}
                                style={[styles.filterChip, isActive && styles.filterChipActive]}
                                onPress={() => setFilter(tab.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                    {tab.emoji} {tab.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity
                        style={styles.filterChip}
                        onPress={() => setManageTabsOpen(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterChipText}>+ Tabs</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.sortRow}>
                <Text style={styles.sortLabel}>Sort:</Text>
                {(['name', 'qty', 'value'] as const).map((key) => {
                    const isActive = sortBy === key;
                    const label = key === 'name' ? 'Name' : key === 'qty' ? 'Qty' : 'Value';
                    return (
                        <TouchableOpacity
                            key={key}
                            style={[styles.sortChip, isActive && styles.sortChipActive]}
                            onPress={() => setSortBy(key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.sortChipText, isActive && styles.sortChipTextActive]}>{label}</Text>
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
                        {inventory.length === 0
                            ? 'Train skills to gather resources!'
                            : 'Try a different filter or search.'}
                    </Text>
                    {(filter !== 'all' || searchQuery.trim() !== '') && inventory.length > 0 && (
                        <TouchableOpacity
                            style={styles.emptyClearBtn}
                            onPress={() => { setFilter('all'); setSearchQuery(''); }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.emptyClearBtnText}>Clear filter & search</Text>
                        </TouchableOpacity>
                    )}
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
            <ItemDetailModal itemId={selectedId} onClose={() => setSelectedId(null)} styles={styles} />

            {/* Manage Tabs Modal */}
            <Modal visible={manageTabsOpen} transparent animationType="fade">
                <Pressable style={styles.detailOverlay} onPress={() => setManageTabsOpen(false)}>
                    <Pressable style={styles.detailCard} onPress={() => {}}>
                        <Text style={styles.detailName}>Custom bank tabs</Text>
                        <Text style={[styles.detailDesc, { marginBottom: Spacing.md }]}>
                            Create tabs and assign items from the item detail view.
                        </Text>
                        {customBankTabs.map((tab) => (
                            <View key={tab.id} style={[styles.detailRow, { marginBottom: Spacing.sm }]}>
                                <Text style={styles.detailStatLabel}>{tab.emoji} {tab.name}</Text>
                                <TouchableOpacity
                                    onPress={() => { dispatch(gameActions.removeCustomBankTab(tab.id)); if (filter === tab.id) setFilter('all'); }}
                                    style={[styles.detailSellButton, { flex: 0, paddingHorizontal: 12 }]}
                                >
                                    <Text style={[styles.detailSellText, { color: palette.red }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <View style={styles.detailSeparator} />
                        <ManageTabForm
                            onAdd={(name, emoji) => {
                                dispatch(gameActions.addCustomBankTab({ id: `custom_${Date.now()}`, name, emoji }));
                            }}
                            styles={styles}
                            palette={palette}
                        />
                        <TouchableOpacity style={styles.detailClose} onPress={() => setManageTabsOpen(false)} activeOpacity={0.8}>
                            <Text style={styles.detailCloseText}>Done</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const CELL_SIZE = 80;
