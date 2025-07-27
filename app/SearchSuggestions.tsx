import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, Platform } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SearchIcon from '../assets/icons/search.svg';
import { mockNewsData, timeAgo } from './mockNewsData';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from '~/components/ui/button';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import LollipopIcon from '../assets/icons/lollipop.svg';
import LollipopIconWhite  from "../assets/icons/lollipop-white.svg";

export default function SearchSuggestionsScreen({ navigation, route }: any) {
    const [wallet, setWallet] = useState<number>(0);
    const [userData, setUserData] = useState<any>({});

  const { colors } = useTheme();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const [search, setSearch] = useState(route?.params?.search || '');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const unlockSheetRef = React.useRef<any>(null);
  const [liveTips, setLiveTips] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
    const [unlockingTip, setUnlockingTip] = useState<any | null>(null);
    const [unlockedTips, setUnlockedTips] = useState<any[]>([]);
    // Fetch latest user data from Supabase on mount and when fetchUserKey changes
    React.useEffect(() => {
      async function fetchUserData() {
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionUser = sessionData?.session?.user;
        if (!sessionUser) return;
        const { data: userData } = await supabase
          .from('users')
          .select('id, credits, unlockedTips')
          .eq('id', sessionUser.id)
          .single();
        if (userData) {
          setUserData(userData);
          setWallet(userData.credits ?? 0);
          setUnlockedTips(Array.isArray(userData.unlockedTips) ? userData.unlockedTips : []);
        }
      }
      fetchUserData();
    }, [route?.params?.fetchUserKey]);
    const userId = route?.params?.userId || null;

    console.log('SearchSuggestionsScreen params:', route.params);

  const [loadingUnlock, setLoadingUnlock] = useState(false);

  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;

  // Fetch live tips from Supabase when mode is 'live'
  React.useEffect(() => {
    setLiveLoading(true);
    setLiveError(null);
    supabase
      .from('investment_tips')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          setLiveError('Failed to fetch live tips.');
          setLiveTips([]);
        } else {
          setLiveTips(data || []);
        }
      })
      .catch(() => {
        setLiveError('Failed to fetch live tips.');
        setLiveTips([]);
      })
      .finally(() => setLiveLoading(false));
  }, []);
  // --- Suggestion logic (copied from search.tsx) ---
  const categories = [
    { name: 'Derivatives', Icon: require('../assets/icons/Derivatives.svg').default },
    { name: 'Indexes', Icon: require('../assets/icons/indexes.svg').default },
    { name: 'Bonds', Icon: require('../assets/icons/bonds.svg').default },
    { name: 'Commodities', Icon: require('../assets/icons/commodities.svg').default },
    { name: 'Forex', Icon: require('../assets/icons/forex.svg').default },
    { name: 'Equity', Icon: require('../assets/icons/equity.svg').default },
    { name: 'Mutual Funds', Icon: require('../assets/icons/mutual-funds.svg').default },
    { name: 'Crypto', Icon: require('../assets/icons/bitcoin.svg').default },
  ];
  const sectorOptions = [
    { name: 'Technology', Icon: require('../assets/icons/tech.svg').default },
    { name: 'Financials', Icon: require('../assets/icons/Financials.svg').default },
    { name: 'Healthcare', Icon: require('../assets/icons/Healthcare.svg').default },
    { name: 'Energy', Icon: require('../assets/icons/Energy.svg').default },
    { name: 'Retail', Icon: require('../assets/icons/Consumer-staples.svg').default },
    { name: 'Industrials', Icon: require('../assets/icons/Industrials.svg').default },
    { name: 'Real Estate', Icon: require('../assets/icons/Real-Estate.svg').default },
    { name: 'Infrastructure', Icon: require('../assets/icons/Infrastructure.svg').default },
  ];
  // Categorize tips by asset_type (asset class), and collect sector(s) for each group
  const suggestions = useMemo(() => {
    if (!search) return [];
    const lower = search.toLowerCase();
    const tips = liveTips;
    const inTips = tips.filter(tip => {
      return (
        (tip.tip && tip.tip.toLowerCase().includes(lower)) ||
        (tip.strategy && tip.strategy.toLowerCase().includes(lower)) ||
        (tip.asset_type && tip.asset_type.toLowerCase().includes(lower)) ||
        (tip.sector && tip.sector.toLowerCase().includes(lower)) ||
        (tip.name && tip.name.toLowerCase().includes(lower)) ||
        (tip.symbol && tip.symbol.toLowerCase().includes(lower)) ||
        (tip?.company_name && tip?.company_name.toLowerCase().includes(lower))
      );
    });
    if (!inTips.length) return [];
    // Group by asset_type, collect unique sectors for each group
    const grouped: { [key: string]: { data: any[], sectors: Set<string> } } = {};
    inTips.forEach(tip => {
      const key = tip.asset_type || 'Other';
      if (!grouped[key]) grouped[key] = { data: [], sectors: new Set() };
      grouped[key].data.push(tip);
      if (tip.sector) grouped[key].sectors.add(tip.sector);
    });
    // Convert to array of { label, sector, data }
    return Object.entries(grouped).map(([label, { data, sectors }]) => {
      let sectorLabel = '—';
      if (sectors.size === 1) sectorLabel = Array.from(sectors)[0];
      else if (sectors.size > 1) sectorLabel = Array.from(sectors).join(', ');
      return { label, sector: sectorLabel, data };
    });
  }, [search, liveTips]);


  useFocusEffect(
      React.useCallback(() => {
        let isActive = true;
        async function fetchUserData() {
          const { data: sessionData } = await supabase.auth.getSession();
          const sessionUser = sessionData?.session?.user;
          if (!sessionUser) return;
          const { data: userData } = await supabase
            .from('users')
            .select('id, credits, unlockedTips')
            .eq('id', sessionUser.id)
            .single();
          if (userData && isActive) {
            setUserData(userData);
            setWallet(userData.credits ?? 25);
            setUnlockedTips(Array.isArray(userData.unlockedTips) ? userData.unlockedTips : []);
            setUserId(userData.id);
          }
        }
        fetchUserData();
        return () => {
          isActive = false;
        };
      }, [])
    );


  const handleUnlockTip = async () => {
      // If not logged in, redirect to login
      if (!userId) {
        console.log('[UnlockTip] User not logged in, redirecting to login screen');
        navigation.navigate('User');
        unlockSheetRef.current?.close?.();
        return;
      }
      console.log('[UnlockTip] Tip ID:', unlockingTip?.id);
      console.log('[UnlockTip] User ID:', userId);
  
      console.log('[UnlockTip] Handler invoked');
      if (!unlockingTip || !userId) {
        console.log('[UnlockTip] No tip to unlock or user not identified');
        return;
      }
      if (wallet <= 0) {
        console.log('[UnlockTip] Insufficient Lollipops to unlock tip');
        Alert.alert('You’ve run out of Lollipops. Earn more or upgrade your plan.');
        unlockSheetRef.current?.close?.();
        return;
      }
      console.log('[UnlockTip] Proceeding to unlock tip');
      setLoadingUnlock(true);
  
      // Deduct credit and persist unlock in Supabase
      const { error: creditError } = await supabase
        .from('users')
        .update({ credits: wallet - 1 })
        .eq('id', userId);
      if (creditError) {
        console.log('[UnlockTip] Error deducting credit:', creditError);
        Alert.alert('Error', 'Failed to deduct credit.');
        setLoadingUnlock(false);
        return;
      }
      console.log('[UnlockTip] Credit deducted, new wallet balance:', wallet - 1);
      setWallet(wallet - 1);
  
      // Add tip id to user's unlockedTips field (array of ids) only if not already present
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('unlockedTips')
        .eq('id', userId)
        .single();
      if (userError) {
        console.log('[UnlockTip] Error fetching user unlockedTips:', userError);
        setLoadingUnlock(false);
        return;
      }
      console.log('[UnlockTip] Current user unlockedTips:', userData?.unlockedTips);
      let newunlockedTips = [];
      if (userData?.unlockedTips && Array.isArray(userData.unlockedTips)) {
        // Only add if not already present
        if (!userData.unlockedTips.includes(String(unlockingTip.id))) {
          newunlockedTips = [...userData.unlockedTips.map(String), String(unlockingTip.id)];
        } else {
          newunlockedTips = [...userData.unlockedTips.map(String)];
        }
      } else {
        newunlockedTips = [String(unlockingTip.id)];
      }
  
      console.log('[UnlockTip] New unlockedTips to update:', newunlockedTips);
  
      // Only update Supabase if tip id is not already present
      if (!userData?.unlockedTips?.includes(String(unlockingTip.id))) {
        try {
          const { data, error } = await supabase
            .from('users')
            .update({ unlockedTips: newunlockedTips })
            .eq('id', userId)
            .select(); // optional: returns updated record
  
          if (error) {
            console.error('[UnlockTip] Error updating user unlockedTips:', error.message);
          } else {
            console.log('[UnlockTip] User unlockedTips updated successfully:', data);
          }
        } catch (err) {
          console.error('[UnlockTip] Unexpected error:', err);
        }
      } else {
        console.log('[UnlockTip] Tip already unlocked, not updating unlockedTips.');
      }
  
      setLoadingUnlock(false);
      unlockSheetRef.current?.close?.();


       setUnlockedTips(newunlockedTips);
        // Notify parent (search.tsx) if callback provided
        if (route?.params?.onUnlockedTipsUpdate) {
          route.params.onUnlockedTipsUpdate(newunlockedTips, wallet - 1);
        }
     
      // After unlocking, navigate to TipCard
      if (unlockingTip) {
        console.log('[UnlockTip] Navigating to TipCard for tip:', unlockingTip);
        navigation.navigate('TipCard', { tip: unlockingTip });
      }
      console.log('[UnlockTip] Handler completed');
    };


    // Helper: check if tip is paywalled (less than 24h old)
  function isPaywalled(tip: any) {
    if (!tip?.created_at) return false;
    const now = new Date();
    const created = new Date(tip.created_at);
    return (now.getTime() - created.getTime()) < 24 * 60 * 60 * 1000;
  }

    function isUnlocked(tip: any) {
    // Return true if tip.id is present in unlockedTips array
    const found = unlockedTips.includes(tip.id);
    // Debug log
    console.log('unlockedTips:', unlockedTips);
    console.log(`Checking if tip ${tip.id} is unlocked...`, found);
    return found;
  }


  // --- Filter carousels ---
  // Helper to convert string to camel case
  const toCamelCase = (str: string) => {
    if (!str) return '';
    return str
      .replace(/(?:^|\s|_|-)([a-z])/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/\s+/g, '');
  };



  return (
    <SafeAreaView edges={['left', 'right', 'bottom', 'top']}  style={{ flex: 1,}}>
      {/* Pinned Search Bar at top of overlay */}
      <View style={{ marginTop:  0,  zIndex: 51, padding: 12, paddingBottom: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: colors.border, borderWidth:1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 }}>
          <SearchIcon width={23.5} height={23.5} fill={isDarkColorScheme ? '#888' : '#888'} style={{ marginRight: 7 }} />
          <TextInput
            style={{ flex: 1, fontSize: 16, color: colors.text, fontFamily: 'UberMove-Medium', backgroundColor: 'transparent', paddingVertical: 4 }}
            placeholder="Search assets, sectors, tips, analysis..."
            placeholderTextColor={isDarkColorScheme ? '#888' : '#888'}
            value={search}
            onChangeText={t => { setSearch(t); setShowSuggestions(!!t); }}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            autoFocus
          />
          <TouchableOpacity
            onPress={() => { setSearch(''); setShowSuggestions(false); navigation.goBack(); }}
            style={{ marginLeft: 8, padding: 4 }}
            accessibilityLabel="Cancel search"
          >
            <Text style={{ color: colors.text, fontSize: 15, fontFamily: 'UberMove-Bold' }}><Ionicons name="close" size={20} color={isDarkColorScheme?'silver':'#222'} /></Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Tips header only */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 2, gap: 10, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 14, fontFamily: 'UberMove-Bold', color: colors.text }}>Tips</Text>
      </View>
      
      {/* Suggestions List below pinned search bar */}
      {liveLoading ? (
        <Text style={{ color: colors.text, opacity: 0.7, fontSize: 15, textAlign: 'center', marginTop: 40 }}>Loading live tips...</Text>
      ) : liveError ? (
        <Text style={{ color: '#f87171', fontSize: 15, textAlign: 'center', marginTop: 40 }}>{liveError}</Text>
      ) : suggestions.length === 0 && search ? (
        <Text style={{ color: colors.text, opacity: 0.7, fontSize: 15, textAlign: 'center', marginTop: 40 }}>No tips found.</Text>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1, marginTop: 12, paddingHorizontal: 16 }}>
          {suggestions.map((group, idx) => (
            <View key={group.label} style={{ marginBottom: 18 }}>
              <Text style={{ fontSize: 13, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 6 }}>
                {group.label}
                {group.sector && (
                  <Text style={{ fontSize: 13, fontFamily: 'UberMove-Medium', color: colors.text, opacity: 0.7 }}>  •  {group.sector}</Text>
                )}
              </Text>
              {group.data.map((item: any, i: number) => {
                // Always show the tip text only
                const displayText = item.tip;
                let timestamp = '';
                if (item.created_at) {
                  timestamp = timeAgo ? timeAgo(item.created_at) : item.created_at;
                }
                return (
                  <TouchableOpacity
                    key={item?.id || idx}
                    activeOpacity={0.92}
                    onPress={() => {
                      navigation.navigate('TipCard', {
                        tip: item,
                        userData: { ...userData, unlockedTips, credits: wallet },
                        onUnlockedTipsUpdate: (tips: string[], newWallet?: number) => {
                          setUnlockedTips(tips);
                          if (typeof newWallet === 'number') setWallet(newWallet);
                          if (route?.params?.onUnlockedTipsUpdate) {
                            route.params.onUnlockedTipsUpdate(tips, newWallet);
                          }
                        }
                      });
                    }}
                    style={{ margin: -2.5 }}
                  >
                    {/* Card content */}
                    <View style={{ width: '100%', paddingBottom: 12.5, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginTop: 10, marginBottom: 10, position: 'relative' }}>
                      <View style={{ paddingHorizontal: 10, paddingVertical: 7.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Profile', { name: item?.name, avatar: item?.avatar })}
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <Image source={{ uri: item?.avatar }} style={{ width: 25, height: 25, borderRadius: 14, marginRight: 8 }} />
                          <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 12, color: colors.text }}>{item?.name}</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#64748b', fontFamily: 'UberMove-Medium', fontSize: 12, minWidth: 80, textAlign: 'right' }}>{timeAgo ? timeAgo(item?.created_at) : item?.created_at}</Text>
                      </View>
                      <Text  numberOfLines={2} style={{ color: colors.text, fontFamily: 'UberMove-Medium', fontSize: 14, textAlign: 'left', opacity: 0.8, padding: 10 }}>
                        {item?.tip || 'No data available'}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 1.5 }}>
                        <Text style={{ marginLeft: 0, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 11.25 }}>{item?.symbol}</Text>
                        <Text style={{ marginLeft: 6, color: '#444', fontFamily: 'UberMove-Bold', fontSize: 13 }}>·</Text>
                        <Text style={{ marginLeft: 6, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 12 }}>{item?.asset_type}</Text>
                        <Text style={{ marginLeft: 6, color: '#444', fontFamily: 'UberMove-Bold', fontSize: 13 }}>·</Text>
                        <Text style={{ marginLeft: 6, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 12 }}>{item?.sector}</Text>
                      </View>
                      {/* Lollipop icon at right bottom for paywalled and not unlocked tips */}
                      {isPaywalled(item) && !isUnlocked(item) && (
                        <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                          {isDarkColorScheme
                            ? <LollipopIconWhite color={'#fff'} width={32} height={32} />
                            : <LollipopIcon color={colors.primary} width={32} height={32} />
                          }
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}
      
    </SafeAreaView>
  );
}
