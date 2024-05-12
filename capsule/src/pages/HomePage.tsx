import React, { useState, useEffect, useCallback } from 'react';
import './home.scss';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";
import PageComponent from '../components/PageComponent/PageComponent';

const HomePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async (telegramUserId: string) => {
    try {
      const response = await fetch(`https://elaborate-gabriel-webapp-091be922.koyeb.app/api/balance/${telegramUserId}`);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке баланса пользователя');
      }
      const data = await response.json();
      setBalance(parseFloat(data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
    }
  }, []);

  useEffect(() => {
    if (userData && userData.id) {
      fetchBalance(userData.id.toString());
    }
  }, [userData, fetchBalance]);

  if (loading) {
    return <div></div>;
  }

  return (
    <div className='content'>
      <PageComponent>
        <Header />
        <div className='general'>
          <div className='balance'>{balance}</div>
          <ActiveTime />
        </div>
        <Navigation />
      </PageComponent>
    </div>
  );
}

export default HomePage;