import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ActivityIndicator, Image, Dimensions, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '~/lib/supabase';
import { useTheme } from '@react-navigation/native';
import { Button } from '~/components/ui/button';
import { useColorScheme } from '~/lib/useColorScheme';
import { timeAgo } from './mockNewsData';
import { useNavigation } from '@react-navigation/native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

// Type for navigation params
interface FilteredTipsParams {
  filterType: 'asset' | 'sector';
  filterName: string;
}

export default function FilteredTipsScreen() {


const navigation = useNavigation();


  const { colors } = useTheme();
  const { isDarkColorScheme } = useColorScheme();
  const route = useRoute<RouteProp<Record<string, FilteredTipsParams>, string>>();
  const { filterType, filterName } = route.params || {};
  console.log('Filter Type:', filterType, 'Filter Name:', filterName);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filterType || !filterName) return;
    console.log('Fetching tips for:', filterType, filterName);
    setLoading(true);
    let query = supabase.from('investment_tips').select('*').order('created_at', { ascending: false });
    
    
    if (filterType === 'asset') {
      query = query.eq('asset_type', filterName);
    } else if (filterType === 'sector') {
      query = query.eq('sector', filterName);
    }
    
    console.log('Query:', query);
    query.then(({ data, error }) => {
      console.log('Received data:', data);
      if (error) {
        console.log('Error:', error);
        setTips([]);
      } else {
        console.log('Setting tips:', data);
        setTips(data || []);
      }
      setLoading(false);
    });


  }, [filterType, filterName]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        <Text style={{ backgroundColor: isDarkColorScheme ? '#121212' : '#EEE', height:height*0.06,margin:-15,padding:15,
             fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 12, textAlign:"center" }}>
           {filterName}
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : tips.length === 0 ? (
          <Text style={{ color: colors.text, fontSize: 16, marginTop: 40 }}>No tips found.</Text>
        ) : (
          <FlatList
            data={tips}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
          <View style={{ width:"90%", marginLeft:width * 0.05, marginVertical:10, alignItems: 'center', justifyContent: 'center', flexDirection:"column" }}>
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
                  <Text style={{ color: isDarkColorScheme ? '#FFF' : '#444', fontFamily: 'UberMove-Bold', fontSize: 13 }}>
                    {item?.name}
                  </Text>
                  <Text style={{ color: '#64748b', marginTop: "0%", fontFamily: 'UberMove-M', fontSize: 10, textAlign: 'left' }}>
                    {timeAgo(item?.created_at)}
                  </Text>
                </View>

            </Button>

            {/* Tip card with 4 outlined buttons at the bottom */}
            <View style={{ width: width * 0.9 }}>
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
                  paddingBottom: 20,
                  paddingTop: 30,
                
                }}
              >
                <Text style={{  fontFamily: 'UberMove-Bold', fontSize: 13, textAlign: 'left' }}>
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
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
