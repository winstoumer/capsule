import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";
import { useData } from '../components/DataProvider/DataContext';
import Loading from '../components/Loading/Loading';
import Balance from '../components/Balance/Balance';
import HexagonGrid from '../components/Hexagon/HexagonGrid';

const HomePage: React.FC = () => {
  const { balanceData, loading } = useData();

  if (loading) {
    return <Loading />;
  }

  return (
    <PageComponent>
      <Header />
      <div className='general'>
        <Balance>
          {Number(balanceData).toFixed(2)}
        </Balance>
        <ActiveTime />
      </div>
      <HexagonGrid />
      <Navigation />
    </PageComponent>
  );
}

export default HomePage;
