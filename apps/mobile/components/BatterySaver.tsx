/**
 * Battery Saver: after 5 minutes with no touch (and setting enabled),
 * shows a true-black dim overlay. Any touch dismisses it.
 * [TRACE: ROADMAP Juice Backlog — Battery Saver Mode]
 */

import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useAppSelector } from '@/store/hooks';

const IDLE_MS = 5 * 60 * 1000;
const CHECK_INTERVAL_MS = 30 * 1000;

interface BatterySaverProps {
    children: React.ReactNode;
}

export function BatterySaver({ children }: BatterySaverProps) {
    const lastTouchRef = useRef(Date.now());
    const [overlayActive, setOverlayActive] = useState(false);
    const batterySaverEnabled = useAppSelector(
        (s) => s.game.player.settings?.batterySaverEnabled ?? false
    );

    const recordTouch = () => {
        lastTouchRef.current = Date.now();
        if (overlayActive) setOverlayActive(false);
    };

    useEffect(() => {
        if (!batterySaverEnabled) {
            setOverlayActive(false);
            return;
        }
        const id = setInterval(() => {
            if (!batterySaverEnabled) return;
            if (Date.now() - lastTouchRef.current >= IDLE_MS) {
                setOverlayActive(true);
            }
        }, CHECK_INTERVAL_MS);
        return () => clearInterval(id);
    }, [batterySaverEnabled]);

    return (
        <View style={styles.wrapper}>
            <TouchableWithoutFeedback onPress={recordTouch} accessible={false}>
                <View style={styles.content}>{children}</View>
            </TouchableWithoutFeedback>
            {overlayActive && (
                <TouchableWithoutFeedback onPress={recordTouch}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
        opacity: 0.92,
    },
});
