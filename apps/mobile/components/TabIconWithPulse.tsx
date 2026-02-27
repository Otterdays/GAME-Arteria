/**
 * TabIconWithPulse (X) — Tab icon pulses gold when level-up or loot until visited.
 */
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';

interface TabIconWithPulseProps {
  name: React.ComponentProps<typeof IconSymbol>['name'];
  size: number;
  color: string;
  pulse: boolean;
}

export function TabIconWithPulse({ name, size, color, pulse }: TabIconWithPulseProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) {
      scale.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 500, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <IconSymbol name={name} size={size} color={pulse ? Palette.gold : color} />
    </Animated.View>
  );
}