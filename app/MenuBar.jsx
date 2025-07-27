import { useNavigation } from 'expo-router';
import * as React from 'react';
import { Keyboard, TouchableOpacity, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, View, TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import { Input } from '~/components/ui/input';
import { WebView } from 'react-native-webview';
import SearchIcon from '~/assets/icons/search.svg';


import { useColorScheme } from '~/lib/useColorScheme';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider, useTheme } from '@react-navigation/native';
import { NAV_THEME } from '~/lib/constants';



export default function MenuBar({ tip }) {

 
  console.log('MenuBar tip:', tip.tip );


    const { colors } = useTheme();


  // State for the input
  const [query, setQuery] = React.useState('');
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };


  const { isDarkColorScheme } = useColorScheme();

    const LIGHT_THEME = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
  };
  const DARK_THEME = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
  };




  const [modalVisible, setModalVisible] = React.useState(false);
  const [pendingQuery, setPendingQuery] = React.useState('');
  const [value, setValue] = React.useState();
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [webViewVisible, setWebViewVisible] = React.useState(false);
  const [webViewUrl, setWebViewUrl] = React.useState('');


  const handleFocus = () => {
    setPendingQuery(query);
    setModalVisible(true);
  };
  const handleClose = () => setModalVisible(false);
  const handleSubmit = () => {

    console.log('Submitting query:', pendingQuery);

    setModalVisible(false);
    setQuery(pendingQuery);
    // TODO: Navigate to ChatGPT webview, passing pendingQuery and headline as context
    const formattedQuery = `
     
      User Query: ${pendingQuery || 'No query provided'}
      With reference to the following Investment Tip: ${tip?.tip || 'Provide an investment tip here'}

    `;

    setWebViewUrl(`https://perplexity.ai/?q=${encodeURIComponent(formattedQuery)}`);
    setWebViewVisible(true);
  };

  // Remove local headline state, use prop
  const navigation = useNavigation();
  React.useEffect(() => {
    const sub = navigation.addListener('blur', () => {
      onValueChange(undefined);
    });

    return sub;
  }, []);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function onValueChange(val) {
    if (typeof val === 'string') {
      setValue(val);
      return;
    }

    setValue(undefined);
  }

  // Move styles above the return to avoid use-before-declaration
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: 10,
      
      height: 60,
      marginBottom: -10,
      justifyContent: 'center',
    },
    // Remove menubar/menuItem/menuText/icon, add input style
    input: {
      width: '96%',
      height: 46,
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 14,
      fontSize: 16,
      borderColor: isDarkColorScheme ? '#444' : '#A9A9A9',
      color: isDarkColorScheme ? '#e0e0e0' : '#000',
      backgroundColor: isDarkColorScheme ? '#222' : '#fff',
      shadowColor: isDarkColorScheme ? '#000' : '#ccc',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 10,
      fontFamily: 'UberMove-Regular',
    },

    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    modalContent: {
      width: '94%',
     
      borderRadius: 16,
      padding: 10,
      marginTop: -30,
      alignItems: 'center',
      
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    modalInput: {
      width: '100%',
      minHeight: 80,
      maxHeight: 200,
      borderRadius: 8,
      borderWidth: 1,

      paddingHorizontal: 14,
      fontSize: 18,
  
    
      fontFamily: 'UberMove-Regular',
      marginBottom: 16,
      textAlignVertical: 'top',
      backgroundColor: '#EEE',
    },
    sendButton: {
     
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 32,
      alignItems: 'center',
    },
    sendButtonText: {

      fontFamily: 'UberMove-Bold',
      fontSize: 16,
    },
    sendButtonFull: {
      borderRadius: 8,
      borderWidth: 1,
 
      paddingVertical: 18,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      bottom: 0,
    },
  });

  return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
    
    

                <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: colors.border, borderWidth:1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginHorizontal:0.5, marginBottom:9 }}>
                  <SearchIcon width={21.5} height={21.5} fill={isDarkColorScheme ? '#888' : '#888'} style={{ marginRight: 7 }} />
                  <TextInput
                    editable={true}
                    style={{ flex: 1, fontSize: 16, color: colors.text, fontFamily: 'UberMove-Medium', backgroundColor: 'transparent', paddingVertical: 4 }}
                    placeholder="Ask AI about this tip, stock, financials..."
                    placeholderTextColor={isDarkColorScheme ? '#888' : '#888'}
                    value={query}
                    onChangeText={setQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (!query.trim()) return;
                      const formattedQuery = `\nUser Query: ${query}\nWith reference to the following Investment Tip: ${tip?.tip || 'Provide an investment tip here'}\n`;
                      setWebViewUrl(`https://perplexity.ai/?q=${encodeURIComponent(formattedQuery)}`);
                      setWebViewVisible(true);
                    }}
                    style={{ marginLeft: 6, padding: 2, opacity: query.trim() ? 1 : 0.5 }}
                    accessibilityLabel="Submit Query"
                  >
                    <Ionicons name="send-sharp" size={query.trim() ? 20 : 0} color={colors.text} />
                  </TouchableOpacity>
                </View>

        {/* Modal removed, now handled inline in search bar */}

        {webViewVisible && (
          <Modal
            visible={webViewVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            transparent={false}
            onRequestClose={() => setWebViewVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: isDarkColorScheme ? '#000' : '#fff'}}>
              {/* Top middle closing line indicator */}
              <View style={{ width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 0 }}>
                <TouchableOpacity onPress={() => setWebViewVisible(false)} activeOpacity={0.7} accessibilityLabel="Close WebView">
                  <View
                    style={{
                      width: 44,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: isDarkColorScheme ? '#333' : '#ccc',
                      marginBottom: 2,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <WebView source={{ uri: webViewUrl }} style={{ flex: 1, marginTop:10 }} />
            </View>
          </Modal>
        )}
    

    </ThemeProvider>
  );

}