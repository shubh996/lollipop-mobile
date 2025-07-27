import { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectValue, SelectLabel } from '~/components/ui/select';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, View, Dimensions, Modal } from 'react-native';
import { Text } from '~/components/ui/text';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
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




export default function PostDetails() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined // restores default
      });
    };
  }, [navigation]);

  // Modal state for bottom sheet
  const [showSheet, setShowSheet] = React.useState(false);

  const route = useRoute();
;

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
  const [tip, setTip] = React.useState((route.params as { tip?: string })?.tip || '');
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


          <View style={{ padding: 15,}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              
              
              <Button size={"sm"} variant={"outline"} 
              style={{width:50, height:50, marginVertical: 16,  borderRadius:350, alignItems:"flex-start"}} 
              onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={isDarkColorScheme ? '#EEE' : '#444'} />
              </Button>

    

               {/* Symbol and Compared Inputs in one row with labels above */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10, marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 2 }}>Symbol</Text>
            <Input
              style={{ fontSize: 16, fontFamily: 'UberMove-Medium', color: colors.text, backgroundColor: isDarkColorScheme ? '#222' : '#fff', borderColor: colors.border, borderWidth: 1, borderRadius: 8, padding: 10 }}
              placeholder="e.g. AAPL"
              placeholderTextColor={isDarkColorScheme ? '#888' : '#aaa'}
              value={symbol}
              onChangeText={setSymbol}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 2 }}>Compare (optional)</Text>
            <Input
              style={{ fontSize: 16, fontFamily: 'UberMove-Medium', color: colors.text, backgroundColor: isDarkColorScheme ? '#222' : '#fff', borderColor: colors.border, borderWidth: 1, borderRadius: 8, padding: 10 }}
              placeholder="e.g. S&P 500"
              placeholderTextColor={isDarkColorScheme ? '#888' : '#aaa'}
              value={compared}
              onChangeText={setCompared}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
        </View>

                          {(symbol || compared) ? (
          <View style={{marginVertical: 10, height: height/3.8  ,width: '100%' }}>
            <TradingView height={height/4} width={width*1.5} theme={isDarkColorScheme ? 'dark' : 'light'} symbol={symbol} compareSymbol={compared}  />
          </View>
        ) : null}

                {/* Show TradingView below if either input has value */}


                {/* Investment Tip Textarea with word counter - at the top */}
        <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:10 }}>Investment Tip</Text>
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


              {/* Asset Type */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:10 }}>Asset Type</Text>
              <Select value={assetType} defaultValue={assetType} onValueChange={setAssetType}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select asset type' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} style={{ width: '90%',marginTop: 0, maxHeight: 260 }}>
                  <ScrollView>
                    <ScrollView>
                    <SelectGroup>
                      <SelectLabel>Asset Type</SelectLabel>
                      {sectorOptions.map(option => (
                        <SelectItem key={option} label={option} value={option}>
                          <Text >{option}</Text>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </ScrollView>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Holding Period */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Holding Period</Text>
              <Select value={holding} defaultValue={holding} onValueChange={setHolding}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select holding period' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Holding Period</SelectLabel>
                    {holdingOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Risk */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Risk</Text>
              <Select value={risk} defaultValue={risk} onValueChange={setRisk}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select risk' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Risk</SelectLabel>
                    {riskOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Conviction */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Conviction</Text>
              <Select value={conviction} defaultValue={conviction} onValueChange={setConviction}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select conviction' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Conviction</SelectLabel>
                    {convictionOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Strategy */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Strategy</Text>
              <Select value={strategy} defaultValue={strategy} onValueChange={setStrategy}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select strategy' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Strategy</SelectLabel>
                    {strategyOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Sentiment */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Sentiment</Text>
              <Select value={sentiment} defaultValue={sentiment} onValueChange={setSentiment}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select sentiment' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Sentiment</SelectLabel>
                    {sentimentOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Sector */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Sector</Text>
              <Select value={sector} defaultValue={sector} onValueChange={setSector}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select sector' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Sector</SelectLabel>
                    {sectorOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Target Duration */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Target Duration</Text>
              <Select value={targetDuration} defaultValue={targetDuration} onValueChange={setTargetDuration}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select target duration' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Target Duration</SelectLabel>
                    {targetDurationOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Catalyst */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Catalyst</Text>
              <Select value={catalyst} defaultValue={catalyst} onValueChange={setCatalyst}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select catalyst' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Catalyst</SelectLabel>
                    {catalystOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Valuation */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Valuation</Text>
              <Select value={valuation} defaultValue={valuation} onValueChange={setValuation}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select valuation' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Valuation</SelectLabel>
                    {valuationOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Technical */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Technical</Text>
              <Select value={technical} defaultValue={technical} onValueChange={setTechnical}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select technical' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full' style={{ maxHeight: 260 }} scrollEnabled={true}>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Technical</SelectLabel>
                    {technicalOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Confidence */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Confidence (%)</Text>
              <Select value={confidence} defaultValue={confidence} onValueChange={setConfidence}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select confidence' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full'>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Confidence (%)</SelectLabel>
                    {[...Array(31)].map((_, i) => {
                      const val = `${70 + i}%`;
                      return (
                        <SelectItem key={val} label={val} value={val}>
                          <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{val}</Text>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Diversification */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Diversification</Text>
              <Select value={diversification} defaultValue={diversification} onValueChange={setDiversification}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select diversification' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full'>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Diversification</SelectLabel>
                    {diversificationOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Liquidity */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Liquidity</Text>
              <Select value={liquidity} defaultValue={liquidity} onValueChange={setLiquidity}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select liquidity' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full'>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Liquidity</SelectLabel>
                    {liquidityOptions.map(option => (
                      <SelectItem key={option} label={option} value={option}>
                        <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{option}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Expected Return */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Expected Return (%)</Text>
              <Select value={expectedReturn} defaultValue={expectedReturn} onValueChange={setExpectedReturn}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select expected return' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full'>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Expected Return (%)</SelectLabel>
                    {[...Array(8)].map((_, i) => {
                      const val = `${8 + i}%`;
                      return (
                        <SelectItem key={val} label={val} value={val}>
                          <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{val}</Text>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              {/* ...repeat for all other selects as before... */}
              {/* Performance */}
              <Text style={{ fontSize: 15, fontFamily: 'UberMove-Medium', color: colors.text, marginBottom: 6, marginTop:25 }}>Performance (%)</Text>
              <Select value={performance} defaultValue={performance} onValueChange={setPerformance}>
                <SelectTrigger className='w-full'>
                  <SelectValue className='text-foreground text-sm native:text-lg' placeholder='Select performance' />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-full'>
                  <ScrollView>
                    <SelectGroup>
                    <SelectLabel>Performance (%)</SelectLabel>
                    {[...Array(31)].map((_, i) => {
                      const val = `${60 + i}%`;
                      return (
                        <SelectItem key={val} label={val} value={val}>
                          <Text style={{ color: isDarkColorScheme ? '#222' : '#FFF' }}>{val}</Text>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                  </ScrollView>
                </SelectContent>
              </Select>
              <Button
                style={{ marginTop: 60, marginBottom:40, height:50 }}
                onPress={handleSubmit}
              >
                <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'UberMove-Bold' }}>Submit Tip</Text>
              </Button>
            </ScrollView>
          </View>
  
     


    </SafeAreaView>
  );
}
