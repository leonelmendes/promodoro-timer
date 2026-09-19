import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer, NavigationProp } from '@react-navigation/native';

import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { Theme } from './shared/themes/theme';

type TScreenDefinition = {
    Home : undefined;
    Settings: undefined;
}

const Stack = createStackNavigator();

export function AppRoutes() {
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
    <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
    </NavigationContainer>
    
  );
}

export type TNavigationScreenProps = NavigationProp<TScreenDefinition>;