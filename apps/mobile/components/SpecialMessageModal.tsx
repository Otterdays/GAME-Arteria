/**
 * SpecialMessageModal — A premium animated modal for special in-game announcements.
 * Supports title, body, emoji, and an optional CTA button.
 * Usage: dispatch(gameActions.showSpecialMessage({ emoji, title, body, cta? }))
 */

import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, FontCinzelBold, FontCinzel } from '@/constants/theme';

export interface SpecialMessage {
    emoji: string;
    title: string;
    body: string;
    /** Optional CTA button label. Defaults to "Got it!" */
    cta?: string;
}

interface Props {
    message: SpecialMessage | null;
    onDismiss: () => void;
}

export function SpecialMessageModal({ message, onDismiss }: Props) {
    const { palette } = useTheme();

    // Animation refs
    const scaleAnim = useRef(new Animated.Value(0.7)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const emojiScaleAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (message) {
            // Reset
            scaleAnim.setValue(0.7);
            opacityAnim.setValue(0);
            glowAnim.setValue(0);
            emojiScaleAnim.setValue(0);

            // Entry sequence
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 80,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                // Emoji pops in with a bounce after a tiny delay
                Animated.sequence([
                    Animated.delay(120),
                    Animated.spring(emojiScaleAnim, {
                        toValue: 1,
                        tension: 60,
                        friction: 5,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();

            // Shimmer loop on the glow border
            Animated.loop(
                Animated.sequence([
                    Animated.timing(shimmerAnim, {
                        toValue: 1,
                        duration: 1800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                    Animated.timing(shimmerAnim, {
                        toValue: 0,
                        duration: 1800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        }
    }, [message, scaleAnim, opacityAnim, emojiScaleAnim, shimmerAnim]);

    if (!message) return null;

    const glowColor = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(139, 92, 246, 0.3)', 'rgba(245, 158, 11, 0.7)'],
    });

    return (
        <Modal
            visible={!!message}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onDismiss}
        >
            {/* Backdrop (native opacity — fine on its own node) */}
            <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} />
            </Animated.View>

            {/* Card — outer: native scale+opacity; inner: JS-driver borderColor */}
            <View style={styles.centerer} pointerEvents="box-none">
                {/* Outer: native driver only (transform + opacity) */}
                <Animated.View
                    style={[
                        styles.outerNative,
                        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                    ]}
                >
                    {/* Inner: JS driver only (borderColor) */}
                    <Animated.View
                        style={[styles.outerGlow, { borderColor: glowColor }]}
                    >
                        <View style={[styles.card, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>

                            {/* Decorative top strip */}
                            <View style={[styles.topStrip, { backgroundColor: palette.accentWeb + '22' }]}>
                                <View style={[styles.topStripLine, { backgroundColor: palette.accentWeb }]} />
                            </View>

                            {/* Emoji */}
                            <Animated.Text style={[styles.emoji, { transform: [{ scale: emojiScaleAnim }] }]}>
                                {message.emoji}
                            </Animated.Text>

                            {/* Title */}
                            <Text style={[styles.title, { color: palette.accentWeb, fontFamily: FontCinzelBold }]}>
                                {message.title}
                            </Text>

                            {/* Divider */}
                            <View style={[styles.divider, { backgroundColor: palette.accentWeb + '44' }]} />

                            {/* Body */}
                            <Text style={[styles.body, { color: palette.textSecondary }]}>
                                {message.body}
                            </Text>

                            {/* CTA Button */}
                            <TouchableOpacity
                                style={[styles.ctaButton, { backgroundColor: palette.accentPrimary }]}
                                onPress={onDismiss}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.ctaText, { color: palette.white, fontFamily: FontCinzel }]}>
                                    {message.cta ?? 'Got it!'}
                                </Text>
                            </TouchableOpacity>

                            {/* Corner stars */}
                            <Text style={[styles.cornerStarTL, { color: palette.gold }]}>✦</Text>
                            <Text style={[styles.cornerStarTR, { color: palette.gold }]}>✦</Text>
                        </View>
                    </Animated.View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    centerer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    outerNative: {
        width: '100%',
        maxWidth: 380,
        // elevation/shadow live here alongside native-driver transforms
        elevation: 24,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
    },
    outerGlow: {
        borderRadius: Radius.xl + 4,
        borderWidth: 1.5,
        width: '100%',
    },
    card: {
        borderRadius: Radius.xl,
        borderWidth: 1,
        overflow: 'hidden',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
        paddingTop: 0,
    },
    topStrip: {
        width: '100%',
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    topStripLine: {
        width: 48,
        height: 3,
        borderRadius: 2,
        marginBottom: 8,
        opacity: 0.8,
    },
    emoji: {
        fontSize: 72,
        marginBottom: Spacing.sm,
    },
    title: {
        fontSize: FontSize.xl,
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    },
    divider: {
        width: '60%',
        height: 1,
        marginVertical: Spacing.md,
        borderRadius: 1,
    },
    body: {
        fontSize: FontSize.base,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.lg,
        paddingHorizontal: Spacing.sm,
    },
    ctaButton: {
        paddingVertical: 14,
        paddingHorizontal: Spacing.xl,
        borderRadius: Radius.full,
        minWidth: 160,
        alignItems: 'center',
    },
    ctaText: {
        fontSize: FontSize.base,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cornerStarTL: {
        position: 'absolute',
        top: 12,
        left: 16,
        fontSize: 12,
        opacity: 0.6,
    },
    cornerStarTR: {
        position: 'absolute',
        top: 12,
        right: 16,
        fontSize: 12,
        opacity: 0.6,
    },
});
