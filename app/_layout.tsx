// Profile stack for user and profile screens
function ProfileStack() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Stack.Navigator initialRouteName="User" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="User" component={UserScreen} initialParams={{ filterType: '', filterName: '' }} />
      <Stack.Screen name="TipListScreen" component={TipListScreen} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} initialParams={{ name: '', avatar: '', theme: isDarkColorScheme ? 'dark' : 'light' }} />

      <Stack.Screen name="TipCard" component={TipCard} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} initialParams={{ name: '', avatar: '', theme: isDarkColorScheme ? 'dark' : 'light' }} />
    </Stack.Navigator>
  );
}
import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
// Import your SVG icons from the assets folder
import MarketIcon from '../assets/icons/markets.svg';
import SearchIcon from '../assets/icons/search.svg';
import ProfileIcon from '../assets/icons/face.svg';
import AddIcon from '../assets/icons/add.svg';
import SettingIcon from '../assets/icons/settings.svg';
import BellIcon from '../assets/icons/bell.svg';

import {
  Appearance,
  
  SafeAreaView,
  View,
  Dimensions,
  Platform

} from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';

import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import {
  useTheme,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import ProfileScreen from './profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import StockScreen from './stocks';
import SettingScreen from './settings';
import SearchScreen from './search';
import NotificationScreen from './NotificationScreen';
import { Text } from 'react-native';
import FilteredTipsScreen from './filteredTips';
import Advisors from './analysts';
import Analysts from './analysts';
import PostTipScreen from './post';
import PostDetails from './postDetails';
import TipCard from './TipCard';
import { User } from 'lucide-react-native';
import UserScreen from './user';
import SearchSuggestionsScreen from './SearchSuggestions';
import TipListScreen from './TipListScreen';

const height = Dimensions.get('window').height;

// ---- Stack and TopTabs setup ----

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};




function ModalIndicator() {
  const { colors } = useTheme();
  if (Platform.OS !== 'ios') return null;
  return (
    <View style={{position: 'absolute', top: 12, left: 0, right: 0, alignItems: 'center', zIndex: 999 }}>
      <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, opacity: 0.6 }} />
    </View>
  );
}




// Home stack for home and filtered tips modal
function HomeStack() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Stack.Navigator initialRouteName="SearchScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchScreen" component={SearchScreen} initialParams={{ userId: "" }} />
      <Stack.Screen name="TipCard" component={TipCard} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} />
      <Stack.Screen name="SearchSuggestionsScreen" component={SearchSuggestionsScreen} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} initialParams={{ search: '' }} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} />
      <Stack.Screen name="User" component={UserScreen} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} initialParams={{ filterType: '', filterName: '' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} initialParams={{ name: '', avatar: '', theme: isDarkColorScheme ? 'dark' : 'light' }} />
      <Stack.Screen name="TipListScreen" component={TipListScreen} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} />
    </Stack.Navigator>
  );
}

// Search stack for search suggestions and tip card
function SearchStack() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Stack.Navigator initialRouteName="SearchSuggestionsScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchSuggestionsScreen" component={SearchSuggestionsScreen} initialParams={{ search: '' }} />
      <Stack.Screen name="TipCard" component={TipCard} options={Platform.OS === 'ios' ? { presentation: 'modal' } : {}} />
    </Stack.Navigator>
  );
}


// ---- Platform-specific effects ----
const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <Tab.Navigator
        screenOptions={({ route, navigation }) => {
          // Get the current route state to check if a modal is active
          const state = navigation.getState();
          const currentRoute = state.routes[state.index];
          const routeName = getFocusedRouteNameFromRoute(currentRoute);
          
          // Modal screens that should hide the tab bar
          const modalScreens = ['TipCard',   'Profile', 'TipListScreen'];
          const isModalActive = modalScreens.includes(routeName || '');

          return {
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => {
              const activeColor = isDarkColorScheme ? '#FFF' : '#000';
              const inactiveColor = isDarkColorScheme ? '#888' : '#777';
              const iconColor = focused ? activeColor : inactiveColor;
              if (route.name === 'Home') {
                return <MarketIcon width={size} height={size} fill={iconColor} />;
              } else if (route.name === 'Search') {
                return <SearchIcon width={size} height={size} fill={iconColor} />;
              } else if (route.name === 'Bell') {
                return <BellIcon width={size} height={size} fill={iconColor} />;
              } else if (route.name === 'Settings') {
                return <ProfileIcon width={size} height={size} fill={iconColor} />;
              }
              return null;
            },
            tabBarLabel: ({ color, focused }) => {
              const activeColor = isDarkColorScheme ? '#FFF' : '#000';
              const inactiveColor = isDarkColorScheme ? '#888' : '#777';
              const labelColor = focused ? activeColor : inactiveColor;
              return <Text style={{ fontSize: 11, color: labelColor, fontFamily: 'UberMove-Medium', marginBottom: 2 }}>{route.name}</Text>;
            },
            tabBarActiveTintColor: isDarkColorScheme ? '#FFF' : '#000',
            tabBarInactiveTintColor: isDarkColorScheme ? '#888' : '#777',
            tabBarStyle: isModalActive ? { display: 'none' } : {
              backgroundColor: isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background,
              borderTopColor: isDarkColorScheme ? NAV_THEME.dark.border : NAV_THEME.light.border,
              height: height * 0.1,
              paddingTop: 10,
              borderTopWidth: 1,
              marginHorizontal:-5
            },
          };
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Tips' }} />
        <Tab.Screen name="Search" component={SearchStack} options={{ tabBarLabel: 'Search' }} />
        <Tab.Screen name="Bell" component={NotificationScreen} options={{ tabBarLabel: 'Alerts' }} />
        <Tab.Screen name="Settings" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
      </Tab.Navigator>
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