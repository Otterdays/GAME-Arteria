/**
 * ProgressBarWithPulse — QoL O: Subtle glow when fill moves.
 * Wraps a progress bar fill and triggers a brief pulse animation on progress change.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ProgressBarWithPulseProps {
  progress: number;
  fillColor: string;
  widthPercent: number;
  style?: object;
}

export function ProgressBarWithPulse({ progress, fillColor, widthPercent, style }: ProgressBarWithPulseProps) {
  const pulseOpacity = useRef(new Animated.Value(0)).current;
  const prevProgress = useRef(progress);

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

  return (
    <View style={[styles.fill, { backgroundColor: fillColor, width: `${Math.max(2, widthPercent)}%` }, style]}>
      <Animated.View
        style={[
          styles.pulseOverlay,
          { backgroundColor: '#ffffff', opacity: pulseOpacity },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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