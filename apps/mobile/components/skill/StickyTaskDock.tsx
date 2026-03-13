/**
 * StickyTaskDock — Sticky bottom CTA for Craft/Stop plus quick summary.
 * [TRACE: Woodworking Flagship Plan — reusable skill UI]
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, FontSize } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { BouncyButton } from '@/components/BouncyButton';
import * as Haptics from 'expo-haptics';

export interface StickyTaskDockProps {
    isActive: boolean;
    canCraft: boolean;
    summaryText?: string;
    onPrimaryAction: () => void;
    primaryLabel: string;
    activeLabel?: string;
    accentColor: string;
}

export function StickyTaskDock({
    isActive,
    canCraft,
    summaryText,
    onPrimaryAction,
    primaryLabel,
    activeLabel = 'Stop',
    accentColor,
}: StickyTaskDockProps) {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingHorizontal: Spacing.md,
                    paddingTop: Spacing.md,
                    paddingBottom: Math.max(insets.bottom, Spacing.md),
                    backgroundColor: palette.bgCard,
                    borderTopWidth: 1,
                    borderTopColor: palette.border,
                },
                summary: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    marginBottom: Spacing.sm,
                    textAlign: 'center',
                },
                button: {
                    backgroundColor: accentColor,
                    paddingVertical: Spacing.md,
                    borderRadius: 8,
                    alignItems: 'center',
                },
                buttonActive: {
                    backgroundColor: palette.red,
                },
                buttonDisabled: {
                    backgroundColor: palette.bgApp,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                buttonText: {
                    color: palette.white,
                    fontWeight: 'bold',
                    fontSize: FontSize.base,
                },
            }),
        [palette, accentColor, insets.bottom]
    );

    const showButton = isActive || canCraft;
    const buttonLabel = isActive ? activeLabel : primaryLabel;
    const isDisabled = !isActive && !canCraft;

    if (!showButton && !summaryText) return null;

    const handlePress = () => {
        if (isDisabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPrimaryAction();
    };

    return (
        <View style={styles.container}>
            {summaryText && <Text style={styles.summary}>{summaryText}</Text>}
            {showButton && (
                <BouncyButton
                    style={[
                        styles.button,
                        isActive && styles.buttonActive,
                        isDisabled && styles.buttonDisabled,
                    ]}
                    scaleTo={0.97}
                    onPress={handlePress}
                    disabled={isDisabled}
                    accessibilityRole="button"
                    accessibilityLabel={buttonLabel}
                >
                    <Text style={[styles.buttonText, isDisabled && { color: palette.textSecondary }]}>
                        {buttonLabel}
                    </Text>
                </BouncyButton>
            )}
        </View>
    );
}
