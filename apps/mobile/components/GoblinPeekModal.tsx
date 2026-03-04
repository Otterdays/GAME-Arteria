/**
 * GoblinPeekModal — Shows goblin artwork when goblin_peek random event fires.
 * [TRACE: constants/enemies.ts — first random enemy]
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize } from '@/constants/theme';
import GoblinSvg from '@/assets/images/goblin_1.svg';

const DISMISS_MS = 3000;

export default function GoblinPeekModal() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const show = useAppSelector((s) => s.game.showGoblinPeek);

    const dismiss = useCallback(() => {
        dispatch(gameActions.setShowGoblinPeek(false));
    }, [dispatch]);

    useEffect(() => {
        if (!show) return;
        const t = setTimeout(dismiss, DISMISS_MS);
        return () => clearTimeout(t);
    }, [show, dismiss]);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                overlay: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                card: {
                    backgroundColor: palette.bgCard,
                    borderRadius: Radius.lg,
                    padding: Spacing.xl,
                    alignItems: 'center',
                    maxWidth: 280,
                    borderWidth: 2,
                    borderColor: palette.gold,
                },
                title: {
                    fontSize: FontSize.xl,
                    fontWeight: '700',
                    color: palette.gold,
                    marginBottom: Spacing.sm,
                },
                message: {
                    fontSize: FontSize.md,
                    color: palette.textPrimary,
                    textAlign: 'center',
                },
                svgWrap: {
                    width: 120,
                    height: 120,
                    marginVertical: Spacing.md,
                },
            }),
        [palette]
    );

    if (!show) return null;

    return (
        <Modal visible={show} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={dismiss} accessible accessibilityLabel="Dismiss goblin peek">
                <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.title}>A Goblin!</Text>
                    <View style={styles.svgWrap}>
                        <GoblinSvg width={120} height={120} />
                    </View>
                    <Text style={styles.message}>
                        It peeked from the shadows... then scurried away. Your first enemy sighting!
                    </Text>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
