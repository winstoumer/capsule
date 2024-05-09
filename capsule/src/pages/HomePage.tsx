// src/pages/HomePage.tsx
import './home.scss';
import React, { useState, useEffect } from 'react';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";

const HomePage: React.FC = () => {
  const [activeText, setActiveText] = useState("Active..");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveText(prevText => prevText === "Active.." ? "Search Nft.." : "Active..");
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='content'>
      <Header />
      <div className='general'>
        <div className='balance'>120</div>
        <div className='watch-capsule'>
          <img src="/capsule_v_1.png" className='always-capsule' />
        </div>
        <ActiveTime />
        <div className='active-signal'>
          {activeText}
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default HomePage;
