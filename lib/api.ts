import Constants from 'expo-constants';

const getApiUrl = () => {
  if (__DEV__) {
    const { manifest } = Constants;
    if (manifest?.debuggerHost) {
      const ip = manifest.debuggerHost.split(':').shift();
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
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
}
