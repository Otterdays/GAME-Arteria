/**
 * RecipeWorkbenchCard — Bigger recipe card with input slots, output preview, level gate, affordability.
 * [TRACE: Woodworking Flagship Plan — reusable skill UI]
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { getItemMeta } from '@/constants/items';
import { formatXpHr } from '@/utils/formatNumber';
import { BouncyButton } from '@/components/BouncyButton';
import { ActivePulseGlow } from '@/components/ActivePulseGlow';
import { SmoothProgressBar } from '@/components/SmoothProgressBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { getGlassCardGradientColors } from '@/constants/skillPageStyles';

export interface RecipeInput {
    id: string;
    quantity: number;
}

export interface RecipeOutput {
    id: string;
    quantity: number;
}

export interface RecipeWorkbenchCardProps {
    id: string;
    name: string;
    emoji: string;
    levelReq: number;
    xpPerTick: number;
    baseTickMs: number;
    successRate: number;
    consumedItems: RecipeInput[];
    items: RecipeOutput[];
    skillColor: string;
    playerLevel: number;
    inventory: { id: string; quantity: number }[];
    isActive: boolean;
    activeTask?: { partialTickMs: number; intervalMs: number } | null;
    onPress: () => void;
}

function canAfford(inventory: { id: string; quantity: number }[], consumed: RecipeInput[]): boolean {
    for (const c of consumed) {
        const owned = inventory.find((i) => i.id === c.id)?.quantity ?? 0;
        if (owned < c.quantity) return false;
    }
    return true;
}

function minBatches(inventory: { id: string; quantity: number }[], consumed: RecipeInput[]): number {
    let min = Infinity;
    for (const c of consumed) {
        const owned = inventory.find((i) => i.id === c.id)?.quantity ?? 0;
        const batches = c.quantity > 0 ? Math.floor(owned / c.quantity) : Infinity;
        min = Math.min(min, batches);
    }
    return min === Infinity ? 0 : min;
}

export function RecipeWorkbenchCard({
    name,
    emoji,
    levelReq,
    xpPerTick,
    baseTickMs,
    successRate,
    consumedItems,
    items,
    skillColor,
    playerLevel,
    inventory,
    isActive,
    activeTask,
    onPress,
}: RecipeWorkbenchCardProps) {
    const { palette } = useTheme();
    const isLevelLocked = playerLevel < levelReq;
    const affordable = canAfford(inventory, consumedItems);
    const batches = minBatches(inventory, consumedItems);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                card: {
                    marginBottom: Spacing.md,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: palette.border,
                    overflow: 'hidden',
                    backgroundColor: palette.bgCard,
                    padding: Spacing.md,
                },
                cardActive: {
                    borderWidth: 2,
                    borderColor: skillColor,
                    backgroundColor: skillColor + '11',
                },
                cardEmpty: {
                    borderColor: palette.red + '66',
                },
                header: {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: Spacing.sm,
                },
                emoji: {
                    fontSize: 36,
                    marginRight: Spacing.md,
                },
                titleBlock: { flex: 1 },
                name: {
                    fontSize: FontSize.base,
                    fontWeight: '700',
                    color: palette.textPrimary,
                },
                req: {
                    fontSize: FontSize.xs,
                    color: palette.textSecondary,
                    marginTop: 2,
                },
                ioRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: Spacing.sm,
                    gap: Spacing.md,
                },
                ioSlot: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.xs,
                    flex: 1,
                    backgroundColor: palette.bgApp,
                    padding: Spacing.sm,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                ioLabel: {
                    fontSize: FontSize.xs,
                    color: palette.textMuted,
                    textTransform: 'uppercase',
                },
                ioContent: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                },
                statsRow: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: Spacing.sm,
                    marginBottom: Spacing.sm,
                },
                statPill: {
                    backgroundColor: palette.bgApp,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                statLabel: { fontSize: 10, color: palette.textMuted },
                statValue: { fontSize: FontSize.sm, fontWeight: '700', color: palette.textPrimary },
                trainButton: {
                    backgroundColor: palette.accentPrimary,
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                },
                trainButtonActive: { backgroundColor: palette.red },
                trainButtonEmpty: {
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                trainButtonLocked: {
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                },
                trainButtonText: { color: palette.white, fontWeight: 'bold', fontSize: FontSize.base },
            }),
        [palette, skillColor]
    );

    const outOfMaterials = !isLevelLocked && !affordable;

    return (
        <BouncyButton
            style={[
                styles.card,
                isActive && styles.cardActive,
                outOfMaterials && styles.cardEmpty,
            ]}
            scaleTo={0.98}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLevelLocked || outOfMaterials, selected: isActive }}
            accessibilityLabel={`${name}. ${isLevelLocked ? `Unlocks at level ${levelReq}` : 'Craft'}`}
        >
            {!isLevelLocked && (
                <LinearGradient
                    colors={getGlassCardGradientColors(palette)}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            )}
            {isActive && <ActivePulseGlow color={skillColor} />}

            <View style={styles.header}>
                <Text style={[styles.emoji, isLevelLocked && { opacity: 0.4 }]}>{emoji}</Text>
                <View style={styles.titleBlock}>
                    <Text style={[styles.name, isLevelLocked && { color: palette.textDisabled }]}>
                        {name}
                    </Text>
                    <Text style={styles.req}>
                        {isLevelLocked
                            ? `Unlocks at Lv. ${levelReq}`
                            : `Lv. ${levelReq} · ${consumedItems.map((c) => {
                                  const m = getItemMeta(c.id);
                                  return `${m.emoji} ${c.quantity}`;
                              }).join(', ')}`}
                    </Text>
                </View>
            </View>

            <View style={[styles.ioRow, isLevelLocked && { opacity: 0.5 }]}>
                <View style={styles.ioSlot}>
                    <Text style={styles.ioLabel}>Inputs</Text>
                    <View style={styles.ioContent}>
                        {consumedItems.map((c) => {
                            const m = getItemMeta(c.id);
                            const owned = inventory.find((i) => i.id === c.id)?.quantity ?? 0;
                            const ok = owned >= c.quantity;
                            return (
                                <Text key={c.id} style={{ fontSize: FontSize.sm }}>
                                    {m.emoji} {owned}/{c.quantity}
                                </Text>
                            );
                        })}
                    </View>
                </View>
                <Text style={{ color: palette.textMuted, fontSize: FontSize.sm }}>→</Text>
                <View style={styles.ioSlot}>
                    <Text style={styles.ioLabel}>Output</Text>
                    <View style={styles.ioContent}>
                        {items.map((o) => {
                            const m = getItemMeta(o.id);
                            return (
                                <Text key={o.id} style={{ fontSize: FontSize.sm }}>
                                    {m.emoji} {o.quantity}
                                </Text>
                            );
                        })}
                    </View>
                </View>
            </View>

            <View style={[styles.statsRow, isLevelLocked && { opacity: 0.5 }]}>
                <View style={styles.statPill}>
                    <Text style={styles.statLabel}>XP/tick</Text>
                    <Text style={styles.statValue}>{xpPerTick}</Text>
                </View>
                <View style={styles.statPill}>
                    <Text style={styles.statLabel}>XP/hr</Text>
                    <Text style={[styles.statValue, { color: palette.gold }]}>
                        {formatXpHr(xpPerTick, baseTickMs, successRate)}
                    </Text>
                </View>
                {!isLevelLocked && (
                    <View style={styles.statPill}>
                        <Text style={styles.statLabel}>Batches</Text>
                        <Text style={[styles.statValue, !affordable && { color: palette.red }]}>
                            {batches}
                        </Text>
                    </View>
                )}
            </View>

            {!isLevelLocked && (
                <View
                    style={[
                        styles.trainButton,
                        isActive && styles.trainButtonActive,
                        outOfMaterials && styles.trainButtonEmpty,
                    ]}
                >
                    <Text style={styles.trainButtonText}>
                        {isActive ? 'Stop' : outOfMaterials ? 'Need Materials' : 'Craft'}
                    </Text>
                </View>
            )}
            {isActive && activeTask && (
                <SmoothProgressBar
                    partialTickMs={activeTask.partialTickMs}
                    intervalMs={activeTask.intervalMs}
                    fillColor={skillColor}
                />
            )}
            {isLevelLocked && (
                <View style={[styles.trainButton, styles.trainButtonLocked]}>
                    <IconSymbol name="lock.fill" size={16} color={palette.textDisabled} />
                </View>
            )}
        </BouncyButton>
    );
}
