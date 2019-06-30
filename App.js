import React from 'react';
import { View } from 'react-native';
import Routes from './navigator';

export default function App() {
  const Navigator = Routes()
  return (
    <View style={{ flex: 1 }}>
      <Navigator />
    </View>
  );
}
