// src/App.tsx

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BoostPage from './pages/BoostPage';
import EarnPage from './pages/EarnPage';
import NftPage from './pages/NftPage';
import dotenv from 'dotenv';

dotenv.config();

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/boost" element={<BoostPage />} />
        <Route path="/earn" element={<EarnPage />} />
        <Route path="/nft" element={<NftPage />} />
      </Routes>
    </Router>
  );
}

export default App
