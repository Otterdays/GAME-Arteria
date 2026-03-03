import { useEffect } from 'react';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();
import { store } from '@/store';
import { useGameLoop } from '@/hooks/useGameLoop';
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
import { BatterySaver } from '@/components/BatterySaver';
import { QuickSwitchProvider } from '@/contexts/QuickSwitchContext';
import { QuickSwitchSidebar } from '@/components/QuickSwitchSidebar';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Inner app shell — must be inside the Redux Provider
 * so our hooks can access the store.
 */
function AppShell() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
  });

  useGameLoop();
  usePersistence();

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QuickSwitchProvider>
      <BatterySaver>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
        <StatusBar style="light" translucent backgroundColor="transparent" />
      </BatterySaver>
      </QuickSwitchProvider>
    </ThemeProvider>
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
