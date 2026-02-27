/**
 * bank.tsx — Phase 1.3
 *
 * Full Bank & Inventory UI.
 * Grid layout of every item in the player's inventory.
 * Supports tapping an item for a detail modal showing sell value + recipe stubs.
 *
 * ITEM_META is a local registry mapping item IDs to emoji and display name.
 * Extend this as new skills and drops are added.
 */
import React, { useState } from 'react';
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
} from 'react-native';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { InventoryItem } from '@/store/gameSlice';

// ── Item registry ──────────────────────────────────────────────────────────
// Add new entries here whenever a new drop source is added to the game.
interface ItemMeta {
    emoji: string;
    label: string;
    sellValue: number; // gold per unit
    description: string;
}

const ITEM_META: Record<string, ItemMeta> = {
    copper_ore: { emoji: '🪨', label: 'Copper Ore', sellValue: 3, description: 'A common ore found near the surface.' },
    tin_ore: { emoji: '🪨', label: 'Tin Ore', sellValue: 3, description: 'Used with Copper to make Bronze.' },
    iron_ore: { emoji: '⛰️', label: 'Iron Ore', sellValue: 10, description: 'A sturdy ore for smithing mid-tier gear.' },
    coal: { emoji: '⚫', label: 'Coal', sellValue: 15, description: 'Fuel for the furnace. Needed for Steel.' },
    gold_ore: { emoji: '🟡', label: 'Gold Ore', sellValue: 40, description: 'Valuable ore. Smelt into Gold Bars.' },
    mithril_ore: { emoji: '🔵', label: 'Mithril Ore', sellValue: 80, description: 'A rare ore with magical properties.' },
    adamantite_ore: { emoji: '🟢', label: 'Adamantite Ore', sellValue: 150, description: 'Extremely hard. Forms the best non-cosmic armour.' },
    runite_ore: { emoji: '🛸', label: 'Runite Ore', sellValue: 400, description: 'Endgame material. Guarded by Runite Golems.' },
};

const UNKNOWN: ItemMeta = { emoji: '❓', label: 'Unknown Item', sellValue: 1, description: 'An unregistered item.' };

function getMeta(id: string): ItemMeta {
    return ITEM_META[id] ?? { ...UNKNOWN, label: id.replace(/_/g, ' ') };
}

// ── Item Cell ────────────────────────────────────────────────────────────────
function ItemCell({ item, onPress }: { item: InventoryItem; onPress: (item: InventoryItem) => void }) {
    const meta = getMeta(item.id);
    return (
        <TouchableOpacity style={styles.cell} onPress={() => onPress(item)} activeOpacity={0.7}>
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
function ItemDetailModal({ item, onClose }: { item: InventoryItem | null; onClose: () => void }) {
    if (!item) return null;
    const meta = getMeta(item.id);
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

                    <TouchableOpacity style={styles.detailClose} onPress={onClose} activeOpacity={0.8}>
                        <Text style={styles.detailCloseText}>Close</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

// ── Bank Screen ──────────────────────────────────────────────────────────────
export default function BankScreen() {
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const gold = useAppSelector((s) => s.game.player.gold);
    const [selected, setSelected] = useState<InventoryItem | null>(null);

    const renderItem = ({ item }: ListRenderItemInfo<InventoryItem>) => (
        <ItemCell item={item} onPress={setSelected} />
    );

    const totalWorth = inventory.reduce((acc, item) => {
        const meta = getMeta(item.id);
        return acc + meta.sellValue * item.quantity;
    }, 0);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.screenTitle}>Bank</Text>
                    <Text style={styles.screenSub}>{inventory.length} item type{inventory.length !== 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.goldBadge}>
                        <Text style={styles.goldEmoji}>💰</Text>
                        <Text style={styles.goldText}>{gold.toLocaleString()}</Text>
                    </View>
                    {inventory.length > 0 && (
                        <Text style={styles.worthText}>
                            Worth ~{totalWorth >= 1000
                                ? `${(totalWorth / 1000).toFixed(1)}k`
                                : totalWorth.toLocaleString()} gp
                        </Text>
                    )}
                </View>
            </View>

            {/* Filter stub */}
            <View style={styles.filterRow}>
                <View style={styles.filterChipActive}>
                    <Text style={styles.filterChipTextActive}>All</Text>
                </View>
                <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Ores</Text>
                </View>
                <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Bars</Text>
                </View>
                <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Other</Text>
                </View>
            </View>

            {/* Grid */}
            {inventory.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyEmoji}>📦</Text>
                    <Text style={styles.emptyTitle}>Bank is empty</Text>
                    <Text style={styles.emptyHint}>Train Mining to gather ores!</Text>
                </View>
            ) : (
                <FlatList
                    data={inventory}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={4}
                    contentContainerStyle={styles.grid}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Item Detail Modal */}
            <ItemDetailModal item={selected} onClose={() => setSelected(null)} />
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
    },
    detailClose: {
        marginTop: Spacing.lg,
        backgroundColor: Palette.accentPrimary,
        paddingVertical: 12,
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    detailCloseText: { color: Palette.white, fontWeight: '700', fontSize: FontSize.base },
});
