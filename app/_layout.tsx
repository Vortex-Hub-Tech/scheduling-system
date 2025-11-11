import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppConfigProvider } from './contexts/AppConfigContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppConfigProvider>
      <StatusBar style="light" backgroundColor="#2563eb" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="service-details" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="my-bookings" />
        <Stack.Screen name="gallery" />
        <Stack.Screen name="reviews" />
      </Stack>
    </AppConfigProvider>
  );
}