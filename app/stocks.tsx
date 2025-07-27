import * as React from 'react';
import { View, Dimensions, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import DerivativesIcon from '../assets/icons/Derivatives.svg';
import IndexesIcon from '../assets/icons/indexes.svg';
import BondsIcon from '../assets/icons/bonds.svg';
import ForexIcon from '../assets/icons/forex.svg';
import EquityIcon from '../assets/icons/equity.svg';
import MutualFundsIcon from '../assets/icons/mutual-funds.svg';
import CommoditiesIcon from '../assets/icons/commodities.svg';
import BitcoinIcon from '../assets/icons/bitcoin.svg';
const categories = [
  { name: 'Derivatives', Icon: DerivativesIcon },
  { name: 'Indexes', Icon: IndexesIcon },
  { name: 'Bonds', Icon: BondsIcon },
  { name: 'Commodities', Icon: CommoditiesIcon },
  { name: 'Forex', Icon: ForexIcon },
  { name: 'Equity', Icon: EquityIcon },
  { name: 'Mutual Funds', Icon: MutualFundsIcon },
  { name: 'Crypto', Icon: BitcoinIcon },
];
import RBSheet from 'react-native-raw-bottom-sheet';
// Explanations for each label
const FIELD_EXPLANATIONS: Record<string, string> = {
  'Entry Price': 'The price at which the advisor suggests entering the position. This is the recommended buy price for the asset.',
  'Stop Loss': 'A stop loss is a pre-set price at which the position should be sold to limit potential losses. It helps manage risk.',
  'Duration': 'The expected holding period for this tip. It indicates how long the advisor expects the position to be held.',
  'Allocation': 'The suggested portion of your portfolio to allocate to this tip. Helps with diversification and risk management.',
  'Catalyst': 'A specific event or factor expected to drive the asset’s price movement, such as earnings, news, or macro events.',
  'Valuation': 'The advisor’s view on whether the asset is undervalued, overvalued, or fairly valued based on analysis.',
  'Sentiment': 'The overall market or advisor sentiment (bullish, bearish, neutral) regarding this asset.',
  'Technical': 'Technical analysis signals or patterns supporting this tip, such as moving averages, RSI, or chart patterns.',
  'Confidence': 'How confident the advisor is in this tip, usually on a scale or as a qualitative assessment.',
  'Diversification': 'How this tip fits into a diversified portfolio. Diversification helps reduce risk.',
  'Liquidity': 'How easily the asset can be bought or sold without affecting its price. High liquidity is generally preferred.',
  'Exp. Return': 'The expected return from this tip, based on the advisor’s analysis and projections.',
  'Performance': 'Historical or expected performance of the asset or similar tips.',
  'Sector': 'The sector or industry to which the asset belongs, e.g., Technology, Healthcare.',
  'Holding': 'Indicates if the tip is a new buy, hold, or sell recommendation.',
  'Risk': 'The level of risk associated with this tip, such as low, medium, or high.',
  'Conviction': 'The strength of the advisor’s belief in this tip, often based on research or experience.',
  'Win Rate': 'The historical success rate of similar tips or strategies.',
  'Strategy': 'The overall investment or trading strategy behind this tip, such as momentum, value, or growth.',
};
// Styles for buttons and labels in the horizontal scroll
import { supabase } from '~/lib/supabase';
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
const usableHeight = height *0.95;
import { NAV_THEME } from '~/lib/constants';
import MenuBar from './MenuBar';

import {
  useTheme,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';


export default function StockScreen() {
  // Asset class state
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0]);
  const assetSheetRef = React.useRef<any>(null);

  console.log('StockScreen rendered');

  const navigation = useNavigation();

  // Theme state for toggling
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>(
    useColorScheme().isDarkColorScheme ? 'dark' : 'light'
  );

  const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
  };
  const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
  };

  const isDarkColorScheme = themeMode === 'dark';
  const router = useRouter();
  const colors = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  const [selectedTip, setSelectedTip] = React.useState("");
  const [isTipModalVisible, setTipModalVisible] = React.useState(false);
  const [tips, setTips] = React.useState<any[]>([]);
  const [infoSheetLabel, setInfoSheetLabel] = React.useState<string>("");
  const [infoSheetExplanation, setInfoSheetExplanation] = React.useState<string>("");
  const infoSheetRef = React.useRef<RBSheet>(null);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  

  const handleTipClick = (tip: string) => {
    setSelectedTip(tip);
    setTipModalVisible(true);
  };



  const fetchTips = async (pageNum = 0) => {
    console.log('Fetching tips for page:', pageNum);
    setLoading(true);
    const pageSize = 2;
    const from = pageNum * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabase
      .from('investment_tips')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) {
      console.error('Supabase error:', error);
    } else {
      if (pageNum === 0) {

        setTips(data);

        setTips(mockNewsData)

      } else {
        console.log('Appending data:', data);
        setTips((prev) => [...prev, ...data]);
      }
      setHasMore(data && data.length === pageSize);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    console.log('Fetching initial tips');
    fetchTips(0);
    setPage(0);
  }, []);

  // Lazy load next page when user reaches last tip
  const handlePageSelected = React.useCallback((e: any) => {
    const idx = e.nativeEvent.position;
    if (hasMore && idx >= tips.length - 2 && !loading) {
      fetchTips(page + 1);
      setPage((p) => p + 1);
    }
  }, [hasMore, tips.length, loading, page]);


  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <View style={{ flex: 1, backgroundColor: isDarkColorScheme ? '#000' : '#FFF' }}>
        
        
        
        
        {/* Header view above PagerView */}
        {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start', borderBottomWidth: 0.67, marginTop: height * 0.055, borderColor: isDarkColorScheme ? '#222' : '#ddd', paddingHorizontal: 0, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 3 }}>
            <TouchableOpacity
              
              style={{ padding: 6, borderRadius: 20, paddingLeft: 14 }}
              activeOpacity={0.7}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="arrow-back" size={26} color={colors.text} />
            </TouchableOpacity>
          
           
          </View>
          <TouchableOpacity
            onPress={() => assetSheetRef.current?.open()}
            style={{ width: '23%', alignItems: 'center', marginBottom: 8, marginLeft:15 }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 80,
                height: 45,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: colors.border,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 6,
                shadowColor: colors.background,
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <selectedCategory.Icon width={25} height={25} fill={colors.text} />
              <Feather name="chevron-down" size={16} color={colors.text} />
            </View>
          </TouchableOpacity>
          
          <RBSheet
            ref={assetSheetRef}
            height={340}
            openDuration={250}
            customStyles={{
              container: {
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                padding: 14,
                backgroundColor: isDarkColorScheme ? '#18181b' : '#fff',
                alignItems: 'center',
              },
            }}
            closeOnPressMask={true}
          >
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: isDarkColorScheme ? '#333' : '#bbb',
                  marginBottom: 12,
                }}
              />
              <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 18, marginBottom: 36, color: isDarkColorScheme ? '#EEE' : '#444' }}>Select Asset Class</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: "100%" }}>
                {categories.map(({ name, Icon }) => (
                  <TouchableOpacity
                    key={name}
                    style={{ width: '23%', alignItems: 'center', marginBottom: 28 }}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedCategory({ name, Icon });
                      assetSheetRef.current?.close();
                    }}
                  >
                    <View
                      style={{
                      width: 64,
                    height: 64,
                    borderRadius: 32,
                    borderWidth: 1,
                    borderColor: colors.border,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 6,
                    shadowColor: colors.background,
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    elevation: 1,
                      }}
                    >
                      <Icon width={20} height={20} fill={colors.text} />
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        color: colors.text,
                        fontFamily: 'UberMove-Bold',
                        textAlign: 'center',
                        marginTop: 2,
                      }}
                      numberOfLines={2}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button style={{ marginTop: 12, width: 120 }} onPress={() => assetSheetRef.current?.close()}>
                <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 15 }}>Cancel</Text>
              </Button>
            </View>
          </RBSheet>
        
        </View> */}




        {/* PagerView below header */}
        <PagerView
          style={{ flex: 1 }}
          layoutDirection={'ltr'}
          initialPage={0}
          orientation="vertical"
          onPageSelected={handlePageSelected}
        >
          {tips?.map((item, idx) => (
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
          
          
         
          {/* Tip card and name button pinned to bottom, but button is half-overlapping the top of the tip card */}
          <View style={{  position: 'absolute', left: 0, right: 0, top: 15, alignItems: 'center' }}>
            {/* Profile button, half outside and half on top of tip card */}
          

              <Button
              variant={'outline'}
              size={'sm'}
              style={{
                alignSelf: 'center',
                
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
                borderColor: colors.border,
                borderWidth: 0.9,
                borderRadius: 100,
              }}
              onPress={() => navigation.navigate('Profile', { name: item?.name, avatar: item?.avatar, tipperName: item?.name })}
            >
              <Image
                source={{ uri: item?.avatar }}
                style={{ width: 25, height: 25, borderRadius: 14, marginRight: 8 }}
              />
              
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text style={{marginRight:5, color: isDarkColorScheme ? '#A9A9A9' : '#444', fontFamily: 'UberMove-Bold', fontSize: Math.max(11, width * 0.0273) }}>
                    {item?.name}
                  </Text>
                  <Text style={{ color: '#64748b', marginTop: "-10%", fontFamily: 'UberMove-M', fontSize: Math.max(10, width * 0.023), textAlign: 'left' }}>
                    {timeAgo(item?.created_at)}
                  </Text>
                </View>

            </Button>

            {/* Tip card with 4 outlined buttons at the bottom */}
              <View 
               
                style={{
                  borderColor: colors.border,
                  borderWidth: 0.85,
                  padding: 16,
                  width: '100%',
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 2,
                  borderRadius: 15,
                  paddingBottom: 10,
                  paddingTop: 30,
                  height:height * 0.825,
                  width: width * 0.95,
                  justifyContent: 'space-between',
                }}
              >

                <View style={{  width: width  , height:height * 0.58, margin:-5}}>
                  <TradingView height={height/2} width={width} symbol={item?.symbol} compareSymbol={item?.compared} theme={isDarkColorScheme ? 'dark' : 'light'} onError={(e: unknown) => { console.error('TradingView error:', e); }} />
                  
                </View>

              

                <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>

                    
                    <Text style={{  marginTop:20, fontFamily: 'UberMove-Bold', fontSize: Math.max(13, width * 0.034), textAlign: 'left' }}>
                      {item?.tip}
                    </Text>


                    {(() => {
                      // List of fields and their labels
                      const fields = [
                        { key: 'entry_price', label: 'Entry Price' },
                        { key: 'exit_price', label: 'Stop Loss' },
                        { key: 'target_duration', label: 'Duration' },
                        { key: 'allocation', label: 'Allocation' },
                        { key: 'catalyst', label: 'Catalyst' },
                        { key: 'valuation', label: 'Valuation' },
                        { key: 'sentiment', label: 'Sentiment' },
                        { key: 'technical', label: 'Technical' },
                        { key: 'confidence', label: 'Confidence' },
                        { key: 'diversification', label: 'Diversification' },
                        { key: 'liquidity', label: 'Liquidity' },
                        { key: 'expected_return', label: 'Exp. Return' },
                        { key: 'performance', label: 'Performance' },
                        { key: 'sector', label: 'Sector' },
                        { key: 'holding', label: 'Holding' },
                        { key: 'risk', label: 'Risk' },
                        { key: 'conviction', label: 'Conviction' },
                        { key: 'win_rate', label: 'Win Rate' },
                        { key: 'strategy', label: 'Strategy' },
                      ];
                      return (
                        <View style={{ marginTop: 18 }}>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                            {fields.map(({ key, label }) => {
                              const value = item?.[key];
                              if (value === undefined || value === null || value === '') return null;
                              // Convert value to camel style: first letter uppercase, rest lowercase, remove underscores
                              let displayValue = String(value)
                                .replace(/_/g, ' ')
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                              return (
                                <View style={{ alignItems: 'center' }} key={key}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    style={{
                                      borderColor: isDarkColorScheme ? "#666" : colors.border,
                                      borderWidth: 0.95,
                                      borderRadius: 100,
                                      height: 30,
                                      minWidth: 54,
                                      paddingHorizontal: 2,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      marginBottom: 0,
                                      opacity: 0.58,
                                    }}
                                    onPress={() => {
                                      const explanation = FIELD_EXPLANATIONS[label] || 'No explanation available.';
                                      setInfoSheetLabel(label);
                                      setInfoSheetExplanation(explanation);
                                      infoSheetRef.current?.open();
                                    }}
                                  >
                                    <Text
                                      style={{ fontFamily: 'UberMove-Bold', fontSize: 10 }}
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                      adjustsFontSizeToFit
                                      minimumFontScale={0.7}
                                    >
                                      {displayValue}
                                    </Text>
                                  </Button>
                                  <Text style={{
                                  
                                    fontFamily: 'UberMove-Medium',
                                    fontSize: 9,
                                    marginTop: 2,
                                    opacity: 0.7,
                                    textAlign: 'center',
                                    maxWidth: 80,
                                    flexWrap: 'wrap',
                                  }}>{label}</Text>
                                </View>
                              );
                            })}
                          </ScrollView>
                        </View>
                      );
                    })()}





                </View>
              
              </View>
           
            


          </View>



          {/* Chart */}
          <View style={{ marginTop: 20, width: width * 0.97, height:height * 0.6, alignSelf: 'center', justifyContent: 'flex-start' }}>
          </View>


        </View>
      ))}
    


      
    </PagerView>

          {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
          <Text style={{ color: isDarkColorScheme ? '#fff' : '#222', fontSize: 16, marginTop: 24 }}>Loading...</Text>
        </View>
      )}
    </View>
 
      <RBSheet
        ref={infoSheetRef}
        height={220}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 24,
            backgroundColor: isDarkColorScheme ? '#111' : '#EEE',
            paddingTop: 16,
          },
        }}
        closeOnDragDown={true}
        closeOnPressMask={true}
      >
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <View
            style={{
              width: 40,
              height: 5,
              borderRadius: 3,
              backgroundColor: isDarkColorScheme ? '#333' : '#bbb',
              marginBottom: 8,
            }}
          />
        </View>
        <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 18, marginBottom: 18, color: isDarkColorScheme ? '#fff' : '#222', textAlign: 'center' }}>{infoSheetLabel}</Text>
        <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 15, color: isDarkColorScheme ? '#d1d5db' : '#444', lineHeight: 22, textAlign: 'left' }}>{infoSheetExplanation}</Text>
      </RBSheet>
    </ThemeProvider>
  );
}
