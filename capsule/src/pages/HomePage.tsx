import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { Header } from "../components/Header/Header";
import { useData } from '../components/DataProvider/DataContext';
import Loading from '../components/Loading/Loading';
import Balance from '../components/Balance/Balance';
import { Link } from 'react-router-dom';
import SwipeableList from '../components/SwipeableList/SwipeableList';
import StarryNightBackground from '../components/Background/StarryNightBackground';

const SvgLogo = (
  <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280">
    <defs>
      <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: '#CF00F8', stopOpacity: 1 }} />
        <stop offset="70%" style={{ stopColor: 'transparent', stopOpacity: 0.5 }} />
        <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="transparent" />
    <circle cx="140" cy="140" r="70" fill="black" />
    <circle cx="140" cy="140" r="140" fill="url(#glowGradient)">
      <animate attributeName="r" dur="10s" values="220; 220; 220" repeatCount="indefinite" />
      <animate attributeName="opacity" dur="2s" values="1; 0.5; 1" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="rotate" dur="4s" from="360 100 140" to="360 100 140" repeatCount="indefinite" />
    </circle>
    <circle cx="140" cy="140" r="54" fill="black" />
  </svg>
);

const HomePage: React.FC = () => {
  const { balanceData, loading } = useData();

  if (loading) {
    return <Loading />;
  }

  const items = [
    { logo: SvgLogo, buttonText: 'Open' },
    { logo: SvgLogo, buttonText: 'Mining' }
  ];

  return (
    <PageComponent navigation={true} scroll={false}>
      <Header />
      <div className='general'>
        <Balance>
          {Number(balanceData).toFixed(2)}
        </Balance>
        <SwipeableList items={items} />
        <Link className='default-button' to="/mining">Mining</Link>
      </div>
      <StarryNightBackground maxStars={14} />
    </PageComponent>
  );
}

export default HomePage;
