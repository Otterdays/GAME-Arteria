import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
} from 'react-native-reanimated';

interface ActivePulseGlowProps {
    color: string;
    style?: ViewStyle;
}

export function ActivePulseGlow({ color, style }: ActivePulseGlowProps) {
    const opacity = useSharedValue(0.1);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
            ),
            -1, // Infinite
            true // reverse
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        backgroundColor: color,
    }));

    return (
        <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.glow, animatedStyle, style]}
        />
    );
}

const styles = StyleSheet.create({
    glow: {
        borderRadius: 12, // Match typical Radius.lg
    },
});
