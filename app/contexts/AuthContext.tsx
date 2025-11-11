
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../lib/api';

const storage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('Storage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('Storage setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn('Storage removeItem error:', error);
    }
  }
};

interface AuthContextType {
  isOwner: boolean;
  loading: boolean;
  loginAsOwner: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOwnerStatus();
  }, []);

  const checkOwnerStatus = async () => {
    try {
      const ownerToken = await storage.getItem('ownerToken');
      if (ownerToken) {
        const res = await apiRequest('GET', '/api/admin/status');
        if (res.ok) {
          const data = await res.json();
          setIsOwner(data.isAdmin);
        } else {
          await storage.removeItem('ownerToken');
          setIsOwner(false);
        }
      }
    } catch (error) {
      console.error('Owner check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginAsOwner = async (username: string, password: string) => {
    const res = await apiRequest('POST', '/api/admin/login', { username, password });
    if (res.ok) {
      await storage.setItem('ownerToken', 'true');
      setIsOwner(true);
    } else {
      const error = await res.json();
      throw new Error(error.message || 'Login falhou');
    }
  };

  const logout = async () => {
    const res = await apiRequest('POST', '/api/admin/logout');
    await storage.removeItem('ownerToken');
    setIsOwner(false);
  };

  return (
    <AuthContext.Provider value={{ isOwner, loading, loginAsOwner, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
