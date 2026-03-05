/**
 * Skills Screen — Main gameplay screen.
 * QoL improvements:
 *   A. Skills grouped by pillar (Gathering / Combat / Crafting / Support)
 *   B. Total Level badge in the header
 *   C. Locked-card style for unimplemented skills ("Phase 2 ›" tag, no Alert)
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Spacing, FontSize, Radius, CardStyle, FontCinzel, FontCinzelBold } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { router } from 'expo-router';
import { SKILL_META, IMPLEMENTED_SKILLS } from '@/constants/skills';
import { formatNumber } from '@/utils/formatNumber';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { HorizonHUD } from '@/components/HorizonHUD';
import { BouncyButton } from '@/components/BouncyButton';
import { ActivePulseGlow } from '@/components/ActivePulseGlow';
import { ActivityLogModal } from '@/components/ActivityLogModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getLoginBonusStatus } from '@/constants/loginBonus';
import { getDisplayName } from '@/constants/character';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';

// ─── Skill metadata (from shared constants) ───────────────────────────────────

// A. All skills array
const ALL_SKILLS: SkillId[] = [
  'attack', 'hitpoints', 'mining',
  'strength', 'agility', 'smithing', 'forging',
  'defence', 'herblore', 'fishing',
  'scavenging', 'cooking', 'logging',
  'harvesting', 'crafting', 'farming',
  'runecrafting',
];

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

// ─── SkillBox ────────────────────────────────────────────────────────────────

function SkillBox({
  skillId,
  isActive,
  onNavigate,
  styles,
}: {
  skillId: SkillId;
  isActive: boolean;
  onNavigate: (id: SkillId) => void;
  styles: ReturnType<typeof StyleSheet.create>;
}) {
  const skill = useAppSelector((s) => s.game.player.skills[skillId]);
  const meta = SKILL_META[skillId];
  const isImplemented = IMPLEMENTED_SKILLS.has(skillId);

  const currentLevel = Math.min(skill.level, 99);

  return (
    <BouncyButton
      scaleTo={0.92}
      hapticFeedback={isImplemented}
      onPress={() => isImplemented && onNavigate(skillId)}
      disabled={!isImplemented}
      accessibilityRole="button"
      accessibilityLabel={`${meta.label}, level ${currentLevel} of 99. ${!isImplemented ? 'Coming soon' : ''}`}
      style={[
        styles.skillBox,
        isActive && styles.skillBoxActive,
        !isImplemented && styles.skillBoxLocked,
        { overflow: 'hidden' }
      ]}
    >
      {isActive && <ActivePulseGlow color={meta.color} />}

      {/* Icon side */}
      <View style={styles.skillBoxLeft}>
        <Text style={[styles.skillBoxEmoji, !isImplemented && styles.lockedEmoji]}>{meta.emoji}</Text>
      </View>

      {/* Levels side */}
      <View style={styles.skillBoxRight}>
        <Text style={styles.skillBoxLevelTop}>{currentLevel}</Text>
        <Text style={styles.skillBoxLevelBottom}>99</Text>
      </View>
    </BouncyButton>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const NARROW_WIDTH = 360;

