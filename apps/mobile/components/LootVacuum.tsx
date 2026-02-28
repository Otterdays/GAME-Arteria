/**
 * LootVacuum (S) — Icon flies from action area toward Bank tab when gaining items.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { getItemMeta } from '@/constants/items';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ICON_SIZE = 40;
const HALF = ICON_SIZE / 2;
// Start: center of screen (icon center at SCREEN_WIDTH/2, SCREEN_HEIGHT/2)
const START_X = SCREEN_WIDTH / 2 - HALF;
const START_Y = SCREEN_HEIGHT / 2 - HALF;
// End: center of Bank tab (3rd of 5 tabs ≈ 50% width, bottom area)
const END_X = SCREEN_WIDTH * 0.5 - HALF;
const END_Y = SCREEN_HEIGHT - 72;
const FLY_DURATION = 1200;

function FlyingIcon({
  id,
  itemId,
  onComplete,
}: {
  id: string;
  itemId: string;
  onComplete: () => void;
}) {
  const meta = getItemMeta(itemId);
  const posX = useRef(new Animated.Value(START_X)).current;
  const posY = useRef(new Animated.Value(START_Y)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(posX, {
        toValue: END_X,
        duration: FLY_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(posY, {
        toValue: END_Y,
        duration: FLY_DURATION,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(FLY_DURATION - 200),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scale, {
        toValue: 0.6,
        duration: FLY_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => onCompleteRef.current());
  }, [id, itemId]);

  return (
    <Animated.View
      style={[
        styles.iconWrap,
        {
          transform: [
            { translateX: posX },
            { translateY: posY },
            { scale },
          ],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.emoji}>{meta.emoji}</Text>
    </Animated.View>
  );
}

export default function LootVacuum() {
  const dispatch = useAppDispatch();
  const queue = useAppSelector((s) => s.game.lootVacuumQueue);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {queue.map((e) => (
        <FlyingIcon
          key={e.id}
          id={e.id}
          itemId={e.itemId}
          onComplete={() => dispatch(gameActions.popLootVacuum(e.id))}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9997,
  },
  emoji: {
    fontSize: 28,
  },
});