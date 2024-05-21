import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import HomePage from './pages/HomePage';
import BoostPage from './pages/BoostPage';
import EarnPage from './pages/EarnPage';
import NftPage from './pages/NftPage';
import MintNftPage from './pages/MintNftPage';

const AppWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
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
    };

    loadScript();

    return () => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.BackButton.hide();
      }
    };
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/boost" element={<BoostPage />} />
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
      <Router>
        <AppWrapper />
      </Router>
    </TonConnectUIProvider>
  );
}

export default App;