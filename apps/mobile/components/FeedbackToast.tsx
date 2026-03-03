/**
 * FeedbackToast — In-game stylized prompts for locked, no essence, etc.
 * Replaces system Alert.alert with themed, auto-dismissing toasts.
 * [TRACE: DOCU/zhip-ai-styling.md §7.3]
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, type FeedbackToastEvent, type FeedbackToastType } from '@/store/gameSlice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Spacing, Radius, FontSize } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const DURATION_MS = 3500;

function getToastStyles(palette: { red: string; gold: string; accentPrimary: string }): Record<
    FeedbackToastType,
    { borderColor: string; titleColor: string; icon: IconName }
> {
    return {
        locked: { borderColor: palette.red, titleColor: palette.red, icon: 'lock' },
        warning: { borderColor: palette.gold, titleColor: palette.gold, icon: 'alert' },
        error: { borderColor: palette.red, titleColor: palette.red, icon: 'alert-circle' },
        info: { borderColor: palette.accentPrimary, titleColor: palette.accentPrimary, icon: 'information' },
    };
}

export default function FeedbackToast() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const queue = useAppSelector((s) => s.game.feedbackToastQueue);
    const isAnimating = useRef(false);
    const displayToast = useRef<FeedbackToastEvent | null>(null);
    const [visible, setVisible] = React.useState<FeedbackToastEvent | null>(null);

    const translateY = useRef(new Animated.Value(-80)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isAnimating.current || queue.length === 0) return;

        const next = queue[0];
        isAnimating.current = true;
        displayToast.current = next;
        setVisible(next);

        translateY.setValue(-80);
        opacity.setValue(0);

        const hapticMap: Record<FeedbackToastType, Haptics.NotificationFeedbackType> = {
            locked: Haptics.NotificationFeedbackType.Error,
            warning: Haptics.NotificationFeedbackType.Warning,
            error: Haptics.NotificationFeedbackType.Error,
            info: Haptics.NotificationFeedbackType.Warning,
        };
        Haptics.notificationAsync(hapticMap[next.type]);

        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 8,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -80,
                    duration: 280,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                dispatch(gameActions.popFeedbackToast());
                setVisible(null);
                displayToast.current = null;
                isAnimating.current = false;
            });
        }, DURATION_MS);

        return () => clearTimeout(timer);
    }, [queue.length, queue[0]?.id, dispatch, translateY, opacity]);

    const toastStyles = useMemo(() => getToastStyles(palette), [palette]);
    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    position: 'absolute',
                    top: 60,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    zIndex: 9998,
                    paddingHorizontal: Spacing.md,
                },
                toast: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.bgCardHover,
                    borderRadius: Radius.lg,
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.md,
                    borderWidth: 2,
                    shadowColor: palette.border,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    elevation: 8,
                },
                icon: { marginRight: Spacing.md },
                textStack: {
                    flex: 1,
                    justifyContent: 'center',
                },
                title: {
                    fontSize: FontSize.md,
                    fontWeight: '800',
                    marginBottom: 2,
                },
                message: {
                    fontSize: FontSize.sm,
                    color: palette.textPrimary,
                },
            }),
        [palette]
    );

    if (!visible) return null;

    const style = toastStyles[visible.type];

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY }], opacity },
            ]}
            pointerEvents="none"
        >
            <View style={[styles.toast, { borderColor: style.borderColor }]}>
                <MaterialCommunityIcons
                    name={style.icon}
                    size={24}
                    color={style.titleColor}
                    style={styles.icon}
                />
                <View style={styles.textStack}>
                    <Text style={[styles.title, { color: style.titleColor }]}>{visible.title}</Text>
                    <Text style={styles.message}>{visible.message}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

