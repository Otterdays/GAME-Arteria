import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, Radius, FontCinzelBold, ShadowSubtle } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { BouncyButton } from '@/components/BouncyButton';
import { getDisplayName } from '@/constants/character';
import { useAppSelector } from '@/store/hooks';

interface PanelButtonProps {
    title: string;
    subtext: string;
    icon: IconSymbolName;
    route: string;
    colSpan?: 1 | 2;
    colors: [string, string];
    iconColor: string;
}

export default function HubScreen() {
    const { palette } = useTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const playerName = useAppSelector(s => s.game.player.name) || '';
    const name = getDisplayName(playerName);

    const PADDING = Spacing.md;
    const GAP = Spacing.md;
    const itemsPerRow = 2;
    // Calculate a good square size for the 2-column grid
    const buttonSize = (width - PADDING * 2 - GAP * (itemsPerRow - 1)) / itemsPerRow;

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    backgroundColor: palette.bgApp,
                },
                header: {
                    padding: Spacing.xl,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: palette.bgCard,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.border,
                    ...ShadowSubtle,
                },
                headerTitle: {
                    fontFamily: FontCinzelBold,
                    fontSize: 28,
                    color: palette.gold,
                    letterSpacing: 2,
                    textShadowColor: 'rgba(212, 175, 55, 0.4)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 8,
                },
                headerSubText: {
                    color: palette.textSecondary,
                    fontSize: FontSize.md,
                    marginTop: 4,
                },
                content: {
                    padding: PADDING,
                    paddingBottom: Spacing.xl * 3,
                },
                grid: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: GAP,
                },
                buttonCard: {
                    borderRadius: Radius.xl,
                    overflow: 'hidden',
                    backgroundColor: palette.bgCard,
                    ...ShadowSubtle,
                },
                buttonInner: {
                    flex: 1,
                    padding: Spacing.lg,
                    justifyContent: 'space-between',
                },
                iconContainer: {
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: Spacing.sm,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                title: {
                    fontFamily: FontCinzelBold,
                    fontSize: FontSize.xl,
                    color: '#fff',
                    marginBottom: 4,
                    textShadowColor: 'rgba(0, 0, 0, 0.6)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                },
                subtext: {
                    fontSize: FontSize.sm,
                    color: 'rgba(255, 255, 255, 0.8)',
                },
                ambientBg: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.15,
                }
            }),
        [palette]
    );

    const handlePress = (route: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(route as any);
    };

    const buttons: PanelButtonProps[] = [
        {
            title: 'The Skills',
            subtext: 'Train, gather, & master',
            icon: 'hammer.fill',
            route: '/(tabs)/skills',
            colSpan: 2,
            colors: ['#4f46e5', '#3b82f6'],
            iconColor: '#93c5fd',
        },
        {
            title: 'Resonance',
            subtext: 'Pulse the orb, haste the world',
            icon: 'waveform.circle.fill',
            route: '/(tabs)/resonance',
            colors: ['#7c3aed', '#a78bfa'],
            iconColor: '#c4b5fd',
        },
        {
            title: 'Combat',
            subtext: 'Brave the wilderness',
            icon: 'shield.fill',
            route: '/(tabs)/combat',
            colors: ['#b91c1c', '#ef4444'],
            iconColor: '#fca5a5',
        },
        {
            title: 'Bank',
            subtext: 'Manage wealth',
            icon: 'archivebox.fill',
            route: '/(tabs)/bank',
            colors: ['#ca8a04', '#eab308'],
            iconColor: '#fef08a',
        },
        {
            title: 'Shop',
            subtext: 'Trade resources',
            icon: 'cart.fill',
            route: '/(tabs)/shop',
            colors: ['#047857', '#10b981'],
            iconColor: '#6ee7b7',
        },
        {
            title: 'Explore',
            subtext: 'Venture outwards',
            icon: 'map.fill',
            route: '/(tabs)/explore',
            colors: ['#0f766e', '#14b8a6'],
            iconColor: '#5eead4',
        },
        {
            title: 'Quests',
            subtext: 'Follow the lore',
            icon: 'book.pages.fill',
            route: '/(tabs)/quests',
            colors: ['#6d28d9', '#8b5cf6'],
            iconColor: '#c4b5fd',
        },
        {
            title: 'Stats',
            subtext: 'Track progress',
            icon: 'chart.bar.fill',
            route: '/(tabs)/stats',
            colors: ['#be185d', '#ec4899'],
            iconColor: '#f9a8d4',
        },
        {
            title: 'Settings',
            subtext: 'Tweak & adjust',
            icon: 'gearshape.fill',
            route: '/(tabs)/settings',
            colors: ['#334155', '#64748b'],
            iconColor: '#cbd5e1',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + Spacing.xl }]}>
                <Text style={styles.headerTitle}>Arteria</Text>
                <Text style={styles.headerSubText}>Welcome back, {name}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {buttons.map((btn, i) => {
                        const isFullWidth = btn.colSpan === 2;
                        return (
                            <BouncyButton
                                key={btn.title}
                                scaleTo={0.96}
                                onPress={() => handlePress(btn.route)}
                                style={[
                                    styles.buttonCard,
                                    {
                                        width: isFullWidth ? '100%' : buttonSize,
                                        height: isFullWidth ? 140 : buttonSize * 1.05,
                                    }
                                ]}
                            >
                                <LinearGradient
                                    colors={btn.colors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                />
                                {/** Hex pattern or magic overlay would go here. We use generic circle background as stand-in */}
                                <View style={styles.ambientBg}>
                                    <View style={{ position: 'absolute', bottom: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', opacity: 0.2 }} />
                                    <View style={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', opacity: 0.1 }} />
                                </View>

                                <View style={[styles.buttonInner, isFullWidth && { flexDirection: 'row', alignItems: 'center' }]}>
                                    <View>
                                        <View style={[styles.iconContainer, isFullWidth && { marginBottom: 0, marginRight: Spacing.lg }]}>
                                            <IconSymbol name={btn.icon} size={28} color={btn.iconColor} />
                                        </View>
                                    </View>
                                    <View style={[isFullWidth && { flex: 1, justifyContent: 'center' }]}>
                                        <Text style={styles.title}>{btn.title}</Text>
                                        <Text style={styles.subtext}>{btn.subtext}</Text>
                                    </View>
                                    {isFullWidth && (
                                        <View style={{ padding: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20 }}>
                                            <IconSymbol name="chevron.right" size={24} color="#fff" />
                                        </View>
                                    )}
                                </View>
                            </BouncyButton>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
