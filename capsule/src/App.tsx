// src/App.tsx

import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import HomePage from './pages/HomePage';
import BoostPage from './pages/BoostPage';
import EarnPage from './pages/EarnPage';
import NftPage from './pages/NftPage';
import MintNftPage from './pages/MintNftPage';

function App() {

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.setHeaderColor('#000000');
          window.Telegram.WebApp.expand();
        }
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  return (
    <TonConnectUIProvider manifestUrl="https://capsule-server.onrender.com/api/ton-json/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/gbaswebtest_bot/app'
      }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boost" element={<BoostPage />} />
          <Route path="/earn" element={<EarnPage />} />
          <Route path="/collections" element={<NftPage />} />
          <Route path="/mint/:id" element={<MintNftPage />} />
        </Routes>
      </Router>
    </TonConnectUIProvider>
  );
}

export default App
