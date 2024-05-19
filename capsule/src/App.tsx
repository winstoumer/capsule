// src/App.tsx

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import HomePage from './pages/HomePage';
import BoostPage from './pages/BoostPage';
import EarnPage from './pages/EarnPage';
import NftPage from './pages/NftPage';
import MintNftPage from './pages/MintNftPage';

function App() {

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
