import { useEffect, useState } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import 'react-native-reanimated';

import { paletteToNavigationTheme } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();
import { store } from '@/store';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useSfx } from '@/utils/sounds';
import { usePersistence } from '@/hooks/usePersistence';
import UpdateBoard from '@/components/UpdateBoard';
import WhileYouWereAway from '@/components/WhileYouWereAway';
import LevelUpToast from '@/components/LevelUpToast';
import TrainToast from '@/components/TrainToast';
import FeedbackToast from '@/components/FeedbackToast';
import LootVacuum from '@/components/LootVacuum';
import { GlobalActionTicker } from '@/components/GlobalActionTicker';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DialogueOverlay } from '@/components/DialogueOverlay';
import GoblinPeekModal from '@/components/GoblinPeekModal';
import NameEntryModal from '@/components/NameEntryModal';
import { BatterySaver } from '@/components/BatterySaver';
import { QuickSwitchProvider } from '@/contexts/QuickSwitchContext';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import { QuickSwitchSidebar } from '@/components/QuickSwitchSidebar';
import { SpecialMessageModal, SpecialMessage } from '@/components/SpecialMessageModal';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Wraps nav with ThemeProvider using our palette. Must be inside AppThemeProvider.
 */
function NavThemeWrapper({ children }: { children: React.ReactNode }) {
  const { palette } = useTheme();
  const navTheme = paletteToNavigationTheme(palette);
  return <ThemeProvider value={navTheme}>{children}</ThemeProvider>;
}

/** StatusBar style from palette (light text on dark bg, dark text on light bg). */
function StatusBarFromTheme() {
  const { palette } = useTheme();
  const navTheme = paletteToNavigationTheme(palette);
  return (
    <StatusBar
      style={navTheme.dark ? 'light' : 'dark'}
      translucent
      backgroundColor="transparent"
    />
  );
}

/**
 * Inner app shell — must be inside the Redux Provider
 * so our hooks can access the store.
 */
function AppShell() {
  const [fontsLoaded, fontError] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
  });

  const { playForSkill } = useSfx();
  useGameLoop({ onTickComplete: playForSkill });
  usePersistence();

  const [announcement, setAnnouncement] = useState<SpecialMessage | null>(null);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <AppThemeProvider>
      <NavThemeWrapper>
        <QuickSwitchProvider>
          <BatterySaver>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="location/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="patches" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <UpdateBoard />
            <WhileYouWereAway />
            <LevelUpToast />
            <TrainToast />
            <FeedbackToast />
            <LootVacuum />
            <GlobalActionTicker />
            <QuickSwitchSidebar />
            <DialogueOverlay />
            <GoblinPeekModal />
            <NameEntryModal />
            <SpecialMessageModal message={announcement} onDismiss={() => setAnnouncement(null)} />
            <StatusBarFromTheme />
          </BatterySaver>
        </QuickSwitchProvider>
      </NavThemeWrapper>
    </AppThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
    </Provider>
  );
}
