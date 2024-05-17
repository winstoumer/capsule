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
      fetchUserData(userData.id.toString(), userData.first_name);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (telegramUserId: string, firstName: string) => {
    try {
      await axios.get(`https://capsule-server.onrender.com/api/user/${telegramUserId}`);
      setUserExists(true);
      fetchBalance(telegramUserId); // Загрузка баланса пользователя после проверки наличия пользователя
    } catch (error) {
      console.error('Пользователь не найден:', error);
      try {
        await axios.post(`https://capsule-server.onrender.com/api/user/new/${telegramUserId}`, { first_name: firstName });
        fetchUserData(telegramUserId, firstName); // Повторный вызов для загрузки данных после создания пользователя
      } catch (createError) {
        console.error('Ошибка при создании пользователя:', createError);
      }
    } finally {
      setLoading(false);
    }
  };

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
