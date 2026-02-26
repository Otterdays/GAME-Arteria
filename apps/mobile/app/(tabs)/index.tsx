/**
 * Skills Screen — Main gameplay screen.
 * Lists all skills with levels, XP bars, and a "Train" button.
 * Mining is fully interactive as the proof-of-concept.
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';

// Map of skill IDs to display info
const SKILL_META: Record<
  SkillId,
  { label: string; color: string; emoji: string }
> = {
  mining: { label: 'Mining', color: Palette.skillMining, emoji: '⛏️' },
  woodcutting: { label: 'Woodcutting', color: Palette.skillWoodcutting, emoji: '🪓' },
  fishing: { label: 'Fishing', color: Palette.skillFishing, emoji: '🎣' },
  cooking: { label: 'Cooking', color: Palette.skillCooking, emoji: '🍳' },
  smithing: { label: 'Smithing', color: Palette.skillSmithing, emoji: '🔨' },
  crafting: { label: 'Crafting', color: Palette.skillCrafting, emoji: '✂️' },
  farming: { label: 'Farming', color: Palette.skillFarming, emoji: '🌾' },
  herblore: { label: 'Herblore', color: Palette.skillHerblore, emoji: '🧪' },
  agility: { label: 'Agility', color: Palette.skillAgility, emoji: '🏃' },
  attack: { label: 'Attack', color: Palette.skillAttack, emoji: '⚔️' },
  strength: { label: 'Strength', color: Palette.skillStrength, emoji: '💪' },
  defence: { label: 'Defence', color: Palette.skillDefence, emoji: '🛡️' },
  hitpoints: { label: 'Hitpoints', color: Palette.skillHitpoints, emoji: '❤️' },
};

// Simple XP table lookup (inline for display only)
function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  let cumulative = 0;
  for (let lvl = 1; lvl < level; lvl++) {
    cumulative += Math.floor(lvl + 300 * Math.pow(2, lvl / 7)) / 4;
  }
  return Math.floor(cumulative);
}

function progressPercent(xp: number, level: number): number {
  if (level >= 99) return 100;
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const range = nextLevelXP - currentLevelXP;
  if (range <= 0) return 100;
  return Math.min(100, ((xp - currentLevelXP) / range) * 100);
}

function SkillCard({
  skillId,
  isActive,
  onTrain,
}: {
  skillId: SkillId;
  isActive: boolean;
  onTrain: (id: SkillId) => void;
}) {
  const skill = useAppSelector((s) => s.game.player.skills[skillId]);
  const meta = SKILL_META[skillId];
  const progress = progressPercent(skill.xp, skill.level);

  return (
    <View style={[styles.skillCard, isActive && styles.skillCardActive]}>
      {/* Header row */}
      <View style={styles.skillHeader}>
        <Text style={styles.skillEmoji}>{meta.emoji}</Text>
        <View style={styles.skillInfo}>
          <Text style={styles.skillName}>{meta.label}</Text>
          <Text style={styles.skillLevel}>Lv. {skill.level}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.trainButton,
            isActive && styles.trainButtonActive,
          ]}
          onPress={() => onTrain(skillId)}
          activeOpacity={0.7}>
          <Text style={styles.trainButtonText}>
            {isActive ? 'Stop' : 'Train'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* XP Bar */}
      <View style={styles.xpBarContainer}>
        <View style={styles.xpBarBg}>
          <View
            style={[
              styles.xpBarFill,
              {
                width: `${Math.max(2, progress)}%`,
                backgroundColor: meta.color,
              },
            ]}
          />
        </View>
        <Text style={styles.xpText}>
          {Math.floor(skill.xp).toLocaleString()} XP ({progress.toFixed(1)}%)
        </Text>
      </View>
    </View>
  );
}

export default function SkillsScreen() {
  const dispatch = useAppDispatch();
  const activeTask = useAppSelector((s) => s.game.player.activeTask);
  const activeSkillId = activeTask?.skillId ?? null;

  const handleTrain = useCallback(
    (skillId: SkillId) => {
      if (activeTask?.skillId === skillId) {
        dispatch(gameActions.stopTask());
      } else {
        // For now, only mining works; others will just set the task
        const actionMap: Partial<Record<SkillId, string>> = {
          mining: 'copper_ore',
        };
        const actionId = actionMap[skillId];
        if (actionId) {
          dispatch(
            gameActions.startTask({
              type: 'skilling',
              skillId,
              actionId,
              intervalMs: 3000,
              partialTickMs: 0,
            })
          );
        }
      }
    },
    [activeTask, dispatch]
  );

  const skillOrder: SkillId[] = [
    'mining',
    'woodcutting',
    'fishing',
    'cooking',
    'smithing',
    'crafting',
    'farming',
    'herblore',
    'agility',
    'attack',
    'strength',
    'defence',
    'hitpoints',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Skills</Text>
        {activeTask && (
          <View style={styles.activeIndicator}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>
              {SKILL_META[activeTask.skillId as SkillId]?.label ?? 'Active'}
            </Text>
          </View>
        )}
      </View>

      {/* Skill List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {skillOrder.map((skillId) => (
          <SkillCard
            key={skillId}
            skillId={skillId}
            isActive={activeSkillId === skillId}
            onTrain={handleTrain}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgCard,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.green,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.green,
    marginRight: Spacing.xs,
  },
  activeText: {
    fontSize: FontSize.sm,
    color: Palette.green,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },

  // Skill Card
  skillCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  skillCardActive: {
    borderColor: Palette.accentPrimary,
    backgroundColor: Palette.bgCardHover,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  skillEmoji: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  skillLevel: {
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  trainButton: {
    backgroundColor: Palette.accentPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  trainButtonActive: {
    backgroundColor: Palette.red,
  },
  trainButtonText: {
    color: Palette.white,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },

  // XP Bar
  xpBarContainer: {
    gap: 4,
  },
  xpBarBg: {
    height: 8,
    backgroundColor: Palette.bgApp,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  xpText: {
    fontSize: FontSize.xs,
    color: Palette.textMuted,
  },
});
