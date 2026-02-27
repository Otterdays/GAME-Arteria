/**
 * Patch Notes — Full changelog from v0.1.0 to present.
 * [TRACE: DOCU/CHANGELOG.md]
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Spacing, FontSize, Radius } from '@/constants/theme';
import { PATCH_HISTORY } from '@/constants/patchHistory';

export default function PatchesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: 'Patch Notes',
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Patch Notes</Text>
        <Text style={styles.subtitle}>Arteria — from the beginning</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PATCH_HISTORY.map((patch) => (
          <View key={patch.version} style={styles.patchCard}>
            <View style={styles.patchHeader}>
              <Text style={styles.version}>v{patch.version}</Text>
              <Text style={styles.date}>{patch.date}</Text>
            </View>

            {patch.added && patch.added.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Added</Text>
                {patch.added.map((item, i) => (
                  <Text key={i} style={styles.bullet}>• {item}</Text>
                ))}
              </View>
            )}

            {patch.changed && patch.changed.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: Palette.gold }]}>Changed</Text>
                {patch.changed.map((item, i) => (
                  <Text key={i} style={styles.bullet}>• {item}</Text>
                ))}
              </View>
            )}

            {patch.fixed && patch.fixed.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: Palette.green }]}>Fixed</Text>
                {patch.fixed.map((item, i) => (
                  <Text key={i} style={styles.bullet}>• {item}</Text>
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={styles.footer}>Thanks for playing the Alpha!</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    backgroundColor: Palette.bgCard,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.md,
  },
  backText: {
    fontSize: FontSize.md,
    color: Palette.accentPrimary,
    fontWeight: '600',
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    color: Palette.textPrimary,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  patchCard: {
    backgroundColor: Palette.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  patchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  version: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Palette.accentPrimary,
  },
  date: {
    fontSize: FontSize.xs,
    color: Palette.textMuted,
  },
  section: {
    marginTop: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  bullet: {
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    lineHeight: 20,
    marginLeft: Spacing.sm,
    marginBottom: 2,
  },
  footer: {
    fontSize: FontSize.sm,
    color: Palette.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: Spacing.lg,
  },
});
