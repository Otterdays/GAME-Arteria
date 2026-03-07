import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { BouncyButton } from '@/components/BouncyButton';
import { useIdleSoundscape } from '@/hooks/useIdleSoundscape';
import { getNextSkill, getPrevSkill } from '@/constants/skillNavigation';
import { SKILL_META } from '@/constants/skills';
import { SUMMONING_POUCHES, SummoningPouch } from '@/constants/summoning';
import { ProgressBarWithPulse } from '@/components/ProgressBarWithPulse';
import { XP_TABLE, gameActions } from '@/store/gameSlice';
import { SHOP_CATALOG, getItemMeta } from '@/constants/items';

/**
 * Summoning Screen (Familiar Binding)
 * [TRACE: ROADMAP Phase 5 Groundwork]
 */
export default function SummoningScreen() {
    const { palette } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const player = useAppSelector((s) => s.game.player);
    const skill = player.skills['summoning'];
    const meta = SKILL_META['summoning'];

    useIdleSoundscape('summoning');

    const onNext = () => router.replace(`/skills/${getNextSkill('summoning')}`);
    const onPrev = () => router.replace(`/skills/${getPrevSkill('summoning')}`);

    const currentLevelXp = XP_TABLE[skill.level - 1] || 0;
    const nextLevelXp = XP_TABLE[skill.level] || XP_TABLE[98];
    const progressInLevel = skill.xp - currentLevelXp;
    const xpNeededForLevel = nextLevelXp - currentLevelXp;
    const progressPercent = Math.min(100, Math.max(0, (progressInLevel / xpNeededForLevel) * 100));

    return (
        <View style={[styles.container, { backgroundColor: palette.bgApp }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header with Navigation */}
            <View style={[styles.header, { backgroundColor: palette.bgCard }]}>
                <View style={styles.headerTop}>
                    <BouncyButton onPress={onPrev} style={styles.navButton}>
                        <Text style={[styles.navArrow, { color: palette.textSecondary }]}>←</Text>
                    </BouncyButton>

                    <View style={styles.titleContainer}>
                        <Text style={styles.emojiText}>{meta.emoji}</Text>
                        <Text style={[styles.titleText, { color: palette.textPrimary }]}>{meta.label}</Text>
                    </View>

                    <BouncyButton onPress={onNext} style={styles.navButton}>
                        <Text style={[styles.navArrow, { color: palette.textSecondary }]}>→</Text>
                    </BouncyButton>
                </View>

                <View style={styles.xpInfo}>
                    <View style={[styles.levelBadge, { borderColor: meta.color }]}>
                        <Text style={[styles.levelText, { color: meta.color }]}>{skill.level}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={{ height: 6 }}>
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
                {/* Active Familiar Banner */}
                {player.activeFamiliar && (
                    <View style={[styles.activeFamiliarBanner, { backgroundColor: palette.bgCard, borderColor: meta.color }]}>
                        <View style={styles.bannerLeft}>
                            <View style={[styles.bannerIconWrap, { backgroundColor: palette.bgApp, borderColor: meta.color }]}>
                                <Text style={styles.bannerEmoji}>{getItemMeta(player.activeFamiliar.pouchId).emoji}</Text>
                            </View>
                            <View>
                                <Text style={[styles.bannerTitle, { color: palette.textPrimary }]}>Active Spirit: {getItemMeta(player.activeFamiliar.pouchId).label}</Text>
                                <Text style={[styles.bannerDesc, { color: palette.textSecondary }]}>{SUMMONING_POUCHES.find(p => p.id === player.activeFamiliar?.pouchId)?.buff.description}</Text>
                            </View>
                        </View>
                        <BouncyButton
                            style={[styles.dismissButton, { borderColor: palette.red }]}
                            onPress={() => dispatch(gameActions.dismissFamiliar())}
                        >
                            <Text style={[styles.dismissText, { color: palette.red }]}>Dismiss</Text>
                        </BouncyButton>
                    </View>
                )}

                <Text style={[styles.sectionTitle, { color: palette.textSecondary }]}>Familiar Spirit Binding</Text>

                {SUMMONING_POUCHES.map((pouch: SummoningPouch) => {
                    const isUnlocked = skill.level >= pouch.levelReq;
                    const inventoryItem = player.inventory.find(item => item.id === pouch.id);
                    const inventoryCount = inventoryItem?.quantity ?? 0;
                    const isEquipped = player.activeFamiliar?.pouchId === pouch.id;
                    const hasIngredients = pouch.ingredients.every(ing =>
                        (player.inventory.find(item => item.id === ing.id)?.quantity ?? 0) >= ing.quantity
                    );

                    return (
                        <View
                            key={pouch.id}
                            style={[
                                styles.pouchCard,
                                { backgroundColor: palette.bgCard, borderColor: isUnlocked ? (isEquipped ? palette.accentPrimary : meta.color) : palette.border },
                                !isUnlocked && styles.lockedCard
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <View style={[styles.pouchIconWrap, { backgroundColor: palette.bgApp, borderColor: meta.color }]}>
                                    <Text style={styles.pouchEmoji}>{pouch.emoji}</Text>
                                </View>
                                <View style={styles.cardTitleWrap}>
                                    <Text style={[styles.pouchName, { color: isUnlocked ? palette.textPrimary : palette.textSecondary }]}>
                                        {pouch.name}
                                    </Text>
                                    <Text style={[styles.pouchReq, { color: isUnlocked ? meta.color : palette.red }]}>
                                        Lv. {pouch.levelReq} Summoning · <Text style={{ color: palette.textSecondary }}>Buff: {pouch.buff.description}</Text>
                                    </Text>
                                </View>
                                {isUnlocked && inventoryCount > 0 && (
                                    <BouncyButton
                                        style={[
                                            styles.equipButton,
                                            { backgroundColor: isEquipped ? palette.red + '20' : meta.color + '20', borderColor: isEquipped ? palette.red : meta.color }
                                        ]}
                                        onPress={() => isEquipped ? dispatch(gameActions.dismissFamiliar()) : dispatch(gameActions.summonFamiliar({ pouchId: pouch.id }))}
                                    >
                                        <Text style={[styles.equipButtonText, { color: isEquipped ? palette.red : meta.color }]}>
                                            {isEquipped ? 'Dismiss' : 'Summon'}
                                        </Text>
                                    </BouncyButton>
                                )}
                            </View>

                            <View style={styles.ingredientsRow}>
                                {pouch.ingredients.map((ing: any) => {
                                    const playerQty = player.inventory.find(item => item.id === ing.id)?.quantity ?? 0;
                                    const isMet = playerQty >= ing.quantity;
                                    return (
                                        <View key={ing.id} style={[styles.ingredientItem, { backgroundColor: palette.bgApp, opacity: isMet ? 1 : 0.6 }]}>
                                            <Text style={[styles.ingQty, { color: isMet ? palette.green : palette.red }]}>
                                                {playerQty}/{ing.quantity}
                                            </Text>
                                            <Text style={[styles.ingId, { color: palette.textSecondary }]}>{ing.id.replace(/_/g, ' ')}</Text>
                                        </View>
                                    );
                                })}
                            </View>

                            <View style={styles.actionRow}>
                                <BouncyButton
                                    disabled={!isUnlocked || !hasIngredients}
                                    style={[
                                        styles.bindButton,
                                        { backgroundColor: isUnlocked && hasIngredients ? meta.color : palette.border, flex: 1 }
                                    ]}
                                    onPress={() => dispatch(gameActions.bindSummoningPouch({ pouchId: pouch.id }))}
                                >
                                    <View style={styles.bindButtonContent}>
                                        <Text style={styles.bindButtonText}>Bind Pouch</Text>
                                        <Text style={styles.bindButtonXp}>+{pouch.xpPerPouch} XP</Text>
                                    </View>
                                </BouncyButton>
                                {inventoryCount > 0 && (
                                    <View style={[styles.ownedBadge, { backgroundColor: palette.bgApp }]}>
                                        <Text style={[styles.ownedText, { color: palette.textSecondary }]}>Owned: {inventoryCount}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}

                {/* Supplies Shop Section */}
                <Text style={[styles.sectionTitle, { color: palette.textSecondary, marginTop: 10 }]}>Supplies Shop</Text>
                <View style={[styles.shopCard, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>
                    {SHOP_CATALOG.filter(i => ['spirit_pouch', 'spirit_shard'].includes(i.id)).map(item => {
                        const meta = getItemMeta(item.id);
                        return (
                            <View key={item.id} style={styles.shopRow}>
                                <View style={styles.shopItemMeta}>
                                    <Text style={styles.shopItemEmoji}>{meta.emoji}</Text>
                                    <View>
                                        <Text style={[styles.shopItemName, { color: palette.textPrimary }]}>{meta.label}</Text>
                                        <Text style={[styles.shopItemPrice, { color: palette.textSecondary }]}>{item.buyPrice} Gold / unit</Text>
                                    </View>
                                </View>
                                <BouncyButton
                                    disabled={player.gold < item.buyPrice}
                                    style={[styles.buySmallButton, { backgroundColor: player.gold >= item.buyPrice ? palette.accentPrimary : palette.border }]}
                                    onPress={() => dispatch(gameActions.buyItem({ id: item.id, quantity: 1, totalCost: item.buyPrice }))}
                                >
                                    <Text style={styles.buySmallText}>Buy 1</Text>
                                </BouncyButton>
                            </View>
                        );
                    })}
                    <Text style={[styles.goldStatus, { color: palette.textSecondary }]}>
                        You have: <Text style={{ color: palette.accentPrimary }}>{player.gold} Gold</Text>
                    </Text>
                </View>

                <View style={styles.footerInfo}>
                    <Text style={[styles.footerText, { color: palette.textSecondary }]}>
                        Familiars provide passive synergies and combat assistance. Collect Charms from combat and Shards from the Summoning Shop to bind spirits.
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
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    navArrow: { fontSize: 24, fontWeight: 'bold' },
    titleContainer: { flexDirection: 'row', alignItems: 'center' },
    emojiText: { fontSize: 28, marginRight: 10 },
    titleText: { fontSize: 22, fontWeight: 'bold', letterSpacing: 0.5 },
    // Active Familiar Banner Styles
    activeFamiliarBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 2,
    },
    bannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bannerIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginRight: 12,
    },
    bannerEmoji: { fontSize: 24 },
    bannerTitle: { fontSize: 15, fontWeight: 'bold' },
    bannerDesc: { fontSize: 12, marginTop: 2 },
    dismissButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    dismissText: { fontSize: 12, fontWeight: 'bold' },
    // Equip Button
    equipButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 15,
        borderWidth: 1,
    },
    equipButtonText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
    // Owned Badge
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    ownedBadge: {
        paddingHorizontal: 12,
        height: 48,
        borderRadius: 15,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    ownedText: { fontSize: 11, fontWeight: 'bold' },
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
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    pouchCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
    },
    pouchIconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    pouchEmoji: { fontSize: 32 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    cardTitleWrap: { flex: 1 },
    pouchName: { fontSize: 18, fontWeight: 'bold' },
    pouchReq: { fontSize: 12, fontWeight: '800', marginTop: 3 },
    ingredientsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    ingredientItem: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        minWidth: 90,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    ingQty: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    ingId: { fontSize: 10, textTransform: 'capitalize' },
    lockedCard: { opacity: 0.5 },
    bindButton: {
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bindButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    bindButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    bindButtonXp: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
    footerInfo: { marginTop: 10, padding: 20, alignItems: 'center' },
    footerText: { textAlign: 'center', fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
    shopCard: { borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1 },
    shopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    shopItemMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    shopItemEmoji: { fontSize: 24, backgroundColor: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 10 },
    shopItemName: { fontSize: 14, fontWeight: 'bold' },
    shopItemPrice: { fontSize: 11, marginTop: 2 },
    buySmallButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
    buySmallText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    goldStatus: { textAlign: 'center', fontSize: 12, marginTop: 5, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 },
});
