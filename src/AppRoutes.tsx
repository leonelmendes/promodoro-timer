import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';

import { Home } from './pages/Home';
import { Settings } from './pages/Settings';

type TScreenDefinition = {
    Home : undefined;
    Settings: undefined;
}

const Stack = createStackNavigator();

export function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

export type TNavigationScreenProps = NavigationProp<TScreenDefinition>;