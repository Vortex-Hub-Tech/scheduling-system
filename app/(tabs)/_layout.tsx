
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useAppConfig } from '../contexts/AppConfigContext';

export default function TabLayout() {
  const { isOwnerMode } = useAppConfig();

  if (isOwnerMode) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📊</span>,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Gerenciar',
            tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>⚙️</span>,
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🏠</span>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>✂️</span>,
        }}
      />
    </Tabs>
  );
}
