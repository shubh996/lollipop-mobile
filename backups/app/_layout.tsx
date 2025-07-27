import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Appearance, Platform, SafeAreaView, View , Dimensions} from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  useTheme,
  type ParamListBase,
  type TabNavigationState,
} from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
const height = Dimensions.get('window').height;

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
MaterialTopTabNavigationOptions,
typeof Navigator,
TabNavigationState<ParamListBase>,
MaterialTopTabNavigationEventMap
>(Navigator);


const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();
const { colors } = useTheme();
  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <SafeAreaView style={{ flex: 1 }} >
      <MaterialTopTabs
      initialRouteName='stocks'
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: 'capitalize',
          fontWeight: 'bold',
          fontFamily: 'UberMove-Bold',
          
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.text,
        },
        tabBarStyle: {
          height: height * 0.06,
          marginTop:-10,
          
        
         
          

        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 'auto', minWidth: 100 },
      }}
    >
      <MaterialTopTabs.Screen name="stocks" options={{ title: 'stocks' }} />
      <MaterialTopTabs.Screen name="crypto" options={{ title: 'crypto' }} />
      <MaterialTopTabs.Screen name="commodities" options={{ title: 'commodities' }} />
      <MaterialTopTabs.Screen name="forex" options={{ title: 'forex' }} />
      </MaterialTopTabs>
      <PortalHost />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add('bg-background');
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
  }, []);
}

function noop() {}
