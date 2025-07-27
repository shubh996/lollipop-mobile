import { useNavigation } from 'expo-router';
import * as React from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import { Input } from '~/components/ui/input';
import { WebView } from 'react-native-webview';


import { useColorScheme } from '~/lib/useColorScheme';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '~/lib/constants';



export default function MenuBar({ news }) {
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
      Heading: ${news?.headline || 'No heading provided'}
      Summary: ${news?.summary || 'Provide a summary here'}
      Investment Tip: ${news?.tip || 'Provide an investment tip here'}
      User Query: ${pendingQuery || 'No query provided'}
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
      marginBottom: 10,
      justifyContent: 'center',
    },
    // Remove menubar/menuItem/menuText/icon, add input style
    input: {
      width: '100%',
      height: 45,
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 14,
      fontSize: 16,
      borderColor: isDarkColorScheme ? '#444' : '#ccc',
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
    
      
        <Pressable style={{ width: '95%' ,marginVertical:10, marginLeft:"1%"}} onPress={handleFocus}>
          <View pointerEvents="none">
            <Input
              style={styles.input}
              placeholder="Ask AI about this news, stocks, financials..."
              value={query}
              editable={false}
            />
          </View>
        </Pressable>

        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          transparent={false}
          onRequestClose={handleClose}
          style={{ backgroundColor: isDarkColorScheme ? '#000' : '#EEE', flex: 1, padding:20 }}
        >
            <View style={{ backgroundColor: isDarkColorScheme ? '#000' : '#EEE', 
              
              margin: Platform.OS === 'ios' ? 0 : 20,
              flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

                <Input
                  style={[styles.modalInput, {
                    minHeight: '40%',
                    maxHeight: undefined,
                    fontSize: 20,
                    backgroundColor: isDarkColorScheme ? '#000' : '#EEE',
                    color: isDarkColorScheme ? '#e0e0e0' : '#000',
                    padding: 30,
                    borderColor: isDarkColorScheme ? '#000' : '#EEE',
                  }]}
                  placeholder="Ask AI about this news, stocks, financials..."
                  placeholderTextColor={isDarkColorScheme ? '#888' : '#666'}
                  value={pendingQuery}
                  onChangeText={setPendingQuery}
                  autoFocus
                  multiline
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit}
                  blurOnSubmit={true}
                  textAlignVertical="top"
                />
                <View style={{ width: '100%', paddingHorizontal: 0, paddingBottom: 24, justifyContent:"flex-end" }}>
                  <Button size={"lg"} style={{width:"25%", marginLeft:"70%"}}  onPress={handleSubmit}>
                    <Text >Send</Text>
                  </Button>
                </View>
            </View>
    
        </Modal>

        {webViewVisible && (
          <Modal
            visible={webViewVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            transparent={false}
            onRequestClose={() => setWebViewVisible(false)}
          >
            <WebView source={{ uri: webViewUrl }} style={{ flex: 1 }} />
          </Modal>
        )}
    

    </ThemeProvider>
  );

}