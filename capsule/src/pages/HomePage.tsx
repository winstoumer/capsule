import React from 'react';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";
import PageComponent from '../components/PageComponent/PageComponent';
import './home.scss';
import { DataProvider, useData } from '../components/DataProvider/DataContext';

const HomePage: React.FC = () => {
  const { balanceData } = useData();

  return (
    <div className='content'>
      <PageComponent>
        <DataProvider>
          <Header />
            <div className='general'>
              <div className='balance'>{balanceData !== null ? parseFloat(balanceData.toFixed(2)) : 'N/A'}</div>
              <ActiveTime />
            </div>
          <Navigation />
        </DataProvider>
      </PageComponent>
    </div>
  );
}

export default HomePage;
