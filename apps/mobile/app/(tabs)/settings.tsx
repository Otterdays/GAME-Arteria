import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { Palette, Spacing, FontSize, Radius, CardStyle, FontCinzel, FontCinzelBold } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { deleteSave } from '@/store/persistence';

function SettingsRow({
    label,
    value,
    onValueChange,
    description,
}: {
    label: string;
    value?: boolean;
    onValueChange?: (v: boolean) => void;
    description?: string;
}) {
    const hasToggle = value !== undefined && onValueChange;
    const content = (
        <>
            <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>{label}</Text>
                {description && (
                    <Text style={styles.rowDesc}>{description}</Text>
                )}
            </View>
            {hasToggle && (
                <View pointerEvents="none">
                    <Switch
                        value={value}
                        thumbColor={Palette.white}
                        trackColor={{
                            false: Palette.bgApp,
                            true: Palette.accentPrimary,
                        }}
                    />
                </View>
            )}
        </>
    );
    if (hasToggle) {
        return (
            <Pressable
                style={styles.row}
                onPress={() => onValueChange?.(!value)}
                android_ripple={{ color: Palette.bgCardHover }}
            >
                {content}
            </Pressable>
        );
    }
    return <View style={styles.row}>{content}</View>;
}

export default function SettingsScreen() {
    const dispatch = useAppDispatch();
    const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
    const bankPulseEnabled = useAppSelector(
        (s) => s.game.player.settings?.bankPulseEnabled ?? true
    );
    const horizonHudEnabled = useAppSelector(
        (s) => s.game.player.settings?.horizonHudEnabled ?? true
    );
    const sfxEnabled = useAppSelector((s) => s.game.player.settings?.sfxEnabled ?? true);
    const bgmEnabled = useAppSelector((s) => s.game.player.settings?.bgmEnabled ?? true);
    const confirmTaskSwitch = useAppSelector(
        (s) => s.game.player.settings?.confirmTaskSwitch ?? false
    );
    const batterySaverEnabled = useAppSelector(
        (s) => s.game.player.settings?.batterySaverEnabled ?? false
    );
    const notifyLevelUp = useAppSelector(
        (s) => s.game.player.settings?.notifyLevelUp ?? true
    );
    const notifyTaskComplete = useAppSelector(
        (s) => s.game.player.settings?.notifyTaskComplete ?? true
    );
    const notifyIdleCapReached = useAppSelector(
        (s) => s.game.player.settings?.notifyIdleCapReached ?? true
    );
    const idleSoundscapesEnabled = useAppSelector(
        (s) => s.game.player.settings?.idleSoundscapesEnabled ?? false
    );
    const dontPushCount = useAppSelector((s) => s.game.player.dontPushCount ?? 0);
    const unlockedTitles = useAppSelector((s) => s.game.player.unlockedTitles ?? []);
    const hasStubbornTitle = unlockedTitles.includes('The Stubborn');

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
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gameplay</Text>
                <View style={styles.sectionCard}>
                <SettingsRow
                    label="Bank Tab Pulse"
                    value={bankPulseEnabled}
                    onValueChange={(v) => dispatch(gameActions.setBankPulseEnabled(v))}
                    description="Gold glow on Bank tab when gaining loot"
                />
                <SettingsRow
                    label="Horizon HUD"
                    value={horizonHudEnabled}
                    onValueChange={(v) => dispatch(gameActions.setHorizonHudEnabled(v))}
                    description="Goal cards (Immediate / Session / Grind) on Skills screen"
                />
                <SettingsRow
                    label="Offline Progression"
                    value={true}
                    description="Calculate progress while app is closed"
                />
                <SettingsRow
                    label="Confirm Task Switch"
                    value={confirmTaskSwitch}
                    onValueChange={(v) => dispatch(gameActions.setConfirmTaskSwitch(v))}
                    description="Ask before switching active tasks"
                />
                <SettingsRow
                    label="Battery Saver"
                    value={batterySaverEnabled}
                    onValueChange={(v) => dispatch(gameActions.setBatterySaverEnabled(v))}
                    description="Dim screen after 5 min idle (touch to wake)"
                />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Audio</Text>
                <View style={styles.sectionCard}>
                <SettingsRow
                    label="Sound Effects"
                    value={sfxEnabled}
                    onValueChange={(v) => dispatch(gameActions.setSfxEnabled(v))}
                    description="Haptics, ticks, level-up feedback"
                />
                <SettingsRow
                    label="Background Music"
                    value={bgmEnabled}
                    onValueChange={(v) => dispatch(gameActions.setBgmEnabled(v))}
                    description="Ambient music (coming soon)"
                />
                <SettingsRow
                    label="Idle Soundscapes"
                    value={idleSoundscapesEnabled}
                    onValueChange={(v) => dispatch(gameActions.setIdleSoundscapesEnabled(v))}
                    description="Ambient loops per skill (e.g. forge, waves)"
                />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.sectionCard}>
                <SettingsRow
                    label="Level Up Alerts"
                    value={notifyLevelUp}
                    onValueChange={(v) => dispatch(gameActions.setNotifyLevelUp(v))}
                    description="Notify when you gain a level"
                />
                <SettingsRow
                    label="Task Complete"
                    value={notifyTaskComplete}
                    onValueChange={(v) => dispatch(gameActions.setNotifyTaskComplete(v))}
                    description="Notify when a task finishes"
                />
                <SettingsRow
                    label="Idle Cap Reached"
                    value={notifyIdleCapReached}
                    onValueChange={(v) => dispatch(gameActions.setNotifyIdleCapReached(v))}
                    description="Notify when 24h / 7-day offline cap is full"
                />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Premium</Text>
                <View style={styles.sectionCard}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => router.push('/patron')}
                    activeOpacity={0.7}
                >
                    <View style={styles.rowInfo}>
                        <Text style={styles.rowLabel}>Patron's Pack</Text>
                        <Text style={styles.rowDesc}>7-day offline cap, 100 slots, +20% XP</Text>
                    </View>
                    {isPatron ? (
                        <Text style={[styles.rowLabel, { color: Palette.gold, fontWeight: '700' }]}>Active</Text>
                    ) : (
                        <Text style={styles.arrow}>›</Text>
                    )}
                </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.sectionCard}>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Version</Text>
                    <Text style={styles.versionText}>{Constants.expoConfig?.version ?? '0.1.0'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => router.push('/patches')}
                    activeOpacity={0.7}
                >
                    <View style={styles.rowInfo}>
                        <Text style={styles.rowLabel}>Patch Notes</Text>
                        <Text style={styles.rowDesc}>View full changelog from v0.1.0</Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
                </View>
            </View>

            {/* Easter egg: "Don't Push This" — 1000 presses unlocks title "The Stubborn" */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Easter Egg</Text>
                <View style={styles.sectionCard}>
                <TouchableOpacity
                    style={styles.easterEggRow}
                    onPress={() => dispatch(gameActions.incrementDontPushCount())}
                    activeOpacity={0.8}
                >
                    <View style={styles.rowInfo}>
                        <Text style={styles.easterEggLabel}>Don&apos;t Push This</Text>
                        <Text style={styles.rowDesc}>
                            {hasStubbornTitle
                                ? "You unlocked the title \"The Stubborn\"!"
                                : `Presses: ${dontPushCount < 1000 ? dontPushCount : '1000'}`}
                        </Text>
                    </View>
                    {hasStubbornTitle ? (
                        <Text style={styles.titleBadge}>🏆 The Stubborn</Text>
                    ) : (
                        <Text style={styles.arrow}>›</Text>
                    )}
                </TouchableOpacity>
                </View>
            </View>

            {/* QoL I — Developer / Reset */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Developer</Text>
                <View style={styles.sectionCard}>
                <TouchableOpacity style={styles.dangerRow} onPress={handleResetSave} activeOpacity={0.7}>
                    <View style={styles.rowInfo}>
                        <Text style={styles.dangerLabel}>Wipe Save Data</Text>
                        <Text style={styles.rowDesc}>Deletes all progress and starts fresh</Text>
                    </View>
                    <Text style={styles.dangerArrow}>›</Text>
                </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
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
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: Spacing['2xl'] },
    title: {
        fontFamily: FontCinzelBold,
        fontSize: FontSize.xl,
        color: Palette.textPrimary,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontFamily: FontCinzelBold,
        fontSize: FontSize.md,
        color: Palette.accentWeb,
        letterSpacing: 1.5,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    sectionCard: {
        ...CardStyle,
        overflow: 'hidden',
        marginHorizontal: Spacing.md,
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
    easterEggRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Palette.bgCard,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Palette.divider,
        borderLeftWidth: 3,
        borderLeftColor: Palette.gold,
    },
    easterEggLabel: {
        fontSize: FontSize.base,
        color: Palette.gold,
        fontWeight: '600',
    },
    titleBadge: {
        fontSize: FontSize.sm,
        color: Palette.gold,
        fontWeight: '700',
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
    arrow: {
        fontSize: 20,
        color: Palette.textSecondary,
        fontWeight: '600',
    },
});
