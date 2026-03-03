/**
 * ProgressBarWithPulse — QoL O: Subtle glow when fill moves.
 * Animates width changes to avoid jittery jumps when XP updates in discrete chunks.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ANIM_DURATION = 180;

interface ProgressBarWithPulseProps {
  progress: number;
  fillColor: string;
  widthPercent: number;
  style?: object;
}

export function ProgressBarWithPulse({ progress, fillColor, widthPercent, style }: ProgressBarWithPulseProps) {
  const pulseOpacity = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(Math.max(2, widthPercent))).current;
  const prevProgress = useRef(progress);

  useEffect(() => {
    const target = Math.max(2, Math.min(100, widthPercent));
    Animated.timing(widthAnim, {
      toValue: target,
      duration: ANIM_DURATION,
      useNativeDriver: false,
    }).start();
  }, [widthPercent, widthAnim]);

  useEffect(() => {
    if (Math.abs(progress - prevProgress.current) > 0.5) {
      prevProgress.current = progress;
      pulseOpacity.setValue(1);
      Animated.timing(pulseOpacity, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }).start();
    }
  }, [progress, pulseOpacity]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: fillColor, width: widthInterpolated },
        ]}
      >
        <Animated.View
          style={[styles.pulseOverlay, { backgroundColor: '#ffffff', opacity: pulseOpacity }]}
          pointerEvents="none"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  pulseOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
  },
});