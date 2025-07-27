
import { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectValue, SelectLabel } from '~/components/ui/select';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, View, Dimensions, Modal } from 'react-native';
import { Text } from '~/components/ui/text';
import { useNavigation } from '@react-navigation/native';

  // Add many options for demonstration
  const holdingOptions = [
    ...['1D', '1W', 'Swing', 'Long'],
    ...Array.from({length: 20}, (_,i) => `Option ${i+1}`)
  ];
  const riskOptions = [
    ...['Low', 'Medium', 'High'],
    ...Array.from({length: 20}, (_,i) => `Risk ${i+1}`)
  ];
  const convictionOptions = [
    ...['High', 'Medium', 'Low'],
    ...Array.from({length: 20}, (_,i) => `Conviction ${i+1}`)
  ];
  const strategyOptions = [
    ...['Growth', 'Value', 'Momentum', 'Income', 'Index'],
    ...Array.from({length: 20}, (_,i) => `Strategy ${i+1}`)
  ];
  const sentimentOptions = [
    ...['Bullish', 'Neutral', 'Bearish'],
    ...Array.from({length: 20}, (_,i) => `Sentiment ${i+1}`)
  ];
  const sectorOptions = [
    ...['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer'],
    ...Array.from({length: 20}, (_,i) => `Sector ${i+1}`)
  ];
  const targetDurationOptions = [
    ...['2W', '1M', '3M', '6-12M'],
    ...Array.from({length: 20}, (_,i) => `Duration ${i+1}`)
  ];
  const catalystOptions = [
    ...['Earnings', 'Fed', 'M&A', 'Product'],
    ...Array.from({length: 20}, (_,i) => `Catalyst ${i+1}`)
  ];
  const valuationOptions = [
    ...['P/E 18x', 'EV/EBITDA 12x', 'DCF +15%', 'PEG 1.2'],
    ...Array.from({length: 20}, (_,i) => `Valuation ${i+1}`)
  ];
  const technicalOptions = [
    ...['RSI 60', 'MACD Bull', 'MA Cross', 'ADX 25'],
    ...Array.from({length: 20}, (_,i) => `Technical ${i+1}`)
  ];
  const diversificationOptions = [
    ...['Core', 'Satellite', 'Hedge'],
    ...Array.from({length: 20}, (_,i) => `Diversification ${i+1}`)
  ];
  const liquidityOptions = [
    ...['High', 'Medium', 'Low'],
    ...Array.from({length: 20}, (_,i) => `Liquidity ${i+1}`)
  ];
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '~/lib/constants';
import {
  useTheme,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import { useColorScheme } from '~/lib/useColorScheme';
import { Input } from '~/components/ui/input';
import TradingView from './TradingView';
import { Button } from '~/components/ui/button';
import { Ionicons } from '@expo/vector-icons';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};


const height= Dimensions.get('window').height;
const width = Dimensions.get('window').width;


export default function PostTipScreen() {

    const navigation = useNavigation();
  // Modal state for bottom sheet
  const [showSheet, setShowSheet] = React.useState(false);

  const { colors } = useTheme();
  const { isDarkColorScheme } = useColorScheme();

  // Default values
  // Option helpers
  const mapOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));
  const symbolOptions = mapOptions(["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]);
  const comparedOptions = mapOptions(["MSFT", "NASDAQ", "Dow Jones", "Russell 2000"]);

  // Default values as strings
  const [assetType, setAssetType] = React.useState(sectorOptions[0]);
  const [symbol, setSymbol] = React.useState('');
  const [compared, setCompared] = React.useState('');
  const [tip, setTip] = React.useState('');
  const [tipWordCount, setTipWordCount] = React.useState(0);
  const [winRate, setWinRate] = React.useState('80%');
  const [risk, setRisk] = React.useState(riskOptions[0]);
  const [duration, setDuration] = React.useState('');
  const [holding, setHolding] = React.useState(holdingOptions[0]);
  const [conviction, setConviction] = React.useState(convictionOptions[0]);
  const [strategy, setStrategy] = React.useState(strategyOptions[0]);
  const [sentiment, setSentiment] = React.useState(sentimentOptions[0]);
  const [sector, setSector] = React.useState(sectorOptions[0]);
  const [targetDuration, setTargetDuration] = React.useState(targetDurationOptions[0]);
  const [allocation, setAllocation] = React.useState('');
  const [catalyst, setCatalyst] = React.useState(catalystOptions[0]);
  const [valuation, setValuation] = React.useState(valuationOptions[0]);
  const [technical, setTechnical] = React.useState(technicalOptions[0]);
  const [confidence, setConfidence] = React.useState('70%');
  const [diversification, setDiversification] = React.useState(diversificationOptions[0]);
  const [liquidity, setLiquidity] = React.useState(liquidityOptions[0]);
  const [expectedReturn, setExpectedReturn] = React.useState('8%');
  const [performance, setPerformance] = React.useState('60%');

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  // (removed duplicate mapOptions)

  // Handle tip input and word count
  const handleTipChange = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= 40) {
      setTip(text);
      setTipWordCount(words.length);
    } else {
      // Prevent adding more words
      setTip(words.slice(0, 40).join(' '));
      setTipWordCount(40);
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (tipWordCount > 0 && tipWordCount <= 40) {
      Alert.alert('Success', 'Your investment tip has been submitted!');
      // Reset form or do further logic here
    } else {
      Alert.alert('Error', 'Tip must be 1-40 words.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>


      <ScrollView style={{ flex: 1, backgroundColor: colors.background, height: height * 0.8 }} contentContainerStyle={{ padding: 20 ,  height: height  }}>
        <Text style={{ fontSize: 22, fontFamily: 'UberMove-Bold', color: colors.text, marginBottom: 38 }}>Post Investment Tip</Text>

       
    

        <Input
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            minHeight: 80,
            color: colors.text,
            backgroundColor: isDarkColorScheme ? '#222' : '#fff',
            marginBottom: 6,
            fontSize: 16,
            fontFamily: 'UberMove-Medium',
          }}
          multiline
          placeholder="Describe your investment tip..."
          placeholderTextColor={isDarkColorScheme ? '#888' : '#aaa'}
          value={tip}
          onChangeText={handleTipChange}
        />
        <Text style={{ alignSelf: 'flex-start', color: tipWordCount > 40 ? 'red' : colors.text, fontSize: 13, marginBottom: 14, marginLeft:5 }}>
          {tipWordCount}/40 words
        </Text>

<View style={{ flexDirection: 'row', justifyContent:"flex-end", alignItems:"flex-end", marginBottom: 10, marginTop: -5 }}>
        <Button 

    onPress={() => navigation.navigate('PostDetails', { tip})}

       // onPress={() => setShowSheet(true)}
          disabled={!tip.trim() || tipWordCount > 40}
        
        size={"sm"} variant={"default"}
              style={{width:50, height:50, marginVertical: 16,  borderRadius:350, alignItems:"flex-start"}} 
              >
                <Ionicons name="arrow-forward" size={24} color={isDarkColorScheme ? '#000' : '#FFF'} />
              </Button>
</View>




      </ScrollView>

    
    </SafeAreaView>
  );
}
