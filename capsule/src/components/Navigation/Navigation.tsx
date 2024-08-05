// navigation.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navigation.scss';
import IconType from '../Default/IconType';
import { navigationForward } from '../utils/handleNavigation';

interface TelegramUserData {
  id: number;
}

export const Navigation: React.FC = () => {
  const [userData, setUserData] = useState<TelegramUserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      setUserData(user);
    }
  }, []);

  return (
    <div className='bottom-navigation'>
      <div className='navigation'>
        <div className="nav-b" onClick={() => navigationForward(navigate, '/earn')}>
          <IconType size={34} border={false} type='task' strokeColor='white' />
          Tasks
        </div>
        {userData !== null && (userData.id === 935718482 || userData.id === 6226411124 || userData.id === 6642888027) ? (
          <div className="nav-b" onClick={() => navigationForward(navigate, '/leaderboard')}>
            <IconType size={34} border={false} type='leaderboard' />
            Leaderboard
          </div>
        ) : (<></>)}
        <div className="nav-b" onClick={() => navigationForward(navigate, '/frens')}>
          <IconType size={34} border={false} type='frens' />
          Frens
        </div>
      </div>
    </div>
  );
};
