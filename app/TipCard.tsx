import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, Share, Alert } from 'react-native';
import TradingView from './TradingView';
import { useRoute, useTheme } from '@react-navigation/native';
import { timeAgo } from './mockNewsData';
import { Button } from '~/components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from '~/lib/useColorScheme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Example SVG imports (replace with your actual icons)
import MarketIcon from '../assets/icons/markets.svg';
import ConfigurationIcon from '../assets/icons/bulb.svg';
import AIIcon from '../assets/icons/ai.svg';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import MenuBar from './MenuBar';
import { Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LollipopIcon from '../assets/icons/lollipop.svg';
import LollipopIconWhite  from "../assets/icons/lollipop-white.svg";

type Tip = {
  id?: string | number;
  avatar: string;
  name: string;
  symbol: string;
  asset_type: string;
  sector: string;
  created_at: string;
  tip: string;
  strategy?: string;
  risk?: string;
  expected_return?: string;
  duration?: string;
  region?: string;
};

type TipCardProps = {
  tip: Tip;
  onClose?: () => void;
  showClose?: boolean;
};




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

const FIELD_ICONS: Record<string, string> = {
  'Symbol': 'pricetag-outline',
  'Compared To': 'swap-horizontal-outline',
  'Asset Type': 'cube-outline',
  'Entry Price': 'trending-up-outline',
  'Stop Loss': 'remove-circle-outline',
  'Duration': 'time-outline',
  'Allocation': 'pie-chart-outline',
  'Catalyst': 'flash-outline',
  'Valuation': 'stats-chart-outline',
  'Sentiment': 'happy-outline',
  'Technical': 'analytics-outline',
  'Confidence': 'checkmark-done-outline',
  'Diversification': 'grid-outline',
  'Liquidity': 'water-outline',
  'Exp. Return': 'cash-outline',
  'Performance': 'speedometer-outline',
  'Sector': 'business-outline',
  'Holding': 'archive-outline',
  'Risk': 'warning-outline',
  'Conviction': 'star-outline',
  'Win Rate': 'trophy-outline',
  'Strategy': 'bulb-outline',
};

function FundamentalTabContent({ tip }: { tip: Tip }) {
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const { colors } = useTheme();
  const { isDarkColorScheme } = useColorScheme ? useColorScheme() : { isDarkColorScheme: false };
  const infoSheetRef = useRef<any>(null);
  const [sheetLabel, setSheetLabel] = useState<string>('');
  const [sheetValue, setSheetValue] = useState<string>('');
  const [sheetExplanation, setSheetExplanation] = useState<string>('');
    const navigation = useNavigation();

    const route = useRoute();
 
  const [bookmarkFilled, setBookmarkFilled] = React.useState(false);
  const [bookmarkLoading, setBookmarkLoading] = React.useState(false);

  // Table fields
  const fields = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'compared', label: 'Compared To' },
    { key: 'asset_type', label: 'Asset Type' },
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


    // Check if tip is already bookmarked on mount
  React.useEffect(() => {
    async function checkBookmarked() {
      // Get current user
      const { data: { session } } = await import('~/lib/supabase').then(m => m.supabase.auth.getSession());
      const userId = session?.user?.id;
      if (!userId || !tip?.id) return;
      // Fetch user's bookmarks array
      const { data: userData } = await import('~/lib/supabase').then(m => m.supabase
        .from('users')
        .select('bookmarks')
        .eq('id', userId)
        .single());
      if (userData?.bookmarks && Array.isArray(userData.bookmarks)) {
        setBookmarkFilled(userData.bookmarks.includes(String(tip.id)));
      }
    }
    checkBookmarked();
  }, [tip?.id]);

  // Bookmark handler
  const handleBookmark = async () => {
    setBookmarkLoading(true);
    // Get current user
    const { data: { session } } = await import('~/lib/supabase').then(m => m.supabase.auth.getSession());
    const userId = session?.user?.id;
    if (!userId) {
      setBookmarkLoading(false);
      // Not logged in, navigate to Login screen
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('User');
      }
      return;
    }
    if (!tip?.id) {
      setBookmarkLoading(false);
      return;
    }
    // Fetch current bookmarks
    const { data: userData, error } = await import('~/lib/supabase').then(m => m.supabase
      .from('users')
      .select('bookmarks')
      .eq('id', userId)
      .single());
    let newBookmarks = [];
    const tipIdStr = String(tip.id);
    if (userData?.bookmarks && Array.isArray(userData.bookmarks)) {
      if (!userData.bookmarks.includes(tipIdStr)) {
        // Bookmark: add tip id
        newBookmarks = [...userData.bookmarks, tipIdStr];
        const { error: updateError } = await import('~/lib/supabase').then(m => m.supabase
          .from('users')
          .update({ bookmarks: newBookmarks })
          .eq('id', userId));
        if (updateError) {
          console.error('[Bookmark] Error updating bookmarks:', updateError.message);
        } else {
          setBookmarkFilled(true);
        }
      } else {
        // Unbookmark: remove tip id
        newBookmarks = userData.bookmarks.filter((id: string) => id !== tipIdStr);
        const { error: updateError } = await import('~/lib/supabase').then(m => m.supabase
          .from('users')
          .update({ bookmarks: newBookmarks })
          .eq('id', userId));
        if (updateError) {
          console.error('[Unbookmark] Error updating bookmarks:', updateError.message);
        } else {
          setBookmarkFilled(false);
        }
      }
    } else {
      // No bookmarks yet, add tip id
      newBookmarks = [tipIdStr];
      const { error: updateError } = await import('~/lib/supabase').then(m => m.supabase
        .from('users')
        .update({ bookmarks: newBookmarks })
        .eq('id', userId));
      if (updateError) {
        console.error('[Bookmark] Error updating bookmarks:', updateError.message);
      } else {
        setBookmarkFilled(true);
      }
    }
    setBookmarkLoading(false);
  };


  


  // Reusable section components
  const InvestmentTipSection = ({ tip, colors, isDarkColorScheme }: { tip: Tip, colors: any, isDarkColorScheme: boolean }) => (
   

        <View style={{ width: '100%', paddingBottom: 5, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginTop: 2, marginBottom: 18 }}>
      <View style={{ flexDirection: 'row', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 13, color: colors.text, padding: 10 }}>Investment Tip</Text>
      </View>
      <Text style={{ color: colors.text, fontFamily: 'UberMove-Medium', fontSize: 14, textAlign: 'left', opacity: 0.8 , padding: 10 }}>
        {tip?.tip || 'No data available'}
      </Text>

       <Text style={{textAlign: 'left', opacity: 0.8 , paddingHorizontal: 10, color: '#64748b', fontFamily: 'UberMove-Medium', fontSize: 12, paddingBottom: 10}}>
            {timeAgo(tip?.created_at)}
          </Text>
    </View>
  );

  const InvestmentAdvisorSection = ({ tip, colors, isDarkColorScheme, navigation }: { tip: Tip, colors: any, isDarkColorScheme: boolean, navigation: any }) => (
    <View style={{ width: '100%', paddingBottom: 5, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginTop: 8, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 13, color: colors.text, padding: 10 }}>Investment Advisor</Text>
      </View>
      <TouchableOpacity
        style={{ height: 40, padding: 10, paddingTop: 15, zIndex: 2, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => navigation.navigate('Profile', { name: tip?.name, avatar: tip?.avatar })}
      >
        <Image
          source={{ uri: tip?.avatar }}
          style={{ width: 25, height: 25, borderRadius: 14, marginRight: 8 }}
        />
        <Text style={{ marginRight: 5, color: isDarkColorScheme ? '#A9A9A9' : '#444', fontFamily: 'UberMove-Bold', fontSize: 12 }}>
          {tip?.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const SourcesSection = ({ tip, colors, isDarkColorScheme }: { tip: Tip, colors: any, isDarkColorScheme: boolean }) => {
    const sources = (tip as any).sources || [
      { type: 'url', label: 'Company Website', value: 'https://example.com' },
      { type: 'url', label: 'News Article', value: 'https://news.com/article' },
      { type: 'document', label: 'Research PDF', value: 'Q2-2025-Research.pdf' },
    ];
    return (
      <View style={{ width: '100%', paddingBottom: 5, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginTop: 10, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
          <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 13, color: colors.text, padding: 10 }}>Sources</Text>
        </View>
        {sources.map((source: any, idx: number) => (
          <TouchableOpacity
            key={source.value + idx}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: idx === sources.length - 1 ? 0 : 1, borderBottomColor: colors.border }}
            activeOpacity={source.type === 'url' ? 0.7 : 1}
            onPress={() => {
              if (source.type === 'url') {
                try {
                  // @ts-ignore
                  if (window && window.open) window.open(source.value, '_blank');
                } catch {
                  if (typeof Linking !== 'undefined') {
                    // @ts-ignore
                    Linking.openURL(source.value);
                  }
                }
              }
            }}
          >
            <Ionicons
              name={source.type === 'url' ? 'link-outline' : 'document-outline'}
              size={16}
              color={isDarkColorScheme ? '#A9A9A9' : '#444'}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: colors.text, fontFamily: 'UberMove-Medium', fontSize: 12, flex: 1 }} numberOfLines={1} ellipsizeMode="tail">
              {source.label || source.value}
            </Text>
            {source.type === 'url' ? (
              <Text style={{ color: '#3b82f6', fontSize: 11, marginLeft: 6 }} numberOfLines={1} ellipsizeMode="tail">{source.value}</Text>
            ) : (
              <Text style={{ color: '#64748b', fontSize: 11, marginLeft: 6 }}>{source.value}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 8, paddingBottom:30 }}>
      

      <MenuBar tip={tip} />
      
      
      {/* CHART at top */}
      <View style={{ width: '100%', backgroundColor: isDarkColorScheme ?'#18181b' : '#fff', borderWidth: 1, borderColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12, marginTop: 6, marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
          <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 13, color: colors.text, padding: 10, paddingVertical:11 }}>Chart</Text>
        </View>
        <View style={{ width: width, height: height * 0.53, margin: width > 900 ?0 : "-2.5%", marginTop:width > 900 ? "-0.65%" : "-2%", marginLeft: width > 900 ? "-0.65%" : "-2.25%" }}>
          <TradingView height={height} width={width} symbol={tip?.symbol} compareSymbol={tip?.compared} theme={isDarkColorScheme ? 'dark' : 'light'} onError={(e: unknown) => { console.error('TradingView error:', e); }} />
        </View>
      </View>


      

      {width > 900 
      ?    <View style={{gap:10, flexDirection: width > 900 ? 'row' : 'column', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
        <View style={{ width: '50%', marginBottom: 10, borderRadius: 14, borderWidth: 0, borderColor: colors.border, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', overflow: 'hidden' }}>
          <InvestmentTipSection tip={tip} colors={colors} isDarkColorScheme={isDarkColorScheme} />
          <InvestmentAdvisorSection tip={tip} colors={colors} isDarkColorScheme={isDarkColorScheme} navigation={navigation} />
          <SourcesSection tip={tip} colors={colors} isDarkColorScheme={isDarkColorScheme} />
          <MenuBar/>
        </View>



      <ScrollView 
      
      
      
      
        style={{ width: '60%', marginBottom: 10, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', overflow: 'hidden' }}>
        {/* Table Header */}
        <View style={{ flexDirection: 'row', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 13, color: colors.text, padding: 10 }}>Label</Text>
          <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 13, color: colors.text, padding: 10, textAlign:"right" }}>Value</Text>
        </View>
        {/* Table Rows */}
        {fields.map(({ key, label }) => {
          const value = (tip as any)[key];
          if (value === undefined || value === null || value === '') return null;
          let displayValue = String(value)
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          return (
            <View key={key} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  setSheetLabel(label);
                  setSheetValue(displayValue);
                  setSheetExplanation(FIELD_EXPLANATIONS[label] || '');
                  infoSheetRef.current?.open();
                }}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}
                accessibilityLabel={`Show info for ${label}`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={FIELD_ICONS[label] || 'help-circle'}
                  size={15}
                  color={isDarkColorScheme ? '#A9A9A9' : '#444'}
                  style={{ marginRight: 6 }}
                />
                <Text style={{ marginRight: 4, fontFamily: 'UberMove-Medium', fontSize: 12, color: isDarkColorScheme ? '#A9A9A9' : '#444' }}>{label}</Text>
              </TouchableOpacity>
              <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 12, color: colors.text, padding: 10, marginTop: 3, textAlign: 'right' }}>{displayValue}</Text>
            </View>
          );
        })}
      </ScrollView>



      </View>

      :    
        
        <View style={{ width: '100%', marginVertical: 10, borderRadius: 14, borderWidth: 0, borderColor: colors.border, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', overflow: 'hidden', marginBottom:10 }}>
          
          
          <InvestmentTipSection tip={tip} colors={colors} isDarkColorScheme={isDarkColorScheme} />


          <ScrollView
            style={{ width: '99.5%', marginBottom: 10, marginHorizontal: 1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', overflow: 'hidden' }}>
        {/* Table Header */}
        <View style={{ flexDirection: 'row', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 13, color: colors.text, padding: 10 }}>Label</Text>
          <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 13, color: colors.text, padding: 10, textAlign:"right" }}>Value</Text>
        </View>
        {/* Table Rows */}
        {fields.map(({ key, label }) => {
          const value = (tip as any)[key];
          if (value === undefined || value === null || value === '') return null;
          let displayValue = String(value)
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          return (
            <View key={key} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  setSheetLabel(label);
                  setSheetValue(displayValue);
                  setSheetExplanation(FIELD_EXPLANATIONS[label] || '');
                  infoSheetRef.current?.open();
                }}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}
                accessibilityLabel={`Show info for ${label}`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={FIELD_ICONS[label] || 'help-circle'}
                  size={15}
                  color={isDarkColorScheme ? '#A9A9A9' : '#444'}
                  style={{ marginRight: 6 }}
                />
                <Text style={{ marginRight: 4, fontFamily: 'UberMove-Medium', fontSize: 12, color: isDarkColorScheme ? '#A9A9A9' : '#444' }}>{label}</Text>
              </TouchableOpacity>
              <Text style={{ flex: 1, fontFamily: 'UberMove-Bold', fontSize: 12, color: colors.text, padding: 10, marginTop: 3, textAlign:"right" }}>{displayValue}</Text>
            </View>
          );
        })}
      </ScrollView>
          <InvestmentAdvisorSection tip={tip} colors={colors} isDarkColorScheme={isDarkColorScheme} navigation={navigation} />
          <SourcesSection tip={tip} colors={colors} isDarkColorScheme={isDarkColorScheme} />
          


           <View style={{ marginHorizontal:-10, width: width, marginTop: width>900? "1%": Platform.OS === 'ios' ? "0.1%" : "2.5%",
        flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', padding:20,
        paddingHorizontal: 30, borderTopWidth: 0.6, borderTopColor: colors.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingBottom: 13 }}>
          <Ionicons name="arrow-back-sharp" size={0} color={colors.text} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* Bookmark Button */}
          <TouchableOpacity
            onPress={handleBookmark}
            disabled={bookmarkLoading}
            style={{ marginLeft: 8, marginBottom: 13 }}
            accessibilityLabel={bookmarkFilled ? 'Bookmarked' : 'Bookmark'}
            activeOpacity={0.7}
          >
            <Ionicons
              name={bookmarkFilled ? 'bookmark-sharp' : 'bookmark-outline'}
              size={22}
              color={bookmarkFilled ? colors.primary : colors.text}
            />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            onPress={async () => {
              try {
                await Share.share({
                  message: tip?.tip
                    ? `Investment Tip: ${tip.tip}\n\nBy: ${tip.name}\nAsset: ${tip.symbol}\n` : 'Check out this investment tip!',
                  title: 'Share Investment Tip',
                });
              } catch (error) {
                Alert.alert('Error', 'Could not share the tip.');
              }
            }}
            style={{ marginLeft: 8, marginBottom: 13 }}
            accessibilityLabel="Share Tip"
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={22} color={colors.text} />
          </TouchableOpacity>

          {/* Report Button */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Report Tip',
                'Are you sure you want to report this tip?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Report', style: 'destructive', onPress: () => {
                    // Placeholder: Implement actual report logic here
                    Alert.alert('Reported', 'Thank you for reporting. Our team will review this tip.');
                  } },
                ]
              );
            }}
            style={{ marginLeft: 8, marginBottom: 13 }}
            accessibilityLabel="Report Tip"
            activeOpacity={0.7}
          >
            <Ionicons name="flag-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
        



     



      </View>


      }

   








    



      {/* Info Bottom Sheet for label/value */}
      <RBSheet
        ref={infoSheetRef}
        height={height * 0.234}
        openDuration={250}
        customStyles={{
          container: {
            backgroundColor: isDarkColorScheme ? '#18181b' : '#fff',
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            padding: 24,
          },
        }}
        closeOnDragDown
        closeOnPressMask
      >
        <View style={{ alignItems: 'center', justifyContent: 'flex-start', flex: 1 }}>
          <Text style={{ fontSize: 17, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 10, textAlign: 'center' }}>{sheetLabel}</Text>
          {sheetExplanation ? (
            <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, opacity: 0.7, textAlign: 'left', marginTop: 8 }}>{sheetExplanation}</Text>
          ) : null}
        </View>
      </RBSheet>
    </ScrollView>
  );
}


