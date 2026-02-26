import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Palette.accentPrimary,
        tabBarInactiveTintColor: isDark ? Palette.textDisabled : '#687076',
        tabBarStyle: {
          backgroundColor: isDark ? Palette.bgCard : '#ffffff',
          borderTopColor: isDark ? Palette.border : '#e0e0e0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        headerStyle: {
          backgroundColor: isDark ? Palette.bgApp : '#f5f6fa',
        },
        headerTintColor: isDark ? Palette.textPrimary : '#11181C',
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Skills',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="hammer.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="combat"
        options={{
          title: 'Combat',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="shield.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bank"
        options={{
          title: 'Bank',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="archivebox.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="cart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="gearshape.fill" color={color} />
          ),
        }}
      />
      {/* Hide the old explore tab */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
