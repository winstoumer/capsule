import React, { useState, useEffect } from 'react';
import './home.scss';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";
import PageComponent from '../components/PageComponent/PageComponent';
import axios from 'axios';

type TelegramUserData = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

const HomePage: React.FC = () => {

  const [userData, setUserData] = useState<TelegramUserData | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      setUserData(user);
    }
  }, []);

  useEffect(() => {
    if (userData && userData.id) {
      fetchBalance(userData.id.toString());
    }
  }, [userData]);

  const fetchBalance = async (telegramUserId: string) => {
    try {
      const response = await axios.get(`https://capsule-server.onrender.com/api/balance/${telegramUserId}`);
      const responseData = response.data;
      if (responseData.hasOwnProperty('balance')) {
        const balanceValue = parseFloat(responseData.balance);
        if (!isNaN(balanceValue)) {
          setBalance(balanceValue);
        } else {
          throw new Error('Неверный формат баланса');
        }
      } else {
        throw new Error('Отсутствует поле "balance" в ответе сервера');
      }
    } catch (error) {
      console.error('Ошибка при загрузке баланса пользователя:', error);
      // Добавьте обработку ошибки, например, уведомление пользователю
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userData)
      try {
        await axios.get(`https://capsule-server.onrender.com/api/user/${userData.id}`);
        setUserExists(true);
      } catch (error) {
        console.error('Пользователь не найден:', error);
        await axios.post(`https://capsule-server.onrender.com/api/user/new/${userData.id}`, { first_name: userData.first_name });
        await fetchData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!userExists) {
    return <div>create account...</div>;
  }

  return (
    <div className='content'>
      <PageComponent>
        <Header />
        <div className='general'>
          <div className='balance'>{balance !== null ? parseFloat(balance.toFixed(2)) : 'N/A'}</div>
          <ActiveTime />
        </div>
        <Navigation />
      </PageComponent>
    </div>
  );
}

export default HomePage;