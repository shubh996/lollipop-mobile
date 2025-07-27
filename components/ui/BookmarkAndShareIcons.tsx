import * as React from 'react';
import { SvgXml } from 'react-native-svg';

export const BookmarkIcon = ({ size = 24, color = '#000' }) => (
  <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" height="${size}px" viewBox="0 -960 960 960" width="${size}px" fill="${color}"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>`} width={size} height={size} />
);

export const ShareIcon = ({ size = 24, color = '#000' }) => (
  <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" height="${size}px" viewBox="0 -960 960 960" width="${size}px" fill="${color}"><path d="M240-40q-33 0-56.5-23.5T160-120v-440q0-33 23.5-56.5T240-640h120v80H240v440h480v-440H600v-80h120q33 0 56.5 23.5T800-560v440q0 33-23.5 56.5T720-40H240Zm200-280v-447l-64 64-56-57 160-160 160 160-56 57-64-64v447h-80Z"/></svg>`} width={size} height={size} />
);
