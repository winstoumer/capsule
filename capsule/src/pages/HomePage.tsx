import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { useData } from '../components/DataProvider/DataContext';
import Loading from '../components/Loading/Loading';
import Balance from '../components/Balance/Balance';
import { Link } from 'react-router-dom';

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
        <Link className='default-button' to="/mining">Mining</Link>
      </div>
      <Navigation />
    </PageComponent>
  );
}

export default HomePage;
