import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { SkillId } from '@/store/gameSlice';
import { SKILL_META } from '@/constants/skills';
import { BouncyButton } from './BouncyButton';

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

    const styles = useMemo(
        () =>
            StyleSheet.create({
                overlay: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.6)',
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
                },
                emojiContainer: {
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: palette.bgApp,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: Spacing.lg,
                    borderWidth: 2,
                },
                emoji: {
                    fontSize: 40,
                },
                title: {
                    fontSize: FontSize.xl,
                    fontWeight: 'bold',
                    color: palette.textPrimary,
                    marginBottom: Spacing.sm,
                    textAlign: 'center',
                },
                message: {
                    fontSize: FontSize.md,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    marginBottom: Spacing.xl,
                    lineHeight: 22,
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
                },
            }),
        [palette]
    );

    if (!skillId) return null;

    const meta = SKILL_META[skillId];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={styles.card}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={[styles.emojiContainer, { borderColor: meta.color }]}>
                        <Text style={styles.emoji}>{meta.emoji}</Text>
                    </View>
                    <Text style={styles.title}>{meta.label} is coming soon!</Text>
                    <Text style={styles.message}>
                        This skill is currently in the works. Check back in a future update!
                    </Text>

                    <BouncyButton
                        style={[styles.button, { borderColor: meta.color }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Okay</Text>
                    </BouncyButton>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
