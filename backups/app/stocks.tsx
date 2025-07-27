import * as React from 'react';
import { View, Dimensions, Image } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from 'react-native-reanimated';
import { Button } from '~/components/ui/button';

import { Text } from '~/components/ui/text';
import PagerView from 'react-native-pager-view';

import { useColorScheme } from '~/lib/useColorScheme';
import TradingView from './TradingView';
import { mockNewsData } from './mockNewsData';
import { useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const TAB_BAR_HEIGHT = 56; // Adjust if your tab bar is taller/shorter
const usableHeight = height *0.88;
import { NAV_THEME } from '~/lib/constants';

export default function StockScreen() {



  const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
  };
  const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
  };


  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  return (

    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
    <PagerView style={{ flex: 1 }} initialPage={0} orientation="vertical">
      {mockNewsData.map((item, idx) => (
        <View
          key={idx}
          style={{
            flex: 1,
            minHeight: usableHeight,
            maxHeight: usableHeight,
            width: width,
            paddingBottom: 0,
            overflow: 'hidden',
          }}
        >
          {/* Chart */}
          <View style={{ marginTop: 10, width: width * 0.97, height: usableHeight * 0.4, alignSelf: 'center', justifyContent: 'center' }}>
            <TradingView symbol={item.symbol} compareSymbol={item.compareSymbol} theme={isDarkColorScheme ? 'dark' : 'light'} onError={(e: unknown) => { console.error('TradingView error:', e); }} />
          </View>
          {/* Headline & summary */}
          <View style={{ width: width, alignItems: 'center', justifyContent: 'center', padding: 18, marginTop: -30 }}>
            <Text
              style={{
                fontFamily: 'UberMove-Bold',
                fontSize: Math.max(18, width * 0.05),
                marginBottom: 18,
                textAlign: 'justify',
                width: '100%',
              }}
            >
              {item.headline}
            </Text>
            <Text
              style={{
                fontFamily: 'UberMove-Medium',
                color: '#64748b',
                fontSize: Math.max(13, width * 0.04),
                marginBottom: 16,
                textAlign: 'justify',
                width: '100%',
              }}
            >
              {item.summary}
            </Text>
          </View>
          {/* Tip card and name button pinned to bottom */}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingBottom: 24 }}>
            <View style={{
              backgroundColor: '#4ba366',
          
              padding: 16,
              width: width * 0.9,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
              marginBottom: 10,
            }}>
              <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: Math.max(15, width * 0.037), textAlign: 'left' }}>
                {item.tip}
              </Text>
            </View>
            <Button
              variant={'outline'}
              size={'sm'}
              style={{
                alignSelf: 'center',
                backgroundColor: '#e6f4ea',
                height: 40,
                paddingVertical: 6,
                paddingHorizontal: 38,
                marginTop: -25,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 2,
                elevation: 1,
                borderColor: '#e6f4ea',
                borderWidth: 0,
                borderRadius: 100,
              }}
              onPress={() => router.push({ pathname: '/profile', params: { name: item.user.name, avatar: item.user.avatar } })}
            >
              <Image
                source={{ uri: item.user.avatar }}
                style={{ width: 25, height: 25, borderRadius: 14, marginRight: 8 }}
              />
              <Text style={{ color: '#22c55e', fontFamily: 'UberMove-Bold', fontSize: Math.max(13, width * 0.037) }}>
                {item.user.name}
              </Text>
            </Button>
          </View>
        </View>
      ))}
    </PagerView>
    </ThemeProvider>
  );
}
  