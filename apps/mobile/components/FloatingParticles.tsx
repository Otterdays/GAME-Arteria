import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ParticleProps {
    color: string;
    size: number;
    duration: number;
    delay: number;
}

const Particle = ({ color, size, duration, delay }: ParticleProps) => {
    const animY = useRef(new Animated.Value(height + 10)).current;
    const animX = useRef(new Animated.Value(Math.random() * width)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const runAnimation = () => {
            animY.setValue(height + 10);
            animX.setValue(Math.random() * width);
            opacity.setValue(0);

            Animated.parallel([
                Animated.timing(animY, {
                    toValue: -20,
                    duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 0.4,
                        duration: duration * 0.2,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: duration * 0.8,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => runAnimation());
        };

        const timeout = setTimeout(runAnimation, delay);
        return () => clearTimeout(timeout);
    }, [animY, animX, opacity, duration, delay]);

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    backgroundColor: color,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    transform: [
                        { translateY: animY },
                        { translateX: animX },
                    ],
                    opacity,
                },
            ]}
        />
    );
};

export const FloatingParticles = ({ color = '#8b5cf6', count = 12 }: { color?: string; count?: number }) => {
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 5000 + 4000,
            delay: Math.random() * 5000,
        }));
    }, [count]);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((p) => (
                <Particle key={p.id} color={color} size={p.size} duration={p.duration} delay={p.delay} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
    },
});
