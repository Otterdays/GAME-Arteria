import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay } from 'react-native-reanimated';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { SkillId } from '@/store/gameSlice';
import { SKILL_META } from '@/constants/skills';
import { BouncyButton } from './BouncyButton';
import { LinearGradient } from 'expo-linear-gradient';

export function ComingSoonModal({
    visible,
    skillId,
    onClose,
}: {
    visible: boolean;
    skillId: SkillId | null;
    onClose: () => void;
}) {
    const { palette } = useTheme();
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = withSpring(1, { damping: 15 });
            opacity.value = withTiming(1, { duration: 250 });
        } else {
            scale.value = withTiming(0.9, { duration: 150 });
            opacity.value = withTiming(0, { duration: 150 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const styles = useMemo(
        () =>
            StyleSheet.create({
                overlay: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: Spacing.xl,
                },
                card: {
                    width: '100%',
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.xl,
                    borderWidth: 1,
                    borderColor: palette.border,
                    padding: Spacing.xl,
                    alignItems: 'center',
                    overflow: 'hidden',
                },
                headerGlow: {
                    position: 'absolute',
                    top: -50,
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    opacity: 0.15,
                },
                emojiContainer: {
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: palette.bgApp,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: Spacing.lg,
                    borderWidth: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 10,
                },
                emoji: {
                    fontSize: 48,
                },
                title: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.xl,
                    color: palette.textPrimary,
                    marginBottom: Spacing.md,
                    textAlign: 'center',
                },
                statusBadge: {
                    backgroundColor: palette.bgApp,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: Radius.full,
                    borderWidth: 1,
                    marginBottom: Spacing.lg,
                },
                statusText: {
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: palette.textSecondary,
                },
                message: {
                    fontSize: FontSize.md,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    marginBottom: Spacing.xl,
                    lineHeight: 24,
                    paddingHorizontal: Spacing.sm,
                },
                button: {
                    width: '100%',
                    backgroundColor: palette.bgApp,
                    paddingVertical: Spacing.md,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                    borderWidth: 1,
                },
                buttonText: {
                    color: palette.textPrimary,
                    fontSize: FontSize.md,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                },
                constructionBadge: {
                    position: 'absolute',
                    top: 20,
                    right: -30,
                    backgroundColor: '#fbbf24',
                    paddingHorizontal: 40,
                    paddingVertical: 4,
                    transform: [{ rotate: '45deg' }],
                },
                constructionText: {
                    fontSize: 10,
                    fontWeight: '900',
                    color: '#000',
                    textAlign: 'center',
                }
            }),
        [palette]
    );

    if (!skillId) return null;

    const meta = SKILL_META[skillId];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />
                <Animated.View
                    style={[styles.card, animatedStyle]}
                    pointerEvents="box-none"
                >
                    <LinearGradient
                        colors={[meta.color, 'transparent']}
                        style={styles.headerGlow}
                    />

                    <View style={styles.constructionBadge}>
                        <Text style={styles.constructionText}>IN WORKS</Text>
                    </View>

                    <View style={[styles.emojiContainer, { borderColor: meta.color }]}>
                        <Text style={styles.emoji}>{meta.emoji}</Text>
                    </View>

                    <Text style={styles.title}>{meta.label}</Text>

                    <View style={[styles.statusBadge, { borderColor: meta.color + '44' }]}>
                        <Text style={[styles.statusText, { color: meta.color }]}>Building Phase</Text>
                    </View>

                    <Text style={styles.message}>
                        The architects of Arteria are currently forging the foundations of {meta.label}.
                        {"\n\n"}
                        Check back in a future update to see what's being built!
                    </Text>

                    <BouncyButton
                        style={[styles.button, { borderColor: meta.color }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>CONTINUE ADVENTURE</Text>
                    </BouncyButton>
                </Animated.View>
            </View>
        </Modal>
    );
}
