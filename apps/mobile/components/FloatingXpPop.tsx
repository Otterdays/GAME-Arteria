import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { Palette, FontSize, Spacing } from '@/constants/theme';

interface FloatingXpPopProps {
    amount: number;
    emoji: string;
    triggerKey: any; // Change this to trigger the animation
}

export const FloatingXpPop: React.FC<FloatingXpPopProps> = ({ amount, emoji, triggerKey }) => {
    const anim = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (triggerKey) {
            setVisible(true);
            anim.setValue(0);
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.delay(200),
            ]).start(() => setVisible(false));
        }
    }, [triggerKey]);

    if (!visible) return null;

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -30],
    });

    const opacity = anim.interpolate({
        inputRange: [0, 0.2, 0.8, 1],
        outputRange: [0, 1, 1, 0],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <Text style={styles.text}>
                +{amount.toFixed(1)} XP {emoji}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: -Spacing.xl, // Position it below the XP amount
        zIndex: 10,
        pointerEvents: 'none',
    },
    text: {
        color: Palette.gold,
        fontSize: FontSize.sm,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});
