/**
 * bank.tsx — Bank & Inventory UI.
 * Search, filters (Ore, Bar, Log, Fish, Food, Runes, Equipment, Other), custom tabs, Sell All Junk.
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Modal,
    Pressable,
    ListRenderItemInfo,
    TextInput,
    Platform,
    Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { INVENTORY_SLOT_CAP_F2P, INVENTORY_SLOT_CAP_PATRON } from '@/constants/game';
import { getItemMeta, type ItemType } from '@/constants/items';

/** Skills that use this item type. Improves discovery. */
function getUsedInSkills(type: ItemType): string {
    const map: Record<ItemType, string> = {
        ore: 'Mining, Smithing',
        bar: 'Smithing, Forging',
        log: 'Logging',
        fish: 'Fishing, Cooking',
        food: 'Cooking',
        potion: 'Herblore',
        rune: 'Runecrafting',
        equipment: 'Forging',
        other: '',
        pouch: 'Summoning',
        summoning: 'Summoning',
    };
    return map[type] ?? '';
}
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, InventoryItem } from '@/store/gameSlice';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { getItemMasteryTier, getItemMasterySpeedBonus, getItemMasteryYieldBonus } from '@/constants/mastery';

const BANK_CUSTOM_TABS_MAX = 6;

// ── Item Cell ────────────────────────────────────────────────────────────────
function ItemCell({
    item,
    onPress,
    onLongPress,
    styles,
}: {
    item: InventoryItem;
    onPress: (itemId: string) => void;
    onLongPress?: (id: string) => void;
    styles: Record<string, any>;
}) {
    const meta = getItemMeta(item.id);
    return (
        <TouchableOpacity
            style={styles.cell}
            onPress={() => onPress(item.id)}
            onLongPress={onLongPress ? () => onLongPress(item.id) : undefined}
            activeOpacity={0.7}
            delayLongPress={400}
        >
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
    styles: Record<string, any>;
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
                <Pressable style={styles.detailCard} onPress={() => { }}>
                    <Text style={styles.detailEmoji}>{meta.emoji}</Text>
                    <Text style={styles.detailName}>{meta.label}</Text>
                    <Text style={styles.detailDesc}>{meta.description}</Text>
                    {getUsedInSkills(meta.type) ? (
                        <Text style={[styles.detailStatLabel, { marginTop: 4 }]}>
                            Used in: {getUsedInSkills(meta.type)}
                        </Text>
                    ) : null}

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

                    {/* Item Mastery Section */}
                    {(() => {
                        const lifetime = useAppSelector(s => s.game.player.lifetimeStats);
                        const count = lifetime?.byItem?.[item.id] ?? 0;
                        const tier = getItemMasteryTier(count);
                        const speed = getItemMasterySpeedBonus(count);
                        const yields = getItemMasteryYieldBonus(count);

                        let nextThreshold = 100;
                        if (tier === 1) nextThreshold = 500;
                        else if (tier === 2) nextThreshold = 2500;
                        else if (tier === 3) nextThreshold = 10000;

                        const progress = tier === 4 ? 1 : Math.min(1, count / nextThreshold);

                        return (
                            <View style={styles.masterySection}>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailStatLabel, { color: tier > 0 ? '#fbbf24' : '#9ca3af' }]}>
                                        Mastery Tier {tier > 0 ? 'I'.repeat(tier).replace(/IIII/, 'IV') : '0'}
                                    </Text>
                                    <Text style={styles.detailStatValue}>{count.toLocaleString()} Produced</Text>
                                </View>
                                {tier < 4 && (
                                    <View style={styles.masteryProgressBg}>
                                        <View style={[styles.masteryProgressFill, { width: `${progress * 100}%` }]} />
                                    </View>
                                )}
                                <View style={styles.masteryBonusRow}>
                                    <Text style={[styles.masteryBonusText, { color: speed > 1 ? '#10b981' : '#6b7280' }]}>
                                        ⚡ Speed: {speed > 1 ? `+${Math.round((speed - 1) * 100)}%` : 'Base'}
                                    </Text>
                                    <Text style={[styles.masteryBonusText, { color: yields > 1 ? '#10b981' : '#6b7280' }]}>
                                        📦 Yield: {yields > 1 ? `+${Math.round((yields - 1) * 100)}%` : 'Base'}
                                    </Text>
                                </View>
                            </View>
                        );
                    })()}

                    <View style={styles.detailSeparator} />

                    <View style={styles.detailActionRow}>
                        <TouchableOpacity
                            style={[styles.detailSellButton, item.isLocked && styles.detailSellButtonDisabled]}
                            disabled={item.isLocked}
                            onPress={() => {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                dispatch(gameActions.sellItem({ id: item.id, quantity: 1, pricePer: meta.sellValue }));
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.detailSellText}>Sell 1</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.detailSellButton, item.isLocked && styles.detailSellButtonDisabled]}
                            disabled={item.isLocked}
                            onPress={() => {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                dispatch(gameActions.sellItem({ id: item.id, quantity: item.quantity, pricePer: meta.sellValue }));
                                onClose();
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.detailSellText}>Sell All</Text>
                        </TouchableOpacity>
                    </View>

                    {meta.type === 'equipment' && (
                        <>
                            <TouchableOpacity
                                style={[styles.detailSellButton, { marginTop: Spacing.sm, borderColor: '#3b82f6', backgroundColor: '#3b82f6' + '11' }]}
                                onPress={() => {
                                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    dispatch(gameActions.equipItem({ itemId: item.id }));
                                    onClose();
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.detailSellText, { color: '#3b82f6' }]}>Equip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.detailSellButton, item.quantity < 10 && styles.detailSellButtonDisabled, { marginTop: Spacing.sm, borderColor: '#a855f7', backgroundColor: '#a855f7' + '11' }]}
                                onPress={() => {
                                    if (item.quantity < 10) return;
                                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    dispatch(gameActions.refineEquipment({ itemId: item.id }));
                                    if (item.quantity < 11) onClose(); // Auto-close if we just used the last 10
                                }}
                                disabled={item.quantity < 10}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.detailSellText, { color: '#a855f7' }]}>
                                    {item.quantity >= 10 ? '✨ Refine (Cost: 10)' : `✨ Refine (Need 10, Have ${item.quantity})`}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {item.id === 'bones' && (
                        <TouchableOpacity
                            style={[styles.detailSellButton, { marginTop: Spacing.sm, borderColor: '#eab308', backgroundColor: '#eab308' + '11' }]}
                            onPress={() => {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                dispatch(gameActions.buryBone({ itemId: item.id }));
                                onClose();
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.detailSellText, { color: '#eab308' }]}>Bury</Text>
                        </TouchableOpacity>
                    )}

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
                                    const tabIcon = tab.itemIds.length > 0 ? getItemMeta(tab.itemIds[0]).emoji : tab.emoji;
                                    return (
                                        <TouchableOpacity
                                            key={tab.id}
                                            style={[styles.detailSellButton, inTab && styles.detailLockButtonActive]}
                                            onPress={() => dispatch(gameActions.assignItemToTab({ tabId: tab.id, itemId: item.id, add: !inTab }))}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.detailSellText}>{tabIcon} {tab.name}</Text>
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
    styles: Record<string, any>;
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
    { key: 'potion', label: 'Potions' },
    { key: 'rune', label: 'Runes' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'other', label: 'Other' },
];

