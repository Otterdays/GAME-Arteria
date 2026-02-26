import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Palette, Spacing, FontSize } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';

export default function BankScreen() {
    const inventory = useAppSelector((s) => s.game.player.inventory);
    const gold = useAppSelector((s) => s.game.player.gold);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bank</Text>
                <View style={styles.goldBadge}>
                    <Text style={styles.goldEmoji}>💰</Text>
                    <Text style={styles.goldText}>{gold.toLocaleString()}</Text>
                </View>
            </View>
            {inventory.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emoji}>📦</Text>
                    <Text style={styles.emptyText}>Your bank is empty</Text>
                    <Text style={styles.emptyHint}>
                        Train skills to gather resources!
                    </Text>
                </View>
            ) : (
                <View style={styles.itemGrid}>
                    {inventory.map((item) => (
                        <View key={item.id} style={styles.itemCell}>
                            <Text style={styles.itemName}>{item.id.replace(/_/g, ' ')}</Text>
                            <Text style={styles.itemQty}>x{item.quantity.toLocaleString()}</Text>
                        </View>
                    ))}
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Palette.bgApp },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.md,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Palette.textPrimary,
    },
    goldBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Palette.bgCard,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: Palette.gold,
    },
    goldEmoji: { fontSize: 16, marginRight: 4 },
    goldText: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Palette.gold,
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: { fontSize: 64, marginBottom: Spacing.md },
    emptyText: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Palette.textPrimary,
        marginBottom: Spacing.xs,
    },
    emptyHint: {
        fontSize: FontSize.base,
        color: Palette.textSecondary,
    },
    itemGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
    },
    itemCell: {
        backgroundColor: Palette.bgCard,
        borderRadius: 8,
        padding: Spacing.sm,
        borderWidth: 1,
        borderColor: Palette.border,
        width: '30%',
        alignItems: 'center',
    },
    itemName: {
        fontSize: FontSize.xs,
        color: Palette.textPrimary,
        textTransform: 'capitalize',
        textAlign: 'center',
        marginBottom: 4,
    },
    itemQty: {
        fontSize: FontSize.sm,
        color: Palette.gold,
        fontWeight: '700',
    },
});
