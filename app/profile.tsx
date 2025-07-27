// Hide main top bar when profile is active
export const options = {
  headerShown: false,
  tabBarStyle: { display: 'none' },
};
import * as React from 'react';
import { View, Image, ScrollView, Dimensions, Alert, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from '~/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { timeAgo, mockNewsData } from './mockNewsData';
import { supabase } from '~/lib/supabase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { cn } from '~/lib/utils';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
const width = Dimensions.get('window').width;
const Tab = createMaterialTopTabNavigator();

import { Button } from '~/components/ui/button';
import TradingView from './TradingView';
import { FontAwesome, Feather, AntDesign, Ionicons, SimpleLineIcons, Zocial } from '@expo/vector-icons';
import CircularProgress  from 'react-native-circular-progress-indicator';

interface NewsTabProps {
  name: string;
  theme?: string;
}

function NewsTab({ name, theme }: NewsTabProps) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [userTips, setUserTips] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!name) return;
    setLoading(true);
    // Fetch tips for this user from Supabase
    (async () => {
      try {
        const { data, error } = await supabase
          .from('investment_tips')
          .select('*')
          .eq('name', name)
          .order('created_at', { ascending: false });
        if (error) {
          console.log('Supabase error:', error.message);
          setUserTips([]);
        } else {
          setUserTips(data || []);
        }
      } catch (err) {
        console.log('Fetch error:', err);
        setUserTips([]);
      }
      setLoading(false);
    })();
  }, [name]);

  // Helper to format timestamp as date string
  function getTime(ts: string) {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  function getDate(ts: string) {
    const d = new Date(ts);
    const day = d.getDate();
    const month = d.toLocaleString('en-IN', { month: 'short' });
    const year = String(d.getFullYear()).slice(-2); // '25'
    return `${day} ${month} '${year}`;
  }

  // Define column widths for the table (now 17 columns)
  const MIN_COLUMN_WIDTHS = [100, 90, 120, 80, 90, 110, 110, 110, 110, 110, 110, 110, 110, 110, 110, 110, 110];

  const columnWidths = React.useMemo(() => {
    return MIN_COLUMN_WIDTHS.map((minWidth) => {
      const evenWidth = width / MIN_COLUMN_WIDTHS.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
          <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 16, marginBottom: 10 }}>Loading tips...</Text>
        </View>
      ) : (
        <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
          <Table aria-labelledby='news-table'>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: columnWidths[0] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Time</Text></TableHead>
                <TableHead style={{ width: columnWidths[1] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Symbol</Text></TableHead>
                <TableHead style={{ width: columnWidths[2] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Performance</Text></TableHead>
                <TableHead style={{ width: columnWidths[3] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Tip</Text></TableHead>
                <TableHead style={{ width: columnWidths[4] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Win Rate %</Text></TableHead>
                <TableHead style={{ width: columnWidths[5] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Conviction</Text></TableHead>
                <TableHead style={{ width: columnWidths[6] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Holding</Text></TableHead>
                <TableHead style={{ width: columnWidths[7] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Risk</Text></TableHead>
                <TableHead style={{ width: columnWidths[8] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Entry Price</Text></TableHead>
                <TableHead style={{ width: columnWidths[9] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Stop Loss</Text></TableHead>
                <TableHead style={{ width: columnWidths[10] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Holding</Text></TableHead>
                <TableHead style={{ width: columnWidths[11] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Allocation</Text></TableHead>
                <TableHead style={{ width: columnWidths[12] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Catalyst</Text></TableHead>
                <TableHead style={{ width: columnWidths[13] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Valuation</Text></TableHead>
                <TableHead style={{ width: columnWidths[14] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Sentiment</Text></TableHead>
                <TableHead style={{ width: columnWidths[15] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Technical</Text></TableHead>
                <TableHead style={{ width: columnWidths[16] }}><Text style={{ fontFamily: 'UberMove-Bold' }}>Sector</Text></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <FlashList
                data={userTips}
                estimatedItemSize={45}
                contentContainerStyle={{
                  paddingBottom: insets.bottom,
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: news, index }) => {
                  // Demo data for new columns
                  const winRate = 65 + (index % 20); // 65% to 84%
                  const conviction = ['High', 'Medium', 'Low'][index % 3];
                  const holding = ['1D', '1W', 'Swing', 'Long-Term'][index % 4];
                  const risk = ['Low', 'Medium', 'High'][index % 3];
                  // Generate a score out of 100 for demo (e.g., 60-99)
                  const score = 60 + (index % 40);
                  return (
                    <TableRow
                      key={`${news.symbol}-${index}`}
                      className={cn('active:bg-secondary', index % 2 && 'bg-muted/40 ')}
                      style={{ height: 50 }}
                      onPress={() => navigation.navigate('TipCard', { tip: news })}
                    >
                      <TableCell style={{ width: columnWidths[0] }}>
                        <View>
                          <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 15 }}>{timeAgo(news.created_at)}</Text>
                        </View>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[1] }}>
                        <Text style={{ fontFamily: 'UberMove-Bold' }}>{news.symbol}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[2], height: 50, minWidth: 80, maxWidth: 120, padding: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50 }}>
                          <CircularProgress
                            value={score}
                            radius={18}
                            duration={1000}
                            activeStrokeColor={'#000'}
                            inActiveStrokeColor={'#eee'}
                            progressValueColor={'#000'}
                            progressValueStyle={{ fontWeight: 'bold', color: '#222' }}
                            progressValueFontSize={11}
                            titleFontSize={10}
                            titleColor={'black'}
                            titleStyle={{ fontWeight: '500' }}
                            maxValue={100}
                            circleBackgroundColor={'#fff'}
                          />
                        </View>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[3]/2, marginRight: columnWidths[3]/2 }}>
                        <Button
                          variant='ghost'
                          size='sm'
                          style={{ marginLeft: -10, }}
                          onPress={() => navigation.navigate('TipCard', { tip: news })}
                        >
                          <AntDesign name="eye" size={16} color="#222" style={{marginBottom:10 }}/>
                        </Button>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[4] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{winRate}%</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[5] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{conviction}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[6] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{holding}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[7] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{risk}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[8] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.entry_price}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[9] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.exit_price}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[10] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.target_duration}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[11] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.allocation}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[12] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.catalyst}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[13] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.valuation}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[14] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.sentiment}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[15] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.technical}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[16] }}>
                        <Text style={{ fontFamily: 'UberMove-Medium' }}>{news.sector}</Text>
                      </TableCell>
                    </TableRow>
                  );
                }}
                ListFooterComponent={() => (
                  <>
                    <TableFooter>
                      <TableRow>
                        <TableCell className='flex-1 justify-center'>
                          <Text className='text-foreground' style={{ fontFamily: 'UberMove-Bold' }}>Total</Text>
                        </TableCell>
                        <TableCell className='items-end pr-8'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onPress={() => {
                              Alert.alert(
                                'Total News',
                                `${userTips.length} investment tips from ${name}`
                              );
                            }}
                          >
                            <Text style={{ fontFamily: 'UberMove-Medium' }}>{userTips.length} tips</Text>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                    <View className='items-center py-3 ios:pb-0'>
                      <Text
                        nativeID='news-table'
                        className='items-center text-sm text-muted-foreground'
                        style={{ fontFamily: 'UberMove-Medium' }}
                      >
                        Investment tips shared by {name}.
                      </Text>
                    </View>
                  </>
                )}
              />
            </TableBody>
          </Table>
        </ScrollView>
      )}
    </View>
  );
    
}


export default function ProfileScreen() {
  const route = useRoute();
  const { name = '', avatar = '', theme = '' } = (route.params as { name?: string; avatar?: string; theme?: string }) || {};
  const { width, height } = useWindowDimensions();
  const headerHeight = height * 0.09;

  // Social button handler (replace with actual links if available)
  const handleSocial = (type: string) => {
    if (type === 'twitter') {
      // open twitter
    } else if (type === 'instagram') {
      // open instagram
    } else if (type === 'website') {
      // open website
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* News Table */}
      <NewsTab name={name} theme={theme} />
      <View style={{ flexDirection: 'row', alignItems: 'center', height: headerHeight, paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#000',
        position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#000', justifyContent: 'space-between', }}>
        <Image
          source={{ uri: avatar }}
          style={{ width: headerHeight * 0.5, height: headerHeight * 0.5, borderRadius: headerHeight * 0.3, marginRight: 10 }}
        />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 16, marginBottom: -2.4, color: '#FFF' }}>{name}</Text>
          <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 12, color: '#888' }}>
            {"566 Tips"}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => handleSocial('twitter')}
            style={{ marginHorizontal: 2, borderWidth: 1, borderColor: '#222', borderRadius: 100, width: 34, height: 34, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
          >
            <Feather name="mail" size={16} color="#222" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => handleSocial('twitter')}
            style={{ marginHorizontal: 2, borderWidth: 1, borderColor: '#222', borderRadius: 100, width: 34, height: 34, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
          >
            <FontAwesome6 name="x-twitter" size={16} color="#222" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => handleSocial('instagram')}
            style={{ marginHorizontal: 2, borderWidth: 1, borderColor: '#222', borderRadius: 100, width: 34, height: 34, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
          >
            <Feather name="instagram" size={18} color="#222" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => handleSocial('website')}
            style={{ marginHorizontal: 2, borderWidth: 1, borderColor: '#222', borderRadius: 100, width: 34, height: 34, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
          >
            <Zocial name="linkedin" size={16} color="#222" style={{ marginTop: -4 }} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => Alert.alert('Investment License', `${name} is a SEBI Registered Investment Advisor (RIA123456)\n\nLicense valid till 2027.`)}
            style={{ marginHorizontal: 2, borderWidth: 1, borderColor: '#222', borderRadius: 100, width: 34, height: 34, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
          >
            <Ionicons name="document-outline" size={18} color="#222" />
          </Button>
        </View>
      </View>
    </View>
  );
}
