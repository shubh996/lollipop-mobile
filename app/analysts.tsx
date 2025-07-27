import React from 'react';
import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity, Image, Alert } from 'react-native';

import { FontAwesome, FontAwesome5, Feather, AntDesign, Ionicons, SimpleLineIcons, Zocial, FontAwesome6 } from '@expo/vector-icons';
import MarketIcon from '../assets/icons/markets.svg';
import { Button } from '~/components/ui/button';



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





const advisors = [
  { name: 'Rohit Sharma', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', title: 'Equity Specialist' },
  { name: 'Nitya Mehta', avatar:'https://randomuser.me/api/portraits/men/33.jpg', title: 'Tech Analyst' },
  { name: 'Amit Singh', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', title: 'Macro Strategist' },
  // Add more advisors as needed
];



export default function Analysts() {
  
  const { colors } = useTheme();
  const { isDarkColorScheme } = useColorScheme();


  const [search, setSearch] = React.useState('');

    const handleSocial = (type: string) => {
    if (type === 'twitter') {
      // open twitter
    } else if (type === 'instagram') {
      // open instagram
    } else if (type === 'website') {
      // open website
    }
  };

  // Filter advisors by search
  const filteredAdvisors = advisors.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1,  margin: 15 }}>
      {/* Search Bar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderColor:isDarkColorScheme ? colors.border : "#EEE",
        borderWidth: 2,
        borderRadius: 150,
        paddingHorizontal: 14,
        marginBottom: 18,
        height: 50,
      }}>
        <TextInput
          placeholder="Search Investment Analysts"
          placeholderTextColor={colors.border}
          style={{
            flex: 1,
            fontSize: 16,
            color: isDarkColorScheme ? colors.text : '#000',
            fontFamily: 'UberMove-Medium',

          }}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      
      <FlatList
        data={filteredAdvisors}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              
              gap:12,
              paddingVertical: 25,
              borderBottomWidth: 0.4,
              borderColor: colors.border,
              paddingHorizontal: 10,
              justifyContent: 'space-between', // <-- Ensures left and right alignment
            }}
            activeOpacity={0.7}
            // onPress={() => { /* Navigate to advisor profile */ }}
          >
            {/* LEFT: Profile Image and Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: colors.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                  shadowColor: colors.background,
                  shadowOpacity: 0.04,
                  shadowRadius: 2,
                  elevation: 1,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    color: isDarkColorScheme ? colors.text : '#000',
                    fontFamily: 'UberMove-Bold',
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: isDarkColorScheme ? '#666' : '#666',
                    fontFamily: 'UberMove-Medium',
                    marginTop: 2,
                  }}
                >
                  {item.title}
                </Text>
              </View>
            </View>

            {/* RIGHT: Social Buttons */}
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Button
                variant="default"
                size="icon"
                onPress={() => handleSocial('tips')}
                style={{
                  marginHorizontal: 2,
                  borderWidth: 1,
                  borderColor: '#222',
                  borderRadius: 100,
                  width: 34,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MarketIcon fill={colors.background}  />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => handleSocial('twitter')}
                style={{
                  marginHorizontal: 2,
                  borderWidth: 1,
                  borderColor: '#222',
                  borderRadius: 100,
                  width: 34,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <Feather name="mail" size={16} color="#222" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => handleSocial('twitter')}
                style={{
                  marginHorizontal: 2,
                  borderWidth: 1,
                  borderColor: '#222',
                  borderRadius: 100,
                  width: 34,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <FontAwesome6 name="x-twitter" size={16} color="#222" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => handleSocial('instagram')}
                style={{
                  marginHorizontal: 2,
                  borderWidth: 1,
                  borderColor: '#222',
                  borderRadius: 100,
                  width: 34,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <Feather name="instagram" size={18} color="#222" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => handleSocial('website')}
                style={{
                  marginHorizontal: 2,
                  borderWidth: 1,
                  borderColor: '#222',
                  borderRadius: 100,
                  width: 34,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <Zocial name="linkedin" size={16} color="#222" style={{ marginTop: -4 }} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onPress={() =>
                  Alert.alert(
                    'Investment License',
                    `${item.name} is a SEBI Registered Investment Advisor (RIA123456)\n\nLicense valid till 2027.`
                  )
                }
                style={{
                  marginHorizontal: 2,
                  borderWidth: 1,
                  borderColor: '#222',
                  borderRadius: 100,
                  width: 34,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <Ionicons name="document-outline" size={18} color="#222" />
              </Button>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>
            No analysts found.
          </Text>
        }
      />
    </SafeAreaView>
  );
}