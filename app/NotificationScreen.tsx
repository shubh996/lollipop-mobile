import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTipsData } from '../lib/useDataStore';
import { registerForPushNotificationsAsync } from '~/lib/notifications';
import { supabase } from '~/lib/supabase';

// Investment app notification data (static for now)
const notifications = [
  // ...existing code...
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    weekday: 'short',
  }).toUpperCase();
}

// Group notifications by date
const groupByDate = (items: typeof notifications) => {
  const groups: Record<string, typeof notifications> = {};
  items.forEach(item => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  });
  return groups;
};

export default function NotificationScreen() {
  const { colors } = useTheme();
  const { isDarkColorScheme } = useColorScheme();
  const navigation = useNavigation();
  const { tips: liveTips, loading: liveLoading, error: liveError, refresh: refreshLiveTips } = useTipsData();
  const grouped = groupByDate(notifications);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));



  React.useEffect(() => {
    console.log('Registering for push notifications...');
    async function registerForPushNotifications() {
      console.log('1. Registering for push notifications...');
      // Get user session and user id from Supabase auth
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();


      console.log('2. Got session:', session?.user?.id);

      if (sessionError) {
        console.log('Error getting session:', sessionError);
        return;
      }
      const userId = session?.user?.id;
      if (!userId) {
        console.log('No user id found in session.');
        return;
      }
      const token = await registerForPushNotificationsAsync();
      console.log('2. Got token:', token);
      if (token) {
        console.log('3. Updating user record with token...');
        const {data, error } = await supabase
          .from('users')
          .update({ expo_token: token,})
          .eq('id', userId);
        if (!error) {
          console.log('4. Push token updated successfully:', data);
        } else {
          console.log('5. Error updating push token:', error);
          Alert.alert('Error', 'Failed to update push token.');
        }
      }
    }
    registerForPushNotifications();
  }, []);
    
   
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{marginTop: Platform.OS === 'ios' ? "-2.5%" : 0, flexDirection: 'row', justifyContent:"center", alignItems: 'center', height: 56, borderBottomWidth: 1, borderBottomColor: isDarkColorScheme ? '#232323' : '#e5e7eb', backgroundColor: colors.background, paddingHorizontal: 0 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 10, paddingVertical: 8, marginLeft: 2, marginRight: 2 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity> */}
        <Text style={{ fontSize: 18, fontFamily: 'UberMove-Bold', color: colors.text, marginLeft: 2, marginTop: 2 , textAlign:"center"}}>Notifications</Text>
      {/* <TouchableOpacity onPress={refreshLiveTips} style={{ paddingHorizontal: 10, paddingVertical: 8, marginLeft: 2, marginRight: 2 }}>
            <Ionicons name="refresh" size={22} color={colors.text} />
        </TouchableOpacity> */}
      </View>
      <ScrollView contentContainerStyle={{ padding: 0, paddingTop: 0 }} showsVerticalScrollIndicator={false}>
        {sortedDates.map(date => (
          <View key={date} style={{ marginBottom: 0 }}>
            <Text style={{ textAlign:"center", fontSize: 12, color: colors.text, opacity: 0.6,  marginBottom: 9, marginTop: 38, fontFamily: 'UberMove-Bold', letterSpacing: 0.5 }}>
              {formatDate(date)}
            </Text>
            <View style={{ marginHorizontal: 0, borderRadius: 0, overflow: 'hidden' }}>
              {grouped[date].map((n, idx) => {
                // Only make the tip notification pressable
                const isTip = n.title && n.title.toLowerCase().includes('tip published');
                // Use live tip if available
                const tipObj = isTip && liveTips.length > 0 ? liveTips[0] : isTip ? {
                  id: 'tsla-2025',
                  name: 'Meghna',
                  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                  symbol: 'TSLA',
                  asset_type: 'Equity',
                  sector: 'Technology',
                  created_at: '2025-07-22T09:00:00Z',
                  tip: 'Tesla is expected to outperform this quarter due to strong delivery numbers and new product launches.',
                  strategy: 'Growth',
                  risk: 'Medium',
                  expected_return: '18%',
                  duration: '3 months',
                  region: 'US',
                } : null;
                const content = (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    minHeight: 54,
                    paddingHorizontal: 12,
                    backgroundColor: n.unread ? (isDarkColorScheme ? '#232323' : '#f7fafd') : (isDarkColorScheme ? '#19191b' : '#fff'),
                    borderTopWidth: idx === 0 ? 1 : 0,
                    borderTopColor: isDarkColorScheme ? '#232323' : '#e5e7eb',
                    borderBottomWidth: 1,
                    borderBottomColor: isDarkColorScheme ? '#232323' : '#e5e7eb',
                    marginHorizontal: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                  }}>
                    {/* Dot indicator for unread */}
                    <View style={{ width: 18, alignItems: 'center', justifyContent: 'flex-start'}}>
                      <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: n.unread ? '#2563eb' : 'transparent', marginTop: 16 }} />
                    </View>
                    <View style={{ flex: 1, paddingTop: 12, paddingBottom: 8, paddingRight:12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: n.unread ? 'UberMove-Bold' : 'UberMove-Medium', color: colors.text, fontSize: 15, marginBottom: 10, flex: 1 }} numberOfLines={2}>
                          {n.title}
                        </Text>
                        <Text style={{ color: colors.text, fontFamily: 'UberMove-Medium', fontSize: 13, opacity: 0.6, marginLeft: 10, marginBottom: 10, minWidth: 56, textAlign: 'right' }}>{n.time}</Text>
                      </View>
                      <Text style={{ marginBottom: 10 , fontFamily: 'UberMove-Medium', color: colors.text, fontSize: 13, opacity: 0.8, marginTop: 1 }}>{n.message}</Text>
                    </View>
                  </View>
                );
                return isTip ? (
                  <TouchableOpacity
                    key={n.id}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('TipCard', { tip: tipObj })}
                  >
                    {content}
                  </TouchableOpacity>
                ) : (
                  <View key={n.id}>{content}</View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
