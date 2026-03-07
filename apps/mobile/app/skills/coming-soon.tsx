import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { BouncyButton } from '@/components/BouncyButton';
import { SKILL_META, SkillId } from '@/constants/skills';

export default function ComingSoonSkill() {
    const { palette } = useTheme();
    const router = useRouter();
    const { skill: skillId } = useLocalSearchParams<{ skill: string }>();
    const meta = SKILL_META[skillId as SkillId] || { label: 'Unknown Skill', emoji: '❓', color: '#ccc' };

    return (
        <View style={[styles.container, { backgroundColor: palette.bgApp }]}>
            <Stack.Screen options={{ title: meta.label, headerTransparent: true, headerTintColor: palette.textPrimary }} />

            <View style={styles.center}>
                <Text style={styles.emoji}>{meta.emoji}</Text>
                <Text style={[styles.title, { color: palette.textPrimary }]}>{meta.label}</Text>
                <View style={[styles.badge, { backgroundColor: meta.color + '20', borderColor: meta.color }]}>
                    <Text style={[styles.badgeText, { color: meta.color }]}>COMING SOON</Text>
                </View>
                <Text style={[styles.description, { color: palette.textSecondary }]}>
                    The artisans of Arteria are still drafting the blueprints for this skill. Check back in a future update!
                </Text>

                <BouncyButton
                    style={[styles.backButton, { backgroundColor: palette.bgCard, borderColor: palette.border }]}
                    onPress={() => router.back()}
                >
                    <Text style={[styles.backText, { color: palette.textPrimary }]}>Go Back</Text>
                </BouncyButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 80, marginBottom: 20 },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
    badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
    badgeText: { fontWeight: 'bold', fontSize: 14 },
    description: { textAlign: 'center', fontSize: 16, lineHeight: 24, marginBottom: 40, paddingHorizontal: 20 },
    backButton: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
    backText: { fontWeight: '600' }
});
