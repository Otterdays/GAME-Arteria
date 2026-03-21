// [TRACE: DOCU/SCRATCHPAD.md — Anchor Timeline Selection v0.7.0]
/**
 * character-select.tsx — "The Docking Station"
 *
 * The first screen the player sees. Each "Anchor" is a separate character life.
 * Supports up to 3 anchors on F2P, 6 for Patron.
 *
 * On entry: no activeAnchorId in manifest, or explicit "Switch Anchor".
 * On select: loads that anchor's PlayerState → navigates to /(tabs)/.
 * On "+": opens CreateAnchorModal.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Alert,
    Pressable,
    SafeAreaView,
    Dimensions,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { anchorActions } from '@/store/anchorSlice';
import { gameActions } from '@/store/gameSlice';
import {
    loadAnchorState,
    deleteAnchorState,
    saveManifest,
    type AnchorMeta,
} from '@/store/persistence';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, FontCinzelBold, ShadowElevated, ShadowDeep } from '@/constants/theme';
import CreateAnchorModal from '@/components/CreateAnchorModal';
import type { PlayerState } from '@/store/gameSlice';

const { width: SCREEN_W } = Dimensions.get('window');

// Max slots per account type
const MAX_ANCHORS_FREE    = 3;
const MAX_ANCHORS_PATRON  = 6;

// Map affinity → visual accent color
const AFFINITY_COLOR: Record<string, [string, string, string]> = {
    luminar:   ['#0f2060', '#1a3d9e', '#5b8cff'],
    voidmire:  ['#1a0a2e', '#3d1060', '#9b59b6'],
    balanced:  ['#0a2a1a', '#1a5835', '#2ecc71'],
};

// ── Helpers ──────────────────────────────────────────────────

function formatLastPlayed(ts: number): string {
    if (!ts) return 'Never';
    const diff = Date.now() - ts;
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(diff / 86_400_000);
    if (mins < 2)    return 'Just now';
    if (mins < 60)   return `${mins}m ago`;
    if (hours < 24)  return `${hours}h ago`;
    if (days < 30)   return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
}

// ── Sub-components ────────────────────────────────────────────

function StarField() {
    // Static starfield using Animated values for subtle twinkle
    const stars = useRef(
        Array.from({ length: 60 }, (_, i) => ({
            x: Math.random() * SCREEN_W,
            y: Math.random() * 900,
            size: Math.random() * 2.5 + 0.5,
            opacity: new Animated.Value(Math.random() * 0.6 + 0.2),
            delay: i * 120,
        }))
    ).current;

    useEffect(() => {
        stars.forEach((s) => {
            const loop = () => {
                Animated.sequence([
                    Animated.timing(s.opacity, {
                        toValue: Math.random() * 0.5 + 0.1,
                        duration: Math.random() * 2000 + 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(s.opacity, {
                        toValue: Math.random() * 0.8 + 0.3,
                        duration: Math.random() * 2000 + 1500,
                        useNativeDriver: true,
                    }),
                ]).start(() => loop());
            };
            setTimeout(loop, s.delay);
        });
    }, []);

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {stars.map((s, i) => (
                <Animated.View
                    key={i}
                    style={{
                        position: 'absolute',
                        left: s.x,
                        top: s.y,
                        width: s.size,
                        height: s.size,
                        borderRadius: s.size / 2,
                        backgroundColor: '#ffffff',
                        opacity: s.opacity,
                    }}
                />
            ))}
        </View>
    );
}

interface AnchorCardProps {
    meta: AnchorMeta;
    onPress: () => void;
    onDelete: () => void;
    index: number;
}

function AnchorCard({ meta, onPress, onDelete, index }: AnchorCardProps) {
    const [bg, mid, accent] = AFFINITY_COLOR[meta.affinityId] ?? AFFINITY_COLOR.balanced;
    const slideAnim = useRef(new Animated.Value(60)).current;
    const fadeAnim  = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 380,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 380,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
                marginBottom: Spacing.sm,
            }}
        >
            <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
                <LinearGradient
                    colors={[bg, mid] as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.anchorCard, { borderColor: accent + '55' }]}
                >
                    {/* Affinity aura glow bar */}
                    <View style={[styles.auraBand, { backgroundColor: accent }]} />

                    <View style={styles.cardBody}>
                        {/* Left: name + stats */}
                        <View style={styles.cardLeft}>
                            <Text style={styles.cardName} numberOfLines={1}>
                                {meta.name}
                            </Text>
                            <View style={styles.cardMeta}>
                                <Text style={[styles.cardAffinity, { color: accent }]}>
                                    {affinityEmoji(meta.affinityId)} {capitalize(meta.affinityId)}
                                </Text>
                                <Text style={styles.cardDot}>·</Text>
                                <Text style={styles.cardStat}>
                                    ⚡ Lv {meta.totalLevel}
                                </Text>
                                {meta.isPatron && (
                                    <>
                                        <Text style={styles.cardDot}>·</Text>
                                        <Text style={styles.cardPatron}>✦ Patron</Text>
                                    </>
                                )}
                            </View>
                            <Text style={styles.cardTime}>
                                Last played {formatLastPlayed(meta.lastSavedAt)}
                            </Text>
                        </View>

                        {/* Right: play button */}
                        <View style={styles.cardRight}>
                            <View style={[styles.playBtn, { borderColor: accent }]}>
                                <Text style={[styles.playBtnText, { color: accent }]}>▶</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {/* Delete button (subtle, bottom-right) */}
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={onDelete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

function EmptySlotCard({ onPress }: { onPress: () => void }) {
    const pulseAnim = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const loop = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.6, duration: 900, useNativeDriver: true }),
            ]).start(() => loop());
        };
        loop();
    }, []);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
            <Animated.View style={[styles.emptySlot, { opacity: pulseAnim }]}>
                <Text style={styles.emptySlotPlus}>+</Text>
                <Text style={styles.emptySlotText}>New Anchor</Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