export default function BankScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const gold = useAppSelector((s) => s.game.player.gold);
    const lumina = useAppSelector((s) => s.game.player.lumina ?? 0);
    const customBankTabs = useAppSelector((s) => s.game.player.customBankTabs ?? []);
    const junkItemIds = useAppSelector((s) => s.game.player.junkItemIds ?? []);
    const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
    const slotCap = isPatron ? INVENTORY_SLOT_CAP_PATRON : INVENTORY_SLOT_CAP_F2P;

    const lastBankTab = useAppSelector((s) => s.game.player.lastBankTab ?? 'main');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTabId, setSelectedTabId] = useState<'main' | string>('main');
    const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');
    const [manageTabsOpen, setManageTabsOpen] = useState(false);
    type SortKey = 'name' | 'qty' | 'value';
    const [sortBy, setSortBy] = useState<SortKey>('name');

    const customTab = selectedTabId !== 'main' ? customBankTabs.find((t) => t.id === selectedTabId) : null;

    useEffect(() => {
        if (lastBankTab === 'main' || customBankTabs.some((t) => t.id === lastBankTab)) {
            setSelectedTabId(lastBankTab);
        }
    }, [lastBankTab, customBankTabs]);

    const handleTabSelect = useCallback((tabId: 'main' | string) => {
        setSelectedTabId(tabId);
        dispatch(gameActions.setLastBankTab(tabId));
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, [dispatch]);

    const filteredInventory = useMemo(() => {
        let list = inventory;
        if (customTab) {
            const ids = new Set(customTab.itemIds);
            list = list.filter((item) => ids.has(item.id));
        }
        if (typeFilter !== 'all') {
            list = list.filter((item) => getItemMeta(item.id).type === typeFilter);
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
    }, [inventory, customTab, typeFilter, searchQuery, sortBy]);

    const canAddTab = customBankTabs.length < BANK_CUSTOM_TABS_MAX;

    const handleLongPressItem = useCallback((itemId: string) => {
        if (!canAddTab) return;
        const meta = getItemMeta(itemId);
        Alert.alert(
            'New tab',
            `Create a new tab with "${meta.label}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Create tab',
                    onPress: () => {
                        const id = `custom_${Date.now()}`;
                        dispatch(gameActions.addCustomBankTabWithItem({
                            id,
                            name: meta.label,
                            emoji: meta.emoji,
                            itemId,
                        }));
                        setSelectedTabId(id);
                        dispatch(gameActions.setLastBankTab(id));
                        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    },
                },
            ]
        );
    }, [canAddTab, dispatch]);

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
                headerBox: {
                    padding: Spacing.md,
                    paddingBottom: Spacing.sm,
                    backgroundColor: palette.bgCard,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: Spacing.sm,
                },
                screenTitle: {
                    fontSize: FontSize.xl,
                    color: palette.textPrimary,
                    fontFamily: FontCinzelBold,
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
                    marginBottom: Spacing.sm,
                },
                searchInput: {
                    backgroundColor: palette.bgInput,
                    borderRadius: Radius.md,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    fontSize: FontSize.base,
                    color: palette.textPrimary,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                filterScroll: {
                    flexGrow: 0,
                    flexShrink: 0,
                },
                filterScrollContent: { flexGrow: 0 },
                tabBarRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    gap: Spacing.sm,
                },
                tabChip: {
                    minWidth: 56,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 8,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabChipActive: {
                    borderColor: palette.accentPrimary,
                    backgroundColor: palette.accentPrimary + '22',
                },
                tabChipAdd: {
                    borderStyle: 'dashed',
                },
                tabChipDisabled: {
                    opacity: 0.6,
                },
                tabChipEmoji: { fontSize: 18, marginBottom: 2 },
                tabChipText: { fontSize: 11, color: palette.textSecondary, fontWeight: '600' },
                tabChipTextActive: { color: palette.accentPrimary },
                filterRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.xs,
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
                    paddingVertical: Spacing.xs,
                    gap: Spacing.sm,
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
                // Mastery styles
                masterySection: { marginVertical: 4 },
                masteryProgressBg: {
                    height: 8,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: 4,
                    marginVertical: 10,
                    overflow: 'hidden',
                },
                masteryProgressFill: {
                    height: '100%',
                    backgroundColor: '#fbbf24',
                },
                masteryBonusRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
                masteryBonusText: { fontSize: 12, fontWeight: 'bold' },

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
        <ItemCell item={item} onPress={setSelectedId} onLongPress={handleLongPressItem} styles={styles} />
    );

    const totalWorth = inventory.reduce((acc, item) => {
        const meta = getItemMeta(item.id);
        return acc + meta.sellValue * item.quantity;
    }, 0);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.headerBox}>
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
                                onPress={() => {
                                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    dispatch(gameActions.sellAllJunk());
                                }}
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

                {/* Tab bar (OSRS-style: Main + up to 6 custom + Add) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
                    <View style={styles.tabBarRow}>
                        <TouchableOpacity
                            style={[styles.tabChip, selectedTabId === 'main' && styles.tabChipActive]}
                            onPress={() => handleTabSelect('main')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.tabChipEmoji, selectedTabId === 'main' && styles.tabChipTextActive]}>📦</Text>
                            <Text style={[styles.tabChipText, selectedTabId === 'main' && styles.tabChipTextActive]}>Main</Text>
                        </TouchableOpacity>
                        {customBankTabs.map((tab) => {
                            const isActive = selectedTabId === tab.id;
                            const tabIcon = tab.itemIds.length > 0 ? getItemMeta(tab.itemIds[0]).emoji : tab.emoji;
                            return (
                                <TouchableOpacity
                                    key={tab.id}
                                    style={[styles.tabChip, isActive && styles.tabChipActive]}
                                    onPress={() => handleTabSelect(tab.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.tabChipEmoji, isActive && styles.tabChipTextActive]}>{tabIcon}</Text>
                                    <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]} numberOfLines={1}>{tab.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity
                            style={[styles.tabChip, styles.tabChipAdd, !canAddTab && styles.tabChipDisabled]}
                            onPress={() => canAddTab && setManageTabsOpen(true)}
                            activeOpacity={0.7}
                            disabled={!canAddTab}
                        >
                            <Text style={[styles.tabChipText, !canAddTab && { color: palette.textDisabled }]}>
                                {canAddTab ? '+ Add' : 'Max'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Type filters (within current tab) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
                    <View style={styles.filterRow}>
                        {FILTER_OPTIONS.map((opt) => {
                            const isActive = typeFilter === (opt.key === 'all' ? 'all' : opt.key);
                            return (
                                <TouchableOpacity
                                    key={opt.key}
                                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                                    onPress={() => {
                                        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setTypeFilter(opt.key === 'all' ? 'all' : opt.key as ItemType);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search items..."
                        placeholderTextColor={palette.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

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
                    {(typeFilter !== 'all' || searchQuery.trim() !== '') && inventory.length > 0 && (
                        <TouchableOpacity
                            style={styles.emptyClearBtn}
                            onPress={() => { setTypeFilter('all'); setSearchQuery(''); }}
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
                    <Pressable style={styles.detailCard} onPress={() => { }}>
                        <Text style={styles.detailName}>Custom bank tabs</Text>
                        <Text style={[styles.detailDesc, { marginBottom: Spacing.sm }]}>
                            Max 6 tabs. Long-press an item in the grid to create a tab with that item.
                        </Text>
                        {!canAddTab && (
                            <Text style={[styles.detailStatLabel, { marginBottom: Spacing.sm, color: palette.gold }]}>
                                At limit. Delete a tab to add another.
                            </Text>
                        )}
                        {customBankTabs.map((tab) => {
                            const tabIcon = tab.itemIds.length > 0 ? getItemMeta(tab.itemIds[0]).emoji : tab.emoji;
                            return (
                                <View key={tab.id} style={[styles.detailRow, { marginBottom: Spacing.sm }]}>
                                    <Text style={styles.detailStatLabel}>{tabIcon} {tab.name}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            dispatch(gameActions.removeCustomBankTab(tab.id));
                                            if (selectedTabId === tab.id) setSelectedTabId('main');
                                        }}
                                        style={[styles.detailSellButton, { flex: 0, paddingHorizontal: 12 }]}
                                    >
                                        <Text style={[styles.detailSellText, { color: palette.red }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                        <View style={styles.detailSeparator} />
                        {canAddTab && (
                            <ManageTabForm
                                onAdd={(name, emoji) => {
                                    dispatch(gameActions.addCustomBankTab({ id: `custom_${Date.now()}`, name, emoji }));
                                }}
                                styles={styles}
                                palette={palette}
                            />
                        )}
                        <TouchableOpacity style={styles.detailClose} onPress={() => setManageTabsOpen(false)} activeOpacity={0.8}>
                            <Text style={styles.detailCloseText}>Done</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const CELL_SIZE = 80;
