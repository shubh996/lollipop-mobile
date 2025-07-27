import * as React from 'react';
import { SvgXml } from 'react-native-svg';

export const YoutubeIcon = ({ size = 24, color = '#000' }) => (
  <SvgXml xml={`<svg fill="${color}" height="${size}px" width="${size}px" viewBox="0 0 49 49" xmlns="http://www.w3.org/2000/svg"><g><g><path d="M39.256,6.5H9.744C4.371,6.5,0,10.885,0,16.274v16.451c0,5.39,4.371,9.774,9.744,9.774h29.512c5.373,0,9.744-4.385,9.744-9.774V16.274C49,10.885,44.629,6.5,39.256,6.5z M47,32.726c0,4.287-3.474,7.774-7.744,7.774H9.744C5.474,40.5,2,37.012,2,32.726V16.274C2,11.988,5.474,8.5,9.744,8.5h29.512c4.27,0,7.744,3.488,7.744,7.774V32.726z"/><path d="M33.36,24.138l-13.855-8.115c-0.308-0.18-0.691-0.183-1.002-0.005S18,16.527,18,16.886v16.229c0,0.358,0.192,0.69,0.502,0.868c0.154,0.088,0.326,0.132,0.498,0.132c0.175,0,0.349-0.046,0.505-0.137l13.855-8.113c0.306-0.179,0.495-0.508,0.495-0.863S33.667,24.317,33.36,24.138z M20,31.37V18.63l10.876,6.371L20,31.37z"/></g></g></svg>`} width={size} height={size} />
);

export const GoogleIcon = ({ size = 24, color = '#000' }) => (
  <SvgXml xml={`<svg fill="${color}" height="${size}px" width="${size}px" viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg"><path d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105S0,162.897,0,105z"/></svg>`} width={size} height={size} />
);

export const TwitterIcon = ({ size = 24, color = '#1DA1F2' }) => (
  // Placeholder: Add your twitter.svg content here when available
  <SvgXml xml={`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#e5e7eb"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="#1DA1F2">Tw</text></svg>`} width={size} height={size} />
);
