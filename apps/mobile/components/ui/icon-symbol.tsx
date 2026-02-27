// Fallback for using MaterialCommunityIcons on Android and web.
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * SF Symbol to MaterialCommunityIcons mapping.
 * MaterialCommunityIcons is preferred for games as it contains specific RPG icons.
 */
const MAPPING = {
  // Tabs
  'hammer.fill': 'pickaxe',
  'shield.fill': 'sword-cross',
  'archivebox.fill': 'treasure-chest',
  'cart.fill': 'cart',
  'gearshape.fill': 'cog',

  // RPG Specific Backlog
  'sword': 'sword',
  'axe': 'axe',
  'fish': 'fish',
  'flask': 'flask',
  'book': 'book-open-variant',
  'crown': 'crown',
  'scroll': 'script-text',

  // Common
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code-tags',
  'chevron.right': 'chevron-right',
  'lock.fill': 'lock',
  'bag.fill': 'bag-personal',
} as Record<string, ComponentProps<typeof MaterialCommunityIcons>['name']>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and MaterialCommunityIcons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || 'help-circle';
  return <MaterialCommunityIcons color={color} size={size} name={iconName as any} style={style} />;
}
