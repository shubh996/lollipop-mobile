import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ActivityIndicator, Dimensions, Image, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '~/lib/supabase';
import { useTheme } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import TradingView from './TradingView';
import MenuBar from './MenuBar';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const usableHeight = height *0.9;
import { useColorScheme } from '~/lib/useColorScheme';
import { Button } from '~/components/ui/button';
import { timeAgo } from './mockNewsData';

// Type for navigation params
interface FilteredTipsParams {
  filterType: 'asset' | 'sector';
  filterName: string;
}

export default function FilteredTipsScreen() {

  const { isDarkColorScheme } = useColorScheme();


  const { colors } = useTheme();
  const route = useRoute<RouteProp<Record<string, FilteredTipsParams>, string>>();
  const { filterType, filterName } = route.params || {};
  console.log('Filter Type:', filterType, 'Filter Name:', filterName);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  console.log("tips==>", tips)




  
    const [page, setPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(true);
    
  

  
  
    const fetchTips = async (pageNum = 0) => {
      if (!filterType || !filterName) return;
      console.log('Fetching tips for page:', pageNum, 'with filter:', filterType, filterName);
      setLoading(true);
      const pageSize = 2;
      const from = pageNum * pageSize;
      const to = from + pageSize - 1;
      let query = supabase
        .from('investment_tips')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      if (filterType === 'asset') {
        query = query.eq('asset_type', filterName);
      } else if (filterType === 'sector') {
        query = query.eq('sector', filterName);
      }
      const { data, error, count } = await query;
      if (error) {
        console.error('Supabase error:', error);
      } else {
        if (pageNum === 0) {
          setTips(data);
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
    }, [filterType, filterName]);
  
    // Lazy load next page when user reaches last tip
    const handlePageSelected = React.useCallback((e: any) => {
      const idx = e.nativeEvent.position;
      if (hasMore && idx >= tips.length - 2 && !loading) {
        fetchTips(page + 1);
        setPage((p) => p + 1);
      }
    }, [hasMore, tips.length, loading, page]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        {/* <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 12 }}>
          {filterType === 'asset' ? 'Asset Class' : 'Sector'}: {filterName}
        </Text> */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : tips.length === 0 ? (
          <Text style={{ color: colors.text, fontSize: 16, marginTop: 40 }}>No tips found.</Text>
        ) : (
          
           <PagerView
                style={{ }}
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
                      backgroundColor:"red"
                    }}
                  >
                    
                    
                   
                    {/* Tip card and name button pinned to bottom, but button is half-overlapping the top of the tip card */}
                    <View style={{  position: 'absolute', left: 0, right: 0, bottom: height * 0.068, alignItems: 'center' }}>
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
                        onPress={() => navigation.navigate('Profile', { name: item?.name, avatar: item?.avatar })}
                      >
                        <Image
                          source={{ uri: item?.avatar }}
                          style={{ width: 25, height: 25, borderRadius: 14, marginRight: 8 }}
                        />
                        
                          <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={{ color: isDarkColorScheme ? '#FFF' : '#444', fontFamily: 'UberMove-Bold', fontSize: Math.max(13, width * 0.03) }}>
                              {item?.name}
                            </Text>
                            <Text style={{ color: '#64748b', marginTop: "-7.5%", fontFamily: 'UberMove-M', fontSize: Math.max(10, width * 0.023), textAlign: 'left' }}>
                              {timeAgo(item?.created_at)}
                            </Text>
                          </View>
          
                      </Button>
          
                      {/* Tip card with 4 outlined buttons at the bottom */}
                      <View style={{ width: width * 0.95 }}>
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
                          
                          }}
                        >
                          <Text style={{  fontFamily: 'UberMove-Bold', fontSize: Math.max(13, width * 0.034), textAlign: 'left' }}>
                            {item?.tip}
                          </Text>
                          {/* Four outlined buttons at the bottom of the tip card */}
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
                                        <Button variant="outline" size="sm" style={{
                                          borderColor: colors.border,
                                          borderWidth: 0.85,
                                         
                                          borderRadius: 100,
                                          height: 30,
                                          minWidth: 54,
                                          paddingHorizontal: 2,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          marginBottom: 0,
                                          opacity: 0.58,
                                        }}>
                                          <Text
                                            style={{  fontFamily: 'UberMove-Bold', fontSize: 11 }}
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
                                          fontSize: 10,
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
          
          
                  </View>
                ))}
              
          
          
                
              </PagerView>
        )}
      </View>
    </SafeAreaView>
  );
}
