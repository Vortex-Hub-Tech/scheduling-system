import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

import { HapticTab } from '@/app/components/HapticTab';
import { IconSymbol } from '@/app/components/ui/IconSymbol';
import TabBarBackground from '@/app/components/ui/TabBarBackground';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { useAppConfig } from '@/app/contexts/AppConfigContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isOwnerMode } = useAppConfig();

  if (isOwnerMode) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>💼</Text>,
        }}
      />
    </Tabs>
  );
}