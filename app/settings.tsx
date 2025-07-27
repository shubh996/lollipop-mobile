import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '~/lib/supabase';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '~/lib/constants';
import {
  useTheme,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export default function SettingScreen (){
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [profileName, setProfileName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const { colors } = useTheme();
  const { isDarkColorScheme } = useColorScheme();

  // Check if user is already logged in on mount
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setProfileName(data.user.user_metadata?.name || '');
        setProfilePic(data.user.user_metadata?.profile_photo_url || '');
        console.log('User is already logged in:', data.user);
      } else {
        setUser(null);
        console.log('No user logged in');
      }
    })();
  }, []);


  const handleSendOtp = async () => {
    console.log('handleSendOtp called with email:', email);
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: undefined,
          shouldCreateUser: true,
        },
      });
      console.log('signInWithOtp result:', { data, error });
      if (error) throw error;
      setStep('otp');
    } catch (err: any) {
      console.log('Error in handleSendOtp:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    console.log('handleVerifyOtp called with email:', email, 'otp:', otp);
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      console.log('verifyOtp result:', { data, error });
      if (data && data.user) {
        await createUserProfileIfNotExists({
          id: data.user.id,
          name: data.user.user_metadata?.name || '',
          email: data.user.email || '',
          profile_photo_url: data.user.user_metadata?.profile_photo_url || '',
        });
        setUser(data.user);
        setProfileName(data.user.user_metadata?.name || '');
        setProfilePic(data.user.user_metadata?.profile_photo_url || '');
        console.log('User profile created or exists, navigating to Profile');
        // navigation.reset({ index: 0, routes: [{ name: 'Profile', params: { user: data.user } }] });
      }
      if (error) throw error;
    } catch (err: any) {
      console.log('Error in handleVerifyOtp:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update profile in Supabase
  const handleProfileUpdate = async () => {
    setProfileLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileName,
          profile_photo_url: profilePic,
        },
      });
      if (error) throw error;
      // Optionally update in your own users table as well
      setUser((u: any) => ({ ...u, user_metadata: { ...u.user_metadata, name: profileName, profile_photo_url: profilePic } }));
      alert('Profile updated!');
    } catch (err: any) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail('');
    setOtp('');
    setStep('email');
  };

  // Email validation regex
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (user) {
    // Settings/Profile screen
    return (
      <SafeAreaView style={{ flex: 1, margin: 10, backgroundColor: isDarkColorScheme ? '#111' : '#fff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 400, backgroundColor: isDarkColorScheme ? '#181818' : 'rgba(255,255,255,0.98)', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: isDarkColorScheme ? '#EEE' : colors.text, fontFamily: 'UberMove-Bold', textAlign: 'center', marginBottom: 16 }}>Settings</Text>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              {profilePic ? (
                <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', backgroundColor: '#eee', marginBottom: 8 }}>
                  <ImageBackground source={{ uri: profilePic }} style={{ width: 80, height: 80 }} imageStyle={{ borderRadius: 40 }} />
                </View>
              ) : (
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, color: '#888' }}>?</Text>
                </View>
              )}
              <Input
                value={profilePic}
                onChangeText={setProfilePic}
                placeholder="Profile picture URL"
                style={{ marginTop: 8, marginBottom: 0, fontSize: 14, backgroundColor: isDarkColorScheme ? '#232323' : '#f5f5f5', color: isDarkColorScheme ? '#eee' : '#222', borderRadius: 8, paddingHorizontal: 12, height: 40, borderWidth: 1, borderColor: isDarkColorScheme ? '#333' : '#e5e5e5', width: 220 }}
              />
            </View>
            <View style={{ width: '100%', marginBottom: 18 }}>
              <Label>Name</Label>
              <Input
                value={profileName}
                onChangeText={setProfileName}
                placeholder="Your name"
                style={{ marginTop: 8, marginBottom: 0, fontSize: 16, backgroundColor: isDarkColorScheme ? '#232323' : '#f5f5f5', color: isDarkColorScheme ? '#eee' : '#222', borderRadius: 8, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: isDarkColorScheme ? '#333' : '#e5e5e5' }}
              />
            </View>
            <Button onPress={handleProfileUpdate} disabled={profileLoading} style={{ marginTop: 4, width: '100%' }}>
              <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 16 }}>{profileLoading ? 'Updating...' : 'Update Profile'}</Text>
            </Button>
            <Button onPress={handleLogout} style={{ marginTop: 18, width: '100%', backgroundColor: '#e11d48' }}>
              <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 16, color: '#fff' }}>Log Out</Text>
            </Button>
            <View style={{ marginTop: 32, width: '100%', alignItems: 'center' }}>
              <Button style={{ width: '100%', backgroundColor: '#268e52' }} onPress={() => alert('Apply to become an Investment Advisor!')}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 16, color: '#fff' }}>Become an Investment Advisor</Text>
                  <Text style={{ fontSize: 12, color: '#fff', marginTop: 2 }}>You can post tips and make money</Text>
                </View>
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Login/OTP flow (default)
  return (
    <SafeAreaView style={{ flex: 1, margin: 10, backgroundColor: isDarkColorScheme ? '#111' : '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            backgroundColor: isDarkColorScheme ? '#111' : '#fff',
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 400,
              backgroundColor: isDarkColorScheme ? '#181818' : 'rgba(255,255,255,0.98)',
              borderRadius: 16,
              padding: 24,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: isDarkColorScheme ? '#EEE' : colors.text,
                fontFamily: 'UberMove-Bold',
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              Welcome
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: isDarkColorScheme ? '#bbb' : '#555',
                fontFamily: 'UberMove-Medium',
                textAlign: 'center',
              }}
            >
              {step === 'email' ? 'Enter your email to get OTP' : 'Enter the OTP sent to your email'}
            </Text>
            <View style={{ height: 24 }} />
            {step === 'email' && (
              <View style={{ marginBottom: 18, width: '100%' }}>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    marginTop: 8,
                    marginBottom: 0,
                    fontSize: 16,
                    backgroundColor: isDarkColorScheme ? '#232323' : '#f5f5f5',
                    color: isDarkColorScheme ? '#eee' : '#222',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 44,
                    borderWidth: 1,
                    borderColor: isDarkColorScheme ? '#333' : '#e5e5e5',
                  }}
                />
              </View>
            )}
            {step === 'otp' && (
              <View style={{ marginBottom: 18, width: '100%' }}>
                <Label>OTP</Label>
                <Input
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Enter OTP"
                  keyboardType="number-pad"
                  style={{
                    marginTop: 8,
                    marginBottom: 0,
                    fontSize: 16,
                    backgroundColor: isDarkColorScheme ? '#232323' : '#f5f5f5',
                    color: isDarkColorScheme ? '#eee' : '#222',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 44,
                    borderWidth: 1,
                    borderColor: isDarkColorScheme ? '#333' : '#e5e5e5',
                  }}
                />
              </View>
            )}
            <Button
              onPress={step === 'email' ? handleSendOtp : handleVerifyOtp}
              disabled={loading || (step === 'email' ? (!email || !isValidEmail) : !otp)}
              style={{ marginTop: 12, width: '100%' }}
            >
              <Text style={{fontFamily: 'UberMove-Bold', fontSize: 16}}>{loading ? 'Processing...' : step === 'email' ? 'Get OTP' : 'Login'}</Text>
            </Button>
            {!!error && (
              <Text
                style={{
                  color: '#e11d48',
                  fontSize: 13,
                  marginTop: 12,
                  textAlign: 'center',
                }}
              >
                {error}
              </Text>
            )}
            <Text
              style={{
                fontSize: 12,
                color: isDarkColorScheme ? '#aaa' : '#888',
                marginTop: 24,
                textAlign: 'center',
              }}
            >
              By clicking continue, you agree to our{' '}
              <Text style={{ color: '#268e52', textDecorationLine: 'underline' }}>Terms of Service</Text> and{' '}
              <Text style={{ color: '#268e52', textDecorationLine: 'underline' }}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper to create user profile if not exists
async function createUserProfileIfNotExists({ id, name, email, profile_photo_url }: { id: string, name: string, email: string, profile_photo_url: string }) {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();
    if (fetchError && fetchError.code !== 'PGRST116') {
      return;
    }
    if (!existing) {
      await supabase.from('users').insert([
        {
          id,
          name: name || '',
          email: email || '',
          profile_photo_url: profile_photo_url || '',
          created_at: new Date().toISOString(),
        },
      ]);
    }
  } catch (e) {
    // ignore
  }
}
