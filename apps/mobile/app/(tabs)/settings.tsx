import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Pressable, Alert, Platform, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';

// expo-updates native module may be absent in Expo Go; guard to avoid crash
let Updates: typeof import('expo-updates') | null = null;
try {
    Updates = require('expo-updates');
} catch {
    Updates = null;
}
import { Spacing, FontSize, Radius, FontCinzelBold, THEME_OPTIONS, HeaderShadow, ShadowMedium, type PaletteShape } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { deleteSave } from '@/store/persistence';
import { getLoginBonusStatus, LOGIN_BONUS_DAYS } from '@/constants/loginBonus';
import { getDisplayName, PROTAGONIST_CANONICAL_NAME } from '@/constants/character';
import { useSfx } from '@/utils/sounds';
import { PATCH_HISTORY } from '@/constants/patchHistory';

function LoginBonusRow({ styles }: { styles: ReturnType<typeof createSettingsStyles> }) {
    const loginBonus = useAppSelector((s) => s.game.player.loginBonus ?? { lastClaimDate: null, consecutiveDays: 0 });
    const status = getLoginBonusStatus(loginBonus.lastClaimDate, loginBonus.consecutiveDays);
    const nextDay = loginBonus.consecutiveDays >= 7 ? 1 : loginBonus.consecutiveDays + 1;
    const nextReward = LOGIN_BONUS_DAYS[nextDay - 1];
    return (
        <View style={styles.row}>
            <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>🎁 Login bonus</Text>
                <Text style={styles.rowDesc}>
                    {status.canClaim
                        ? `Day ${status.day} ready to claim!`
                        : `Streak: Day ${loginBonus.consecutiveDays}/7 · Next: Day ${nextDay} — ${nextReward.gold} gp${nextReward.lumina ? ` + ${nextReward.lumina} Lumina` : ''}`}
                </Text>
            </View>
        </View>
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
            padding: Spacing.md,
            paddingBottom: Spacing.sm,
            backgroundColor: palette.bgCard,
            borderBottomWidth: 1,
            borderBottomColor: palette.border,
            ...HeaderShadow,
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
            ...ShadowMedium,
            shadowColor: palette.accentWeb,
            shadowOpacity: 0.18,
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
        masterySpendBtnMax: {
            backgroundColor: palette.green + '33',
            borderColor: palette.green,
            borderWidth: 1,
        },
        masterySpendText: {
            fontSize: FontSize.sm,
            fontWeight: '700',
            color: palette.white,
        },
        masterySpendTextDisabled: {
            color: palette.textMuted,
        },
        masterySpendTextMax: {
            color: palette.green,
        },
        masteryContainer: {
            padding: Spacing.sm,
            gap: Spacing.lg,
        },
        masteryPillar: {
            gap: Spacing.sm,
        },
        masteryPillarTitle: {
            fontSize: FontSize.xs,
            fontWeight: '700',
            color: palette.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: Spacing.xs,
            marginLeft: Spacing.xs,
        },
        masterySkillCard: {
            backgroundColor: palette.bgApp,
            borderRadius: Radius.sm,
            padding: Spacing.sm,
            marginBottom: Spacing.sm,
            borderWidth: 1,
            borderColor: palette.border,
        },
        masterySkillHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.sm,
            paddingBottom: Spacing.xs,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
        },
        masterySkillEmoji: {
            fontSize: 20,
            marginRight: Spacing.sm,
        },
        masterySkillName: {
            flex: 1,
            fontSize: FontSize.base,
            fontWeight: '600',
            color: palette.textPrimary,
        },
        masteryPointsBadge: {
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: Radius.sm,
            backgroundColor: palette.bgInput,
            borderWidth: 1,
            borderColor: palette.border,
        },
        masteryPointsBadgeActive: {
            borderColor: palette.gold,
            backgroundColor: palette.gold + '22',
        },
        masteryPointsText: {
            fontSize: FontSize.xs,
            fontWeight: '700',
            color: palette.textSecondary,
        },
        masteryPointsBadgeActiveText: {
            color: palette.gold,
        },
        masteryUpgradeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Spacing.xs,
            gap: Spacing.sm,
        },
        masteryUpgradeInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: Spacing.sm,
        },
        masteryUpgradeLabel: {
            fontSize: FontSize.sm,
            color: palette.textSecondary,
            flex: 1,
        },
        masteryLevelText: {
            fontSize: FontSize.xs,
            fontWeight: '700',
            color: palette.textMuted,
            minWidth: 28,
        },
        masteryModalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: Spacing.lg,
        },
        masteryModalContent: {
            width: '100%',
            maxWidth: 480,
            maxHeight: '85%',
            backgroundColor: palette.bgCard,
            borderRadius: Radius.lg,
            borderWidth: 1,
            borderColor: palette.border,
            overflow: 'hidden',
        },
        masteryModalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
        },
        masteryModalTitle: {
            fontSize: FontSize.lg,
            fontWeight: '700',
            color: palette.textPrimary,
            fontFamily: FontCinzelBold,
        },
        masteryModalCloseBtn: {
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.sm,
        },
        masteryModalCloseText: {
            fontSize: FontSize.sm,
            fontWeight: '600',
            color: palette.accentPrimary,
        },
        masteryModalBody: {
            maxHeight: 420,
        },
        masteryModalScrollContent: {
            padding: Spacing.sm,
            paddingBottom: Spacing.lg,
            gap: Spacing.lg,
        },
        masteryRow: {
            flexDirection: 'row',
            gap: Spacing.sm,
            marginBottom: Spacing.sm,
        },
        masterySkillCardWrapper: {
            flex: 1,
            minWidth: 0,
        },
        masterySkillCardHalf: {
            backgroundColor: palette.bgApp,
            borderRadius: Radius.sm,
            padding: Spacing.sm,
            borderWidth: 1,
            borderColor: palette.border,
            alignSelf: 'stretch',
        },
    });
}

