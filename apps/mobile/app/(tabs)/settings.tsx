import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { Palette, Spacing, FontSize } from '@/constants/theme';

function SettingsRow({
    label,
    value,
    description,
}: {
    label: string;
    value?: boolean;
    description?: string;
}) {
    return (
        <View style={styles.row}>
            <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>{label}</Text>
                {description && (
                    <Text style={styles.rowDesc}>{description}</Text>
                )}
            </View>
            {value !== undefined && (
                <Switch
                    value={value}
                    thumbColor={Palette.white}
                    trackColor={{
                        false: Palette.bgApp,
                        true: Palette.accentPrimary,
                    }}
                />
            )}
        </View>
    );
}

export default function SettingsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gameplay</Text>
                <SettingsRow
                    label="Offline Progression"
                    value={true}
                    description="Calculate progress while app is closed"
                />
                <SettingsRow
                    label="Confirm Task Switch"
                    value={false}
                    description="Ask before switching active tasks"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <SettingsRow
                    label="Level Up Alerts"
                    value={true}
                    description="Notify when you gain a level"
                />
                <SettingsRow
                    label="Task Complete"
                    value={true}
                    description="Notify when a task finishes"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Version</Text>
                    <Text style={styles.versionText}>0.1.0</Text>
                </View>
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
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Palette.accentPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Palette.bgCard,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Palette.divider,
    },
    rowInfo: { flex: 1, marginRight: Spacing.md },
    rowLabel: {
        fontSize: FontSize.base,
        color: Palette.textPrimary,
        fontWeight: '500',
    },
    rowDesc: {
        fontSize: FontSize.xs,
        color: Palette.textSecondary,
        marginTop: 2,
    },
    versionText: {
        fontSize: FontSize.base,
        color: Palette.textSecondary,
    },
});
