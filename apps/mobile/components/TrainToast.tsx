/**
 * TrainToast — Shows "Mining: Iron Vein" when starting a skill action.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { Palette, Spacing, Radius, FontSize } from '@/constants/theme';
import { getActionDisplayName } from '@/utils/actionDisplayName';

export default function TrainToast() {
  const activeTask = useAppSelector((s) => s.game.player.activeTask);
  const prevTaskRef = useRef<{ skillId?: string; actionId: string } | null>(null);
  const [toast, setToast] = useState<{ skill: string; action: string } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    if (!activeTask) {
      prevTaskRef.current = null;
      return;
    }
    const prev = prevTaskRef.current;
    const isNewStart = !prev || prev.actionId !== activeTask.actionId;
    prevTaskRef.current = { skillId: activeTask.skillId, actionId: activeTask.actionId };

    if (isNewStart && activeTask.skillId) {
      const skillName = activeTask.skillId.charAt(0).toUpperCase() + activeTask.skillId.slice(1);
      const actionName = getActionDisplayName(activeTask.skillId, activeTask.actionId);
      setToast({ skill: skillName, action: actionName });

      opacity.setValue(0);
      translateY.setValue(-40);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 8 }),
      ]).start();

      const t = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -40, duration: 250, useNativeDriver: true }),
        ]).start(() => setToast(null));
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [activeTask?.skillId, activeTask?.actionId, opacity, translateY]);

  if (!toast) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }] },
      ]}
      pointerEvents="none"
    >
      <View style={styles.toast}>
        <Text style={styles.text}>{toast.skill}: {toast.action}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9998,
  },
  toast: {
    backgroundColor: Palette.bgCardHover,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.accentPrimary,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
});