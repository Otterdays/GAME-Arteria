import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, Pressable, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { Spacing, FontSize, Radius, FontCinzelBold, THEME_OPTIONS, type PaletteShape } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions, type SkillId } from '@/store/gameSlice';
import { deleteSave } from '@/store/persistence';
import { MASTERY_UPGRADES } from '@/constants/mastery';
import { SKILL_META } from '@/constants/skills';

function MasterySection() {
    const dispatch = useAppDispatch();
    const masteryPoints = useAppSelector((s) => s.game.player.masteryPoints ?? {});
    const masterySpent = useAppSelector((s) => s.game.player.masterySpent ?? {});
    const { palette } = useTheme();
    const styles = useMemo(() => createSettingsStyles(palette), [palette]);
    return (
        <>
            {(Object.entries(MASTERY_UPGRADES) as [SkillId, NonNullable<typeof MASTERY_UPGRADES[SkillId]>][]).map(([skillId, upgrades]) => {
                const points = masteryPoints[skillId] ?? 0;
                const spent = masterySpent[skillId] ?? {};
                const meta = SKILL_META[skillId];
                return (
                    <React.Fragment key={skillId}>
                        <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: palette.divider }]}>
                            <View style={styles.rowInfo}>
                                <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>{meta?.emoji} {meta?.label}</Text>
                                <Text style={styles.rowDesc}>{points} point{points !== 1 ? 's' : ''} to spend</Text>
                            </View>
                        </View>
                        {upgrades.map((u) => {
                            const level = spent[u.id] ?? 0;
                            const canSpend = points >= u.cost && level < u.maxLevel;
                            return (
                                <View key={u.id} style={[styles.row, { paddingLeft: Spacing.lg, backgroundColor: palette.bgApp }]}>
                                    <View style={styles.rowInfo}>
                                        <Text style={[styles.rowLabel, { fontSize: FontSize.sm }]}>{u.label}</Text>
                                        <Text style={styles.rowDesc}>Level {level}/{u.maxLevel} · {u.cost} pt{u.cost !== 1 ? 's' : ''}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.masterySpendBtn, !canSpend && styles.masterySpendBtnDisabled]}
                                        onPress={() => canSpend && (Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), dispatch(gameActions.spendMastery({ skillId, upgradeId: u.id, cost: u.cost, maxLevel: u.maxLevel })))}
                                        disabled={!canSpend}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.masterySpendText, !canSpend && styles.masterySpendTextDisabled]}>Spend</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </React.Fragment>
                );
            })}
        </>
    );
}

function SettingsRow({
    label,
    value,
    onValueChange,
    description,
    styles,
}: {
    label: string;
    value?: boolean;
    onValueChange?: (v: boolean) => void;
    description?: string;
    styles: ReturnType<typeof createSettingsStyles>;
}) {
    const { palette } = useTheme();
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
                        thumbColor={palette.white}
                        trackColor={{
                            false: palette.bgApp,
                            true: palette.accentPrimary,
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
                android_ripple={{ color: palette.bgCardHover }}
            >
                {content}
            </Pressable>
        );
    }
    return <View style={styles.row}>{content}</View>;
}

function createSettingsStyles(palette: PaletteShape) {
    return StyleSheet.create({
        container: { flex: 1 },
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
            color: palette.textPrimary,
        },
        section: { marginBottom: Spacing.lg },
        sectionTitle: {
            fontFamily: FontCinzelBold,
            fontSize: FontSize.md,
            color: palette.accentWeb,
            letterSpacing: 1.5,
            marginBottom: Spacing.sm,
            marginLeft: Spacing.xs,
        },
        sectionCard: {
            backgroundColor: palette.bgCard,
            borderWidth: 1,
            borderColor: palette.border,
            borderRadius: Radius.md,
            shadowColor: palette.accentWeb,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 3,
            overflow: 'hidden',
            marginHorizontal: Spacing.md,
        },
        themeRow: {
            paddingHorizontal: Spacing.md,
            paddingTop: Spacing.md,
            paddingBottom: Spacing.sm,
        },
        themeChips: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: Spacing.sm,
            paddingHorizontal: Spacing.md,
            paddingBottom: Spacing.md,
        },
        themeChip: {
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: Radius.full,
            borderWidth: 1,
        },
        themeChipText: {
            fontSize: FontSize.sm,
            fontWeight: '600',
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: palette.bgCard,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
        },
        dangerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: palette.bgCard,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
            borderLeftWidth: 3,
            borderLeftColor: palette.red,
        },
        easterEggRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: palette.bgCard,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
            borderLeftWidth: 3,
            borderLeftColor: palette.gold,
        },
        easterEggLabel: {
            fontSize: FontSize.base,
            color: palette.gold,
            fontWeight: '600',
        },
        titleBadge: {
            fontSize: FontSize.sm,
            color: palette.gold,
            fontWeight: '700',
        },
        rowInfo: { flex: 1, marginRight: Spacing.md },
        rowLabel: {
            fontSize: FontSize.base,
            color: palette.textPrimary,
            fontWeight: '500',
        },
        dangerLabel: {
            fontSize: FontSize.base,
            color: palette.red,
            fontWeight: '600',
        },
        rowDesc: {
            fontSize: FontSize.xs,
            color: palette.textSecondary,
            marginTop: 2,
        },
        versionText: {
            fontSize: FontSize.base,
            color: palette.textSecondary,
        },
        dangerArrow: {
            fontSize: 20,
            color: palette.red,
            fontWeight: '700',
        },
        arrow: {
            fontSize: 20,
            color: palette.textSecondary,
            fontWeight: '600',
        },
        masterySpendBtn: {
            paddingVertical: 6,
            paddingHorizontal: Spacing.md,
            borderRadius: Radius.sm,
            backgroundColor: palette.accentPrimary,
            justifyContent: 'center',
        },
        masterySpendBtnDisabled: {
            backgroundColor: palette.bgApp,
            borderWidth: 1,
            borderColor: palette.border,
            opacity: 0.7,
        },
        masterySpendText: {
            fontSize: FontSize.sm,
            fontWeight: '700',
            color: palette.white,
        },
        masterySpendTextDisabled: {
            color: palette.textMuted,
        },
    });
}

