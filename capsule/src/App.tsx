import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import HomePageWithProviders from './pages/HomePageWithProviders';
import BoostPageWithProviders from './pages/BoostPageWithProviders';
import EarnPage from './pages/EarnPage';
import NftPage from './pages/CollectionPage';
import MintNftPage from './pages/MintPage';
import { CurrentTimeProvider } from './components/CurrentTimeProvider/CurrentTimeContext';

const AppWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
            navigate(-1); // Use navigate with a negative number to go back
          });

          if (location.pathname.startsWith('/mint/')) {
            backButton.show();
          } else {
            backButton.hide();
          }
        }
      };
      document.body.appendChild(script);
    } else {
      if (window.Telegram && window.Telegram.WebApp) {
        if (location.pathname.startsWith('/mint/')) {
          window.Telegram.WebApp.BackButton.show();
        } else {
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
      <Route path="/boost" element={<BoostPageWithProviders />} />
      <Route path="/earn" element={<EarnPage />} />
      <Route path="/collections" element={<NftPage />} />
      <Route path="/mint/:id" element={<MintNftPage />} />
    </Routes>
  );
};

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://capsule-server.onrender.com/api/ton-json/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/gbaswebtest_bot/app',
      }}
    >
      <CurrentTimeProvider>
        <Router>
          <AppWrapper />
        </Router>
      </CurrentTimeProvider>
    </TonConnectUIProvider>
  );
}

export default App;
