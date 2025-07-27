import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {
  Appearance,
  Platform,
  SafeAreaView,
  View,
  Dimensions,
  Text,
} from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // <-- NEW
import { useTheme } from '@react-navigation/native';
import ProfileScreen from './profile';

const height = Dimensions.get('window').height;

// ---- Stack and BottomTabs setup ----
const Stack = createStackNavigator();
const BottomTabs = createBottomTabNavigator();

function NewsScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>News</Text></View>;
}
function SettingsScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Settings</Text></View>;
}

function TabsWrapper() {
  const { colors } = useTheme();
  return (
    <BottomTabs.Navigator
      initialRouteName="News"
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: 'grey',
        headerShown: false,
      }}
    >
      <BottomTabs.Screen name="News" component={NewsScreen} />
      <BottomTabs.Screen name="Profile" component={ProfileScreen} />
      <BottomTabs.Screen name="Settings" component={SettingsScreen} />
    </BottomTabs.Navigator>
  );
}

// ---- Platform-specific effects ----
// No-operation function for default case


const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabsWrapper} />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ presentation: 'modal' }}
          initialParams={{ name: '', avatar: '', theme: isDarkColorScheme ? 'dark' : 'light' }}
        />
      </Stack.Navigator>
      <PortalHost />
    </ThemeProvider>
  );
}
// ---- Util functions ----
const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add('bg-background');
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
  }, []);
}

function noop() {}
