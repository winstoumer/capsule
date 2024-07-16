import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { Header } from "../components/Header/Header";
import { useData } from '../components/DataProvider/DataContext';
import Loading from '../components/Loading/Loading';
import Balance from '../components/Balance/Balance';
import SwipeableList from '../components/SwipeableList/SwipeableList';

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
    <circle cx="140" cy="140" r="100" fill="url(#glowGradient)">
      <animate attributeName="r" dur="10s" values="220; 220; 220" repeatCount="indefinite" />
      <animate attributeName="opacity" dur="2s" values="1; 0.5; 1" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="rotate" dur="4s" from="360 100 140" to="360 100 140" repeatCount="indefinite" />
    </circle>
    <circle cx="140" cy="140" r="46" fill="black" />
    <text x="90" y="53" fill="#CF00F8" font-size="30" font-weight="600">2</text>
    <text x="120" y="60" fill="#CF00F8" font-size="34" font-weight="600">2</text>
    <text x="80" y="130" fill="#CF00F8" font-size="38" font-weight="600">2</text>
    <text x="120" y="160" fill="#CF00F8" opacity="0.2" font-size="16" font-weight="600">2</text>
    <text x="190" y="130" fill="#CF00F8" opacity="0.4" font-size="16" font-weight="600">2</text>
    <text x="160" y="70" fill="#CF00F8" font-size="36" font-weight="600" text-anchor="middle" dominant-baseline="middle">2</text>
  </svg>
);

const SvgMatter = (
  <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280">
    <defs>
      <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: '#00CDFF', stopOpacity: 1 }} />
        <stop offset="70%" style={{ stopColor: 'transparent', stopOpacity: 0.5 }} />
        <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="transparent" />
    <circle cx="140" cy="140" r="70" fill="black" />
    <circle cx="140" cy="80" r="70" fill="url(#glowGradient)">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 140 140"
        to="360 140 140"
        dur="20s"
        repeatCount="indefinite"
      />
      <animate attributeName="opacity" dur="2s" values="1; 0.5; 1" repeatCount="indefinite" />
    </circle>
    <circle cx="140" cy="140" r="40" fill="black" />
    <text x="96" y="142" fill="white" opacity="1" font-size="42" font-weight="600">0.02</text>
    <text x="116" y="180" fill="#00CDFF" opacity="1" font-size="22" font-weight="600">59m</text>
  </svg>
);

const HomePage: React.FC = () => {
  const { balanceData, loading } = useData();

  if (loading) {
    return <Loading />;
  }

  const items = [
    { logo: SvgLogo, buttonText: 'Open', link: '/mining' },
    { logo: SvgMatter, buttonText: 'Open', link: '/mining' }
  ];

  return (
    <PageComponent navigation={true} scroll={false}>
      <Header />
      <div className='general'>
        <Balance>
          {Number(balanceData).toFixed(2)}
        </Balance>
        <SwipeableList items={items} />
        <div></div>
      </div>
    </PageComponent>
  );
}

export default HomePage;
