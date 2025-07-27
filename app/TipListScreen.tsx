import React from 'react';
import {Image, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '~/lib/constants';
import {
  useTheme,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import { useColorScheme } from '~/lib/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { timeAgo } from './mockNewsData';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export default function TipListScreen({ route }) {
  // route.params.tips: array of tip objects
  const { tips, title , userData} = route.params || {};
 const { colors } = useTheme();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
   const navigation = useNavigation();
 
  console.log('TipListScreen params: userData', userData);

  return (
    <View style={{ flex: 1, }}>
      <View style={{ padding: 12,  flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 18, marginTop: 20, paddingBottom: 20, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
        <Text style={{ fontSize: 17, fontFamily: 'UberMove-Bold', color: colors.text }}>{title}</Text>
      </View>
      {(!tips || tips.length === 0) ? (
        <Text style={{ fontSize: 16,  textAlign: 'center', marginTop: 40 }}>
          No tips found.
        </Text>
      ) : (
        <FlatList
          data={tips}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          renderItem={({ item, index }) => (
                         <TouchableOpacity
                         
                         onPress={() => navigation.navigate('TipCard', { tip: item, userData })}
                         
                         
                          style={{ width: '95%', margin:"2.5%", paddingBottom: 12.5, backgroundColor: isDarkColorScheme ? '#18181b' : '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginTop: 10, marginBottom: 10 }}>
                           {console.log('Tip item:', item)}
                           
                           <View style={{ paddingHorizontal: 10, paddingVertical: 7.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: isDarkColorScheme ? '#232323' : '#f3f3f3', borderBottomWidth: 1, borderBottomColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                             <TouchableOpacity
                               onPress={() => navigation.navigate('Profile', { name: item?.name, avatar: item?.avatar })}
                               style={{ flexDirection: 'row', alignItems: 'center' }}
                             >
                               <Image source={{ uri: item?.avatar }} style={{ width: 25, height: 25, borderRadius: 14, marginRight: 8 }} />
                               <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 12, color: colors.text }}>{item?.name}</Text>
                             </TouchableOpacity>
                             <Text style={{ color: '#64748b', fontFamily: 'UberMove-Medium', fontSize: 12, minWidth: 80, textAlign: 'right' }}>{timeAgo ? timeAgo?.(item?.created_at) : item?.created_at}</Text>
                           </View>
                           <Text style={{ color: colors.text, fontFamily: 'UberMove-Medium', fontSize: 14, textAlign: 'left', opacity: 0.8, padding: 10 }}>
                             {item?.tip || 'No data available'}
                           </Text>
                           <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 1.5 }}>
                             <Text style={{ marginLeft: 0, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 11.25 }}>{item?.symbol}</Text>
                             <Text style={{ marginLeft: 6, color: '#444', fontFamily: 'UberMove-Bold', fontSize: 13 }}>·</Text>
                             <Text style={{ marginLeft: 6, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 12 }}>{item?.asset_type}</Text>
                             <Text style={{ marginLeft: 6, color: '#444', fontFamily: 'UberMove-Bold', fontSize: 13 }}>·</Text>
                             <Text style={{ marginLeft: 6, color: isDarkColorScheme ? '#999' : '#444', fontFamily: 'UberMove-Bold', fontSize: 12 }}>{item?.sector}</Text>
                           </View>
                         </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
