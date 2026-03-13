/**
 * SkillCategoryRail — Segmented chips for filtering recipes by category.
 * [TRACE: Woodworking Flagship Plan — reusable skill UI]
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Spacing, FontSize } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

export interface SkillCategoryRailProps<T extends string> {
    categories: readonly T[];
    labels: Record<T, string>;
    selected: T;
    onSelect: (category: T) => void;
    accentColor: string;
}

export function SkillCategoryRail<T extends string>({
    categories,
    labels,
    selected,
    onSelect,
    accentColor,
}: SkillCategoryRailProps<T>) {
    const { palette } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flexDirection: 'row',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    gap: Spacing.sm,
                    backgroundColor: palette.bgApp,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                },
                chip: {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: palette.border,
                    backgroundColor: palette.bgCard,
                },
                chipSelected: {
                    borderColor: accentColor,
                    backgroundColor: accentColor + '22',
                },
                chipText: {
                    fontSize: FontSize.sm,
                    fontWeight: '600',
                    color: palette.textSecondary,
                },
                chipTextSelected: {
                    color: accentColor,
                },
            }),
        [palette, accentColor]
    );

    return (
        <View style={styles.container}>
            {categories.map((cat) => {
                const isSelected = selected === cat;
                return (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onSelect(cat);
                        }}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isSelected }}
                        accessibilityLabel={labels[cat]}
                    >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {labels[cat]}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
