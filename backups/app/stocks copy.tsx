import * as React from 'react';
import { View, Dimensions, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
// Styles for buttons and labels in the horizontal scroll

import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from 'react-native-reanimated';
import { Button } from '~/components/ui/button';

import { Text } from '~/components/ui/text';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';

import { useColorScheme } from '~/lib/useColorScheme';
import TradingView from './TradingView';
import { mockNewsData, timeAgo } from './mockNewsData';
import { useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const TAB_BAR_HEIGHT = 56; // Adjust if your tab bar is taller/shorter
const usableHeight = height *0.88;
import { NAV_THEME } from '~/lib/constants';
import MenuBar from './MenuBar';

export default function StockScreen() {

const navigation = useNavigation();


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

  const [selectedTip, setSelectedTip] = React.useState("");
  const [isTipModalVisible, setTipModalVisible] = React.useState(false);

  const handleTipClick = (tip: string) => {
    setSelectedTip(tip);
    setTipModalVisible(true);
  };



  return (

    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
    <PagerView style={{ flex: 1 }} layoutDirection={'ltr'} initialPage={0} orientation="vertical" >
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
          <View style={{ marginTop: 10, width: width * 0.97, height:height * 0.7, alignSelf: 'center', justifyContent: 'flex-start' }}>

            <View style={{width: width * 0.999 , height:height * 0.505}}>
             <TradingView height={height/2} width={width} symbol={item.symbol} compareSymbol={item.compareSymbol} theme={isDarkColorScheme ? 'dark' : 'light'} onError={(e: unknown) => { console.error('TradingView error:', e); }} />
             </View>
            
            <View style={{ width: width * 0.999 ,height: height * 0.1, marginTop:0 }}>
              <MenuBar news={item} />
            </View>

          </View>
          
         
          {/* Tip card and name button pinned to bottom, but button is half-overlapping the top of the tip card */}
          <View style={{  position: 'absolute', left: 0, right: 0, bottom: 10, alignItems: 'center' }}>
            {/* Profile button, half outside and half on top of tip card */}
          

              <Button
              variant={'outline'}
              size={'sm'}
              style={{
                alignSelf: 'center',
                backgroundColor: '#e6f4ea',
                height: 40,
                paddingVertical: 6,
                paddingHorizontal: 38,
                marginBottom: -15, // Pull up so it's half over tip card
                zIndex: 2,
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
              onPress={() => navigation.navigate('Profile', { name: item.user.name, avatar: item.user.avatar })}
            >
              <Image
                source={{ uri: item.user.avatar }}
                style={{ width: 25, height: 25, borderRadius: 14, marginRight: 8 }}
              />
              
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text style={{ color: '#000', fontFamily: 'UberMove-Bold', fontSize: Math.max(13, width * 0.03) }}>
                    {item.user.name}
                  </Text>
                  <Text style={{ color: '#64748b', marginTop: "-12.5%", fontFamily: 'UberMove-M', fontSize: Math.max(10, width * 0.023), textAlign: 'left' }}>
                    {timeAgo(item.timestamp)}
                  </Text>
                </View>

            </Button>

            {/* Tip card with 4 outlined buttons at the bottom */}
            <View style={{ width: width * 0.925 }}>
              <View 
               
                style={{
                  backgroundColor: '#268e52',
                  padding: 16,
                  width: '100%',
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 2,
                  borderRadius: 15,
                  paddingBottom: 10,
                  paddingTop: 30,
                
                }}
              >
                <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: Math.max(15, width * 0.037), textAlign: 'left' }}>
                  {item.tip}
                </Text>
                {/* Four outlined buttons at the bottom of the tip card */}
                {(() => {
                  // Demo default values for each card
                  const holdingOptions = ['1D', '1W', 'Swing', 'Long'];
                  const riskOptions = ['Low', 'Medium', 'High'];
                  const convictionOptions = ['High', 'Medium', 'Low'];
                  const winRate = 65 + (idx % 20); // 65% to 84%
                  const strategyOptions = ['Growth', 'Value', 'Momentum', 'Income', 'Index'];
                  const sentimentOptions = ['Bullish', 'Neutral', 'Bearish'];
                  const sectorOptions = ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer'];
                  const entryPrice = `$${(100 + idx * 2).toFixed(2)}`;
                  const exitPrice = `$${(95 + idx * 2).toFixed(2)}`;
                  const targetDuration = ['2W', '1M', '3M', '6-12M'][idx % 4];
                  const allocation = `${10 + (idx % 5) * 5}%`;
                  const catalyst = ['Earnings', 'Fed', 'M&A', 'Product'][idx % 4];
                  const valuation = ['P/E 18x', 'EV/EBITDA 12x', 'DCF +15%', 'PEG 1.2'][idx % 4];
                  const sentiment = sentimentOptions[idx % sentimentOptions.length];
                  const technical = ['RSI 60', 'MACD Bull', 'MA Cross', 'ADX 25'][idx % 4];
                  const confidence = `${70 + (idx % 10)}%`;
                  const diversification = ['Core', 'Satellite', 'Hedge'][idx % 3];
                  const liquidity = ['High', 'Medium', 'Low'][idx % 3];
                  const expectedReturn = `${8 + (idx % 7)}%`;
                  const performance = `${60 + (idx % 30)}%`;
                  const sector = sectorOptions[idx % sectorOptions.length];
                  const holding = holdingOptions[idx % holdingOptions.length];
                  const risk = riskOptions[idx % riskOptions.length];
                  const conviction = convictionOptions[idx % convictionOptions.length];
                  const strategy = strategyOptions[idx % strategyOptions.length];
                  return (
                    <View style={{ marginTop: 18 }}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                        {/* Entry Price / Buy Range */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {entryPrice}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Entry Price</Text>
                        </View>
                        {/* Exit Plan / Stop Loss */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
  borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {exitPrice}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Stop Loss</Text>
                        </View>
                        {/* Target Duration */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {targetDuration}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Duration</Text>
                        </View>
                        {/* Capital Allocation % */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {allocation}
                          </Text>
                        </Button>
                        <Text style={{ color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',}}>Allocation</Text>
                        </View>
                        {/* Catalyst/Event Driver */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {catalyst}
                          </Text>
                        </Button>
                        <Text style={{ color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',}}>Catalyst</Text>
                        </View>
                        {/* Valuation Insight */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {valuation}
                          </Text>
                        </Button>
                        <Text style={{
                           color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
                        }}>Valuation</Text>
                        </View>
                        {/* Sentiment Indicator */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {sentiment}
                          </Text>
                        </Button>
                        <Text style={{

                                                    color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
                        }}>Sentiment</Text>
                        </View>
                        {/* Technical Signal */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {technical}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Technical</Text>
                        </View>
                        {/* Confidence Level */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {confidence}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Confidence</Text>
                        </View>
                        {/* Diversification Role */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {diversification}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Diversification</Text>
                        </View>
                        {/* Liquidity / Volume */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {liquidity}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Liquidity</Text>
                        </View>
                        {/* Expected Return (%) */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {expectedReturn}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Exp. Return</Text>
                        </View>
                        {/* Historical Performance */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {performance}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Performance</Text>
                        </View>
                        {/* Sector/Industry Tag */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {sector}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Sector</Text>
                        </View>
                        {/* Holding Period (legacy) */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {holding}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Holding</Text>
                        </View>
                        {/* Risk (legacy) */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {risk}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Risk</Text>
                        </View>
                        {/* Conviction (legacy) */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {conviction}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Conviction</Text>
                        </View>
                        {/* Win Rate (legacy) */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {winRate + '%'}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Win Rate</Text>
                        </View>
                        {/* Strategy (legacy) */}
                        <View style={{ alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{
 borderColor: '#fff',
  borderWidth: 0.85,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 100,
  height: 30,
  minWidth: 54,
  paddingHorizontal: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  opacity: 0.8,
}} >
                          <Text
                            style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 11 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                          >
                            {strategy}
                          </Text>
                        </Button>
                        <Text style={{
  color: '#fff',
  fontFamily: 'UberMove-Medium',
  fontSize: 10,
  marginTop: 2,
  opacity: 0.7,
  textAlign: 'center',
  maxWidth: 80,
  flexWrap: 'wrap',
}}>Strategy</Text>
                        </View>
                      </ScrollView>
                    </View>
                  );
                })()}

              </View>
            </View>


          </View>
        </View>
      ))}
    </PagerView>
    
 
    </ThemeProvider>
  );
}
