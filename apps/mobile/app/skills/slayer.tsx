import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { BouncyButton } from '@/components/BouncyButton';
import { useIdleSoundscape } from '@/hooks/useIdleSoundscape';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { SKILL_META } from '@/constants/skills';
import { SLAYER_MONSTERS, SlayerMonster, SLAYER_SHOP_CATALOG, SlayerShopItem } from '@/constants/slayer';
import { getItemMeta } from '@/constants/items';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { XP_TABLE, gameActions } from '@/store/gameSlice';
import { Spacing, FontSize, Radius, FontCinzelBold } from '@/constants/theme';
import { getLevelBadgeStyles, getGlassCardGradientColors } from '@/constants/skillPageStyles';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ActivePulseGlow } from '@/components/ActivePulseGlow';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

/**
 * Slayer Screen (Task-based monster hunting)
 * [TRACE: ROADMAP Phase 4 Groundwork]
 */
export default function SlayerScreen() {
    const { palette } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const player = useAppSelector((s) => s.game.player);
    const skill = player.skills['slayer'];
    const meta = SKILL_META['slayer'];
    const currentTask = player.slayerTask;

    useIdleSoundscape('slayer');

    const onNext = () => router.replace(`/skills/${getNextSkill('slayer')}` as any);
    const onPrev = () => router.replace(`/skills/${getPrevSkill('slayer')}` as any);

    const currentLevelXp = XP_TABLE[skill.level - 1] || 0;
    const nextLevelXp = XP_TABLE[skill.level] || XP_TABLE[98];
    const progressInLevel = skill.xp - currentLevelXp;
    const xpNeededForLevel = nextLevelXp - currentLevelXp;
    const progressPercent = Math.min(100, Math.max(0, (progressInLevel / xpNeededForLevel) * 100));

    const slayerCoins = player.inventory.find(i => i.id === 'slayer_coins')?.quantity || 0;

    const handleBuyItem = (item: SlayerShopItem) => {
        if (slayerCoins < item.cost) {
            dispatch(gameActions.pushFeedbackToast({
                type: 'error',
                title: 'Not enough Coins',
                message: `You need ${item.cost} Slayer Coins.`,
            }));
            return;
        }

        dispatch(gameActions.removeItems([{ id: 'slayer_coins', quantity: item.cost }]));
        dispatch(gameActions.addItems([{ id: item.id, quantity: 1 }]));

        dispatch(gameActions.pushFeedbackToast({
            type: 'lucky',
            title: 'Purchase Successful',
            message: `You bought ${item.name}!`,
        }));
    };

    return (
        <View style={[styles.container, { backgroundColor: palette.bgApp }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header with Navigation */}
            <View style={[styles.header, { backgroundColor: palette.bgCard }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onPrev();
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <View style={[styles.enhancedBadge, { backgroundColor: palette.gold }]}>
                            <Text style={styles.enhancedBadgeText}>Enhanced!</Text>
                        </View>
                        <Text style={styles.emojiText}>{meta.emoji}</Text>
                        <Text style={[styles.titleText, { color: palette.textPrimary }]}>{meta.label}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onNext();
                        }}
                        style={styles.navButton}
                    >
                        <IconSymbol name="chevron.right" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.xpInfo}>
                    <View style={getLevelBadgeStyles(palette, meta.color).levelBadge}>
                        <Text style={[styles.levelText, { color: meta.color }]}>{skill.level}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={styles.xpBarBg}>
                            <ProgressBarWithPulse
                                progress={skill.xp}
                                fillColor={meta.color}
                                widthPercent={progressPercent}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Active Task Section */}
                <View style={styles.activeTaskSection}>
                    <Text style={[styles.sectionTitle, { color: palette.textSecondary }]}>Your Current Bounty</Text>
                    <View style={[styles.taskCard, { backgroundColor: palette.bgCard, borderColor: meta.color }]}>
                        {!currentTask ? (
                            <View style={styles.noTaskWrap}>
                                <Text style={styles.noTaskEmoji}>🎯</Text>
                                <Text style={[styles.noTaskTitle, { color: palette.textPrimary }]}>No Slayer Task</Text>
                                <Text style={[styles.noTaskSubtitle, { color: palette.textSecondary }]}>
                                    Find a Slayer Master in the world to receive a monster bounty.
                                </Text>
                                <BouncyButton
                                    onPress={() => dispatch(gameActions.startDialogue({ treeId: 'dt_slayer_master', startNodeId: 'node_1' }))}
                                >
                                    <Text style={styles.actionButtonText}>Seek Master Mark</Text>
                                </BouncyButton>
                            </View>
                        ) : (
                            <View style={styles.activeTaskWrap}>
                                <View style={styles.taskLabelRow}>
                                    <Text style={[styles.taskMonsterName, { color: palette.textPrimary }]}>
                                        {SLAYER_MONSTERS.find(m => m.id === currentTask.monsterId)?.name || 'Unknown Monster'}
                                    </Text>
                                    <Text style={[styles.taskAmount, { color: meta.color }]}>
                                        {currentTask.currentAmount} / {currentTask.targetAmount}
                                    </Text>
                                </View>
                                <View style={{ height: 12 }}>
                                    <ProgressBarWithPulse
                                        progress={currentTask.currentAmount}
                                        fillColor={meta.color}
                                        widthPercent={(currentTask.currentAmount / currentTask.targetAmount) * 100}
                                    />
                                </View>
                                <Text style={[styles.taskNote, { color: palette.textSecondary }]}>
                                    Kills in combat contribute to your Slayer bounty.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Master's Bestiary Section */}
                <Text style={[styles.sectionTitle, { color: palette.textSecondary }]}>The Slayer's Bestiary</Text>
                {SLAYER_MONSTERS.map((monster: SlayerMonster) => {
                    const isUnlocked = skill.level >= monster.levelReq;
                    return (
                        <View
                            key={monster.id}
                            style={[
                                styles.monsterRow,
                                { backgroundColor: palette.bgCard, borderLeftWidth: 4, borderLeftColor: isUnlocked ? meta.color : palette.border },
                                !isUnlocked && styles.lockedMonster
                            ]}
                        >
                            <View style={styles.monsterMain}>
                                <Text style={[styles.monsterName, { color: isUnlocked ? palette.textPrimary : palette.textSecondary }]}>
                                    {monster.name}
                                </Text>
                                <Text style={[styles.monsterLocations, { color: palette.textSecondary }]}>
                                    {monster.locations.join(', ')}
                                </Text>
                            </View>
                            <View style={styles.monsterStats}>
                                <Text style={[styles.monsterLevelReq, { color: isUnlocked ? meta.color : palette.red }]}>
                                    Lv. {monster.levelReq}
                                </Text>
                                <Text style={[styles.monsterXp, { color: palette.textSecondary }]}>
                                    {monster.slayerXpPerKill} XP
                                </Text>
                            </View>
                        </View>
                    );
                })}

                {/* Slayer Shop Section */}
                <View style={styles.shopSection}>
                    <View style={styles.shopHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: palette.textSecondary, marginBottom: 0 }]}>The Slayer's Shop</Text>
                        <Text style={[styles.coinsBalance, { color: meta.color }]}>🪙 {slayerCoins} Coins</Text>
                    </View>
                    {SLAYER_SHOP_CATALOG.map((item) => {
                        const itemMeta = getItemMeta(item.id);
                        const canAfford = slayerCoins >= item.cost;
                        return (
                            <View key={item.id} style={[styles.shopItemRow, { backgroundColor: palette.bgCard }]}>
                                <View style={styles.shopItemMain}>
                                    <View style={styles.shopItemTitleRow}>
                                        {itemMeta && <Text style={styles.shopItemEmoji}>{itemMeta.emoji}</Text>}
                                        <Text style={[styles.shopItemName, { color: palette.textPrimary }]}>{item.name}</Text>
                                    </View>
                                    <Text style={[styles.shopItemDesc, { color: palette.textSecondary }]}>{item.description}</Text>
                                </View>
                                <BouncyButton
                                    onPress={() => handleBuyItem(item)}
                                    style={[
                                        styles.buyButton,
                                        { backgroundColor: canAfford ? meta.color : palette.border }
                                    ]}
                                >
                                    <Text style={styles.buyButtonText}>{item.cost} 🪙</Text>
                                </BouncyButton>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.footerNote}>
                    <Text style={[styles.footerText, { color: palette.textSecondary }]}>
                        Slayer tasks grant Slayer XP and Slayer Coins upon completion. Exclusive combat instances are locked behind Slayer levels.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    navButton: {
        padding: Spacing.xs,
        opacity: 0.5,
    },
    navArrow: { fontSize: 24, fontWeight: 'bold' },
    titleContainer: { flexDirection: 'row', alignItems: 'center' },
    emojiText: { fontSize: 28, marginRight: 10 },
    titleText: { fontFamily: FontCinzelBold, fontSize: 22, fontWeight: 'bold' },
    enhancedBadge: {
        position: 'absolute',
        top: -10,
        left: 0,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
        zIndex: 10,
        transform: [{ rotate: '-5deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 1,
    },
    enhancedBadgeText: {
        color: '#0f111a',
        fontSize: 8,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    xpInfo: { flexDirection: 'row', alignItems: 'center' },
    levelBadge: {
        backgroundColor: '#000',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginRight: 10,
    },
    levelText: { fontWeight: 'bold', fontSize: 16 },
    progressContainer: { flex: 1 },
    xpBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: Radius.full,
        overflow: 'hidden',
    },
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    activeTaskSection: { marginBottom: 30 },
    taskCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    noTaskWrap: { alignItems: 'center', paddingVertical: 10 },
    noTaskEmoji: { fontSize: 48, marginBottom: 12 },
    noTaskTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    noTaskSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 16, paddingHorizontal: 20 },
    activeTaskWrap: { paddingVertical: 5 },
    taskLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
    taskMonsterName: { fontSize: 20, fontWeight: 'bold' },
    taskAmount: { fontSize: 18, fontWeight: '800' },
    taskNote: { fontSize: 12, marginTop: 12, fontStyle: 'italic', textAlign: 'center' },
    monsterRow: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    monsterMain: { flex: 1 },
    monsterName: { fontSize: 16, fontWeight: 'bold' },
    monsterLocations: { fontSize: 12, marginTop: 2 },
    monsterStats: { alignItems: 'flex-end' },
    monsterLevelReq: { fontSize: 14, fontWeight: '800' },
    monsterXp: { fontSize: 11, fontWeight: '600', marginTop: 2 },
    lockedMonster: { opacity: 0.4 },
    actionButton: {
        height: 48,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    shopSection: { marginTop: 20 },
    shopHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    coinsBalance: { fontSize: 16, fontWeight: 'bold' },
    shopItemRow: { flexDirection: 'row', padding: 16, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
    shopItemMain: { flex: 1, paddingRight: 10 },
    shopItemTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    shopItemEmoji: { fontSize: 18, marginRight: 8 },
    shopItemName: { fontSize: 16, fontWeight: 'bold' },
    shopItemDesc: { fontSize: 12, lineHeight: 16 },
    buyButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    footerNote: { marginTop: 20, padding: 20, opacity: 0.7 },
    footerText: { textAlign: 'center', fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
});
