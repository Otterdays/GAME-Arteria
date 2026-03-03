/**
 * Local notifications — Idle Cap Reached, Level Up, Task Complete.
 * Schedules a one-time notification when app goes to background (idle cap).
 * [TRACE: ROADMAP Phase 7.3]
 */

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { OFFLINE_CAP_F2P_MS, OFFLINE_CAP_PATRON_MS } from '@/constants/game';

const IDLE_CAP_CHANNEL_ID = 'arteria-idle-cap';
const IDLE_CAP_NOTIFICATION_ID = 'arteria-idle-cap-reached';

/** Configure how notifications are shown when app is in foreground */
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/** Request permission; call early (e.g. on app load or when opening Settings). */
export async function requestNotificationPermission(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

/** Schedule "Idle cap reached" for (lastSaveTimestamp + capMs). Call when app goes to background. */
export async function scheduleIdleCapReachedIfEnabled(
    lastSaveTimestamp: number,
    isPatron: boolean,
    enabled: boolean
): Promise<void> {
    if (!enabled) {
        await cancelIdleCapNotification();
        return;
    }
    const capMs = isPatron ? OFFLINE_CAP_PATRON_MS : OFFLINE_CAP_F2P_MS;
    const triggerAt = lastSaveTimestamp + capMs;
    const now = Date.now();
    if (triggerAt <= now) return;
    const granted = await requestNotificationPermission();
    if (!granted) return;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(IDLE_CAP_CHANNEL_ID, {
            name: 'Idle cap',
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }
    await Notifications.cancelScheduledNotificationAsync(IDLE_CAP_NOTIFICATION_ID);
    await Notifications.scheduleNotificationAsync({
        identifier: IDLE_CAP_NOTIFICATION_ID,
        content: {
            title: 'Idle cap reached',
            body: isPatron
                ? "Your 7-day offline progress is full. Come back and collect!"
                : "Your 24h offline progress is full. Come back and collect!",
            data: { type: 'idle_cap' },
        },
        trigger: {
            type: 'date' as const,
            date: new Date(triggerAt),
            channelId: IDLE_CAP_CHANNEL_ID,
        },
    });
}

/** Cancel the scheduled idle-cap notification (e.g. when user returns before cap). */
export async function cancelIdleCapNotification(): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(IDLE_CAP_NOTIFICATION_ID);
    } catch {
        // ignore
    }
}

/** Cancel all scheduled Arteria notifications (e.g. on fresh open so we don't double-notify). */
export async function cancelAllScheduled(): Promise<void> {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
        // ignore
    }
}
