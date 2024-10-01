import { StyleSheet } from 'react-native';
import React from 'react';
import MainNavigation from './src/navigation/MainNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainNavigation />
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
