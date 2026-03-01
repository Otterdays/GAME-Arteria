/**
 * Patron's Pack — Premium expansion purchase screen.
 * [TRACE: Patron's Pack] Mock purchase; real IAP to be wired later.
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';

const BENEFITS = [
    { emoji: '⏳', label: '7-day offline cap', desc: 'Progress accrues for up to 7 days while away (vs 24h F2P)' },
    { emoji: '📦', label: '100 bank slots', desc: 'Double your storage (50 → 100 unique items)' },
    { emoji: '✨', label: '+20% XP bonus', desc: 'Earn XP 20% faster while playing' },
    { emoji: '🏆', label: 'Patron badge', desc: 'Gold badge displayed on your profile' },
];

export default function PatronScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);

    const handleUnlock = () => {
        dispatch(gameActions.setPatron(true));
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen
                options={{
                    title: "Patron's Pack",
                    headerShown: false,
                }}
            />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                >
                    <Text style={styles.backText}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Patron's Pack</Text>
                <Text style={styles.subtitle}>Premium expansion — one-time unlock</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroCard}>
                    <Text style={styles.heroEmoji}>🌟</Text>
                    <Text style={styles.heroTitle}>
                        {isPatron ? 'Thank you, Patron!' : "Patron's Pack"}
                    </Text>
                    {!isPatron && (
                        <Text style={styles.heroPrice}>$4.99 — one time</Text>
                    )}
                    {isPatron && (
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>Active</Text>
                        </View>
                    )}
                </View>

                <View style={styles.benefitsSection}>
                    <Text style={styles.sectionTitle}>Benefits</Text>
                    {BENEFITS.map((b, i) => (
                        <View key={i} style={styles.benefitRow}>
                            <Text style={styles.benefitEmoji}>{b.emoji}</Text>
                            <View style={styles.benefitBody}>
                                <Text style={styles.benefitLabel}>{b.label}</Text>
                                <Text style={styles.benefitDesc}>{b.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {!isPatron && (
                    <TouchableOpacity
                        style={styles.unlockButton}
                        onPress={handleUnlock}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.unlockButtonText}>Unlock Patron's Pack</Text>
                        <Text style={styles.unlockButtonSub}>Mock purchase — no charge</Text>
                    </TouchableOpacity>
                )}

                {isPatron && (
                    <View style={styles.thankYouNote}>
                        <Text style={styles.thankYouText}>
                            Your support helps us build Arteria. Enjoy the benefits!
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Palette.bgApp },
    header: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Palette.border,
    },
    backButton: { alignSelf: 'flex-start', paddingVertical: Spacing.sm, paddingRight: Spacing.md },
    backText: { fontSize: FontSize.base, color: Palette.accentPrimary, fontWeight: '600' },
    title: { fontSize: FontSize.xl, fontWeight: '700', color: Palette.textPrimary },
    subtitle: { fontSize: FontSize.sm, color: Palette.textSecondary, marginTop: 2 },

    scroll: { flex: 1 },
    scrollContent: { padding: Spacing.md, paddingBottom: Spacing['2xl'] },

    heroCard: {
        backgroundColor: Palette.bgCard,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Palette.border,
        padding: Spacing.xl,
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    heroEmoji: { fontSize: 48, marginBottom: Spacing.sm },
    heroTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Palette.textPrimary },
    heroPrice: { fontSize: FontSize.lg, color: Palette.gold, marginTop: Spacing.sm, fontWeight: '600' },
    activeBadge: {
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        backgroundColor: 'rgba(255,202,40,0.2)',
        borderWidth: 1,
        borderColor: Palette.gold,
    },
    activeBadgeText: { fontSize: FontSize.sm, fontWeight: '700', color: Palette.gold },

    benefitsSection: { marginBottom: Spacing.xl },
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Palette.accentPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.md,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Palette.bgCard,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Palette.border,
    },
    benefitEmoji: { fontSize: 24, marginRight: Spacing.md },
    benefitBody: { flex: 1 },
    benefitLabel: { fontSize: FontSize.base, fontWeight: '600', color: Palette.textPrimary },
    benefitDesc: { fontSize: FontSize.sm, color: Palette.textSecondary, marginTop: 2 },

    unlockButton: {
        backgroundColor: Palette.green,
        borderRadius: Radius.md,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Palette.greenDim,
    },
    unlockButtonText: { fontSize: FontSize.lg, fontWeight: '700', color: Palette.white },
    unlockButtonSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', marginTop: 4 },

    thankYouNote: {
        backgroundColor: 'rgba(74,144,226,0.1)',
        borderRadius: Radius.md,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Palette.accentPrimary,
    },
    thankYouText: { fontSize: FontSize.base, color: Palette.textSecondary, textAlign: 'center' },
});
