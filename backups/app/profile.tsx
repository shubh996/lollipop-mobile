// Hide main top bar when profile is active
export const options = {
  headerShown: false,
  tabBarStyle: { display: 'none' },
};
import * as React from 'react';
import { View, Image, ScrollView, Dimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { mockNewsData } from './mockNewsData';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const width = Dimensions.get('window').width;
const Tab = createMaterialTopTabNavigator();

function NewsTab({ name }) {
  const userNews = mockNewsData.filter((item) => item.user.name === name);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center', padding: 24 }}>
      {userNews.map((item, idx) => (
        <View key={idx} style={{ width: width * 0.92, backgroundColor: '#f4f4f5', borderRadius: 16, padding: 18, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
          <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 18, marginBottom: 8 }}>{item.headline}</Text>
          <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 15, color: '#64748b', marginBottom: 10 }}>{item.summary}</Text>
          <View style={{ backgroundColor: '#4ba366', borderRadius: 8, padding: 10, marginTop: 8 }}>
            <Text style={{ color: '#fff', fontFamily: 'UberMove-Bold', fontSize: 14 }}>{item.tip}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function AboutTab({ name, avatar }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 24 }}>
      <Image
        source={{ uri: avatar }}
        style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 16 }}
      />
      <Text style={{ fontFamily: 'UberMove-Bold', fontSize: 24, marginBottom: 8 }}>{name}</Text>
      <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 16, color: '#64748b', marginBottom: 24 }}>
        Financial News & Tips
      </Text>
      <Text style={{ fontFamily: 'UberMove-Medium', fontSize: 15, color: '#64748b', textAlign: 'center' }}>
        This is the profile page for {name}. Here you can see all the financial news and tips shared by this user. More profile features can be added here.
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const avatar = Array.isArray(params.avatar) ? params.avatar[0] : params.avatar;

  return (
    <Tab.Navigator
    
      screenOptions={{
        
        tabBarLabelStyle: { fontFamily: 'UberMove-Bold', fontSize: 16,marginTop:10 },
        tabBarIndicatorStyle: { backgroundColor: '#000' },
        tabBarStyle: { height:60},
      }}

    >

      <Tab.Screen name="About">
        {() => <AboutTab name={name} avatar={avatar} />}
      </Tab.Screen>
            <Tab.Screen name="News">
        {() => <NewsTab name={name} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
