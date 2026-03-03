/**
 * ActivityLogModal — Scrollable log of random events, level-ups, skill starts.
 * [TRACE: User request — log for random events and skill happenings]
 */

import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Pressable,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store/hooks';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import type { ActivityLogEntry, ActivityLogType } from '@/store/gameSlice';

const TYPE_EMOJI: Record<ActivityLogType, string> = {
    random_event: '🎲',
    level_up: '⭐',
    skill_start: '▶️',
};

function formatTimeAgo(timestamp: number): string {
    const sec = Math.floor((Date.now() - timestamp) / 1000);
    if (sec < 60) return 'Just now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    return `${Math.floor(sec / 86400)}d ago`;
}

export function ActivityLogModal({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const activityLog = useAppSelector((s) => s.game.activityLog ?? []);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                overlay: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'flex-end',
                },
                sheet: {
                    backgroundColor: palette.bgCard,
                    borderTopLeftRadius: Radius.xl,
                    borderTopRightRadius: Radius.xl,
                    maxHeight: height * 0.6,
                    paddingBottom: insets.bottom + Spacing.lg,
                },
                header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: Spacing.lg,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                title: {
                    fontSize: FontSize.lg,
                    fontWeight: 'bold',
                    color: palette.textPrimary,
                },
                closeBtn: {
                    padding: Spacing.sm,
                },
                closeBtnText: {
                    color: palette.accentPrimary,
                    fontSize: FontSize.md,
                    fontWeight: '600',
                },
                scrollContent: {
                    padding: Spacing.md,
                    gap: Spacing.xs,
                },
                entry: {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: Spacing.sm,
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.md,
                    backgroundColor: palette.bgApp,
                    borderRadius: Radius.md,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                entryEmoji: { fontSize: 18 },
                entryBody: { flex: 1 },
                entryMessage: {
                    fontSize: FontSize.sm,
                    color: palette.textPrimary,
                    fontWeight: '500',
                },
                entryMeta: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    marginTop: 2,
                },
                empty: {
                    padding: Spacing.xl,
                    alignItems: 'center',
                },
                emptyText: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                },
            }),
        [palette, insets, height]
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Activity Log</Text>
                        <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
                            <Text style={styles.closeBtnText}>Done</Text>
                        </Pressable>
                    </View>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {activityLog.length === 0 ? (
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>No activity yet. Start skilling!</Text>
                            </View>
                        ) : (
                            activityLog.map((entry: ActivityLogEntry) => (
                                <View key={entry.id} style={styles.entry}>
                                    <Text style={styles.entryEmoji}>{TYPE_EMOJI[entry.type]}</Text>
                                    <View style={styles.entryBody}>
                                        <Text style={styles.entryMessage}>{entry.message}</Text>
                                        <Text style={styles.entryMeta}>{formatTimeAgo(entry.timestamp)}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
