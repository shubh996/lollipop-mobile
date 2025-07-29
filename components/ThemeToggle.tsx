import { colorScheme } from 'nativewind';
import { Pressable, Text, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { MoonStar } from '~/lib/icons/MoonStar';
import { Sun } from '~/lib/icons/Sun';
import { useColorScheme } from '~/lib/useColorScheme';

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
    <Pressable
      onPress={toggleColorScheme}
      style={{
        borderWidth: 1.4,
        borderColor: isDarkColorScheme ? '#333' : '#e0e0e0',
        borderRadius: 11,
        padding: 12.2,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 2,
      }}
      android_ripple={{ color: isDarkColorScheme ? '#333' : '#e0e0e0' }}
    >
      {!isDarkColorScheme ? (
        <MoonStar className='text-foreground' size={23} strokeWidth={1.25} />
      ) : (
        <Sun className='text-foreground' size={24} strokeWidth={1.25} />
      )}
    </Pressable>
  );
}
