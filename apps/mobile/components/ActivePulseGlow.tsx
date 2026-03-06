import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';

interface ActivePulseGlowProps {
    color: string;
    style?: ViewStyle;
}

/**
 * Dual-layer active glow: a soft ambient layer (slow, wide) underneath
 * and a brighter focused pulse (faster, smaller) on top.
 * Creates a "breathing" depth effect on active cards.
 */
export function ActivePulseGlow({ color, style }: ActivePulseGlowProps) {
    const ambientOpacity = useSharedValue(0.06);
    const focusedOpacity = useSharedValue(0.08);

    useEffect(() => {
        // Layer 1: Slow ambient drift (3s cycle)
        ambientOpacity.value = withRepeat(
            withSequence(
                withTiming(0.2, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.06, { duration: 1800, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        // Layer 2: Faster focused heartbeat (1.6s cycle, slightly delayed)
        focusedOpacity.value = withDelay(
            400,
            withRepeat(
                withSequence(
                    withTiming(0.35, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.08, { duration: 800, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            )
        );
    }, []);

    const ambientStyle = useAnimatedStyle(() => ({
        opacity: ambientOpacity.value,
        backgroundColor: color,
    }));

    const focusedStyle = useAnimatedStyle(() => ({
        opacity: focusedOpacity.value,
        backgroundColor: color,
    }));

    return (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
            {/* Layer 1: Wide ambient glow */}
            <Animated.View
                style={[StyleSheet.absoluteFill, styles.ambient, ambientStyle]}
            />
            {/* Layer 2: Focused center pulse */}
            <Animated.View
                style={[StyleSheet.absoluteFill, styles.focused, focusedStyle]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    ambient: {
        borderRadius: 12,
    },
    focused: {
        borderRadius: 12,
        // Slightly inset for a brighter center feel
        margin: 2,
    },
});
