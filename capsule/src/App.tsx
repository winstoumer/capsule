import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { CurrentTimeProvider } from './components/CurrentTimeProvider/CurrentTimeContext';
import HomePageWithProviders from './pages/HomePageWithProviders';
import BoostPageWithProviders from './pages/BoostPageWithProviders';
import EarnPage from './pages/EarnPage';
import CollectionPage from './pages/CollectionPage';
import MintPageWithProviders from './pages/MintPageWithProviders';
import MiningPageWithProviders from './pages/MiningPageWithProviders';
import GamePage from './pages/GamePage';
import BoostGamePage from './pages/BoostGamePage';
import FrensPage from './pages/FrensPage';
import StarryNightBackground from './components/Background/StarryNightBackground';
import LeaderboardPage from './pages/LeaderboardPage';
import NotificationList from './components/Default/NotificationList';

const AppWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const contentElement = document.querySelector('.content');

    if (contentElement) {
      contentElement.classList.add('slideDown');
      setTimeout(() => {
        navigate(-1);
      }, 200);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const scriptId = 'telegram-web-app-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.setHeaderColor('#000000');
          window.Telegram.WebApp.expand();

          const backButton = window.Telegram.WebApp.BackButton;
          backButton.onClick(() => {
            handleClick();
          });

          if (location.pathname.startsWith('/game')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/mint/')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/earn')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/frens')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/collections')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/game')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/boostgame')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/boost')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/mining')) {
            backButton.show();
          }
          else if (location.pathname.startsWith('/leaderboard')) {
            backButton.show();
          }
          else {
            backButton.hide();
          }
        }
      };
      document.body.appendChild(script);
    } else {
      if (window.Telegram && window.Telegram.WebApp) {
        if (location.pathname.startsWith('/game')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else if (location.pathname.startsWith('/mint/')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else if (location.pathname.startsWith('/earn')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else if (location.pathname.startsWith('/frens')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else if (location.pathname.startsWith('/collections')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else if (location.pathname.startsWith('/boostgame')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else if (location.pathname.startsWith('/boost')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else if (location.pathname.startsWith('/mining')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else if (location.pathname.startsWith('/leaderboard')) {
          window.Telegram.WebApp.BackButton.show();
        }
        else {
          window.Telegram.WebApp.BackButton.hide();
        }
      }
    }

    return () => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.BackButton.hide();
      }
    };
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePageWithProviders />} />
      <Route path="/mining" element={<MiningPageWithProviders />} />
      <Route path="/boost" element={<BoostPageWithProviders />} />
      <Route path="/boostgame" element={<BoostGamePage />} />
      <Route path="/earn" element={<EarnPage />} />
      <Route path="/frens" element={<FrensPage />} />
      <Route path="/collections" element={<CollectionPage />} />
      <Route path="/mint/:id" element={<MintPageWithProviders />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
    </Routes>
  );
};

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://capsule-server.onrender.com/api/ton-json/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"]
          },
          {
            appName: "nicegramWallet",
            name: "Nicegram Wallet",
            imageUrl: "https://static.nicegram.app/icon.png",
            aboutUrl: "https://nicegram.app",
            universalLink: "https://nicegram.app/tc",
            deepLink: "nicegram-tc://",
            jsBridgeKey: "nicegramWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android"]
          },
          {
            appName: "binanceTonWeb3Wallet",
            name: "Binance Web3 Wallet",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMEIwRTExIi8+CjxwYXRoIGQ9Ik01IDE1TDcuMjU4MDYgMTIuNzQxOUw5LjUxNjEzIDE1TDcuMjU4MDYgMTcuMjU4MUw1IDE1WiIgZmlsbD0iI0YwQjkwQiIvPgo8cGF0aCBkPSJNOC44NzA5NyAxMS4xMjlMMTUgNUwyMS4xMjkgMTEuMTI5TDE4Ljg3MSAxMy4zODcxTDE1IDkuNTE2MTNMMTEuMTI5IDEzLjM4NzFMOC44NzA5NyAxMS4xMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMi43NDE5IDE1TDE1IDEyLjc0MTlMMTcuMjU4MSAxNUwxNSAxNy4yNTgxTDEyLjc0MTkgMTVaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMS4xMjkgMTYuNjEyOUw4Ljg3MDk3IDE4Ljg3MUwxNSAyNUwyMS4xMjkgMTguODcxTDE4Ljg3MSAxNi42MTI5TDE1IDIwLjQ4MzlMMTEuMTI5IDE2LjYxMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0yMC40ODM5IDE1TDIyLjc0MTkgMTIuNzQxOUwyNSAxNUwyMi43NDE5IDE3LjI1ODFMMjAuNDgzOSAxNVoiIGZpbGw9IiNGMEI5MEIiLz4KPC9zdmc+Cg==",
            aboutUrl: "https://www.binance.com/en/web3wallet",
            deepLink: "bnc://app.binance.com/cedefi/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "safari", "ios", "android"],
            universalLink: "https://app.binance.com/cedefi/ton-connect"
          },
          {
            appName: "okxTonWallet2",
            name: "New OKX Wallet",
            imageUrl: "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
            aboutUrl: "https://www.okx.com/web3",
            universalLink: "https://www.okx.com/ul/uYJPB0",
            bridgeUrl: "https://www.okx.com/tonbridge/discover/rpc/bridge",
            jsBridgeKey: "okxTonWallet",
            platforms: ["chrome", "safari", "firefox", "ios", "android"]
          },
          {
            appName: "okxTonWalletTr2",
            name: "New OKX TR Wallet",
            imageUrl: "https://static.okx.com/cdn/assets/imgs/247/587A8296F0BB640F.png",
            aboutUrl: "https://tr.okx.com/web3",
            universalLink: "https://tr.okx.com/ul/uYJPB0?entityId=5",
            jsBridgeKey: "okxTonWallet",
            bridgeUrl: "https://www.okx.com/tonbridge/discover/rpc/bridge",
            platforms: [
              "chrome",
              "safari",
              "firefox",
              "ios",
              "android"
            ]
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/bigmatter_bot/app',
      }}
    >
      <CurrentTimeProvider>
        <Router>
          <AppWrapper />
        </Router>
        <StarryNightBackground maxStars={28} />
        <NotificationList />
      </CurrentTimeProvider>
    </TonConnectUIProvider>
  );
}

export default App;
