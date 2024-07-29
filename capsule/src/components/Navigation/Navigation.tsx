// navigation.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navigation.scss';
import IconType from '../Default/IconType';

interface TelegramUserData {
  id: number;
  first_name: string;
}

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<TelegramUserData | null>(null);

  const handleNavigation = (path: string) => {
    const contentElement = document.querySelector('.content');

    if (contentElement) {
      contentElement.classList.add('slideDown');
      setTimeout(() => {
        navigate(path);
      }, 200); // Задержка должна соответствовать длительности анимации
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      setUserData(user);
    }
  }, []);

  return (
    <div className='bottom-navigation'>
      <div className='navigation'>
        <div className="nav-b" onClick={() => handleNavigation('/earn')}>
          <IconType size={24} type='task' strokeColor='white' />
          Tasks
        </div>
        {userData !== null && userData.id === 935718482 ? (
          <div className="nav-b" onClick={() => handleNavigation('/leaderboard')}>
            <IconType size={24} type='leaderboard' />
            Leaderboard
          </div>
        ) : (<></>)}
        <div className="nav-b" onClick={() => handleNavigation('/frens')}>
          <IconType size={24} type='frens' />
          Frens
        </div>
      </div>
    </div>
  );
};

