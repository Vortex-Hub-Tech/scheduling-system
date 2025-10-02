import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const res = await apiRequest('GET', '/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          await AsyncStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await apiRequest('POST', '/api/auth/login', { email, password });
    if (res.ok) {
      const data = await res.json();
      await AsyncStorage.setItem('authToken', data.token);
      setUser(data.user);
    } else {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    const res = await apiRequest('POST', '/api/auth/register', { name, email, password, phone });
    if (res.ok) {
      const data = await res.json();
      await AsyncStorage.setItem('authToken', data.token);
      setUser(data.user);
    } else {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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