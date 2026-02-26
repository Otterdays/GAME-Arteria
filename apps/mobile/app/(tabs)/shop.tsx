import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Palette, Spacing, FontSize } from '@/constants/theme';

export default function ShopScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Shop</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.emoji}>🏪</Text>
                <Text style={styles.comingSoon}>Coming Soon</Text>
                <Text style={styles.description}>
                    Buy and sell items with the merchant. Upgrade your gear and stock up on supplies.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Palette.bgApp },
    header: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.md,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Palette.textPrimary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    emoji: { fontSize: 64, marginBottom: Spacing.md },
    comingSoon: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Palette.accentPrimary,
        marginBottom: Spacing.sm,
    },
    description: {
        fontSize: FontSize.base,
        color: Palette.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
