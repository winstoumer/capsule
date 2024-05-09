// src/App.tsx

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EarnPage from './pages/EarnPage';
import NftPage from './pages/NftPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/earn" element={<EarnPage />} />
        <Route path="/nft" element={<NftPage />} />
      </Routes>
    </Router>
  );
}

export default App
