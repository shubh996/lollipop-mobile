import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import { supabase } from '~/lib/supabase';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

import LollipopIcon from '../assets/icons/lollipop.svg';
import LollipopIconWhite  from "../assets/icons/lollipop-white.svg";

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '~/lib/constants';
import {
  useTheme,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import { useColorScheme } from '~/lib/useColorScheme';



// Import SVG icons
import DerivativesIcon from '../assets/icons/Derivatives.svg';
import IndexesIcon from '../assets/icons/indexes.svg';
import BondsIcon from '../assets/icons/bonds.svg';
import ForexIcon from '../assets/icons/forex.svg';
import EquityIcon from '../assets/icons/equity.svg';
import MutualFundsIcon from '../assets/icons/mutual-funds.svg';
import CommoditiesIcon from '../assets/icons/commodities.svg';
import BitcoinIcon from '../assets/icons/bitcoin.svg';
import LiveIcon from '../assets/icons/live.svg';
// Sector SVG icons
import TechIcon from '../assets/icons/tech.svg';
import FinanceIcon from '../assets/icons/Financials.svg';
import HealthcareIcon from '../assets/icons/Healthcare.svg';
import EnergyIcon from '../assets/icons/Energy.svg';
import IndustrialsIcon from '../assets/icons/Industrials.svg';
import RealEstateIcon from '../assets/icons/Real-Estate.svg';
import FlashIcon from '../assets/icons/flash.svg';
import FaceIcon from '../assets/icons/face.svg';
import BellIcon from '../assets/icons/bell.svg';

import SunIcon from '../assets/icons/sun.svg';
import DarkIcon from '../assets/icons/dark.svg';

// NotificationScreen is now in its own file
import InfrastructureIcon from '../assets/icons/Infrastructure.svg';

import RetailIcon from '../assets/icons/Consumer-staples.svg';

// --- Master filter list ---
export const MASTER_FILTERS = {
  assets: [
 { name: 'Equity', Icon: EquityIcon },
    { name: 'Commodities', Icon: CommoditiesIcon },
    { name: 'Forex', Icon: ForexIcon },
   
    { name: 'Mutual Funds', Icon: MutualFundsIcon },
    { name: 'Crypto', Icon: BitcoinIcon },
        { name: 'Derivatives', Icon: DerivativesIcon },
    { name: 'Indexes', Icon: IndexesIcon },
    { name: 'Bonds', Icon: BondsIcon },
  ],
  sectors: [
    { name: 'Technology', Icon: TechIcon },
    { name: 'Financials', Icon: FinanceIcon },
    { name: 'Healthcare', Icon: HealthcareIcon },
    { name: 'Energy', Icon: EnergyIcon },
    { name: 'Retail', Icon: RetailIcon },
    { name: 'Industrials', Icon: IndustrialsIcon },
    { name: 'Real Estate', Icon: RealEstateIcon },
    { name: 'Infrastructure', Icon: InfrastructureIcon },
  ],
  sentiments: [
    { name: 'Bullish', color: '#22c55e', Icon: FlashIcon },
    { name: 'Bearish', color: '#f87171', Icon: FlashIcon },
    { name: 'Neutral', color: '#EEE', Icon: FlashIcon },
    { name: 'Volatile', color: '#fbbf24', Icon: FlashIcon },
    { name: 'Momentum', color: '#6366f1', Icon: FlashIcon },
    { name: 'Growth', color: '#0ea5e9', Icon: FlashIcon },
    { name: 'Value', color: '#a855f7', Icon: FlashIcon },
    { name: 'Income', color: '#eab308', Icon: FlashIcon },
    { name: 'Defensive', color: '#ef4444', Icon: FlashIcon },
  ],
  risk: [
    { name: 'Low', icon: 'dot-single' },
    { name: 'Medium', icon: 'dots-two-vertical' },
    { name: 'High', icon: 'dots-three-vertical' },
  ],
  expectedReturn: [
    { label: '0-10%', min: 0, max: 10, icon: 'trending-up' },
    { label: '10-20%', min: 10, max: 20, icon: 'trending-up' },
    { label: '20-30%', min: 20, max: 30, icon: 'trending-up' },
    { label: '30-40%', min: 30, max: 40, icon: 'trending-up' },
    { label: '40-50%', min: 40, max: 50, icon: 'trending-up' },
    { label: '50%+', min: 50, max: Infinity, icon: 'trending-up' },
  ],
};


import { useNavigation } from '@react-navigation/native';
import { mockNewsData, timeAgo } from './mockNewsData';
import { useTipsData } from '../lib/useDataStore';
import SearchIcon from "../assets/icons/search.svg";
import { Ionicons } from '@expo/vector-icons';
import { Button } from '~/components/ui/button';
import RBSheet from 'react-native-raw-bottom-sheet';
import LottieView from 'lottie-react-native';

// import TipCard from './TipCard';
// import { Modal } from 'react-native';

export default function SearchScreen() {
  // Wallet and unlock state
  const [wallet, setWallet] = useState<number>(25);
  const [unlockingTip, setUnlockingTip] = useState<any | null>(null);
  const [unlockedTips, setUnlockedTips] = useState<string[]>([]);
  const unlockSheetRef = useRef<any>(null);
  const [loadingUnlock, setLoadingUnlock] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Always reload user data from Supabase when screen is focused
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



    // Fetch unlockedTips from Supabase when userId changes
  React.useEffect(() => {
    async function getUserID() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log('[Supabase] Error fetching user ID:', error.message);
        return;
      }
      if (data.user) {
        setUserId(data.user.id);

        fetchUserData();
        
        console.log('[Supabase] User ID fetched:', data.user.id);
       
        
      } else {
        console.log('[Supabase] No user logged in');
      }
      
    }
    getUserID();



  }, [userId]);


  async function fetchUserData() {

    if (!userId) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.log('[Supabase] Error fetching user data:', error.message);
      return;
    }

    setUserData(data);
    setUnlockedTips(data?.unlockedTips || []);
    setWallet(data?.credits); // Default to 25 if wallet not set

    console.log('[Supabase] Unlocked tips loaded:', data?.unlockedTips);
    console.log('[Supabase] User data loaded:', data);

  }




  
  // Helper: check if tip is unlocked
  function isUnlocked(tip: any) {
    return unlockedTips.includes(tip.id);
  }
  
  // Unlock a tip and update unlockedTips in Supabase

  const { colors } = useTheme();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const navigation = useNavigation();
  const infoSheetRef = React.useRef<any>(null);
  const ResultSheetRef = React.useRef<any>(null);
  const aiSheetRef = React.useRef<any>(null);

  // --- State for search and filters ---
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string[]>([]);
  const [selectedAnalyst, setSelectedAnalyst] = useState<string[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<string[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<string[]>([]);
  // For expected return, store the label of the selected range
  const [selectedExpectedReturn, setSelectedExpectedReturn] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // TipCard modal state
  const [modalTip, setModalTip] = useState<any | null>(null);

  // Demo/Live toggle state
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('live');
  // Use central data store for live tips only
  const { tips: liveTips, loading: liveLoading, error: liveError, refresh: refreshLiveTips } = useTipsData();

  // --- Dynamic filter options from data source ---
  const tipsData = liveTips;
  // Helper: normalize string for matching (case-insensitive, trim)
  const normalize = (str: string) => (str || '').toLowerCase().replace(/\s+/g, '').trim();

  // --- Use master filter lists ---
  const assetTypes = MASTER_FILTERS.assets;
  const sectorTypes = MASTER_FILTERS.sectors;
  const sentiments = MASTER_FILTERS.sentiments;
  const riskTypes = MASTER_FILTERS.risk;
  const expectedReturnRanges = MASTER_FILTERS.expectedReturn;

 

  // --- Filtered tips based on selected filters and data mode ---
  const filteredTips = useMemo(() => {
    // Helper for robust string matching
    const matchString = (a: string | undefined, b: string | undefined) => {
      if (!a || !b) return false;
      return a.trim().toLowerCase() === b.trim().toLowerCase();
    };
    return tipsData.filter(tip => {
      // Parse expected_return as number (strip % and whitespace)
      let tipReturn = null;
      if (tip.expected_return) {
        const match = String(tip.expected_return).match(/([\d.]+)/);
        tipReturn = match ? parseFloat(match[1]) : null;
      }
      // Expected Return: at least one selected range must match
      let matchesExpectedReturn = true;
      if (selectedExpectedReturn.length > 0) {
        matchesExpectedReturn = selectedExpectedReturn.some(label => {
          const range = expectedReturnRanges.find(r => r.label === label);
          return range && tipReturn !== null && tipReturn >= range.min && tipReturn < range.max;
        });
      }
      return (
        (selectedAsset.length === 0 || selectedAsset.some(sel => matchString(sel, tip.asset_type))) &&
        (selectedSector.length === 0 || selectedSector.some(sel => matchString(sel, tip.sector))) &&
        (selectedAnalyst.length === 0 || selectedAnalyst.some(sel => matchString(sel, tip.name))) &&
        (selectedSentiment.length === 0 || (tip.strategy && selectedSentiment.some(sel => matchString(sel, tip.strategy)))) &&
        (selectedRisk.length === 0 || (tip.risk && selectedRisk.some(sel => matchString(sel, tip.risk)))) &&
        matchesExpectedReturn
      );
    });
  }, [tipsData, selectedAsset, selectedSector, selectedAnalyst, selectedSentiment, selectedRisk, selectedExpectedReturn]);

  // --- Handlers ---
  // Helper: check if tip is paywalled (less than 24h old)
  function isPaywalled(tip: any) {
    if (!tip?.created_at) return false;
    const now = new Date();
    const created = new Date(tip.created_at);
    return (now.getTime() - created.getTime()) < 24 * 60 * 60 * 1000;
  }


  // --- Filter carousels ---
  // Helper to convert string to camel case
  const toCamelCase = (str: string) => {
    if (!str) return '';
    return str
      .replace(/(?:^|\s|_|-)([a-z])/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/\s+/g, '');
  };

  const renderFilterCarousel = (label: string, data: any[], selected: string[], onSelect: (v: string) => void, renderItem: (item: any, selected: boolean) => React.ReactNode) => (
    <View style={{ marginBottom: 18, }}>
      <Text style={{marginLeft:10, fontSize: 13, fontFamily: 'UberMove-Bold', color: isDarkColorScheme ? "#A9A9A9": colors.text, marginBottom: 10 }}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 8 }}>
        {data.map((item, idx) => {
          // For expected return, use item.label for selection, else item.name
          const value = item.label || item.name;
          const isSelected = selected.includes(value);
          return (
            <TouchableOpacity
              key={value || item.tip || idx}
              style={{ marginRight: -10, marginLeft:10, }}
              activeOpacity={0.8}
              onPress={() => onSelect(value)}
            >
              {renderItem(item, isSelected)}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );


  const SearchAndFilter = () => (
    <View style={{ gap: 10, paddingHorizontal: 0, justifyContent: 'space-between', marginHorizontal:-10 }}>
      {renderFilterCarousel('Asset', assetTypes, selectedAsset, (v) => setSelectedAsset(selectedAsset.includes(v) ? selectedAsset.filter(x => x !== v) : [...selectedAsset, v]), (item, selected) => (
        <View style={{  backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 18, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', }}>
          {item.Icon ? (
            <item.Icon width={18} height={18} fill={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text} style={{ marginRight: 4 }} />
          ) : null}
          <Text style={{ color: selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text, fontFamily: 'UberMove-Bold', fontSize: 13 }}>{toCamelCase(item.name)}</Text>
        </View>
      ))}
      {renderFilterCarousel('Sector', sectorTypes, selectedSector, (v) => setSelectedSector(selectedSector.includes(v) ? selectedSector.filter(x => x !== v) : [...selectedSector, v]), (item, selected) => (
        <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 18, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {item.Icon ? (
            <item.Icon width={18} height={18} fill={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text} style={{ marginRight: 4 }} />
          ) : null}
          <Text style={{ color: selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text, fontFamily: 'UberMove-Bold', fontSize: 13 }}>{toCamelCase(item.name)}</Text>
        </View>
      ))}
      {renderFilterCarousel('Sentiment', sentiments, selectedSentiment, (v) => setSelectedSentiment(selectedSentiment.includes(v) ? selectedSentiment.filter(x => x !== v) : [...selectedSentiment, v]), (item, selected) => {
        // Map sentiment to Ionicons filled icon
        let iconName = 'flash';
        switch (item.name.toLowerCase()) {
          case 'bullish': iconName = 'trending-up'; break;
          case 'bearish': iconName = 'trending-down'; break;
          case 'neutral': iconName = 'remove'; break;
          case 'volatile': iconName = 'swap-horizontal'; break;
          case 'momentum': iconName = 'speedometer-outline'; break;
          case 'growth': iconName = 'leaf-outline'; break;
          case 'value': iconName = 'cash-outline'; break;
          case 'income': iconName = 'wallet-outline'; break;
          case 'defensive': iconName = 'shield-outline'; break;
        }
        return (
        <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 18, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name={iconName} size={16} color={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text} style={{ marginRight: 4 }} />
            <Text style={{ color: selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text, fontFamily: 'UberMove-Bold', fontSize: 13 }}>{toCamelCase(item.name)}</Text>
          </View>
        );
      })}
      {renderFilterCarousel('Risk Involved', riskTypes, selectedRisk, (v) => setSelectedRisk(selectedRisk.includes(v) ? selectedRisk.filter(x => x !== v) : [...selectedRisk, v]), (item, selected) => {
        let dotIcon = 'dot-single';
        const riskName = (item.name || '').toLowerCase();
        if (riskName.includes('low')) dotIcon = 'dot-single';
        else if (riskName.includes('medium')) dotIcon = 'dots-two-vertical';
        else if (riskName.includes('high')) dotIcon = 'dots-three-vertical';
        return (
          <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 18, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Entypo name={dotIcon} size={14} color={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text} style={{ marginRight: 4 }} />
            <Text style={{ color: selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text, fontFamily: 'UberMove-Bold', fontSize: 13 }}>{toCamelCase(item.name)}</Text>
          </View>
        );
      })}
      {renderFilterCarousel('Expected Return', expectedReturnRanges, selectedExpectedReturn, (v) => setSelectedExpectedReturn(selectedExpectedReturn.includes(v) ? selectedExpectedReturn.filter(x => x !== v) : [...selectedExpectedReturn, v]), (item, selected) => (
        <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 18, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text, fontFamily: 'UberMove-Bold', fontSize: 13 }}>{toCamelCase(item.label)}</Text>
        </View>
      ))}
    </View>
  );

  const Results =() => (
    <View style={{ marginTop: 0 }}>
      {/* Tips header and info button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 }}>
        <Text style={{ fontSize: 14, fontFamily: 'UberMove-Bold', color: colors.text }}>Tips</Text>
        <TouchableOpacity
          onPress={() => ResultSheetRef.current?.open?.()}
          style={{ marginLeft: -2, padding: 2, borderRadius: 16 }}
          accessibilityLabel="Info about results"
          activeOpacity={0.7}
        >
          <Ionicons name="information-circle-outline" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginLeft: 'auto', gap: 0 , opacity: 0.87, alignItems: 'center' }}>
          {liveLoading ? (
            <View style={{ padding: 6, borderRadius: 16, marginLeft: 2 }}>
              <ActivityIndicator
                color={colors.primary}
                style={{ width: 22, height: 22 }}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => { refreshLiveTips() }}
              style={{ padding: 6, borderRadius: 16, marginLeft: 2 }}
              accessibilityLabel="Refresh live tips"
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Active Filters Chips */}
   

            {/* Info Bottom Sheet for paywalled tips */}
      <RBSheet
        ref={ResultSheetRef}
        height={height * 0.48}
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
        {/* Closing line indicator */}
        <View style={{ width: '100%', alignItems: 'center', marginTop: -10, marginBottom: 18 }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: isDarkColorScheme ? '#333' : '#ccc', marginBottom: 2 }} />
        </View>
        
        
        
          
          <View style={{ width: '100%', flex:1,  flexDirection:"column",
            justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 18 }}>
            <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 18, color: colors.primary, marginBottom: 8, textAlign: 'center' }}>
              How to use Lollipops to unlock tips
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <MaterialIcons name="lock" size={32} color={colors.text} style={{ marginHorizontal: 6 }} />
              <Ionicons name="arrow-forward" size={28} color={colors.text} style={{ marginHorizontal: 2 }} />
              {isDarkColorScheme ? <LollipopIconWhite color={colors.primary} width={36} height={36} style={{ marginHorizontal: 6 }} /> : <LollipopIcon color={colors.primary} width={36} height={36} style={{ marginHorizontal: 6 }} />}
              <Ionicons name="arrow-forward" size={28} color={colors.text} style={{ marginHorizontal: 2 }} />
              <MaterialIcons name="lock-open" size={32} color={colors.primary} style={{ marginHorizontal: 6 }} />
            </View>
            <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 16, color: colors.text, opacity: 0.85, textAlign: 'center', marginBottom: 8 }}>
              <Text style={{ color: colors.primary }}>Locked tips</Text> show a lollipop icon. Tap the unlock button and 1 lollipop will be used to reveal the tip instantly.
            </Text>
            <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 15, color: colors.text, opacity: 0.8, textAlign: 'center', marginBottom: 8 }}>
              You can earn lollipops by engaging with the app or purchase them directly. Your available lollipops are shown in your wallet/profile.
            </Text>
            <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 15, color: colors.text, opacity: 0.8, textAlign: 'center', marginBottom: 8 }}>
              Once unlocked, tips remain accessible in your account forever.
            </Text>
          </View>
          
       

      </RBSheet>
      
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop:  5, marginBottom: 8, }}>
          {selectedAsset.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedAsset(selectedAsset.filter(x => x !== val))} style={{ backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color:isDarkColorScheme ? "#000" : '#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedSector.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedSector(selectedSector.filter(x => x !== val))} style={{ backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedAnalyst.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedAnalyst(selectedAnalyst.filter(x => x !== val))} style={{ backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedSentiment.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedSentiment(selectedSentiment.filter(x => x !== val))} style={{ backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedRisk.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedRisk(selectedRisk.filter(x => x !== val))} style={{ backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedExpectedReturn.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedExpectedReturn(selectedExpectedReturn.filter(x => x !== val))} style={{ backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
        </View>
          
      {dataMode === 'live' && liveLoading ? (
        <Text style={{ color: colors.text, opacity: 0.7, fontSize: 14, marginTop: 20 }}>Loading live tips...</Text>
      ) : dataMode === 'live' && liveError ? (
        <Text style={{ color: '#f87171', fontSize: 14, marginTop: 20 }}>{liveError}</Text>
      ) : filteredTips.length === 0 ? (
        <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>No results found.</Text>
      ) : (
        <>
          {filteredTips.map((tip, idx) => (
            <TouchableOpacity
              key={tip.id || idx}
              activeOpacity={0.92}
              onPress={() => {



                navigation.navigate('TipCard', { tip, userData,
               onUnlockedTipsUpdate: (newUnlockedTips: any[], newCredits?: number) => {
              setUnlockedTips(newUnlockedTips);
              setUserData({ ...(userData || {}), unlockedTips: newUnlockedTips, credits: newCredits ?? userData?.credits });
            },
                 });


                // // Open the unlock sheet instantly, then set the tip and let the sheet UI decide what to show
                // if (isPaywalled(tip) && !isUnlocked(tip)) {
                //   setUnlockingTip(tip);
                //   unlockSheetRef.current?.open?.();
                // } else {
                //   navigation.navigate('TipCard', { tip, userData });
                // }




              }}
              style={{ margin: -2.5 }}
            >
              {/* Disclaimer at top */}
              <View style={{ width: '100%', paddingBottom: 12.5, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginTop: 10, marginBottom: 10, position: 'relative' }}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 7.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Profile', { name: tip?.name, avatar: tip?.avatar })}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Image source={{ uri: tip.avatar }} style={{ width: 25, height: 25, borderRadius: 14, marginRight: 8 }} />
                    <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 12, color: colors.text }}>{tip.name}</Text>
                  </TouchableOpacity>
                  <Text style={{ color: '#64748b', fontFamily: 'UberMove-Medium', fontSize: 12, minWidth: 80, textAlign: 'right' }}>{timeAgo ? timeAgo(tip.created_at) : tip.created_at}</Text>
                </View>
                <Text  numberOfLines={2} style={{ color: colors.text, fontFamily: 'UberMove-Medium', fontSize: 14, textAlign: 'left', opacity: 0.8, padding: 10 }}>
                  {tip?.tip || 'No data available'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 1.5 }}>
                  <Text style={{ marginLeft: 0, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 11.25 }}>{tip.symbol}</Text>
                  <Text style={{ marginLeft: 6, color: '#444', fontFamily: 'UberMove-Bold', fontSize: 13 }}>·</Text>
                  <Text style={{ marginLeft: 6, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 12 }}>{tip.asset_type}</Text>
                  <Text style={{ marginLeft: 6, color: '#444', fontFamily: 'UberMove-Bold', fontSize: 13 }}>·</Text>
                  <Text style={{ marginLeft: 6, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 12 }}>{tip.sector}</Text>
                </View>
                {/* Show lollipop icon at right bottom if paywalled and not unlocked */}
                {isPaywalled(tip) && !isUnlocked(tip) && userData && (
                  <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                    {isDarkColorScheme ? <LollipopIconWhite color={'#fff'} width={28} height={28} /> : <LollipopIcon color={colors.primary} width={28} height={28} />}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
      {/* Unlock Tip RBSheet */}
      {/* <RBSheet
        ref={unlockSheetRef}
        height={height * 0.34}
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
        <View style={{ width: '100%', alignItems: 'center', marginTop: -10, marginBottom: 18 }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: isDarkColorScheme ? '#333' : '#ccc', marginBottom: 2 }} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
          <MaterialIcons name="lock-outline" color={colors.primary} size={38} style={{ marginBottom: 12 }} />
          <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 10, textAlign: 'center' }}>
            Unlock this tip using 1 Lollipop?
          </Text>
          <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 15, color: colors.text, opacity: 0.85, textAlign: 'center', marginBottom: 18 }}>
            Wallet Balance: {wallet} Lollipops
          </Text>
          <Button 
            size="lg" 
            onPress={() => {
              if (!userId) {
                navigation.navigate('User');
                return;
              }
              setLoadingUnlock(true);
              handleUnlockTip();
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
            {!isDarkColorScheme ? (
              <LollipopIconWhite color={'#fff'} width={21} height={21}  />
            ) : (
              <LollipopIcon color={colors.primary} width={21} height={21} />
            )}
            <Text 
              style={{ 
                color: isDarkColorScheme ? '#000' : '#FFF', 
                fontFamily: 'UberMove-Bold', 
                fontSize: 17 , marginLeft:15
              }}
            >
              {loadingUnlock ? 'Unlocking...' : 'Unlock'}
            </Text>
          </Button>
   
          {wallet === 0 && (
            <Text style={{ color: '#f87171', fontFamily: 'UberMove-Bold', fontSize: 15, marginTop: 18, textAlign: 'center' }}>
              You’ve run out of Lollipops. Earn more or upgrade your plan.
            </Text>
          )}
        </View>
      </RBSheet> */}
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => aiSheetRef.current?.open?.()}
              style={{ backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 10, marginBottom: 30 }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 16 }}>Ask AI</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {/* Ask AI Bottom Sheet */}
      <RBSheet
        ref={aiSheetRef}
        height={height * 0.38}
        openDuration={250}
        customStyles={{
          container: {
            backgroundColor: isDarkColorScheme ? '#18181b' : '#fff',
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            overflow: 'hidden',
          },
        }}
        closeOnDragDown
        closeOnPressMask
      >
        {/* Closing line indicator */}
        <View style={{ width: '100%', alignItems: 'center', marginTop: -10, marginBottom: 18 }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: isDarkColorScheme ? '#333' : '#ccc', marginBottom: 2 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 10, textAlign: 'center' }}>
            Ask AI about your search
          </Text>
          <Text style={{ fontSize: 15, color: colors.text, opacity: 0.85, textAlign: 'center', marginBottom: 18 }}>
            Get instant insights, explanations, or answers for your query.
          </Text>
          <TextInput
            style={{ width: '100%', borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, fontSize: 15, color: colors.text, backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', marginBottom: 18 }}
            placeholder="Type your question for AI..."
            placeholderTextColor={isDarkColorScheme ? '#888' : '#888'}
            value={search}
            editable={false}
          />
          <Button style={{ borderRadius: 16, paddingHorizontal: 22, paddingVertical: 10, marginTop: 8 }}>
            <Text style={{ color: isDarkColorScheme ? '#000' : '#fff', fontFamily: 'UberMove-Bold', fontSize: 15 }}>Submit to AI</Text>
          </Button>
        </View>
      </RBSheet>
        </View>
  )



  const GoLiveBar = () => {
    const navigation = useNavigation();
    // Theme toggle handler
    const handleToggleTheme = () => {
      setColorScheme(isDarkColorScheme ? 'light' : 'dark');
    };
    return (
      <View style={{ width: "100%", flexDirection: 'row', alignItems: 'flex-start', borderBottomWidth: 1, borderColor: colors.border, marginTop: width > 900 ? "1.5%" : Platform.OS === 'ios' ? "0%" : "2%", paddingBottom: 10, paddingHorizontal: 10, justifyContent: 'space-between',
        
       }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchSuggestionsScreen', {
            wallet,
            unlockedTips,
            userId,
            userData,
              onUnlockedTipsUpdate: (newUnlockedTips: any[], newCredits?: number) => {
              setUnlockedTips(newUnlockedTips);
              setUserData({ ...(userData || {}), unlockedTips: newUnlockedTips, credits: newCredits ?? userData?.credits });
            },
          })}
          style={{ padding: 6, borderRadius: 20, marginRight: 2 }}
          activeOpacity={1.0}
          accessibilityLabel="Search"
        >
          <SearchIcon size={22} fill={colors.text} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
       
          {/* Theme toggle icon */}
          <TouchableOpacity
            onPress={handleToggleTheme}
            style={{ padding: 6, borderRadius: 20, marginRight: 0}}
            activeOpacity={0.7}
            accessibilityLabel="Toggle theme"
          >
            {isDarkColorScheme ? (
              <DarkIcon width={21} height={21} fill={colors.text} />
            ) : (
              <SunIcon width={22} height={22} fill={colors.text} />
            )}
          </TouchableOpacity>
             <TouchableOpacity
            onPress={() => navigation.navigate('NotificationScreen')}
            style={{ padding: 6, borderRadius: 20, marginRight: 2 }}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <BellIcon name="bell" fill={colors.text} size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('User')}
            style={{ padding: 6, borderRadius: 20, marginRight: 2 }}
            activeOpacity={0.7}
            accessibilityLabel="Profile"
          >
            <FaceIcon name="user" fill={colors.text} size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- Main Render ---
  return (
    <SafeAreaView  style={{marginBottom:-50, flex: 1, backgroundColor: colors.background}}>


  {/* <GoLiveBar /> */}


      { width > 900 
        ? (
          <View style={{ flex: 1, padding: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            
            
            <View style={{ flex: 1, padding: 18 }}>
              <SearchAndFilter />
            </View>


            {/* Separator line */}
            <View style={{ width: 1.5, backgroundColor: isDarkColorScheme ? '#232323' : '#e5e7eb', alignSelf: 'stretch', marginHorizontal: 10 }} />
            
            
            <ScrollView showsVerticalScrollIndicator={false}  style={{ flex: 1.5, padding: 18   }} contentContainerStyle={{ padding: 4, paddingTop: -10, gap: 10 }}>
              <Results />
            </ScrollView>


          </View>
        )
        : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, padding: 8 }} contentContainerStyle={{ padding: 4, paddingTop: 10, gap: 10 }}>
            <SearchAndFilter />
            <Results />
            <View style={{ height: 20 }}></View>
          </ScrollView>
        )
      }








    




      {/* Immersive search suggestions moved to SearchSuggestions screen */}


      {/* Four-Tier Horizontal Scroll Filters and Results */}
      
    
    </SafeAreaView>
  );
}