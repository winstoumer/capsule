import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";
import { useData } from '../components/DataProvider/DataContext';
import { Loading } from '../components/Loading/Loading';
import BackgroundComponent from '../components/BackgroundComponent/BackgroundComponent';

const HomePage: React.FC = () => {
  const { balanceData, loading } = useData();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='content'>
      <PageComponent>
        <Header />
        <div className='general'>
          <div className='balance'>{balanceData !== null ? parseFloat(balanceData.toFixed(2)) : 'N/A'}</div>
          <ActiveTime />
        </div>
        <BackgroundComponent />
        <Navigation />
      </PageComponent>
    </div>
  );
}

export default HomePage;
