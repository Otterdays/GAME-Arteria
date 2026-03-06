import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface BouncyButtonProps extends PressableProps {
    scaleTo?: number;
    /** Opacity when pressed (0→1). Lower = deeper "push-into-surface" feel. Default 0.85 */
    pressedOpacity?: number;
    hapticFeedback?: boolean;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BouncyButton({
    scaleTo = 0.95,
    pressedOpacity = 0.85,
    hapticFeedback = true,
    style,
    children,
    onPressIn,
    onPressOut,
    onPress,
    disabled,
    ...rest
}: BouncyButtonProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = (e: any) => {
        if (disabled) return;
        if (hapticFeedback && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        scale.value = withSpring(scaleTo, { damping: 15, stiffness: 300 });
        opacity.value = withTiming(pressedOpacity, { duration: 80 });
        onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
        if (disabled) return;
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        opacity.value = withTiming(1, { duration: 150 });
        onPressOut?.(e);
    };

    return (
        <AnimatedPressable
            {...rest}
            disabled={disabled}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={(e) => {
                // We use requestAnimationFrame so the visual press completes cleanly before navigation/state
                requestAnimationFrame(() => onPress?.(e));
            }}
            style={[style, animatedStyle]}
        >
            {children}
        </AnimatedPressable>
    );
}
