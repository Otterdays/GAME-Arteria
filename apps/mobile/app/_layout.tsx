import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/store';
import { useGameLoop } from '@/hooks/useGameLoop';
import { usePersistence } from '@/hooks/usePersistence';
import UpdatesModal from '@/components/UpdatesModal';
import WhileYouWereAway from '@/components/WhileYouWereAway';
import LevelUpToast from '@/components/LevelUpToast';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Inner app shell — must be inside the Redux Provider
 * so our hooks can access the store.
 */
function AppShell() {
  const colorScheme = useColorScheme();

  // Wire up the core game systems
  useGameLoop();
  usePersistence();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <UpdatesModal />
      <WhileYouWereAway />
      <LevelUpToast />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
