import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
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

          if (location.pathname.startsWith('/mint/')) {
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
          else {
            backButton.hide();
          }
        }
      };
      document.body.appendChild(script);
    } else {
      if (window.Telegram && window.Telegram.WebApp) {
        if (location.pathname.startsWith('/mint/')) {
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
    </Routes>
  );
};

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://panicky-patti-webapp-8887f7cc.koyeb.app/api/ton-json/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/bigmatter_bot/app',
      }}
    >
      <CurrentTimeProvider>
        <Router>
          <AppWrapper />
        </Router>
        <StarryNightBackground maxStars={14} />
      </CurrentTimeProvider>
    </TonConnectUIProvider>
  );
}

export default App;
