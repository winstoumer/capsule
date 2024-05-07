// src/pages/Home.tsx
import './home.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";

const Home: React.FC = () => {
  return (
    <div className='content'>
      <div className='general'>
        <div className='watch-capsule'>
          <img src="https://i.ibb.co/wNwqK4Y/Untitled.png" className='always-capsule' />
        </div>
        <ActiveTime />
        <div className='active-signal'>
          Active..
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default Home;
