// navigation.tsx
import { useState, useEffect } from 'react';
import './navigation.scss';
import IconType from '../Default/IconType';
import { navigationForward } from '../utils/handleNavigation';

interface TelegramUserData {
  id: number;
  first_name: string;
}

export const Navigation: React.FC = () => {

  const [userData, setUserData] = useState<TelegramUserData | null>(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      setUserData(user);
    }
  }, []);

  return (
    <div className='bottom-navigation'>
      <div className='navigation'>
        <div className="nav-b" onClick={() => navigationForward('/earn')}>
          <IconType size={34} border={false} type='task' strokeColor='white' />
          Tasks
        </div>
        {userData !== null && userData.id === 935718482 ? (
          <div className="nav-b" onClick={() => navigationForward('/leaderboard')}>
            <IconType size={34} border={false} type='leaderboard' />
            Leaderboard
          </div>
        ) : (<></>)}
        <div className="nav-b" onClick={() => navigationForward('/frens')}>
          <IconType size={34} border={false} type='frens' />
          Frens
        </div>
      </div>
    </div>
  );
};