export default function TipCard() {
  const route = useRoute();
  const { tip, userData, onUnlockedTipsUpdate } = (route.params as { tip?: Tip, userData?: any, onUnlockedTipsUpdate?: (tips: string[]) => void }) || {};
 const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const isDarkColorScheme = useColorScheme ? useColorScheme().isDarkColorScheme : false;
  const { colors } = useTheme();

  console.log('[TipCard] Params with tip:', tip);
  console.log('[TipCard] Params with userData:', userData);
  console.log('[TipCard] Params with onUnlockedTipsUpdate:', onUnlockedTipsUpdate);

    const [loadingUnlock, setLoadingUnlock] = useState(false);
    const [credits, setCredits] = useState(userData?.credits ?? 0);
  



  function isPaywalled(tip: any) {
    if (!tip?.created_at) return false;
    const now = new Date();
    const created = new Date(tip.created_at);
    return (now.getTime() - created.getTime()) < 24 * 60 * 60 * 1000;
  }

tip &&console.log('[TipCard] inlcuding:', userData?.unlockedTips);



  if (!tip) return null;
  return (
    <SafeAreaView style={{marginBottom:0, marginTop: Platform.OS === 'ios' ? -15 : 0, flex: 1, minHeight: height, width: width, paddingBottom: 0, overflow: 'hidden' }}>
      

      { isPaywalled(tip) && !userData?.unlockedTips?.includes(tip.id)
        ? <View style={{ height: height * 0.8, flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 30 }}>
            {/* Info message */}
            <Text style={{ color: colors.text, fontFamily: 'UberMove-Bold', fontSize: 18, textAlign: 'center', marginTop: -18 }}>
              This tip is <Text style={{ color: colors.primary }}>locked</Text> because it was posted less than 24 hours ago.
            </Text>

            {/* Locked icon and lollipops needed */}
            <View style={{ alignItems: 'center', marginTop: -20, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                {/* Show 1 lollipop needed visually */}
                {isDarkColorScheme
                  ? <LollipopIconWhite color={'#fff'} width={60} height={60} style={{ marginHorizontal: 2 }} />
                  : <LollipopIcon color={colors.primary} width={60} height={60} style={{ marginHorizontal: 2 }} />
                }
                
              </View>
              <Text style={{ color: colors.text, fontFamily: 'UberMove-Bold', fontSize: 16, margin: 8 }}>
                  1 lollipop needed to unlock
                </Text>
            </View>
            {/* Wallet credits left */}
            
            {/* Unlock button */}

            <View style={{ width: '120%', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>

            
            <Button 
              size="lg" 
              onPress={async () => {
                if (credits <= 0) {
                  Alert.alert('Insufficient credits', 'You have no credits left to unlock tips.');
                  return;
                }
                setLoadingUnlock(true);
                try {
                  // Get current user
                  const { data: { session } } = await import('~/lib/supabase').then(m => m.supabase.auth.getSession());
                  const userId = session?.user?.id;
                  if (!userId || !tip?.id) throw new Error('User or tip missing');
                  // Update unlockedTips and credits in Supabase
                  const newUnlockedTips = [...(userData?.unlockedTips || []), tip.id];
                  const newCredits = credits - 1;
                  const { error } = await import('~/lib/supabase').then(m => m.supabase
                    .from('users')
                    .update({ unlockedTips: newUnlockedTips, credits: newCredits })
                    .eq('id', userId));
                  if (error) throw error;
                  // Sync with parent (pass both unlockedTips and credits)
                  if (typeof onUnlockedTipsUpdate === 'function') {
                    onUnlockedTipsUpdate(newUnlockedTips, newCredits);
                  }
                  userData.unlockedTips = newUnlockedTips;
                  userData.credits = newCredits;
                  setCredits(newCredits);
                } catch (err: any) {
                  Alert.alert('Error', err.message || 'Failed to unlock tip');
                  console.log('[Supabase] Unlock error:', err.message);
                } finally {
                  setLoadingUnlock(false);
                }
              }} 
              style={{ 
                borderRadius: 7, 
                paddingHorizontal: 22, 
                paddingVertical: 12.5, 
                marginTop: 8, 
                backgroundColor: colors.primary, 
                width: '100%' ,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name="lock-open" size={22} color={colors.background} style={{}} />
              <Text
                style={{
                  color: isDarkColorScheme ? '#000' : '#FFF',
                  fontFamily: 'UberMove-Bold',
                  fontSize: 17, marginLeft: 15
                }}
              >
                { loadingUnlock ? 'Unlocking...' : 'Unlock'}
              </Text>
            </Button>


<Text style={{ color: colors.text, fontFamily: 'UberMove-Bold', fontSize: 16, textAlign: 'center', marginBottom: 8 ,opacity: 0.8, marginTop: 20 }}>
              Lollipops Left: <Text style={{ color: colors.primary }}>{credits}</Text>
            </Text>


            </View>




          </View>
        : <FundamentalTabContent tip={tip} />
      }
      

     
    </SafeAreaView>
  );
}
