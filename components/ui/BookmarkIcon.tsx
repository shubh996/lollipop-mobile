import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { useColorScheme } from 'react-native';

export const BookmarkIcon = ({ color = '#000', size = 24 }) => (
  <SvgXml xml={`<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"${size}px\" viewBox=\"0 -960 960 960\" width=\"${size}px\" fill=\"${color}\"><path d=\"M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z\"/></svg>`} width={size} height={size} />
);
