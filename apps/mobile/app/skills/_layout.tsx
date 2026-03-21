import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { CraftingQueueHub } from '@/components/skill/CraftingQueueHub';

export default function SkillsLayout() {
  return (
    <View style={styles.container}>
      <Slot />
      <CraftingQueueHub />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
