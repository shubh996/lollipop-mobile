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


import RiskIcon from '../assets/icons/risk.svg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';


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
    
    { name: 'Forex', Icon: ForexIcon },
   
    { name: 'ETF', Icon: MutualFundsIcon },
    { name: 'Crypto', Icon: BitcoinIcon },
        { name: 'F&O', Icon: DerivativesIcon },
    { name: 'Indexes', Icon: IndexesIcon },
    { name: 'Bonds', Icon: BondsIcon },
    { name: 'Commodities', Icon: CommoditiesIcon },
  ],
  sectors: [
    { name: 'Technology', Icon: TechIcon },
    { name: 'Finance', Icon: FinanceIcon },
    { name: 'Healthcare', Icon: HealthcareIcon },
    { name: 'Energy', Icon: EnergyIcon },
    { name: 'Retail', Icon: RetailIcon },
    { name: 'Industrials', Icon: IndustrialsIcon },
    { name: 'Estate', Icon: RealEstateIcon },
    { name: 'Infrastructure', Icon: InfrastructureIcon },
  ],
  sentiments: [
    { name: 'Bullish', color: '#22c55e', Icon: "trending-up" },
    { name: 'Bearish', color: '#f87171', Icon: "trending-down" },
    { name: 'Neutral', color: '#EEE', Icon: "remove" },
    { name: 'Volatile', color: '#fbbf24', Icon: "swap-horizontal" },
    { name: 'Momentum', color: '#6366f1', Icon: "speedometer-outline" },
    { name: 'Growth', color: '#0ea5e9', Icon: "leaf-outline" },
    { name: 'Value', color: '#a855f7', Icon: "cash-outline" },
    { name: 'Income', color: '#eab308', Icon: "wallet-outline" },
    { name: 'Defensive', color: '#ef4444', Icon: "shield-outline" },
  ],
  risk: [
    { name: 'Low', Icon: 'dot-single' },
    { name: 'Medium', Icon: 'dots-two-vertical' },
    { name: 'High', Icon: 'dots-three-vertical' },
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
import RBSheet from 'react-native-raw-bottom-sheet';

// import TipCard from './TipCard';
// import { Modal } from 'react-native';

export default function SearchScreen() {


  console.log('[SearchScreen] Rendering SearchScreen');


  // Wallet and unlock state
  const [wallet, setWallet] = useState<any | null>(null);
  const [unlockingTip, setUnlockingTip] = useState<any | null>(null);
  const [unlockedTips, setUnlockedTips] = useState<string[]>([]);
  const unlockSheetRef = useRef<any>(null);
  const [loadingUnlock, setLoadingUnlock] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  console.log('020202002[SearchScreen] Rendering SearchScreen');

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

  // --- Filter Sheet State ---
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filterSheetRef = useRef<any>(null);
 

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

  // --- Lazy loading state ---
  const [visibleCount, setVisibleCount] = useState(25);
  const visibleTips = filteredTips.slice(0, visibleCount);

  // Reset visibleCount when filters change
  React.useEffect(() => {
    setVisibleCount(25);
  }, [filteredTips.length]);

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
    <View style={{ marginTop: 18, marginBottom: -15, marginHorizontal:5}}>
      
      
      <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{flexWrap: 'wrap', flexDirection: 'row',  gap: 8 }}>
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
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 10 }}>
        <View style={{  backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), 
        borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, 
        padding: 12.5, flexDirection: 'row', alignItems: 'center', }}>
          {item.Icon ? (
            <item.Icon width={18} height={18} fill={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text}/>
          ) : null}
        </View>
        <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11 }}>{toCamelCase(item.name)}</Text>
        </View>
      ))}
      {renderFilterCarousel('Sector', sectorTypes, selectedSector, (v) => setSelectedSector(selectedSector.includes(v) ? selectedSector.filter(x => x !== v) : [...selectedSector, v]), (item, selected) => (
                <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 10 }}>
        <View style={{  backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), 
        borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, 
        padding: 12.5, flexDirection: 'row', alignItems: 'center', }}>
          {item.Icon ? (
            <item.Icon width={18} height={18} fill={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text}/>
          ) : null}
        </View>
        <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11 }}>{toCamelCase(item.name)}</Text>
        </View>
      ))}
      {renderFilterCarousel('Sentiment', sentiments, selectedSentiment, (v) => setSelectedSentiment(selectedSentiment.includes(v) ? selectedSentiment.filter(x => x !== v) : [...selectedSentiment, v]), (item, selected) => {
        // Map sentiment to Ionicons filled icon
        let iconName: any = 'flash';
        switch (item.name.toLowerCase()) {
          case 'bullish': iconName = 'trending-up'; break;
          case 'bearish': iconName = 'trending-down'; break;
          case 'neutral': iconName = 'remove'; break;
          case 'volatile': iconName = 'swap-horizontal' ; break;
          case 'momentum': iconName = 'speedometer-outline'; break;
          case 'growth': iconName = 'leaf-outline'; break;
          case 'value': iconName = 'cash-outline'; break;
          case 'income': iconName = 'wallet-outline'; break;
          case 'defensive': iconName = 'shield-outline'; break;
        }
        return (
        

          <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 10 }}>
        <View style={{  backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), 
        borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, 
        padding: 12.5, flexDirection: 'row', alignItems: 'center', }}>
                      <Ionicons name={iconName} size={16} color={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text}  />

        </View>
        <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11 }}>{toCamelCase(item.name)}</Text>
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
         
          <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 10 }}>
        <View style={{  backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), 
        borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, 
        padding: 12.5, flexDirection: 'row', alignItems: 'center', }}>
            <Entypo name={dotIcon} size={14} color={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text}  />

        </View>
        <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11 }}>{toCamelCase(item.name)}</Text>
        </View>
          
        );
      })}
      {renderFilterCarousel('Expected Return', expectedReturnRanges, selectedExpectedReturn, (v) => setSelectedExpectedReturn(selectedExpectedReturn.includes(v) ? selectedExpectedReturn.filter(x => x !== v) : [...selectedExpectedReturn, v]), (item, selected) => (
        <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 18, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11 }}>{toCamelCase(item.label)}</Text>
        </View>
      ))}
    </View>
  );

  const Results =() => (
    <View style={{ marginTop: 5 }}>


<View style={{
  

  
  flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop:  10, marginBottom: 10, }}>
          {selectedAsset.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedAsset(selectedAsset.filter(x => x !== val))} style={{ marginBottom:3, backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color:isDarkColorScheme ? "#000" : '#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedSector.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedSector(selectedSector.filter(x => x !== val))} style={{ marginBottom:3, backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedAnalyst.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedAnalyst(selectedAnalyst.filter(x => x !== val))} style={{ marginBottom:3, backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedSentiment.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedSentiment(selectedSentiment.filter(x => x !== val))} style={{ marginBottom:3, backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedRisk.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedRisk(selectedRisk.filter(x => x !== val))} style={{ marginBottom:3, backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
          {selectedExpectedReturn.map((val) => (
            <TouchableOpacity key={val} onPress={() => setSelectedExpectedReturn(selectedExpectedReturn.filter(x => x !== val))} style={{ marginBottom:3, backgroundColor: isDarkColorScheme ? '#EEE' : '#222', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 4 }}><Text style={{ color: isDarkColorScheme ? "#000" :'#fff', fontSize: 12 }}>{val} ✕</Text></TouchableOpacity>
          ))}
        </View>



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
      
        
          
      {dataMode === 'live' && liveLoading ? (
        <Text style={{ color: colors.text, opacity: 0.7, fontSize: 14, marginTop: 20 }}>Loading live tips...</Text>
      ) : dataMode === 'live' && liveError ? (
        <Text style={{ color: '#f87171', fontSize: 14, marginTop: 20 }}>{liveError}</Text>
      ) : filteredTips.length === 0 ? (
        <Text style={{ color: colors.text, opacity: 0.7, fontSize: 13 }}>No results found.</Text>
      ) : (
        <>
          {visibleTips.map((tip, idx) => (
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
                    {isDarkColorScheme ? <LollipopIconWhite color={'#fff'} width={20} height={20} /> : <LollipopIcon color={colors.primary} width={20} height={20} />}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {/* Lazy loading trigger: show loader or button if more tips available */}
          {visibleCount < filteredTips.length && (
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center', padding: 12, marginTop: 10 }}
              onPress={() => setVisibleCount(c => c + 25)}
            >
              <Text style={{ color: colors.primary, fontFamily: 'UberMove-Bold', fontSize: 12.5 }}>Load more tips</Text>
            </TouchableOpacity>
          )}
        </>
      )}
 
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
          <SearchIcon width={22} height={22} fill={colors.text} />
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
            <BellIcon width={22} height={22} fill={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('User')}
            style={{ padding: 6, borderRadius: 20, marginRight: 2 }}
            activeOpacity={0.7}
            accessibilityLabel="Profile"
          >
            <FaceIcon width={22} height={22} fill={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- Main Render ---
  return (
    <SafeAreaView  style={{marginBottom:-50, flex: 1, backgroundColor: colors.background, }}>


  {/* <GoLiveBar /> */}

    <View  style={{ 

              position: 'absolute', top: height * 0.05, left: 0, right: 0, zIndex: 1000, paddingHorizontal: 12.5, paddingBottom: 12.5, paddingTop:16, backgroundColor: colors.background,
              borderBottomWidth: 1, borderColor: colors.border,
              
              
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  gap: 10 }}>
        {[
          { label: 'Asset', icon: assetTypes[0]?.Icon },
          { label: 'Sector', icon: sectorTypes[0]?.Icon },
          { label: 'Sentiment', icon: assetTypes[7]?.Icon },
          { label: 'Risk', icon: RiskIcon },
          { label: 'Return', icon: assetTypes[2]?.Icon },
        ].map((filter, idx) => (
          <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4 }} key={idx} >
          <TouchableOpacity
            key={filter.label}
            style={{
              backgroundColor: colors.background,
              borderRadius: 360,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 17.5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              
            }}
            activeOpacity={0.85}
            onPress={() => {
              setActiveFilter(filter.label);
              setFilterSheetVisible(true);
              filterSheetRef.current?.open?.();
            }}
          >
            {filter.icon ? <filter.icon width={18} height={18} fill={colors.text} /> : null}
          </TouchableOpacity>
          <Text style={{ color: isDarkColorScheme ? '#fff' : '#000', fontFamily: 'UberMove-Regular', fontSize: 11.3 }}>{filter.label}</Text>
        </View>
        ))}
      </View>


      { width > 900 
        ? (
          <View style={{ flex: 1, padding: 12.5, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            
            
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
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, padding:4.99}} contentContainerStyle={{ padding: 4, paddingTop: height * 0.1, gap: 10 }}>
            
           

      
            
            {/* <SearchAndFilter /> */}
            <Results />
            <View style={{ height: 20 }}></View>
          </ScrollView>
        )
      }

      {/* Filter Sheet (RBSheet) */}
      <RBSheet
        ref={filterSheetRef}
        height={height * 0.7}
        openDuration={250}
        customStyles={{
          container: {
            backgroundColor: isDarkColorScheme ? '#18181b' : '#fff',
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            padding: 4,
            
          },
        }}
        closeOnPressMask
      >
        <View style={{ width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 18 }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 2 }} />
        </View>
        <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 18, color: colors.primary, marginBottom: 18, textAlign: 'center' }}>
          Filters
        </Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{ width: '104%', marginLeft:"-2%" }}>
          {/* Accordion for all filter categories */}
          <Accordion type="single" collapsible value={activeFilter || undefined} onValueChange={setActiveFilter}>
            <AccordionItem style={{paddingVertical: 10, justifyContent:"space-between",}} value="Asset">
               <AccordionTrigger style={{ paddingHorizontal: 20, paddingVertical: 10,  height:55  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 15, color: colors.text, minWidth: 110, textAlign: 'left' }}>Asset</Text>
                  </View>
                </AccordionTrigger>
              <AccordionContent>
                {renderFilterCarousel('Asset', assetTypes, selectedAsset, (v) => setSelectedAsset(selectedAsset.includes(v) ? selectedAsset.filter(x => x !== v) : [...selectedAsset, v]), (item, selected) => (
                  <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 10 }}>
                    <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, padding: 17.5, flexDirection: 'row', alignItems: 'center' }}>
                      {item.Icon ? (
                        <item.Icon width={20} height={20} fill={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text}/>
                      ) : null}
                    </View>
                    <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11, marginBottom: 20 }}>{toCamelCase(item.name)}</Text>
                  </View>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem style={{paddingVertical: 10 }} value="Sector">
                <AccordionTrigger style={{ paddingHorizontal: 20, paddingVertical: 10,  height:55  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 15, color: colors.text, minWidth: 110, textAlign: 'left' }}>Sector</Text>
                  </View>
                </AccordionTrigger>
              <AccordionContent>
                {renderFilterCarousel('Sector', sectorTypes, selectedSector, (v) => setSelectedSector(selectedSector.includes(v) ? selectedSector.filter(x => x !== v) : [...selectedSector, v]), (item, selected) => (
                  <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 10 }}>
                    <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, padding: 17.5, flexDirection: 'row', alignItems: 'center' }}>
                      {item.Icon ? (
                        <item.Icon width={20} height={20} fill={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text}/>
                      ) : null}
                    </View>
                    <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11, marginBottom: 20 }}>{toCamelCase(item.name)}</Text>
                  </View>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem style={{paddingVertical: 10 }} value="Sentiment">
              <AccordionTrigger style={{ paddingHorizontal: 20, paddingVertical: 10,  height:55  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 15, color: colors.text, minWidth: 110, textAlign: 'left' }}>Sentiment</Text>
                  </View>
                </AccordionTrigger>
              <AccordionContent>
                {renderFilterCarousel('Sentiment', sentiments, selectedSentiment, (v) => setSelectedSentiment(selectedSentiment.includes(v) ? selectedSentiment.filter(x => x !== v) : [...selectedSentiment, v]), (item, selected) => {
                  let iconName = 'flash';
                  switch (item.name.toLowerCase()) {
                    case 'bullish': iconName = 'trending-up'; break;
                    case 'bearish': iconName = 'trending-down'; break;
                    case 'neutral': iconName = 'remove'; break;
                    case 'volatile': iconName = 'swap-horizontal' ; break;
                    case 'momentum': iconName = 'speedometer-outline'; break;
                    case 'growth': iconName = 'leaf-outline'; break;
                    case 'value': iconName = 'cash-outline'; break;
                    case 'income': iconName = 'wallet-outline'; break;
                    case 'defensive': iconName = 'shield-outline'; break;
                  }
                  return (
                    <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 10 }}>
                      <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, padding: 17.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={iconName} size={20} color={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text}/>
                      </View>
                      <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11, marginBottom: 20 }}>{toCamelCase(item.name)}</Text>
                    </View>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem style={{paddingVertical: 10 }} value="Risk">
             <AccordionTrigger style={{ paddingHorizontal: 20, paddingVertical: 10,  height:55  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 15, color: colors.text, minWidth: 110, textAlign: 'left' }}>Risk</Text>
                  </View>
                </AccordionTrigger>
              <AccordionContent>
                {renderFilterCarousel('Risk', riskTypes, selectedRisk, (v) => setSelectedRisk(selectedRisk.includes(v) ? selectedRisk.filter(x => x !== v) : [...selectedRisk, v]), (item, selected) => {
                  let dotIcon = 'dot-single';
                  const riskName = (item.name || '').toLowerCase();
                  if (riskName.includes('low')) dotIcon = 'dot-single';
                  else if (riskName.includes('medium')) dotIcon = 'dots-two-vertical';
                  else if (riskName.includes('high')) dotIcon = 'dots-three-vertical';
                  return (
                    <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 10 }}>
                      <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, padding: 17.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Entypo name={dotIcon} size={20} color={selected ? (isDarkColorScheme ? '#000' : '#fff') : colors.text}/>
                      </View>
                      <Text style={{ color: selected ? (isDarkColorScheme ? '#fff' : '#000') : colors.text, fontFamily: 'UberMove-Regular', fontSize: 11, marginBottom: 20 }}>{toCamelCase(item.name)}</Text>
                    </View>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem style={{paddingVertical: 10 }} value="Return">
              <AccordionTrigger style={{ paddingHorizontal: 20, paddingVertical: 10,  height:55  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 15, color: colors.text, minWidth: 110, textAlign: 'left' }}>Expected Return</Text>
                  </View>
                </AccordionTrigger>
              <AccordionContent>
                {renderFilterCarousel('Expected Return', expectedReturnRanges, selectedExpectedReturn, (v) => setSelectedExpectedReturn(selectedExpectedReturn.includes(v) ? selectedExpectedReturn.filter(x => x !== v) : [...selectedExpectedReturn, v]), (item, selected) => (
                  <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginRight: 0, marginBottom: 10 }}>
                    <View style={{ backgroundColor: selected ? isDarkColorScheme ? '#EEE' : colors.primary : (isDarkColorScheme ? '#18181b' : '#fff'), borderRadius: 260, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, padding: 17.5, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ color: selected ? (isDarkColorScheme ? '#000' : '#FFF') : colors.text, fontFamily: 'UberMove-Medium', fontSize: 12.5 }}>{item.label}</Text>
                    </View>
                  </View>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <View style={{ height: 40} }></View>
        </ScrollView>
      </RBSheet>


      
    
    </SafeAreaView>
  );
}