export default function SettingsScreen() {
    const dispatch = useAppDispatch();
    const { palette, themeId, setThemeId } = useTheme();
    const styles = useMemo(() => createSettingsStyles(palette), [palette]);
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
        <SafeAreaView style={[styles.container, { backgroundColor: palette.bgApp }]}>
                <View style={styles.header}>
                <Text style={[styles.title, { color: palette.textPrimary }]}>Settings</Text>
            </View>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Appearance</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.themeRow}>
                        <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>Theme</Text>
                        <Text style={[styles.rowDesc, { color: palette.textSecondary }]}>Follow system or pick a theme</Text>
                    </View>
                    <View style={styles.themeChips}>
                        {THEME_OPTIONS.map((opt) => {
                            const isActive = themeId === opt.id;
                            return (
                                <Pressable
                                    key={opt.id}
                                    onPress={() => {
                                        if (Platform.OS !== 'web') {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        }
                                        setThemeId(opt.id);
                                    }}
                                    style={[
                                        styles.themeChip,
                                        {
                                            backgroundColor: isActive ? palette.accentPrimary : palette.bgInput,
                                            borderColor: isActive ? palette.accentPrimary : palette.border,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.themeChipText,
                                            { color: isActive ? palette.white : palette.textSecondary },
                                        ]}
                                    >
                                        {opt.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Gameplay</Text>
                <View style={styles.sectionCard}>
                <SettingsRow
                    styles={styles}
                    label="Bank Tab Pulse"
                    value={bankPulseEnabled}
                    onValueChange={(v) => dispatch(gameActions.setBankPulseEnabled(v))}
                    description="Gold glow on Bank tab when gaining loot"
                />
                <SettingsRow
                    styles={styles}
                    label="Horizon HUD"
                    value={horizonHudEnabled}
                    onValueChange={(v) => dispatch(gameActions.setHorizonHudEnabled(v))}
                    description="Goal cards (Immediate / Session / Grind) on Skills screen"
                />
                <SettingsRow
                    styles={styles}
                    label="Offline Progression"
                    value={true}
                    description="Calculate progress while app is closed"
                />
                <SettingsRow
                    styles={styles}
                    label="Confirm Task Switch"
                    value={confirmTaskSwitch}
                    onValueChange={(v) => dispatch(gameActions.setConfirmTaskSwitch(v))}
                    description="Ask before switching active tasks"
                />
                <SettingsRow
                    styles={styles}
                    label="Battery Saver"
                    value={batterySaverEnabled}
                    onValueChange={(v) => dispatch(gameActions.setBatterySaverEnabled(v))}
                    description="Dim screen after 5 min idle (touch to wake)"
                />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Audio</Text>
                <View style={styles.sectionCard}>
                <SettingsRow
                    styles={styles}
                    label="Sound Effects"
                    value={sfxEnabled}
                    onValueChange={(v) => dispatch(gameActions.setSfxEnabled(v))}
                    description="Haptics, ticks, level-up feedback"
                />
                <SettingsRow
                    styles={styles}
                    label="Background Music"
                    value={bgmEnabled}
                    onValueChange={(v) => dispatch(gameActions.setBgmEnabled(v))}
                    description="Ambient music (coming soon)"
                />
                <SettingsRow
                    styles={styles}
                    label="Idle Soundscapes"
                    value={idleSoundscapesEnabled}
                    onValueChange={(v) => dispatch(gameActions.setIdleSoundscapesEnabled(v))}
                    description="Ambient loops per skill — coming soon"
                />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Mastery</Text>
                <Text style={[styles.rowDesc, { marginLeft: Spacing.md, marginBottom: Spacing.sm }]}>
                    Earn 1 point per level-up per skill. Spend on permanent buffs.
                </Text>
                <View style={styles.sectionCard}>
                    <MasterySection />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Notifications</Text>
                <View style={styles.sectionCard}>
                <SettingsRow
                    styles={styles}
                    label="Level Up Alerts"
                    value={notifyLevelUp}
                    onValueChange={(v) => dispatch(gameActions.setNotifyLevelUp(v))}
                    description="Notify when you gain a level"
                />
                <SettingsRow
                    styles={styles}
                    label="Task Complete"
                    value={notifyTaskComplete}
                    onValueChange={(v) => dispatch(gameActions.setNotifyTaskComplete(v))}
                    description="Notify when a task finishes"
                />
                <SettingsRow
                    styles={styles}
                    label="Idle Cap Reached"
                    value={notifyIdleCapReached}
                    onValueChange={(v) => dispatch(gameActions.setNotifyIdleCapReached(v))}
                    description="Notify when 24h / 7-day offline cap is full"
                />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Premium</Text>
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
                        <Text style={[styles.rowLabel, { color: palette.gold, fontWeight: '700' }]}>Active</Text>
                    ) : (
                        <Text style={styles.arrow}>›</Text>
                    )}
                </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>About</Text>
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
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Easter Egg</Text>
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
                <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Developer</Text>
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

