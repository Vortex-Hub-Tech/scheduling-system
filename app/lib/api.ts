import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getApiUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://localhost:3000';
    }
    
    const manifest = Constants.expoConfig;
    const debuggerHost = manifest?.hostUri;
    
    if (debuggerHost) {
      const ip = debuggerHost.split(':').shift();
      return `http://${ip}:3000`;
    }
    
    return 'http://localhost:3000';
  }
  return process.env.EXPO_PUBLIC_API_URL || 'https://your-production-api.repl.co';
};

export const API_URL = getApiUrl();

export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  body?: any
): Promise<Response> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
}
