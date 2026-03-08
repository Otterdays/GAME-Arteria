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
import { Spacing, FontSize, Radius, CardStyle, FontCinzel, FontCinzelBold, HeaderShadow, ShadowSubtle } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions, SkillId } from '@/store/gameSlice';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SKILL_META, IMPLEMENTED_SKILLS } from '@/constants/skills';
import { isSkillInProgress } from '@/constants/comingSoon';
import { ComingSoonBadge } from '@/components/ComingSoonBadge';
import { formatNumber } from '@/utils/formatNumber';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { HorizonHUD } from '@/components/HorizonHUD';
import { BouncyButton } from '@/components/BouncyButton';
import { ActivePulseGlow } from '@/components/ActivePulseGlow';
import { ActivityLogModal } from '@/components/ActivityLogModal';
import { MasteryModal } from '@/components/MasteryModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getLoginBonusStatus } from '@/constants/loginBonus';
import { getDisplayName } from '@/constants/character';
import { useFeedbackToast } from '@/hooks/useFeedbackToast';
import { SKILL_PETS } from '@/constants/pets';
import { QuickSwitchToggle } from '@/components/QuickSwitchToggle';
import { FloatingParticles } from '@/components/FloatingParticles';

// ─── Skill metadata (from shared constants) ───────────────────────────────────

// A. Skills grouped by pillar
const PILLARS: { label: string; skills: SkillId[] }[] = [
  { label: 'Combat', skills: ['attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer', 'constitution'] },
  { label: 'Gathering', skills: ['mining', 'logging', 'fishing', 'harvesting', 'scavenging', 'thieving', 'exploration'] },
  { label: 'Artisan', skills: ['smithing', 'forging', 'cooking', 'crafting', 'herblore', 'runecrafting', 'fletching', 'tailoring', 'woodworking', 'alchemy', 'firemaking'] },
  { label: 'Support', skills: ['agility', 'astrology', 'summoning', 'slayer', 'farming', 'construction', 'leadership', 'adventure', 'dungeoneering', 'research'] },
  { label: 'Cosmic', skills: ['sorcery', 'wizardry', 'cleansing', 'barter', 'chaostheory', 'aetherweaving', 'voidwalking', 'celestialbinding', 'chronomancy'] },
];

const ALL_SKILLS: SkillId[] = PILLARS.flatMap(p => p.skills);