export default function SkillsScreen() {
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [logModalVisible, setLogModalVisible] = useState(false);
  const isNarrow = width < NARROW_WIDTH;
  const activeTask = useAppSelector((s) => s.game.player.activeTask);
  const skills = useAppSelector((s) => s.game.player.skills);
  const activeSkillId = activeTask?.skillId ?? null;

  useFocusEffect(useCallback(() => {
    dispatch(gameActions.clearPulseTab('skills'));
  }, [dispatch]));

  // B. Total level — sum of all skill levels
  const totalLevel = Object.values(skills).reduce((sum, s) => sum + Math.min(s?.level ?? 1, 99), 0);
  const maxTotalLevel = ALL_SKILLS.length * 99;

  const horizonHudEnabled = useAppSelector(
    (s) => s.game.player.settings?.horizonHudEnabled ?? true
  );
  const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
  const playerName = useAppSelector((s) => s.game.player.name);
  const displayName = getDisplayName(playerName);

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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: palette.bgApp },
        header: {
          padding: Spacing.md,
          paddingBottom: Spacing.sm,
          backgroundColor: palette.bgCard,
          borderBottomWidth: 1,
          borderBottomColor: palette.border,
        },
        headerTop: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: Spacing.sm,
        },
        headerTitle: {
          fontFamily: FontCinzelBold,
          fontSize: FontSize.lg,
          color: palette.textPrimary,
        },
        totalLevelRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
          marginTop: 1,
        },
        totalLevel: {
          fontSize: FontSize.xs,
          color: palette.gold,
          fontWeight: '600',
        },
        patronBadge: {
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: Radius.sm,
          backgroundColor: 'rgba(255,202,40,0.2)',
          borderWidth: 1,
          borderColor: palette.gold,
        },
        patronBadgeText: {
          fontSize: 10,
          fontWeight: '700',
          color: palette.gold,
          letterSpacing: 0.5,
        },
        activeSkillBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: palette.bgApp,
          paddingHorizontal: Spacing.sm,
          paddingVertical: 4,
          borderRadius: Radius.full,
          borderWidth: 1,
          borderColor: palette.border,
          gap: 4,
        },
        activeSkillEmoji: { fontSize: 12 },
        activeSkillText: {
          color: palette.white,
          fontSize: 11,
          fontWeight: 'bold',
        },
        idleBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: palette.bgApp,
          paddingHorizontal: Spacing.sm,
          paddingVertical: 4,
          borderRadius: Radius.full,
          borderWidth: 1,
          borderColor: palette.border,
          gap: 4,
        },
        idleDot: {
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: palette.textDisabled,
        },
        idleText: {
          color: palette.textSecondary,
          fontSize: 11,
          fontWeight: '600',
        },
        headerXpSection: { gap: 2 },
        headerXpBarBg: {
          height: 5,
          backgroundColor: palette.bgApp,
          borderRadius: Radius.full,
          overflow: 'hidden',
        },
        headerXpBarFill: {
          height: '100%',
          borderRadius: Radius.full,
        },
        headerXpText: {
          fontSize: 9,
          color: palette.textSecondary,
          textAlign: 'center',
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        scrollView: { flex: 1 },
        scrollContent: { paddingBottom: Spacing.xl },
        skillsGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: Spacing.xs,
          paddingTop: Spacing.sm,
        },
        skillBoxContainer: {
          width: isNarrow ? '50%' : '33.33%',
          padding: 6,
        },
        skillBox: {
          width: '100%',
          aspectRatio: 2.1,
          backgroundColor: palette.bgCard,
          ...CardStyle,
          borderColor: palette.border,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.sm,
        },
        skillBoxActive: {
          borderColor: palette.accentWeb,
          backgroundColor: palette.bgCardHover,
          shadowColor: palette.accentWeb,
          shadowOpacity: 0.25,
        },
        skillBoxLocked: { opacity: 0.5 },
        skillBoxLeft: {
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
        },
        skillBoxRight: {
          flex: 1.5,
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 2,
        },
        skillBoxEmoji: { fontSize: 24 },
        lockedEmoji: { opacity: 0.4 },
        skillBoxLevelTop: {
          fontSize: FontSize.lg,
          fontWeight: '800',
          color: palette.gold,
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 1,
        },
        skillBoxLevelBottom: {
          fontSize: FontSize.xs,
          fontWeight: '700',
          color: '#B08D57',
          marginTop: -4,
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 1,
        },
        horizonToggle: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          paddingVertical: 4,
          paddingHorizontal: Spacing.sm,
          marginTop: Spacing.xs,
          alignSelf: 'center',
          backgroundColor: palette.bgApp,
          borderRadius: Radius.full,
          borderWidth: 1,
          borderColor: palette.border,
        },
        horizonToggleText: {
          fontSize: FontSize.xs,
          color: palette.textSecondary,
          fontWeight: '600',
        },
      }),
    [palette, isNarrow]
  );

  const loginBonus = useAppSelector((s) => s.game.player.loginBonus ?? { lastClaimDate: null, consecutiveDays: 0 });
  const { showFeedbackToast } = useFeedbackToast();
  const loginStatus = useMemo(
    () => getLoginBonusStatus(loginBonus.lastClaimDate, loginBonus.consecutiveDays),
    [loginBonus.lastClaimDate, loginBonus.consecutiveDays]
  );

  const loginBonusRewardText = useMemo(() => {
    const { gold, lumina } = loginStatus.reward;
    return lumina ? `${gold.toLocaleString()} gp + ${lumina} Lumina` : `${gold.toLocaleString()} gp`;
  }, [loginStatus.reward]);

  const handleClaimLoginBonus = useCallback(() => {
    const { gold, lumina } = loginStatus.reward;
    dispatch(gameActions.claimLoginBonus({
      gold,
      lumina,
      day: loginStatus.day,
    }));
    showFeedbackToast({
      type: 'lucky',
      title: `Day ${loginStatus.day} Login Bonus!`,
      message: lumina ? `+${gold.toLocaleString()} gp + ${lumina} Lumina` : `+${gold.toLocaleString()} gp`,
    });
  }, [dispatch, loginStatus, showFeedbackToast]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {loginStatus.canClaim && (
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#3d2a6e',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(139,92,246,0.3)',
          }}
          onPress={handleClaimLoginBonus}
        >
          <Text style={{ color: '#e0d4f7', fontWeight: '700', fontSize: FontSize.sm }}>
            🎁 Day {loginStatus.day} — Claim {loginBonusRewardText}!
          </Text>
          <BouncyButton
            style={{
              backgroundColor: palette.gold,
              paddingHorizontal: Spacing.md,
              paddingVertical: 6,
              borderRadius: Radius.sm,
            }}
            onPress={handleClaimLoginBonus}
          >
            <Text style={{ color: '#1a1a1a', fontWeight: '800', fontSize: FontSize.sm }}>Claim</Text>
          </BouncyButton>
        </Pressable>
      )}
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <View>
              <Text style={styles.headerTitle}>Skills</Text>
              <Text style={{ fontSize: FontSize.xs, color: palette.textMuted, marginTop: 1 }}>Welcome, {displayName}</Text>
              <View style={styles.totalLevelRow}>
                <Text style={styles.totalLevel}>Total Lv. {totalLevel} / {maxTotalLevel}</Text>
                {isPatron && (
                  <View style={styles.patronBadge}>
                    <Text style={styles.patronBadgeText}>PATRON</Text>
                  </View>
                )}
              </View>
            </View>
            <Pressable
              onPress={() => setLogModalVisible(true)}
              style={{ padding: Spacing.xs }}
              accessibilityLabel="Open activity log"
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 18 }}>📜</Text>
            </Pressable>
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
                  { width: `${Math.max(2, progress)}%`, backgroundColor: palette.border },
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
        <TouchableOpacity
          style={styles.horizonToggle}
          onPress={() => dispatch(gameActions.setHorizonHudEnabled(!horizonHudEnabled))}
          accessibilityLabel={horizonHudEnabled ? 'Hide goal cards' : 'Show goal cards'}
          accessibilityRole="button"
        >
          <IconSymbol
            name={horizonHudEnabled ? 'chevron.down' : 'chevron.up'}
            size={14}
            color={palette.textSecondary}
          />
          <Text style={styles.horizonToggleText}>
            {horizonHudEnabled ? 'Hide goals' : 'Show goals'}
          </Text>
        </TouchableOpacity>
      </View>

      <ActivityLogModal visible={logModalVisible} onClose={() => setLogModalVisible(false)} />

      {/* A. Skill grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.skillsGrid}>
          {ALL_SKILLS.map((skillId) => (
            <View key={skillId} style={styles.skillBoxContainer}>
              <SkillBox
                skillId={skillId}
                isActive={activeSkillId === skillId}
                onNavigate={handleNavigate}
                styles={styles}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
