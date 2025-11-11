
import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

type AppMode = 'client' | 'owner';

interface AppConfigContextType {
  mode: AppMode;
  isOwnerMode: boolean;
  isClientMode: boolean;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  // Em desenvolvimento, pode mudar manualmente aqui para testar
  // Em produção, virá da variável de ambiente do build
  const mode: AppMode = (Constants.expoConfig?.extra?.APP_MODE || 
                         Platform.select({ web: 'client', default: 'client' })) as AppMode;

  const value = {
    mode,
    isOwnerMode: mode === 'owner',
    isClientMode: mode === 'client',
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