/** Skills that navigate to the Combat tab when tapped. */
const COMBAT_SKILLS = new Set<SkillId>(['attack', 'hitpoints', 'strength', 'defence', 'prayer', 'magic', 'ranged']);

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
  onShowComingSoon,
  styles,
}: {
  skillId: SkillId;
  isActive: boolean;
  onNavigate: (id: SkillId) => void;
  onShowComingSoon: (id: SkillId) => void;
  styles: any;
}) {
  const { palette } = useTheme();
  const skill = useAppSelector((s) => s.game.player.skills[skillId]);
  const meta = SKILL_META[skillId];
  const isImplemented = IMPLEMENTED_SKILLS.has(skillId);
  const isCombatSkill = COMBAT_SKILLS.has(skillId);
  const isClickable = isImplemented || isCombatSkill;

  const currentLevel = Math.min(skill.level, 99);
  const progress = useMemo(() => progressPercent(skill.xp, skill.level), [skill.xp, skill.level]);

  // Calculate mastery level as the sum of all mastery upgrade levels
  const masteryLevel = useMemo(() => {
    return Object.values(skill.mastery || {}).reduce((sum, val) => sum + (val || 0), 0);
  }, [skill.mastery]);

  return (
    <BouncyButton
      scaleTo={0.92}
      hapticFeedback={true}
      onPress={() => isClickable ? onNavigate(skillId) : onShowComingSoon(skillId)}
      disabled={false}
      accessibilityRole="button"
      accessibilityLabel={`${meta.label}, level ${currentLevel} of 99. ${!isClickable ? 'Coming soon' : ''}`}
      style={[
        styles.skillBox,
        isActive && styles.skillBoxActive,
        !isClickable && styles.skillBoxLocked,
        { overflow: 'hidden' }
      ]}
    >
      {isActive && <ActivePulseGlow color={meta.color} />}

      {/* Mastery Badge (Top Right) */}
      {isImplemented && masteryLevel > 0 && (
        <View style={styles.masteryBadgeBox}>
          <IconSymbol name="star.fill" size={8} color={palette.gold} />
          <Text style={styles.masteryBadgeText}>{masteryLevel}</Text>
        </View>
      )}

      {/* Action Indicator (Top Left) */}
      {isActive && (
        <View style={styles.actionIndicatorBox}>
          <Text style={styles.actionIndicatorText}>⚡</Text>
        </View>
      )}

      {/* Icon side */}
      <View style={styles.skillBoxLeft}>
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'transparent']}
          style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-45deg' }, { translateX: -20 }, { translateY: -20 }] }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Text style={[styles.skillBoxEmoji, !isClickable && styles.lockedEmoji]}>{meta.emoji}</Text>
      </View>

      {/* Levels side */}
      <View style={styles.skillBoxRight}>
        {(isImplemented || isCombatSkill) ? (
          <>
            <Text style={styles.skillBoxLevelTop}>{currentLevel}</Text>
            <Text style={styles.skillBoxLevelBottom}>99</Text>
          </>
        ) : (
          <View style={styles.comingSoonWrap}>
            <ComingSoonBadge inProgress={isSkillInProgress(skillId)} size="sm" />
          </View>
        )}
      </View>

      {/* Inline Progress Bar (Bottom) */}
      {isImplemented && (
        <View style={styles.inlineProgressBar}>
          <View
            style={[
              styles.inlineProgressFill,
              { width: `${progress}%`, backgroundColor: meta.color, shadowColor: meta.color, shadowOpacity: 0.5, shadowRadius: 3 }
            ]}
          />
        </View>
      )}
    </BouncyButton>
  );
}

