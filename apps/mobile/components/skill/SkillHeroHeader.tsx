/**
 * SkillHeroHeader — Hero panel for skill screens.
 * Shows skill title, level, active recipe, XP/hour, and progress bar.
 * [TRACE: Woodworking Flagship Plan — reusable skill UI]
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { FloatingXpPop } from '@/components/FloatingXpPop';
import { MasteryBadges } from '@/components/MasteryBadges';
import { formatNumber, formatXpHr } from '@/utils/formatNumber';
import type { SkillId } from '@/store/gameSlice';

export interface SkillHeroHeaderProps {
    skillId: SkillId;
    title: string;
    subtitle: string;
    level: number;
    xp: number;
    skillColor: string;
    activeRecipeName?: string;
    activeXpPerTick?: number;
    activeTickMs?: number;
    activeSuccessRate?: number;
    xpGain?: number;
    xpPopTrigger?: number;
    xpPopEmoji?: string;
}

function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    let c = 0;
    for (let l = 1; l < level; l++) c += Math.floor(l + 300 * Math.pow(2, l / 7)) / 4;
    return Math.floor(c);
}

export function SkillHeroHeader({
    skillId,
    title,
    subtitle,
    level,
    xp,
    skillColor,
    activeRecipeName,
    activeXpPerTick = 0,
    activeTickMs = 3000,
    activeSuccessRate = 1,
    xpGain = 0,
    xpPopTrigger = 0,
    xpPopEmoji = '✨',
}: SkillHeroHeaderProps) {
    const { palette } = useTheme();
    const clvXP = xpForLevel(level);
    const nlvXP = xpForLevel(level + 1);
    const xpIntoLevel = Math.max(0, Math.floor(xp - clvXP));
    const xpNeeded = Math.max(1, nlvXP - clvXP);
    const pct = level >= 99 ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    padding: Spacing.lg,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                    backgroundColor: palette.bgCard,
                },
                levelTag: {
                    backgroundColor: `${skillColor}25`,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: `${skillColor}50`,
                },
                levelTagText: {
                    color: skillColor,
                    fontSize: FontSize.xs,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                title: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.xl,
                    color: palette.textPrimary,
                    marginTop: Spacing.xs,
                },
                subtitle: {
                    fontSize: FontSize.sm,
                    color: palette.textSecondary,
                    marginTop: 4,
                    textAlign: 'center',
                },
                activeRecipe: {
                    marginTop: Spacing.sm,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.xs,
                    backgroundColor: palette.bgApp,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: skillColor + '50',
                },
                activeRecipeText: {
                    fontSize: FontSize.sm,
                    color: skillColor,
                    fontWeight: '600',
                },
                xpHr: {
                    fontSize: FontSize.xs,
                    color: palette.gold,
                    marginTop: 2,
                },
                xpRow: { width: '100%', marginTop: Spacing.sm, gap: 4 },
                xpBarBg: {
                    height: 8,
                    backgroundColor: palette.bgApp,
                    borderRadius: 4,
                    overflow: 'hidden',
                },
                xpText: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    textAlign: 'center',
                },
            }),
        [palette, skillColor]
    );

    return (
        <View style={styles.container}>
            <View style={styles.levelTag}>
                <Text style={styles.levelTagText}>Lv. {level}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <MasteryBadges skillId={skillId} />

            {activeRecipeName && (
                <View style={styles.activeRecipe}>
                    <Text style={styles.activeRecipeText}>{activeRecipeName}</Text>
                    {activeXpPerTick > 0 && (
                        <Text style={styles.xpHr}>
                            {formatXpHr(activeXpPerTick, activeTickMs, activeSuccessRate)} XP/hr
                        </Text>
                    )}
                </View>
            )}

            <View style={styles.xpRow}>
                <View style={styles.xpBarBg}>
                    <ProgressBarWithPulse progress={pct} fillColor={skillColor} widthPercent={pct} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={styles.xpText}>
                        {level >= 99 ? (
                            `${formatNumber(xp)} XP — MAX`
                        ) : (
                            <>
                                <AnimatedNumber value={xpIntoLevel} formatValue={(v) => formatNumber(v)} />
                                {' / '}
                                {formatNumber(xpNeeded)} XP
                            </>
                        )}
                    </Text>
                </View>
                <FloatingXpPop amount={xpGain} emoji={xpPopEmoji} triggerKey={xpPopTrigger} />
            </View>
        </View>
    );
}
