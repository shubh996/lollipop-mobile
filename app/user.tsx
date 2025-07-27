import React, { useState, useEffect, useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Updates from 'expo-updates';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { supabase } from '~/lib/supabase';
import FaceIcon from '../assets/icons/face.svg';
import RBSheet from 'react-native-raw-bottom-sheet';

import LollipopIcon from '../assets/icons/lollipop.svg';
import LollipopIconWhite from '../assets/icons/lollipop-white.svg';


import type {
MaterialTopTabNavigationEventMap,
MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {

type ParamListBase,
type TabNavigationState,
} from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { Button } from '~/components/ui/button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
MaterialTopTabNavigationOptions,
typeof Navigator,
TabNavigationState<ParamListBase>,
MaterialTopTabNavigationEventMap
>(Navigator);

export default function UserScreen() {
  
  const sheetRef = useRef(null);
  const [sheetContent, setSheetContent] = useState<React.ReactNode>(null);
const [editingName, setEditingName] = useState(false);
const [newName, setNewName] = useState(user?.name || '');
  const navigation = require('expo-router').useNavigation();
  const { colors } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bookmarkTips, setBookmarkTips] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>();
  const [unlockedTipsTips, setunlockedTipsTips] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

      const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const handleWalletPress = () => {
    setSheetContent(
      <View style={{gap:10, flex: 1, justifyContent: 'space-between', paddingBottom: 0, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', margin:-5, }}>
        {/* Closing line indicator at top middle */}
        <View style={{ width: '100%', alignItems: 'center', marginTop: 0, marginBottom: 20 }}>
          <View
            style={{
              width: 44,
              height: 5,
              borderRadius: 3,
              backgroundColor: isDarkColorScheme ? '#333' : '#ccc',
              marginBottom: 2,
            }}
          />
        </View>
        <View>
          <Text style={{ fontSize: 22, fontFamily: 'UberMove-Bold', marginBottom: 10, color: colors.text }}>Lollipop's Wallet</Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: colors.text }}>You have <Text style={{ fontFamily: 'UberMove-Bold', color: colors.primary }}>{credits} Lollipops</Text>.</Text>
          <Text style={{ fontSize: 15, color: colors.text, marginBottom: 10 }}>
            1 Lollipop = 1 unlock. You can redeem Lollipops to unlock investment tips.
          </Text>
          <Text style={{ fontSize: 15, color: colors.text, marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', color: colors.primary }}>1 Lollipop = 1 INR</Text>
          </Text>

          <Text style={{ fontSize: 15, color: '#444', marginBottom: 10 }}>
            Tips are locked for 24 hours.
          </Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginVertical: 18, marginBottom:100 }}
          onPress={() => {
            const phone = '918939350442';
            const name = user?.name || 'No Name';
            const email = user?.email || 'No Email';
            const message = encodeURIComponent(
              `Hi, I would like to recharge 100 credits for my account.\nName: ${name}\nEmail: ${email}\nThank you!`
            );
            const url = `https://wa.me/${phone}?text=${message}`;
            // Use Linking to open WhatsApp
            const Linking = require('react-native').Linking;
            Linking.openURL(url).catch(() => {
              Alert.alert('Error', 'Unable to open WhatsApp.');
            });
          }}
        >
          <Text style={{ color: isDarkColorScheme ? '#18181b' : '#fff', fontFamily: 'UberMove-Bold', fontSize: 16 }}>Recharge Lollipops</Text>
        </TouchableOpacity>

        <View style={{ height: 100 , width: '100%', backgroundColor: isDarkColorScheme ? '#18181b' : '#fff'}}></View>
      </View>
    );
    if (sheetRef.current) sheetRef?.current?.open();
  };

  // Fetch wallet and unlockedTips tips from Supabase on mount and on user change
  useEffect(() => {
    async function fetchWalletAndunlockedTips() {
      if (!user?.id) return;
  // Fetch wallet credits, unlockedTips, and bookmarks field
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

    setUserData(userData);
  if (userData?.credits !== undefined) setCredits(userData.credits);
  // Fetch all tips whose id is in unlockedTips
  if (userData?.unlockedTips && Array.isArray(userData.unlockedTips) && userData.unlockedTips.length > 0) {
    const { data: tipsData } = await supabase
      .from('investment_tips')
      .select('*')
      .in('id', userData.unlockedTips);
    setunlockedTipsTips(tipsData || []);
    console.log('[UserScreen] unlockedTips tips loaded:', tipsData?.length || 0);
  } else {
    setunlockedTipsTips([]);
  }
  // Fetch all tips whose id is in bookmarks
  if (userData?.bookmarks && Array.isArray(userData.bookmarks) && userData.bookmarks.length > 0) {
    const { data: bmTipsData } = await supabase
      .from('investment_tips')
      .select('*')
      .in('id', userData.bookmarks);
    setBookmarkTips(bmTipsData || []);
    console.log('[UserScreen] Bookmark tips loaded:', bmTipsData?.length || 0);
  } else {
    setBookmarkTips([]);
  }
    }
    fetchWalletAndunlockedTips();
  }, [user?.id]);


  useEffect(() => {
  let mounted = true;
  
  async function initializeAuth() {
    try {
      setLoading(true);
      
      // First, try to get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[Auth Init] Session error:', sessionError);
      }
      
      if (session?.user && mounted) {
        console.log('[Auth Init] Found existing session for:', session.user.email);
        setUser(session.user);
        setIsLoggedIn(true);
        await fetchBookmarks(session.user.id);
      } else {
        console.log('[Auth Init] No existing session found');
        if (mounted) {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('[Auth Init] Error:', error);
      if (mounted) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }
  
  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('[Auth State Change]', event, session?.user?.email);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        await fetchBookmarks(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoggedIn(false);
        setBookmarks([]);
      }
    }
  );
  
  // Initialize auth
  initializeAuth();
  
  // Cleanup
  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

  // Check session on mount
useEffect(() => {
  async function fetchUserAndPosts() {
    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      console.log('[UserScreen] Auth data:', authData.user);
      
      if (authData.user) {
        // Fetch user profile from 'users' table
        const { data: profileData } = await supabase
          .from('users')
          .select('profile_photo_url, name, email')
          .eq('id', authData.user.id)
          .single();

        // Merge auth user and profile data
        const mergedUser = { ...authData.user, ...profileData };
        setUser(mergedUser);
        setIsLoggedIn(true);

        console.log('[UserScreen] Profile data:', profileData);

        // Check if profile setup is needed
        if (!profileData?.name || !profileData?.profile_photo_url) {
          console.log('[UserScreen] Profile setup needed');
          // Add your profile setup logic here
        }

        // Fetch user's posts
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", authData.user.id)
          .order("created_at", { ascending: false });

        console.log('[UserScreen] Posts data:', postsData);

        // Fetch bookmarks
        await fetchBookmarks(authData.user.id);
      } else {
        // User is not authenticated
        console.log('[UserScreen] No user found');
        setIsLoggedIn(false);
        setUser(null);
        setBookmarks([]);
      }
    } catch (error) {
      console.error('[UserScreen] Error fetching user:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  
  fetchUserAndPosts();
}, []);

// Add this additional useEffect for auth state changes
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('[Auth State Change]', event, session?.user?.email);
      
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        await fetchBookmarks(session.user.id);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setBookmarks([]);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      console.error('[Send OTP] Error:', error.message);
    } else {
      setShowOtpInput(true);
      Alert.alert('OTP Sent', 'Check your email for the login code.');
      console.log('[Send OTP] OTP sent');
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      Alert.alert('Error', 'Please enter both email and OTP.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email', // ✅ Important: for code-based OTP
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      console.error('[Verify OTP] Error:', error.message);
    } else if (data?.session?.user) {
      const loggedInUser = data.session.user;
      // Check if user exists in users table
      const { data: userExists, error: userExistsError } = await supabase
        .from('users')
        .select('id')
        .eq('id', loggedInUser.id)
        .single();
      if (!userExists) {
        // User does not exist, create entry with default values
        await supabase.from('users').insert([
          {
            id: loggedInUser.id,
            credits: 25,
            unlockedTips: [],
            bookmarks: [],
            email: loggedInUser.email,
            name : ""
            // add other default fields as needed
          }
        ]);
      }
      setUser(loggedInUser);
      setIsLoggedIn(true);
      fetchBookmarks(loggedInUser.id);
      setShowOtpInput(false);
      setOtp('');
      console.log('[Verify OTP] Login successful:', loggedInUser.email);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setEmail('');
    setOtp('');
    setBookmarks([]);
    console.log('[Logout] User logged out');
    await Updates.reloadAsync();
  };

  // Fetch bookmarks
  // Fetch bookmarks (legacy, not used)
  const fetchBookmarks = async (userId: string) => {
    // This function is now legacy, bookmarks are fetched from users table
    return;
  };

  // Always declare hooks at the top level

  // UI - Login
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: colors.background }}>
        <View style={{ width: '95%', padding: 24, backgroundColor: colors.card, borderRadius: 16 }}>
          <Text style={{ fontSize: 22, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 18, textAlign: 'center' }}>Login</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 15, marginBottom: 12, color: colors.text }}
            placeholderTextColor={colors.border}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {!showOtpInput ? (
            <TouchableOpacity onPress={handleSendOtp} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color : isDarkColorScheme ? '#18181b' : '#fff', fontFamily: 'UberMove-Bold', fontSize: 16 }}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 18, color: colors.text }}
                placeholderTextColor={colors.border}
                keyboardType="number-pad"
              />
              <TouchableOpacity onPress={handleVerifyOtp} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color : isDarkColorScheme ? '#18181b' : '#fff',  fontFamily: 'UberMove-Bold', fontSize: 16 }}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }


  // Icons (fallback if not available)
  const CreditIcon = () => (
    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
      <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 18 }}>₵</Text>
    </View>
  );
  const unlockedTipsIcon = () => (
    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
      <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 18 }}>⏳</Text>
    </View>
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Profile Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 32, paddingBottom: 12 }}>
        <View style={{ flex: 1 }}>
          {editingName ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                value={newName}
                onChangeText={text => setNewName(text)}
                style={{ fontSize: 22, fontFamily: 'UberMove-Medium', color: colors.text, borderBottomWidth: 1, borderColor: colors.primary, flex: 1, marginRight: 10 }}
                autoFocus
                placeholder={user?.name ? user.name : 'Type name here'}
                placeholderTextColor={colors.border}
              />
              <Button
              size={'sm'}
              
              onPress={async () => {
                if (!newName.trim() || !user?.id) return;
                setEditingName(false);
                const { error } = await supabase
                  .from('users')
                  .update({ name: newName.trim() })
                  .eq('id', user.id);
                if (!error) {
                  setUser({ ...user, name: newName.trim() });
                } else {
                  Alert.alert('Error', 'Failed to update name.');
                }
              }} style={{ backgroundColor: colors.primary, borderRadius: 800, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ color: isDarkColorScheme ? '#18181b' : '#fff', fontFamily: 'UberMove-Bold', fontSize: 16 }}>Save</Text>
              </Button>
            </View>
          ) : (
            <TouchableOpacity onPress={() => {
              setEditingName(true);
              setNewName(user?.name || '');
            }}>
              {user?.name ? (
                <Text style={{ fontSize: 24, fontFamily: 'UberMove-Bold', color: colors.text }}>{user.name}</Text>
              ) : (
                <Text style={{ fontSize: 24, fontFamily: 'UberMove-Bold', color: colors.border }}>
                  Type name here
                </Text>
              )}
            </TouchableOpacity>
          )}
          <Text style={{ fontSize: 16, color: colors.text, opacity: 0.7, marginTop: 7.5 }}>{user?.email || 'arianzesan@gmail.com'}</Text>
        </View>
        <View style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', }}>
          {/* Avatar placeholder */}
          <FaceIcon  fill={colors.text} width={35} height={35} color={colors.text} />

        </View>
      </View>

      {/* Summary Cards */}
      <View style={{ width:"100%", flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, marginBottom: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
        {/* Wallet Card */}
        <TouchableOpacity
          style={{ width:"20%", flex: 1, backgroundColor: colors.card, borderRadius: 14, marginRight: 0, padding: 16, alignItems: 'center', flexDirection: 'row' }}
          onPress={handleWalletPress}
        >
            
           {isDarkColorScheme ? (
            <LollipopIconWhite color={'#fff'} width={24} height={24}  />
          ) : (
            <LollipopIcon color={colors.primary} width={24} height={24} />
          )}          <View style={{ marginLeft: 7 }}>
            <Text style={{ fontSize: 13, color: colors.text, opacity: 0.7 }}>Lollipops</Text>
            <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text }}>{credits}</Text>
          </View>
        </TouchableOpacity>

                {/* unlockedTips Card */}
        <TouchableOpacity
          style={{ width:"30%", flex: 1, backgroundColor: colors.card, borderRadius: 14, marginLeft: -5, marginRight: 9, padding: 16, alignItems: 'center', flexDirection: 'row' }}
          onPress={() => navigation.navigate('TipListScreen', { tips: unlockedTipsTips, title: 'Unlocked Tips' , userData: userData , 
             
          })}
        >
          <MaterialCommunityIcons name="lock-open-variant-outline" size={23} color={colors.primary} style={{ marginRight: 6 }} />
          <View>
            <Text style={{ fontSize: 13, color: colors.text, opacity: 0.7 }}>Unlocked</Text>
            <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text }}>{unlockedTipsTips.length}</Text>
          </View>
        </TouchableOpacity>
     
        {/* Bookmarks Card */}
        <TouchableOpacity
          style={{  width:"30%",flex: 1, backgroundColor: colors.card, borderRadius: 14, marginRight: 4,  padding: 16, alignItems: 'center', flexDirection: 'row' }}
          onPress={() => navigation.navigate('TipListScreen', { tips: bookmarkTips, title: 'Bookmarks' })}
        >
          <MaterialCommunityIcons name="bookmark-outline" size={23} color={colors.primary} style={{ marginRight: 6 }} />
          <View>
            <Text style={{ fontSize: 13, color: colors.text, opacity: 0.7 }}>Bookmarks</Text>
            <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text }}>{bookmarkTips.length}</Text>
          </View>
        </TouchableOpacity>



      </View>

  {/* Wallet Info Sheet */}
      <RBSheet
        ref={sheetRef}
        height={320}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 20,
             backgroundColor: isDarkColorScheme ? '#18181b' : '#fff' 
          },
        }}
      >
        {sheetContent}
      </RBSheet>


        <TouchableOpacity onPress={handleLogout} style={{ position:"absolute", bottom: 20, left: 0, right: 0, padding: 16, backgroundColor: isDarkColorScheme ? '#999' : colors.primary, borderRadius: 10, marginHorizontal: 20 }}>
          <Text style={{  color: isDarkColorScheme ? '#18181b' : '#fff', fontFamily: 'UberMove-Bold', fontSize: 16, textAlign: 'center' }}>Logout</Text>
        </TouchableOpacity>


    </SafeAreaView>
  );
}
