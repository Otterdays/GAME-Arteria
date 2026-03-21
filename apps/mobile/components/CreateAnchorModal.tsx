// [TRACE: DOCU/SCRATCHPAD.md — Anchor Timeline Selection v0.7.0]
/**
 * CreateAnchorModal — Sheet modal for creating a new character (Anchor).
 *
 * Flow:
 *  Step 1 → Enter name (or skip to use "The Anchor")
 *  Step 2 → Pick affinity (Luminar / Voidmire / Balanced)
 *  Confirm → create fresh PlayerState → save → update manifest → navigate to game
 */

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { anchorActions } from '@/store/anchorSlice';
import { gameActions } from '@/store/gameSlice';
import {
    saveAnchorState,
    saveManifest,
    loadManifest,
    type AffinityId,
    type AnchorMeta,
} from '@/store/persistence';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize } from '@/constants/theme';
import { logger } from '@/utils/logger';

// ─── Affinity definitions ─────────────────────────────────────────────────

interface AffinityDef {
    id: AffinityId;
    label: string;
    subtitle: string;
    emoji: string;
    colors: [string, string];
    border: string;
}

const AFFINITIES: AffinityDef[] = [
    {
        id: 'luminar',
        label: 'Luminar',
        subtitle: 'Defensive. Bright magical energy flows from the Celestial Spires.',
        emoji: '✨',
        colors: ['#1a2a4a', '#2a4878'],
        border: '#5b8cff',
    },
    {
        id: 'voidmire',
        label: 'Voidmire',
        subtitle: 'Offensive. Dark cosmic essence seeps from cracks in reality.',
        emoji: '🌑',
        colors: ['#1a0a2e', '#3a0f5a'],
        border: '#9b59b6',
    },
    {
        id: 'balanced',
        label: 'Balanced',
        subtitle: 'Flexible. Walk both paths, in the spirit of Blibbertooth himself.',
        emoji: '⚖️',
        colors: ['#0a2a1a', '#1a4a32'],
        border: '#2ecc71',
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function generateAnchorId(): string {
    return `anchor_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

// ─── Component ────────────────────────────────────────────────────────────

interface Props {
    visible: boolean;
    onDismiss: () => void;
    onCreated: (anchorId: string) => void;
    currentAnchorCount: number;
}

export default function CreateAnchorModal({ visible, onDismiss, onCreated, currentAnchorCount }: Props) {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const manifest = useAppSelector(s => s.anchor.manifest);

    const [step, setStep] = useState<1 | 2>(1);
    const [name, setName] = useState('');
    const [selectedAffinity, setSelectedAffinity] = useState<AffinityId>('balanced');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const styles = makeStyles(palette);

    // Animate in when visible
    React.useEffect(() => {
        if (visible) {
            setStep(1);
            setName('');
            setSelectedAffinity('balanced');
            Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
        } else {
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        }
    }, [visible]);

    function handleCreate() {
        try {
            const anchorId = generateAnchorId();
            const displayName = name.trim() || 'The Anchor';

            // Create a fresh PlayerState with the chosen name
            dispatch(gameActions.newGame(displayName));

            // Build the meta
            const meta: AnchorMeta = {
                id: anchorId,
                name: displayName,
                affinityId: selectedAffinity,
                totalLevel: 1,
                lastSavedAt: Date.now(),
                isPatron: false,
            };

            // Update manifest
            const updatedManifest = {
                activeAnchorId: anchorId,
                anchors: [...(manifest?.anchors ?? []), meta],
                version: 1 as const,
            };
            saveManifest(updatedManifest);
            dispatch(anchorActions.loadManifestAction(updatedManifest));
            dispatch(anchorActions.upsertAnchorMeta(meta));
            dispatch(anchorActions.setActiveAnchorId(anchorId));

            // Save initial anchor state (will be overwritten by auto-save shortly)
            saveAnchorState(anchorId, {});

            logger.info('UI', 'Anchor created', { anchorId, name: displayName });
            onCreated(anchorId);
        } catch (e) {
            logger.error('UI', 'Failed to create anchor', e);
        }
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onDismiss}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />

                <Animated.View style={[styles.sheet, { opacity: fadeAnim }]}>
                    <LinearGradient
                        colors={['#0d0d1a', '#1a1a2e']}
                        style={styles.sheetGradient}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>
                                {step === 1 ? '🌌 New Anchor' : '⚖️ Choose Affinity'}
                            </Text>
                            <Text style={styles.headerSub}>
                                {step === 1
                                    ? 'A new life begins. What do they call you?'
                                    : 'Which cosmic force draws you closer?'}
                            </Text>
                        </View>

                        {/* Step 1 — Name */}
                        {step === 1 && (
                            <View style={styles.stepContent}>
                                <TextInput
                                    style={styles.nameInput}
                                    placeholder="Enter a name (optional)"
                                    placeholderTextColor={palette.textDisabled}
                                    value={name}
                                    onChangeText={setName}
                                    maxLength={24}
                                    autoFocus
                                    selectionColor={palette.accentPrimary}
                                />
                                <Text style={styles.nameSub}>
                                    Leave blank to be known as "The Anchor"
                                </Text>
                                <TouchableOpacity
                                    style={styles.primaryBtn}
                                    onPress={() => setStep(2)}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#5b8cff', '#3d6bea']}
                                        style={styles.primaryBtnGrad}
                                    >
                                        <Text style={styles.primaryBtnText}>Next →</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Step 2 — Affinity */}
                        {step === 2 && (
                            <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
                                {AFFINITIES.map((aff) => {
                                    const isSelected = selectedAffinity === aff.id;
                                    return (
                                        <TouchableOpacity
                                            key={aff.id}
                                            activeOpacity={0.85}
                                            onPress={() => setSelectedAffinity(aff.id)}
                                        >
                                            <LinearGradient
                                                colors={aff.colors}
                                                style={[
                                                    styles.affinityCard,
                                                    { borderColor: isSelected ? aff.border : 'rgba(255,255,255,0.08)' },
                                                ]}
                                            >
                                                <Text style={styles.affinityEmoji}>{aff.emoji}</Text>
                                                <View style={styles.affinityText}>
                                                    <Text style={[styles.affinityLabel, { color: isSelected ? aff.border : palette.textPrimary }]}>
                                                        {aff.label}
                                                    </Text>
                                                    <Text style={styles.affinitySub}>{aff.subtitle}</Text>
                                                </View>
                                                {isSelected && (
                                                    <Text style={[styles.affinityCheck, { color: aff.border }]}>✓</Text>
                                                )}
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    );
                                })}

                                <View style={styles.stepTwoActions}>
                                    <TouchableOpacity
                                        style={styles.backBtn}
                                        onPress={() => setStep(1)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.backBtnText}>← Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.primaryBtn}
                                        onPress={handleCreate}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#2ecc71', '#1a9e56']}
                                            style={styles.primaryBtnGrad}
                                        >
                                            <Text style={styles.primaryBtnText}>Begin Journey ✨</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </LinearGradient>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────

function makeStyles(palette: any) {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.7)',
        },
        sheet: {
            borderTopLeftRadius: Radius.xl,
            borderTopRightRadius: Radius.xl,
            overflow: 'hidden',
            maxHeight: '85%',
        },
        sheetGradient: {
            padding: Spacing.lg,
            paddingBottom: 40,
        },
        header: {
            marginBottom: Spacing.xl,
            alignItems: 'center',
        },
        headerTitle: {
            color: palette.textPrimary,
            fontSize: 22,
            fontWeight: '700',
            letterSpacing: 0.5,
            marginBottom: Spacing.xs,
        },
        headerSub: {
            color: palette.textMuted,
            fontSize: FontSize.sm,
            textAlign: 'center',
        },
        stepContent: {
            flexGrow: 0,
        },
        nameInput: {
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderColor: 'rgba(255,255,255,0.15)',
            borderWidth: 1,
            borderRadius: Radius.md,
            color: palette.textPrimary,
            fontSize: FontSize.lg,
            padding: Spacing.md,
            marginBottom: Spacing.xs,
        },
        nameSub: {
            color: palette.textDisabled,
            fontSize: FontSize.xs,
            marginBottom: Spacing.xl,
            textAlign: 'center',
        },
        primaryBtn: {
            borderRadius: Radius.md,
            overflow: 'hidden',
            marginTop: Spacing.sm,
        },
        primaryBtnGrad: {
            paddingVertical: Spacing.md,
            alignItems: 'center',
        },
        primaryBtnText: {
            color: '#ffffff',
            fontWeight: '700',
            fontSize: FontSize.md,
        },
        affinityCard: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: Radius.md,
            borderWidth: 1.5,
            padding: Spacing.md,
            marginBottom: Spacing.sm,
            gap: Spacing.sm,
        },
        affinityEmoji: {
            fontSize: 28,
        },
        affinityText: {
            flex: 1,
        },
        affinityLabel: {
            fontSize: FontSize.md,
            fontWeight: '700',
            marginBottom: 2,
        },
        affinitySub: {
            color: 'rgba(255,255,255,0.55)',
            fontSize: FontSize.xs,
            lineHeight: 17,
        },
        affinityCheck: {
            fontSize: 20,
            fontWeight: '700',
        },
        stepTwoActions: {
            flexDirection: 'row',
            gap: Spacing.sm,
            marginTop: Spacing.md,
        },
        backBtn: {
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: Radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Spacing.md,
        },
        backBtnText: {
            color: palette.textMuted,
            fontWeight: '600',
        },
    });
}
