import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radius, FontSize, FontCinzel, FontCinzelBold, HeaderShadow, ShadowMedium } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { PATCH_HISTORY } from '@/constants/patchHistory';

export default function PatchNotesScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: palette.bgApp,
        },
        header: {
            paddingTop: insets.top + Spacing.sm,
            paddingHorizontal: Spacing.md,
            paddingBottom: Spacing.md,
            backgroundColor: palette.bgCard,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: palette.border,
            ...HeaderShadow,
        },
        backButton: {
            marginRight: Spacing.md,
            width: 40,
            height: 40,
            borderRadius: Radius.full,
            backgroundColor: palette.bgInput,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            fontSize: FontSize.lg,
            fontFamily: FontCinzelBold,
            color: palette.textPrimary,
        },
        scroll: {
            flex: 1,
        },
        content: {
            padding: Spacing.md,
            paddingBottom: insets.bottom + Spacing.xl,
        },
        versionCard: {
            backgroundColor: palette.bgCard,
            borderRadius: Radius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
            borderWidth: 1,
            borderColor: palette.border,
            ...ShadowMedium,
            shadowColor: palette.accentPrimary,
            shadowOpacity: 0.1,
        },
        versionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
            paddingBottom: Spacing.xs,
        },
        versionText: {
            fontSize: FontSize.lg,
            fontFamily: FontCinzelBold,
            color: palette.gold,
        },
        dateText: {
            fontSize: FontSize.xs,
            color: palette.textMuted,
            fontFamily: 'Inter',
        },
        sectionLabel: {
            fontSize: FontSize.sm,
            fontFamily: FontCinzelBold,
            color: palette.accentSecondary,
            marginTop: Spacing.sm,
            marginBottom: Spacing.xs,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        bulletRow: {
            flexDirection: 'row',
            marginBottom: 4,
            paddingLeft: Spacing.xs,
        },
        bullet: {
            fontSize: FontSize.sm,
            color: palette.accentPrimary,
            marginRight: 6,
            fontWeight: 'bold',
        },
        bulletText: {
            fontSize: FontSize.sm,
            color: palette.textSecondary,
            flex: 1,
            lineHeight: 20,
        },
    }), [palette, insets]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={palette.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chronicles of Arteria</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                {PATCH_HISTORY.map((patch, idx) => (
                    <View key={`${patch.version}-${idx}`} style={styles.versionCard}>
                        <View style={styles.versionHeader}>
                            <Text style={styles.versionText}>v{patch.version}</Text>
                            <Text style={styles.dateText}>{patch.date}</Text>
                        </View>

                        {patch.added && patch.added.length > 0 && (
                            <View>
                                <Text style={styles.sectionLabel}>Added</Text>
                                {patch.added.map((item, i) => (
                                    <View key={i} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {patch.changed && patch.changed.length > 0 && (
                            <View>
                                <Text style={styles.sectionLabel}>Changed</Text>
                                {patch.changed.map((item, i) => (
                                    <View key={i} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {patch.fixed && patch.fixed.length > 0 && (
                            <View>
                                <Text style={styles.sectionLabel}>Fixed</Text>
                                {patch.fixed.map((item, i) => (
                                    <View key={i} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