export default function SettingsScreen() {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const { palette, themeId, setThemeId } = useTheme();
    const styles = useMemo(() => createSettingsStyles(palette), [palette]);
    const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
    const lumina = useAppSelector((s) => s.game.player.lumina ?? 0);
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
    const vibrationEnabled = useAppSelector(
        (s) => s.game.player.settings?.vibrationEnabled ?? true
    );
    const shakeEffectsEnabled = useAppSelector(
        (s) => s.game.player.settings?.shakeEffectsEnabled ?? true
    );
    const floatingXpEnabled = useAppSelector(
        (s) => s.game.player.settings?.floatingXpEnabled ?? true
    );
    const { playTink, playThump, playSplash } = useSfx();
    const dontPushCount = useAppSelector((s) => s.game.player.dontPushCount ?? 0);
    const unlockedTitles = useAppSelector((s) => s.game.player.unlockedTitles ?? []);
    const hasStubbornTitle = unlockedTitles.includes('The Stubborn');
    const playerName = useAppSelector((s) => s.game.player.name);
    const displayName = getDisplayName(playerName);
    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [nicknameEdit, setNicknameEdit] = useState('');
    // OTA update check state
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'downloading' | 'ready' | 'upToDate' | 'error' | 'dev'>('idle');
    const [updateError, setUpdateError] = useState('');
    const handleCheckForUpdates = useCallback(async () => {
        if (!Updates || !Updates.isEnabled) {
            setUpdateStatus('dev');
            return;
        }
        try {
            setUpdateStatus('checking');
            setUpdateError('');
            const check = await Updates.checkForUpdateAsync();
            if (check.isAvailable) {
                setUpdateStatus('downloading');
                await Updates.fetchUpdateAsync();
                setUpdateStatus('ready');
                Alert.alert(
                    '🔄 Update Ready',
                    'A new update has been downloaded. Restart the app to apply it.',
                    [
                        { text: 'Later', style: 'cancel' },
                        { text: 'Restart Now', onPress: () => Updates.reloadAsync() },
                    ]
                );
            } else {
                setUpdateStatus('upToDate');
            }
        } catch (err: any) {
            setUpdateStatus('error');
            setUpdateError(err?.message ?? 'Unknown error');
        }
    }, []);

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
                        dispatch(gameActions.newGame(''));
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: palette.bgApp, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: palette.textPrimary }]}>Settings</Text>
            </View>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Character</Text>
                    <View style={styles.sectionCard}>
                        <Pressable
                            style={styles.row}
                            onPress={() => {
                                setNicknameEdit(playerName || '');
                                setNicknameModalOpen(true);
                            }}
                            android_ripple={{ color: palette.bgCardHover }}
                        >
                            <View style={styles.rowInfo}>
                                <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>Nickname</Text>
                                <Text style={styles.rowDesc}>
                                    You are {PROTAGONIST_CANONICAL_NAME}. Friends call you: <Text style={{ fontWeight: '700', color: palette.gold }}>{displayName}</Text>
                                </Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Pets</Text>
                    <View style={styles.sectionCard}>
                        <Pressable
                            style={styles.row}
                            onPress={() => router.push('/pets')}
                            android_ripple={{ color: palette.bgCardHover }}
                        >
                            <View style={styles.rowInfo}>
                                <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>Manage Pets</Text>
                                <Text style={styles.rowDesc}>
                                    Equip your rare companions found while skilling.
                                </Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                        </Pressable>
                    </View>
                </View>

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
                        <SettingsRow
                            styles={styles}
                            label="Haptics & Vibration"
                            value={vibrationEnabled}
                            onValueChange={(v) => dispatch(gameActions.setVibrationEnabled(v))}
                            description="Tactile feedback on actions"
                        />
                        <SettingsRow
                            styles={styles}
                            label="Screen Shake"
                            value={shakeEffectsEnabled}
                            onValueChange={(v) => dispatch(gameActions.setShakeEffectsEnabled(v))}
                            description="Visual thud effect when gaining resources"
                        />
                        <SettingsRow
                            styles={styles}
                            label="Floating XP"
                            value={floatingXpEnabled}
                            onValueChange={(v) => dispatch(gameActions.setFloatingXpEnabled(v))}
                            description="Show XP numbers popping from icons"
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
                            description="Ambient loops per skill (planned). SFX (tink/thump/splash) play on tick."
                        />
                        <Pressable
                            style={[styles.row, { borderTopWidth: 1, borderTopColor: palette.divider }]}
                            onPress={() => {
                                playTink();
                                setTimeout(() => playThump(), 150);
                                setTimeout(() => playSplash(), 300);
                            }}
                            android_ripple={{ color: palette.bgCardHover }}
                        >
                            <View style={styles.rowInfo}>
                                <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>Test sound</Text>
                                <Text style={styles.rowDesc}>Play tink, thump, splash</Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                        </Pressable>
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
                    <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Login bonus & Lumina</Text>
                    <View style={styles.sectionCard}>
                        <LoginBonusRow styles={styles} />
                        <View style={[styles.row, { borderTopWidth: 1, borderTopColor: palette.divider }]}>
                            <View style={styles.rowInfo}>
                                <Text style={styles.rowLabel}>✨ Lumina</Text>
                                <Text style={styles.rowDesc}>Premium currency. Day 7 login bonus, future shop.</Text>
                            </View>
                            <Text style={[styles.rowLabel, { color: palette.accentPrimary }]}>{lumina.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>Premium</Text>
                    <View style={styles.sectionCard}>
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => router.push('/expansions')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.rowInfo}>
                                <Text style={styles.rowLabel}>Expansions</Text>
                                <Text style={styles.rowDesc}>Unlock new horizons, skills, and boss encounters</Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: palette.accentWeb }]}>About</Text>
                    <View style={styles.sectionCard}>
                        <Pressable
                            style={styles.row}
                            onPress={() => router.push('/patch-notes')}
                            android_ripple={{ color: palette.bgCardHover }}
                        >
                            <View style={styles.rowInfo}>
                                <Text style={styles.rowLabel}>Version v{PATCH_HISTORY[0].version}</Text>
                                <Text style={styles.rowDesc}>Tap to see the full chronicles of Arteria history</Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                        </Pressable>
                        <Pressable
                            style={styles.row}
                            onPress={handleCheckForUpdates}
                            android_ripple={{ color: palette.bgCardHover }}
                            disabled={updateStatus === 'checking' || updateStatus === 'downloading'}
                        >
                            <View style={styles.rowInfo}>
                                <Text style={styles.rowLabel}>Check for Updates</Text>
                                <Text style={[
                                    styles.rowDesc,
                                    updateStatus === 'error' && { color: palette.red },
                                    updateStatus === 'upToDate' && { color: palette.green },
                                    updateStatus === 'ready' && { color: palette.gold },
                                ]}>
                                    {updateStatus === 'idle' && 'Tap to check for OTA updates'}
                                    {updateStatus === 'checking' && 'Checking...'}
                                    {updateStatus === 'downloading' && 'Downloading update...'}
                                    {updateStatus === 'ready' && 'Update ready — restart to apply'}
                                    {updateStatus === 'upToDate' && '✓ You\'re on the latest version'}
                                    {updateStatus === 'error' && `Error: ${updateError}`}
                                    {updateStatus === 'dev' && 'Dev mode — OTA disabled'}
                                </Text>
                            </View>
                            {(updateStatus === 'checking' || updateStatus === 'downloading') ? (
                                <ActivityIndicator size="small" color={palette.accentPrimary} />
                            ) : (
                                <Text style={styles.arrow}>⟳</Text>
                            )}
                        </Pressable>
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

            {/* Nickname edit modal */}
            <Modal visible={nicknameModalOpen} transparent animationType="fade">
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: Spacing.lg }}
                    onPress={() => setNicknameModalOpen(false)}
                >
                    <Pressable
                        style={{
                            backgroundColor: palette.bgCard,
                            borderRadius: Radius.lg,
                            padding: Spacing.lg,
                            borderWidth: 1,
                            borderColor: palette.border,
                        }}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={[styles.rowLabel, { marginBottom: Spacing.sm }]}>Change nickname</Text>
                        <Text style={[styles.rowDesc, { marginBottom: Spacing.md }]}>
                            You are {PROTAGONIST_CANONICAL_NAME}. What should friends call you?
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: palette.bgInput,
                                borderRadius: Radius.md,
                                paddingHorizontal: Spacing.md,
                                paddingVertical: Spacing.sm,
                                fontSize: FontSize.base,
                                color: palette.textPrimary,
                                borderWidth: 1,
                                borderColor: palette.border,
                                marginBottom: Spacing.md,
                            }}
                            placeholder="Nickname"
                            placeholderTextColor={palette.textMuted}
                            value={nicknameEdit}
                            onChangeText={setNicknameEdit}
                            autoCapitalize="words"
                            maxLength={24}
                        />
                        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                            <TouchableOpacity
                                style={[styles.masterySpendBtn, { flex: 1 }]}
                                onPress={() => {
                                    dispatch(gameActions.setPlayerName(nicknameEdit.trim()));
                                    setNicknameModalOpen(false);
                                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.masterySpendText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    borderRadius: Radius.md,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: palette.border,
                                }}
                                onPress={() => setNicknameModalOpen(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={{ fontSize: FontSize.sm, fontWeight: '600', color: palette.textSecondary }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

