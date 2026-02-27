import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { deleteSave } from '@/store/persistence';

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
    const dispatch = useAppDispatch();

    // QoL I — Reset save with confirmation
    const handleResetSave = () => {
        Alert.alert(
            '⚠️ Wipe Save Data',
            'This will permanently delete all your progress. There is no undo.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Wipe Everything',
                    style: 'destructive',
                    onPress: () => {
                        deleteSave();
                        dispatch(gameActions.newGame());
                    },
                },
            ]
        );
    };

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
                    <Text style={styles.versionText}>0.4.0</Text>
                </View>
            </View>

            {/* QoL I — Developer / Reset */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Developer</Text>
                <TouchableOpacity style={styles.dangerRow} onPress={handleResetSave} activeOpacity={0.7}>
                    <View style={styles.rowInfo}>
                        <Text style={styles.dangerLabel}>Wipe Save Data</Text>
                        <Text style={styles.rowDesc}>Deletes all progress and starts fresh</Text>
                    </View>
                    <Text style={styles.dangerArrow}>›</Text>
                </TouchableOpacity>
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
    dangerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Palette.bgCard,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Palette.divider,
        borderLeftWidth: 3,
        borderLeftColor: Palette.red,
    },
    rowInfo: { flex: 1, marginRight: Spacing.md },
    rowLabel: {
        fontSize: FontSize.base,
        color: Palette.textPrimary,
        fontWeight: '500',
    },
    dangerLabel: {
        fontSize: FontSize.base,
        color: Palette.red,
        fontWeight: '600',
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
    dangerArrow: {
        fontSize: 20,
        color: Palette.red,
        fontWeight: '700',
    },
});
