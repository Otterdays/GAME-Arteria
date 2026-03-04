/**
 * NameEntryModal — First-time nickname entry before starting.
 * [TRACE: DOCU/MASTER_DESIGN_DOC.md §II — The Anchor; constants/character.ts]
 *
 * The main character is "The Anchor". The player chooses a nickname
 * that friends and NPCs will use.
 */

import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize } from '@/constants/theme';
import { PROTAGONIST_CANONICAL_NAME } from '@/constants/character';
import { BouncyButton } from '@/components/BouncyButton';
import * as Haptics from 'expo-haptics';

export default function NameEntryModal() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const show = useAppSelector((s) => s.game.awaitingNameEntry);
    const [nickname, setNickname] = useState('');

    const handleContinue = () => {
        const n = nickname.trim();
        if (n.length > 0) {
            dispatch(gameActions.newGame(n));
            setNickname('');
        }
    };

    const handleSkip = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dispatch(gameActions.newGame(''));
        setNickname('');
    };

    const styles = useMemo(
        () =>
            StyleSheet.create({
                overlay: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: Spacing.xl,
                },
                card: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.xl,
                    padding: Spacing.xl,
                    width: '100%',
                    maxWidth: 320,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                title: {
                    fontSize: FontSize.xl,
                    fontWeight: '800',
                    color: palette.textPrimary,
                    textAlign: 'center',
                    marginBottom: Spacing.sm,
                },
                desc: {
                    fontSize: FontSize.md,
                    color: palette.textSecondary,
                    textAlign: 'center',
                    marginBottom: Spacing.lg,
                    lineHeight: 22,
                },
                input: {
                    backgroundColor: palette.bgInput,
                    borderRadius: Radius.md,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    fontSize: FontSize.base,
                    color: palette.textPrimary,
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginBottom: Spacing.md,
                },
                btnRow: {
                    flexDirection: 'row',
                    gap: Spacing.sm,
                    marginTop: Spacing.sm,
                },
                skipBtn: {
                    paddingVertical: 12,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: palette.border,
                    marginTop: Spacing.sm,
                },
                skipText: {
                    fontSize: FontSize.sm,
                    fontWeight: '600',
                    color: palette.textSecondary,
                },
            }),
        [palette]
    );

    if (!show) return null;

    return (
        <Modal visible={show} transparent animationType="fade">
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={40}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Welcome to Arteria</Text>
                    <Text style={styles.desc}>
                        You are {PROTAGONIST_CANONICAL_NAME} — a soul heavy enough to anchor reality. What should friends call you?
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your nickname"
                        placeholderTextColor={palette.textMuted}
                        value={nickname}
                        onChangeText={setNickname}
                        autoCapitalize="words"
                        autoCorrect={false}
                        maxLength={24}
                        accessible
                        accessibilityLabel="Enter your nickname"
                    />
                    <BouncyButton
                        style={{
                            backgroundColor: palette.accentPrimary,
                            paddingVertical: 12,
                            borderRadius: Radius.md,
                            alignItems: 'center',
                            opacity: nickname.trim().length === 0 ? 0.5 : 1,
                        }}
                        onPress={handleContinue}
                        disabled={nickname.trim().length === 0}
                    >
                        <Text style={{ color: palette.white, fontWeight: '700', fontSize: FontSize.base }}>Continue</Text>
                    </BouncyButton>
                    <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.8}>
                        <Text style={styles.skipText}>Skip (use {PROTAGONIST_CANONICAL_NAME})</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
