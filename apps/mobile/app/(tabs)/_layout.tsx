import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabIconWithPulse } from '@/components/TabIconWithPulse';
import { useTheme } from '@/contexts/ThemeContext';
import { INVENTORY_SLOT_CAP_F2P, INVENTORY_SLOT_CAP_PATRON } from '@/constants/game';
import { useAppSelector } from '@/store/hooks';


export default function TabLayout() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const inventoryCount = useAppSelector((s) => s.game.player.inventory.length);
  const isPatron = useAppSelector((s) => s.game.player.settings?.isPatron ?? false);
  const slotCap = isPatron ? INVENTORY_SLOT_CAP_PATRON : INVENTORY_SLOT_CAP_F2P;
  const isInventoryFull = inventoryCount >= slotCap;
  const pulseTab = useAppSelector((s) => s.game.pulseTab);

  // Add bottom inset so the tab bar clears the Android gesture nav bar
  const tabBarHeight = 56 + insets.bottom;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: palette.accentPrimary,
          tabBarInactiveTintColor: palette.textDisabled,
          tabBarStyle: {
            backgroundColor: palette.bgCard,
            borderTopColor: palette.border,
            borderTopWidth: 1,
            height: tabBarHeight,
            paddingBottom: insets.bottom + 6,
            paddingTop: 8,
            elevation: 8,
          },
          headerStyle: {
            backgroundColor: palette.bgApp,
          },
          headerTintColor: palette.textPrimary,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol name="house.fill" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="skills"
          options={{
            title: 'Skills',
            tabBarIcon: ({ color }) => (
              <TabIconWithPulse name="hammer.fill" size={26} color={color} pulse={pulseTab === 'skills'} />
            ),
          }}
        />
        <Tabs.Screen
          name="resonance"
          options={{
            title: 'Resonance',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="waveform.circle.fill" color={color} />
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
            tabBarBadge: isInventoryFull ? '!' : undefined,
            tabBarIcon: ({ color }) => (
              <TabIconWithPulse name="archivebox.fill" size={26} color={color} pulse={pulseTab === 'bank'} />
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
          name="quests"
          options={{
            title: 'Quests',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="book.pages.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="map.fill" color={color} />
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
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="chart.bar.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
