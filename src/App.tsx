import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';

import { Home } from './pages/Home';
import { AppRoutes } from './AppRoutes';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Theme } from './shared/themes/theme';

SplashScreen.preventAutoHideAsync();

export function App() {

  const [loaded, error] = useFonts({
    InterRegular: 'Inter_400Regular',
    InterBold: 'Inter_700Bold',
  });

  useEffect(() => {
    if(loaded || error){
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: Theme.colors.background}}>
        <StatusBar style='light'/>
        <AppRoutes/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}