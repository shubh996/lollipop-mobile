import { useFonts } from 'expo-font';

export const fontMap = {
  Bold: require('../assets/uber-move-text/UberMoveTextBold.otf'),
  Medium: require('../assets/uber-move-text/UberMoveTextMedium.otf'),
  Light: require('../assets/uber-move-text/UberMoveTextLight.otf'),
  Regular: require('../assets/uber-move-text/UberMoveTextRegular.otf'),
};

export function useUberMoveFonts() {
  return useFonts({
    'UberMove-Bold': fontMap.Bold,
    'UberMove-Medium': fontMap.Medium,
    'UberMove-Light': fontMap.Light,
    'UberMove-Regular': fontMap.Regular,
  });
}
