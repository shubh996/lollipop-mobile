import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { supabase } from '~/lib/supabase';

export default function UserScreen() {
  const { colors } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bookmarkTips, setBookmarkTips] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'unlockedTips' | 'bookmarks' | 'insights'>('unlockedTips');

  // UI - Logged In
  // Wallet and unlockedTips state
  const [credits, setCredits] = useState<number>(25);
  const [unlockedTipsTips, setunlockedTipsTips] = useState<any[]>([]);

  // Fetch wallet and unlockedTips tips from Supabase on mount and on user change
  useEffect(() => {
    async function fetchWalletAndunlockedTips() {
      if (!user?.id) return;
  // Fetch wallet credits, unlockedTips, and bookmarks field
  const { data: userData } = await supabase
    .from('users')
    .select('credits, unlockedTips, bookmarks')
    .eq('id', user.id)
    .single();
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
        // User is authenticated
        setUser(authData.user);
        setIsLoggedIn(true); // ✅ This was missing!
        
        // Fetch user profile from 'users' table
        const { data: profileData } = await supabase
          .from('users')
          .select('profile_photo_url, name, email')
          .eq('id', authData.user.id)
          .single();
        
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
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <View style={{ width: '85%', padding: 24, backgroundColor: colors.card, borderRadius: 16 }}>
          <Text style={{ fontSize: 22, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 18, textAlign: 'center' }}>Login</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 12, color: colors.text }}
            placeholderTextColor={colors.border}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {!showOtpInput ? (
            <TouchableOpacity onPress={handleSendOtp} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 16 }}>
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
                <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 16 }}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingBottom: 0, overflow: 'hidden' }}>
      {/* Top Bar (Header Section) */}
      <View style={{ width: '100%', marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 0.6, borderBottomColor: colors.border, minHeight: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 22, fontFamily: 'UberMove-Bold', color: colors.text }}>{user?.name || user?.email || 'Account'}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 17, color: colors.primary, fontFamily: 'UberMove-Bold', marginRight: 6 }}>₵</Text>
            <Text style={{ fontSize: 16, color: colors.text, fontFamily: 'UberMove-Bold' }}>{credits}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 10, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 15 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Secondary Navigation Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 18, gap: 10, marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => setActiveTab('unlockedTips')}
          style={{
            backgroundColor: activeTab === 'unlockedTips' ? colors.primary : colors.card,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 28,
            marginHorizontal: 2,
            borderWidth: activeTab === 'unlockedTips' ? 0 : 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: activeTab === 'unlockedTips' ? '#fff' : colors.text, fontFamily: 'UberMove-Bold', fontSize: 16 }}>unlockedTips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('bookmarks')}
          style={{
            backgroundColor: activeTab === 'bookmarks' ? colors.primary : colors.card,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 28,
            marginHorizontal: 2,
            borderWidth: activeTab === 'bookmarks' ? 0 : 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: activeTab === 'bookmarks' ? '#fff' : colors.text, fontFamily: 'UberMove-Bold', fontSize: 16 }}>Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('insights')}
          style={{
            backgroundColor: activeTab === 'insights' ? colors.primary : colors.card,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 28,
            marginHorizontal: 2,
            borderWidth: activeTab === 'insights' ? 0 : 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: activeTab === 'insights' ? '#fff' : colors.text, fontFamily: 'UberMove-Bold', fontSize: 16 }}>Insights</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Section */}
      <View style={{ flex: 1, paddingHorizontal: 8, paddingBottom: 30 }}>
        {activeTab === 'unlockedTips' ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <unlockedTipsIcon />
              <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text }}>Unlocked Tips unlockedTips</Text>
            </View>
            <View style={{ gap: 10 }}>
              {unlockedTipsTips.length === 0 ? (
                <View style={{ alignItems: 'center', marginBottom: 18 }}>
                  <Text style={{ color: colors.text, opacity: 0.7, fontSize: 15, marginTop: 4 }}>No unlocked tips yet.</Text>
                </View>
              ) : (
                user && Array.isArray(user.unlockedTips) && user.unlockedTips.length > 0
                  ? user.unlockedTips.map((tipId: string, idx: number) => {
                      const tip = unlockedTipsTips.find(t => t.id === tipId);
                      return (
                        <View key={tipId} style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 2, shadowColor: colors.text, shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
                          <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 16, color: colors.primary, marginBottom: 2 }}>{tip ? (tip.title || tip.symbol || 'Unlocked Tip') : `Tip ID: ${tipId}`}</Text>
                          <Text style={{ color: colors.text, fontSize: 14, marginBottom: 4 }}>{tip ? (tip.description || tip.tip || '') : 'Tip details not found.'}</Text>
                          {tip && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                              {tip.asset_type && <Text style={{ color: colors.text, fontSize: 13, marginRight: 10 }}>{tip.asset_type}</Text>}
                              {tip.sector && <Text style={{ color: colors.text, fontSize: 13, marginRight: 10 }}>{tip.sector}</Text>}
                              {tip.created_at && <Text style={{ color: colors.text, fontSize: 12, opacity: 0.7 }}>{new Date(tip.created_at).toLocaleDateString()}</Text>}
                            </View>
                          )}
                        </View>
                      );
                    })
                  : unlockedTipsTips.map((tip, idx) => (
                      <View key={tip.id || idx} style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 2, shadowColor: colors.text, shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
                        <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 16, color: colors.primary, marginBottom: 2 }}>{tip.title || tip.symbol || 'Unlocked Tip'}</Text>
                        <Text style={{ color: colors.text, fontSize: 14, marginBottom: 4 }}>{tip.description || tip.tip || ''}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                          {tip.asset_type && <Text style={{ color: colors.text, fontSize: 13, marginRight: 10 }}>{tip.asset_type}</Text>}
                          {tip.sector && <Text style={{ color: colors.text, fontSize: 13, marginRight: 10 }}>{tip.sector}</Text>}
                          {tip.created_at && <Text style={{ color: colors.text, fontSize: 12, opacity: 0.7 }}>{new Date(tip.created_at).toLocaleDateString()}</Text>}
                        </View>
                      </View>
                    ))
              )}
            </View>
          </>
        ) : activeTab === 'bookmarks' ? (
          <>
            <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 10 }}>Bookmarks</Text>
            <View style={{ gap: 10 }}>
              {bookmarkTips.length === 0 ? (
                <View style={{ alignItems: 'center', marginBottom: 18 }}>
                  <Text style={{ color: colors.text, opacity: 0.7, fontSize: 15, marginTop: 4 }}>No bookmarks found.</Text>
                </View>
              ) : (
                bookmarkTips.map((bm, idx) => (
                  <View key={bm.id || idx} style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 2, shadowColor: colors.text, shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
                    <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 16, color: colors.primary, marginBottom: 2 }}>{bm.title || bm.symbol || 'Bookmarked Tip'}</Text>
                    <Text style={{ color: colors.text, fontSize: 14, marginBottom: 4 }}>{bm.description || bm.tip || ''}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      {bm.asset_type && <Text style={{ color: colors.text, fontSize: 13, marginRight: 10 }}>{bm.asset_type}</Text>}
                      {bm.sector && <Text style={{ color: colors.text, fontSize: 13, marginRight: 10 }}>{bm.sector}</Text>}
                      {bm.created_at && <Text style={{ color: colors.text, fontSize: 12, opacity: 0.7 }}>{new Date(bm.created_at).toLocaleDateString()}</Text>}
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 10 }}>Insights</Text>
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text style={{ color: colors.text, opacity: 0.7, fontSize: 15 }}>No insights available yet.</Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
