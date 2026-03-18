import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';

import { Home } from './pages/Home';
import { AppRoutes } from './AppRoutes';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
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
    <NavigationContainer 
      theme={{
        ...DefaultTheme,
        fonts: {
          ...DefaultTheme.fonts,
          bold: {
            fontFamily: Theme.fonts.interBold,
            fontWeight: '700',
          },
          regular: {
            fontFamily: Theme.fonts.interRegular,
            fontWeight: '500'
          }
        },
        colors: {
          ...DefaultTheme.colors,
          background: Theme.colors.background,
          primary: Theme.colors.primary,
          text: Theme.colors.text,
          card: Theme.colors.divider
        }
      }}>
      <AppRoutes/>
    </NavigationContainer>
  );
}