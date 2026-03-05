/**
 * MasteryBadges — Compact row of active mastery bonuses for skill headers.
 * Shows only purchased upgrades (level > 0). Renders nothing when no mastery spent.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, Radius, type PaletteShape } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector } from '@/store/hooks';
import { MASTERY_UPGRADES, type MasteryUpgradeDef } from '@/constants/mastery';
import type { SkillId } from '@/store/gameSlice';

const UPGRADE_EMOJI: Record<string, string> = {
    xp_bonus: '📖',
    yield_bonus: '📦',
    speed_bonus: '⚡',
};

export function MasteryBadges({ skillId }: { skillId: SkillId }) {
    const { palette } = useTheme();
    const spent = useAppSelector((s) => s.game.player.masterySpent?.[skillId] ?? {});
    const upgrades = MASTERY_UPGRADES[skillId];

    const activeBonuses = useMemo(() => {
        if (!upgrades) return [];
        return upgrades
            .map((u) => ({ ...u, level: spent[u.id] ?? 0 }))
            .filter((u) => u.level > 0);
    }, [upgrades, spent]);

    const styles = useMemo(() => createStyles(palette), [palette]);

    if (activeBonuses.length === 0) return null;

    return (
        <View style={styles.row}>
            {activeBonuses.map((b) => {
                const pct = bonusPercent(b);
                return (
                    <View key={b.id} style={styles.badge}>
                        <Text style={styles.badgeEmoji}>{UPGRADE_EMOJI[b.id] ?? '✦'}</Text>
                        <Text style={styles.badgeText}>+{pct}%</Text>
                    </View>
                );
            })}
        </View>
    );
}

function bonusPercent(u: MasteryUpgradeDef & { level: number }): number {
    if (u.xpPercentPerLevel > 0) return u.level * u.xpPercentPerLevel;
    if (u.yieldPercentPerLevel) return u.level * u.yieldPercentPerLevel;
    if (u.speedPercentPerLevel) return u.level * u.speedPercentPerLevel;
    return 0;
}

function createStyles(palette: PaletteShape) {
    return StyleSheet.create({
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: Spacing.xs,
            marginTop: Spacing.xs,
            flexWrap: 'wrap',
        },
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            backgroundColor: palette.gold + '1A',
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
            borderRadius: Radius.full,
            borderWidth: 1,
            borderColor: palette.gold + '40',
        },
        badgeEmoji: { fontSize: FontSize.xs },
        badgeText: {
            fontSize: FontSize.xs,
            fontWeight: '600',
            color: palette.gold,
        },
    });
}
