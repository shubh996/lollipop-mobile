import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, Text, Image } from 'react-native';

// Must be exported or Fast Refresh won't update the context
export function App() {
  const [fontsLoaded] = useFonts({
    'UberMove-Bold': require('./assets/uber-move-text/UberMoveTextBold.otf'),
    'UberMove-Medium': require('./assets/uber-move-text/UberMoveTextMedium.otf'),
    'UberMove-Light': require('./assets/uber-move-text/UberMoveTextLight.otf'),
    'UberMove-Regular': require('./assets/uber-move-text/UberMoveTextRegular.otf'),
  });

  if (! fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', position: 'relative' }}>
        
        
        {/* Bottom: Made in India & version */}
        <View style={{ position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#888', fontFamily: 'UberMove-Medium', marginBottom: 2 }}>🇮🇳 Made in India</Text>
          <Text style={{ fontSize: 12, color: '#aaa', fontFamily: 'UberMove-Regular' }}>v{require('./app.json').expo.version}</Text>
        </View>
      </View>
    );
  }

  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
