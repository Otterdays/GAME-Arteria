/**
 * Skills Screen — Main gameplay screen.
 * QoL improvements:
 *   A. Skills grouped by pillar (Gathering / Combat / Crafting / Support)
 *   B. Total Level badge in the header
 *   C. Locked-card style for unimplemented skills ("Phase 2 ›" tag, no Alert)
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { router } from 'expo-router';
import { formatNumber } from '@/utils/formatNumber';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { HorizonHUD } from '@/components/HorizonHUD';

// ─── Skill metadata ───────────────────────────────────────────────────────────

const SKILL_META: Record<SkillId, { label: string; color: string; emoji: string }> = {
  mining: { label: 'Mining', color: Palette.skillMining, emoji: '⛏️' },
  logging: { label: 'Logging', color: Palette.skillLogging, emoji: '🪓' },
  harvesting: { label: 'Harvesting', color: Palette.skillHarvesting, emoji: '🪴' },
  scavenging: { label: 'Scavenging', color: Palette.skillScavenging, emoji: '🏕️' },
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

// A. Skill pillars — groups with header label
const SKILL_PILLARS: { label: string; emoji: string; skills: SkillId[] }[] = [
  {
    label: 'Gathering',
    emoji: '⛏️',
    skills: ['mining', 'logging', 'harvesting', 'scavenging', 'fishing'],
  },
  {
    label: 'Combat',
    emoji: '⚔️',
    skills: ['attack', 'strength', 'defence', 'hitpoints'],
  },
  {
    label: 'Crafting',
    emoji: '🔨',
    skills: ['smithing', 'cooking', 'crafting', 'farming', 'herblore'],
  },
  {
    label: 'Support',
    emoji: '✨',
    skills: ['agility'],
  },
];

// C. Skills that are implemented and navigable
const IMPLEMENTED_SKILLS = new Set<SkillId>(['mining']);

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({
  skillId,
  isActive,
  onTrain,
  onNavigate,
}: {
  skillId: SkillId;
  isActive: boolean;
  onTrain: (id: SkillId) => void;
  onNavigate: (id: SkillId) => void;
}) {
  const skill = useAppSelector((s) => s.game.player.skills[skillId]);
  const meta = SKILL_META[skillId];
  const isImplemented = IMPLEMENTED_SKILLS.has(skillId);
  const progress = progressPercent(skill.xp, skill.level);
  const currentLevelXP = xpForLevel(skill.level);
  const nextLevelXP = xpForLevel(skill.level + 1);
  const xpIntoLevel = Math.max(0, Math.floor(skill.xp - currentLevelXP));
  const xpNeeded = Math.max(1, nextLevelXP - currentLevelXP);

  return (
    <TouchableOpacity
      activeOpacity={isImplemented ? 0.7 : 1.0}
      onPress={() => isImplemented && onNavigate(skillId)}
      style={[
        styles.skillCard,
        isActive && styles.skillCardActive,
        !isImplemented && styles.skillCardLocked,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${meta.label}, level ${skill.level}. ${isImplemented ? (isActive ? 'Stop training' : 'Train') : 'Coming in Phase 2'}`}
    >
      {/* Header row */}
      <View style={styles.skillHeader}>
        <Text style={[styles.skillEmoji, !isImplemented && styles.lockedEmoji]}>
          {meta.emoji}
        </Text>
        <View style={styles.skillInfo}>
          <Text style={[styles.skillName, !isImplemented && styles.lockedText]}>
            {meta.label}
          </Text>
          <Text style={styles.skillLevel}>Lv. {skill.level}</Text>
        </View>

        {/* C. Real button for implemented; locked badge otherwise */}
        {isImplemented ? (
          <TouchableOpacity
            style={[styles.trainButton, isActive && styles.trainButtonActive]}
            onPress={(e) => {
              e.stopPropagation(); // Don't trigger card navigation
              onTrain(skillId);
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isActive ? `Stop ${meta.label}` : `Train ${meta.label}`}
          >
            <Text style={styles.trainButtonText}>
              {isActive ? 'Stop' : 'Train'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedBadgeText}>Phase 2 ›</Text>
          </View>
        )}
      </View>

      {/* XP Bar */}
      <View style={styles.xpBarContainer}>
        <View style={styles.xpBarBg}>
          {isImplemented ? (
            <ProgressBarWithPulse
              progress={progress}
              fillColor={meta.color}
              widthPercent={progress}
            />
          ) : (
            <View
              style={[
                styles.xpBarFill,
                { width: `${Math.max(2, progress)}%`, backgroundColor: Palette.border },
              ]}
            />
          )}
        </View>
        <Text style={styles.xpText}>
          {skill.level >= 99
            ? `${formatNumber(skill.xp)} XP — MAX`
            : `${formatNumber(xpIntoLevel)} / ${formatNumber(xpNeeded)} XP`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Pillar divider ───────────────────────────────────────────────────────────

function PillarHeader({ label, emoji }: { label: string; emoji: string }) {
  return (
    <View style={styles.pillarHeader}>
      <View style={styles.pillarLine} />
      <Text style={styles.pillarLabel}>{emoji}  {label}</Text>
      <View style={styles.pillarLine} />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SkillsScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const activeTask = useAppSelector((s) => s.game.player.activeTask);
  const skills = useAppSelector((s) => s.game.player.skills);
  const activeSkillId = activeTask?.skillId ?? null;

  useFocusEffect(useCallback(() => {
    dispatch(gameActions.clearPulseTab('skills'));
  }, [dispatch]));

  // B. Total level — sum of all skill levels
  const totalLevel = Object.values(skills).reduce((sum, s) => sum + (s?.level ?? 0), 0);

  const handleTrain = useCallback(
    (skillId: SkillId) => {
      if (activeTask?.skillId === skillId) {
        dispatch(gameActions.stopTask());
      } else {
        // Just navigate to the screen to let them start a specific node
        router.push(`/skills/${skillId}` as any);
      }
    },
    [activeTask, dispatch]
  );

  const horizonHudEnabled = useAppSelector(
    (s) => s.game.player.settings?.horizonHudEnabled ?? true
  );

  const handleNavigate = useCallback(
    (skillId: SkillId) => {
      router.push(`/skills/${skillId}` as any);
    },
    []
  );

  // Calculate active skill progress for the header
  const activeSkill = activeTask ? skills[activeTask.skillId as SkillId] : null;
  const activeMeta = activeTask ? SKILL_META[activeTask.skillId as SkillId] : null;

  const currentLevelXP = activeSkill ? xpForLevel(activeSkill.level) : 0;
  const nextLevelXP = activeSkill ? xpForLevel(activeSkill.level + 1) : 0;
  const xpIntoLevel = activeSkill ? Math.max(0, Math.floor(activeSkill.xp - currentLevelXP)) : 0;
  const xpNeeded = activeSkill ? Math.max(1, nextLevelXP - currentLevelXP) : 0;
  const progress = activeSkill ? progressPercent(activeSkill.xp, activeSkill.level) : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Skills</Text>
            <Text style={styles.totalLevel}>Total Lv. {totalLevel}</Text>
          </View>
          {activeTask ? (
            <View style={styles.activeSkillBadge}>
              <Text style={styles.activeSkillEmoji}>{activeMeta?.emoji}</Text>
              <Text style={styles.activeSkillText}>{activeMeta?.label} Lv. {activeSkill?.level}</Text>
            </View>
          ) : (
            <View style={styles.idleBadge}>
              <View style={styles.idleDot} />
              <Text style={styles.idleText}>Idle</Text>
            </View>
          )}
        </View>

        {/* Global XP Bar in Header */}
        <View style={styles.headerXpSection}>
          <View style={styles.headerXpBarBg}>
            {activeMeta ? (
              <ProgressBarWithPulse
                progress={progress}
                fillColor={activeMeta.color}
                widthPercent={progress}
              />
            ) : (
              <View
                style={[
                  styles.headerXpBarFill,
                  { width: `${Math.max(2, progress)}%`, backgroundColor: Palette.border },
                ]}
              />
            )}
          </View>
          <Text style={styles.headerXpText}>
            {activeTask && activeSkill
              ? activeSkill.level >= 99
                ? `${formatNumber(activeSkill.xp)} XP — MAX`
                : `${formatNumber(xpIntoLevel)} / ${formatNumber(xpNeeded)} XP`
              : 'Awaiting action...'}
          </Text>
        </View>
        {horizonHudEnabled && <HorizonHUD />}
      </View>

      {/* A. Skill list — grouped by pillar */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SKILL_PILLARS.map((pillar) => (
          <View key={pillar.label}>
            <PillarHeader label={pillar.label} emoji={pillar.emoji} />
            {pillar.skills.map((skillId) => (
              <SkillCard
                key={skillId}
                skillId={skillId}
                isActive={activeSkillId === skillId}
                onTrain={handleTrain}
                onNavigate={handleNavigate}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Palette.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Palette.textPrimary,
  },
  totalLevel: {
    fontSize: FontSize.sm,
    color: Palette.gold,
    fontWeight: '600',
    marginTop: 2,
  },
  activeSkillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgApp,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 6,
  },
  activeSkillEmoji: {
    fontSize: 14,
  },
  activeSkillText: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  idleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgApp,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 6,
  },
  idleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.textDisabled,
  },
  idleText: {
    color: Palette.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  headerXpSection: {
    gap: 4,
  },
  headerXpBarBg: {
    height: 6,
    backgroundColor: Palette.bgApp,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  headerXpBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  headerXpText: {
    fontSize: 10,
    color: Palette.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },

  // A. Pillar divider
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  pillarLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.border,
  },
  pillarLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Palette.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  // Skill Card
  skillCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.xs,
  },
  skillCardActive: {
    borderColor: Palette.accentPrimary,
    backgroundColor: Palette.bgCardHover,
  },
  // C. Locked style
  skillCardLocked: {
    opacity: 0.55,
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
  lockedEmoji: {
    opacity: 0.5,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  lockedText: {
    color: Palette.textSecondary,
  },
  skillLevel: {
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  trainButton: {
    backgroundColor: Palette.accentPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  trainButtonActive: {
    backgroundColor: Palette.red,
  },
  trainButtonText: {
    color: Palette.white,
    fontWeight: '700',
    fontSize: 12,
  },
  // C. Locked badge
  lockedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.bgApp,
  },
  lockedBadgeText: {
    fontSize: 11,
    color: Palette.textDisabled,
    fontWeight: '600',
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
