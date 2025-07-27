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
const { Navigator } = createMaterialTopTabNavigator();


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
      <Stack.Screen name="SearchScreen" 
      component={SearchScreen} 
      initialParams={{ userId:""  }}
      
      />
      <Stack.Screen
        name="TipCard"
        component={props => <><ModalIndicator /><TipCard {...props} /></>}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="SearchSuggestionsScreen"
        component={props => <><ModalIndicator /><SearchSuggestionsScreen {...props} /></>}
        options={{ presentation: 'modal' }}
        initialParams={{ search: '' }}
      />
      <Stack.Screen
        name="User"
        component={props => <><ModalIndicator /><UserScreen {...props} /></>}
        options={{ presentation: 'modal' }}
        initialParams={{ filterType: '', filterName: '' }}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={props => <><ModalIndicator /><NotificationScreen {...props} /></>}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="Profile"
        component={props => <><ModalIndicator /><ProfileScreen {...props} /></>}
        options={{ presentation: 'modal'  }}
        initialParams={{ name: '', avatar: '', theme: isDarkColorScheme ? 'dark' : 'light' }}
      />
      <Stack.Screen
        name="TipListScreen"
        component={props => <><ModalIndicator /><TipListScreen {...props} /></>}
        options={{ presentation: 'modal' }}
      />
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
      
        <HomeStack />
       
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