function SectionHeader({ title, palette }: { title: string; palette: any }) {
  const accentLookup: Record<string, string> = {
    'Combat': '#e74c3c',
    'Gathering': '#27ae60',
    'Artisan': '#9b59b6',
    'Support': '#3498db',
    'Cosmic': '#f59e0b'
  };
  const accent = accentLookup[title] || palette.accentSecondary;

  return (
    <View style={{
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    }}>
      <Text style={{
        fontFamily: FontCinzelBold,
        fontSize: FontSize.sm,
        color: accent,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        textShadowColor: accent + '55',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
      }}>{title}</Text>
      <LinearGradient
        colors={[accent + '88', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1, height: 1, opacity: 0.3 }}
      />
    </View>
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
  const [masteryModalVisible, setMasteryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
  const activePetId = useAppSelector((s) => s.game.player.pets?.activePetId ?? null);
  const activePet = activePetId ? SKILL_PETS[activePetId] : null;

  const handleNavigate = useCallback(
    (skillId: SkillId) => {
      if (COMBAT_SKILLS.has(skillId)) {
        router.push('/(tabs)/combat' as any);
      } else {
        router.push(`/skills/${skillId}` as any);
      }
    },
    []
  );

  const handleShowComingSoon = useCallback((skillId: SkillId) => {
    router.push({ pathname: '/skills/coming-soon', params: { skill: skillId } } as any);
  }, []);

  // Calculate active skill progress for the header
  const activeSkill = activeTask ? skills[activeTask.skillId as SkillId] : null;
  const activeMeta = activeTask ? SKILL_META[activeTask.skillId as SkillId] : null;

  const currentLevelXP = activeSkill ? xpForLevel(activeSkill.level) : 0;
  const nextLevelXP = activeSkill ? xpForLevel(activeSkill.level + 1) : 0;
  const xpIntoLevel = activeSkill ? Math.max(0, Math.floor(activeSkill.xp - currentLevelXP)) : 0;
  const xpNeeded = activeSkill ? Math.max(1, nextLevelXP - currentLevelXP) : 0;
  const progress = activeSkill ? progressPercent(activeSkill.xp, activeSkill.level) : 0;

  const filteredPillars = useMemo(() => {
    if (!searchQuery) return PILLARS;
    const query = searchQuery.toLowerCase();
    return PILLARS.map(p => ({
      ...p,
      skills: p.skills.filter(s =>
        SKILL_META[s].label.toLowerCase().includes(query) ||
        s.toLowerCase().includes(query)
      )
    })).filter(p => p.skills.length > 0);
  }, [searchQuery]);

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
          ...HeaderShadow,
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
        comingSoonWrap: {
          marginTop: 6,
          alignSelf: 'center',
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
        masteryBadgeBox: {
          position: 'absolute',
          top: 4,
          right: 4,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: Radius.full,
          paddingHorizontal: 4,
          paddingVertical: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          borderWidth: 0.5,
          borderColor: palette.gold,
          zIndex: 10,
        },
        masteryBadgeText: {
          fontSize: 8,
          color: palette.gold,
          fontWeight: '700',
        },
        actionIndicatorBox: {
          position: 'absolute',
          top: 4,
          left: 4,
          backgroundColor: 'rgba(139,92,246,0.3)',
          borderRadius: Radius.full,
          width: 14,
          height: 14,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        },
        actionIndicatorText: {
          fontSize: 8,
        },
        inlineProgressBar: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: palette.bgApp,
        },
        inlineProgressFill: {
          height: '100%',
        },
        searchContainer: {
          paddingHorizontal: Spacing.md,
          paddingBottom: Spacing.sm,
          backgroundColor: palette.bgCard,
          borderBottomWidth: 1,
          borderBottomColor: palette.border,
        },
        searchInput: {
          backgroundColor: palette.bgApp,
          borderRadius: Radius.sm,
          paddingVertical: 6,
          paddingHorizontal: Spacing.md,
          fontSize: FontSize.sm,
          color: palette.textPrimary,
          borderWidth: 1,
          borderColor: palette.border,
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
      <FloatingParticles color={palette.accentWeb} count={15} />
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
              <Text style={{ fontSize: FontSize.xs, color: palette.textMuted, marginTop: 1 }}>
                Welcome, {displayName}{activePet ? ` ${activePet.emoji}` : ''}
              </Text>
              <View style={styles.totalLevelRow}>
                <Text style={styles.totalLevel}>Total Lv. {totalLevel} / {maxTotalLevel}</Text>
                {isPatron && (
                  <View style={styles.patronBadge}>
                    <Text style={styles.patronBadgeText}>PATRON</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' }}>
              <QuickSwitchToggle />

              <TouchableOpacity
                onPress={() => setMasteryModalVisible(true)}
                style={{
                  padding: 8,
                  backgroundColor: palette.bgApp,
                  borderRadius: Radius.full,
                  borderWidth: 1,
                  borderColor: palette.border,
                }}
              >
                <IconSymbol name="star.fill" size={18} color={palette.gold} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setLogModalVisible(true)}
                style={{
                  padding: 8,
                  backgroundColor: palette.bgApp,
                  borderRadius: Radius.full,
                  borderWidth: 1,
                  borderColor: palette.border,
                }}
              >
                <IconSymbol name="list.bullet" size={18} color={palette.textSecondary} />
              </TouchableOpacity>
            </View>
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
      <MasteryModal visible={masteryModalVisible} onClose={() => setMasteryModalVisible(false)} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search skills..."
          placeholderTextColor={palette.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* A. Skill grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredPillars.map((pillar) => (
          <View key={pillar.label}>
            <SectionHeader title={pillar.label} palette={palette} />
            <View style={styles.skillsGrid}>
              {pillar.skills.map((skillId) => (
                <View key={skillId} style={styles.skillBoxContainer}>
                  <SkillBox
                    skillId={skillId}
                    isActive={activeSkillId === skillId}
                    onNavigate={handleNavigate}
                    onShowComingSoon={handleShowComingSoon}
                    styles={styles}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
        {filteredPillars.length === 0 && (
          <View style={{ padding: Spacing.xl, alignItems: 'center' }}>
            <Text style={{ color: palette.textMuted, fontFamily: FontCinzel }}>No scrolls found matching your search...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
