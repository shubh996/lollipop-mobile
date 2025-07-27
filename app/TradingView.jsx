// Platform detection

// TradingView for web: uses div+script injection, for native: uses WebView
import { WebView } from 'react-native-webview';
import React, { memo } from 'react';
import { View , Dimensions, Platform} from 'react-native';
import MenuBar from './MenuBar';


function TradingView({ height, width, symbol = 'NASDAQ:AAPL', compareSymbol, theme = 'dark', onError }) {
 

  // Native implementation (Expo/React Native)
  const config = {
    autosize: true,
    symbol,
    timezone: 'Etc/UTC',
    theme,
    style  : '2',
    locale : 'en',
    height : Platform.OS === 'ios' ? height- 450 : 400,
    width: '100%',
    withdateranges: true,
    range: 'YTD',

    allow_symbol_change: false,
    details: false,
    support_host: 'https://www.tradingview.com',
    ...(compareSymbol
      ? {
          compareSymbols: [
            {
              symbol: compareSymbol,
              position: 'SameScale',
            },
          ],
        }
      : {}),

  calendar: true,

  hide_side_toolbar: true,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  interval: "D",

  



      
  };
  
  
  const configString = JSON.stringify(config, null, 2);
  
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Remove border from TradingView widget and its iframe */
          .tradingview-widget-container, .tradingview-widget-container__widget, iframe, body, html {
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
            background: transparent !important;
          }
          /* Remove border from all elements */
          * {
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
            background: transparent !important;
          }
        </style>
      </head>
      <body style="border:none!important;box-shadow:none!important;outline:none!important;background:transparent!important;">
        <!-- TradingView Widget BEGIN -->
        <div class="tradingview-widget-container" style="height:100%; width:100%; border:0 !important; box-shadow:none !important; outline:none !important; background:transparent !important;">
          <div class="tradingview-widget-container__widget" style="height:100%; width:100%; border:0 !important; box-shadow:none !important; outline:none !important; background:transparent !important;"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
          ${configString}
          </script>
        </div>
        <!-- TradingView Widget END -->
      </body>
    </html>
  `;

  const htmlContentFundamental = `<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js" async>
  {
  "symbol": "NASDAQ:AAPL",
  "colorTheme": "dark",
  "isTransparent": false,
  "locale": "en",
  "width": "550"
}
  </script>
</div>
<!-- TradingView Widget END -->`;
  
  return (
    <>
    {/* <MenuBar /> */}
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      javaScriptEnabled
      domStorageEnabled
      style={{backgroundColor: "transparent", borderRadius: 0,  borderColor: "transparent", width: width, height:"80%",marginTop:0 } }
    />


    </>
  );
}

export default memo(TradingView);