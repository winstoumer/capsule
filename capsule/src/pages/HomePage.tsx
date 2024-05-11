// src/pages/HomePage.tsx
import './home.scss';
import React from 'react';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";
import PageComponent from '../components/PageComponent/PageComponent';

const HomePage: React.FC = () => {

  return (
    <div className='content'>
      <PageComponent>
        <Header />
        <div className='general'>
          <div className='balance'>120</div>
          <div className='watch-capsule'>
            <img src="/capsule_v_1.png" className='always-capsule' />
          </div>
          <ActiveTime />
        </div>
        <Navigation />
      </PageComponent>
    </div>
  );
}

export default HomePage;