// ── Screen ─────────────────────────────────────────────────────

export default function CharacterSelectScreen() {
    const { palette } = useTheme();
    const dispatch    = useAppDispatch();
    const router      = useRouter();
    const manifest    = useAppSelector(s => s.anchor.manifest);
    const [showCreate, setShowCreate] = useState(false);
    const titleFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(titleFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, []);

    const anchors = manifest?.anchors ?? [];
    // Check patron status from any loaded anchor (or default false)
    const hasPatron    = anchors.some(a => a.isPatron);
    const maxSlots     = hasPatron ? MAX_ANCHORS_PATRON : MAX_ANCHORS_FREE;
    const canAddMore   = anchors.length < maxSlots;

    function handleSelectAnchor(meta: AnchorMeta) {
        const saved = loadAnchorState<PlayerState>(meta.id);
        if (!saved) {
            // Anchor data missing — start fresh with the name
            dispatch(gameActions.newGame(meta.name));
        } else {
            dispatch(gameActions.loadPlayer(saved));
        }
        dispatch(anchorActions.setActiveAnchorId(meta.id));
        // Persist the active selection
        if (manifest) {
            const updated = { ...manifest, activeAnchorId: meta.id };
            saveManifest(updated);
            dispatch(anchorActions.loadManifestAction(updated));
        }
        router.replace('/(tabs)/');
    }

    function handleDeleteAnchor(meta: AnchorMeta) {
        Alert.alert(
            `Delete "${meta.name}"?`,
            'This will permanently delete all of this Anchor\'s progress. There is no undo.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteAnchorState(meta.id);
                        dispatch(anchorActions.removeAnchorMeta(meta.id));
                        // Persist updated manifest
                        if (manifest) {
                            const updated = {
                                ...manifest,
                                anchors: manifest.anchors.filter(a => a.id !== meta.id),
                                activeAnchorId: manifest.activeAnchorId === meta.id
                                    ? null
                                    : manifest.activeAnchorId,
                            };
                            saveManifest(updated);
                            dispatch(anchorActions.loadManifestAction(updated));
                        }
                    },
                },
            ]
        );
    }

    function handleAnchorCreated(anchorId: string) {
        setShowCreate(false);
        router.replace('/(tabs)/');
    }

    return (
        <SafeAreaView style={styles.root}>
            {/* Deep space bg */}
            <LinearGradient
                colors={['#020408', '#060d16', '#080b1a']}
                style={StyleSheet.absoluteFillObject}
            />
            <StarField />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Animated.View style={[styles.titleBlock, { opacity: titleFade }]}>
                    <Text style={styles.titlePretag}>✦ ARTERIA ✦</Text>
                    <Text style={styles.title}>The Docking Station</Text>
                    <Text style={styles.titleSub}>
                        Select an Anchor to enter their timeline, or begin a new life.
                    </Text>
                </Animated.View>

                {/* Anchor list */}
                <View style={styles.listBlock}>
                    {anchors.map((meta, i) => (
                        <AnchorCard
                            key={meta.id}
                            meta={meta}
                            index={i}
                            onPress={() => handleSelectAnchor(meta)}
                            onDelete={() => handleDeleteAnchor(meta)}
                        />
                    ))}

                    {/* Empty/add slots */}
                    {canAddMore && (
                        <EmptySlotCard onPress={() => setShowCreate(true)} />
                    )}

                    {!canAddMore && (
                        <View style={styles.slotCapBanner}>
                            <Text style={styles.slotCapText}>
                                {hasPatron
                                    ? '✦ All 6 Anchor slots filled.'
                                    : '🔒 Max 3 Anchors on F2P. Upgrade to Patron for 6 slots.'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Lore footer */}
                <Text style={styles.loreQuote}>
                    "Every Anchor is a weight against the Unraveling. The cosmos keeps count."
                    {'\n'}— Blibbertooth, probably
                </Text>
            </ScrollView>

            <CreateAnchorModal
                visible={showCreate}
                onDismiss={() => setShowCreate(false)}
                onCreated={handleAnchorCreated}
                currentAnchorCount={anchors.length}
            />
        </SafeAreaView>
    );
}

// ── Helpers ───────────────────────────────────────────────────

function affinityEmoji(id: string): string {
    if (id === 'luminar')  return '✨';
    if (id === 'voidmire') return '🌑';
    return '⚖️';
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#020408',
    },
    scroll: {
        padding: Spacing.md,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 80,
    },
    titleBlock: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    titlePretag: {
        color: '#f59e0b',
        fontSize: FontSize.xs,
        letterSpacing: 3,
        fontFamily: FontCinzelBold,
        marginBottom: Spacing.xs,
    },
    title: {
        color: '#e8e9ed',
        fontSize: FontSize['2xl'],
        fontFamily: FontCinzelBold,
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: Spacing.xs,
        // Subtle text shadow for depth
        textShadowColor: 'rgba(91, 140, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
    titleSub: {
        color: 'rgba(200,205,220,0.55)',
        fontSize: FontSize.sm,
        textAlign: 'center',
        lineHeight: 19,
    },
    listBlock: {
        marginBottom: Spacing.xl,
    },
    anchorCard: {
        borderRadius: Radius.lg,
        borderWidth: 1,
        overflow: 'hidden',
        ...ShadowDeep,
    },
    auraBand: {
        height: 3,
        width: '100%',
        opacity: 0.85,
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    cardLeft: {
        flex: 1,
    },
    cardName: {
        color: '#e8e9ed',
        fontSize: FontSize.lg,
        fontFamily: FontCinzelBold,
        marginBottom: 4,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    cardAffinity: {
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
    cardDot: {
        color: 'rgba(200,205,220,0.35)',
        fontSize: FontSize.sm,
    },
    cardStat: {
        color: 'rgba(200,205,220,0.65)',
        fontSize: FontSize.sm,
    },
    cardPatron: {
        color: '#f59e0b',
        fontSize: FontSize.sm,
        fontWeight: '700',
    },
    cardTime: {
        color: 'rgba(200,205,220,0.4)',
        fontSize: FontSize.xs,
    },
    cardRight: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    playBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    playBtnText: {
        fontSize: 18,
    },
    deleteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
    },
    deleteBtnText: {
        color: 'rgba(200,80,80,0.6)',
        fontSize: 11,
        fontWeight: '700',
    },
    emptySlot: {
        borderRadius: Radius.lg,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: 'rgba(91,140,255,0.35)',
        padding: Spacing.lg,
        alignItems: 'center',
        backgroundColor: 'rgba(91,140,255,0.04)',
        marginBottom: Spacing.sm,
    },
    emptySlotPlus: {
        color: '#5b8cff',
        fontSize: 30,
        fontWeight: '300',
        lineHeight: 36,
    },
    emptySlotText: {
        color: 'rgba(91,140,255,0.7)',
        fontSize: FontSize.sm,
        marginTop: 4,
    },
    slotCapBanner: {
        padding: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: Radius.md,
        alignItems: 'center',
    },
    slotCapText: {
        color: 'rgba(200,205,220,0.45)',
        fontSize: FontSize.sm,
        textAlign: 'center',
    },
    loreQuote: {
        color: 'rgba(200,205,220,0.28)',
        fontSize: FontSize.xs,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 18,
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.xl,
    },
});
