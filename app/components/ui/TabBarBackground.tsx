
import { View, StyleSheet, Platform } from 'react-native';

export default function TabBarBackground() {
  if (Platform.OS === 'web' || Platform.OS === 'android') {
    return <View style={StyleSheet.absoluteFill} />;
  }
  return null;
}

export function useBottomTabOverflow() {
  return 0;
}
