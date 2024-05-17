import React, { useState, useEffect } from 'react';
import './home.scss';
import { Header } from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";
import { ActiveTime } from "../components/ActiveTime/ActiveTime";
import PageComponent from '../components/PageComponent/PageComponent';
import axios from 'axios';

const HomePage: React.FC = () => {

  const [userData, setUserData] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  //const [userExists, setUserExists] = useState(false);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      setUserData(user);
      if (user && user.photo_url) {
        setPhotoUrl(user.photo_url);
      }
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

  if (loading) {
    return <div></div>;
  }

  return (
    <div className='content'>
      <PageComponent>
        <Header />
        <div className='general'>
          <div>{photoUrl && <img src={photoUrl} alt={`${userData.first_name}'s profile`} />}</div>
          <div className='balance'>{balance !== null ? parseFloat(balance.toFixed(2)) : 'N/A'}</div>
          <ActiveTime />
        </div>
        <Navigation />
      </PageComponent>
    </div>
  );
}

export default HomePage;