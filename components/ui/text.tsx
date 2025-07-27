import * as Slot from '@rn-primitives/slot';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { Platform } from 'react-native';
import { fontMap } from '~/lib/fonts';
import { cn } from '~/lib/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  style,
  fontWeight = 'Regular',
  ...props
}: React.ComponentProps<typeof RNText> & {
  ref?: React.RefObject<RNText>;
  asChild?: boolean;
  fontWeight?: 'Bold' | 'Medium' | 'Light' | 'Regular';
}) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  // Map fontWeight prop to UberMove font family
  let fontFamily = undefined;
  switch (fontWeight) {
    case 'Bold':
      fontFamily = Platform.select({
        ios: 'UberMove-Bold',
        android: 'UberMove-Bold',
        default: 'UberMove-Bold',
      });
      break;
    case 'Medium':
      fontFamily = Platform.select({
        ios: 'UberMove-Medium',
        android: 'UberMove-Medium',
        default: 'UberMove-Medium',
      });
      break;
    case 'Light':
      fontFamily = Platform.select({
        ios: 'UberMove-Light',
        android: 'UberMove-Light',
        default: 'UberMove-Light',
      });
      break;
    default:
      fontFamily = Platform.select({
        ios: 'UberMove-Regular',
        android: 'UberMove-Regular',
        default: 'UberMove-Regular',
      });
  }
  return (
    <Component
      className={cn('text-base text-foreground web:select-text', textClass, className)}
      style={[{ fontFamily }, style]}
      {...props}
    />
  );
}

export { Text, TextClassContext };
