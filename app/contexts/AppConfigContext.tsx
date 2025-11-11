
import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

type AppMode = 'client' | 'owner';

interface AppConfigContextType {
  mode: AppMode;
  isOwnerMode: boolean;
  isClientMode: boolean;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  // Prioriza a variável de ambiente do build (para builds EAS)
  // Se não houver, usa o estado local para desenvolvimento com Expo Go
  const buildMode = Constants.expoConfig?.extra?.APP_MODE as AppMode | undefined;
  const [devMode, setDevMode] = useState<AppMode>('client');
  
  const mode = buildMode || devMode;

  const toggleMode = () => {
    if (!buildMode) {
      setDevMode(current => current === 'client' ? 'owner' : 'client');
    }
  };

  const setModeManual = (newMode: AppMode) => {
    if (!buildMode) {
      setDevMode(newMode);
    }
  };

  const value = {
    mode,
    isOwnerMode: mode === 'owner',
    isClientMode: mode === 'client',
    toggleMode,
    setMode: setModeManual,
  };

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
}
