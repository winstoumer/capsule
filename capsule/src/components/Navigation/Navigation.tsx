// navigation.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navigation.scss';

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

  const TaskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#1d1d1d" stroke-width="1" fill="none" />
      <path d="M6 12l4 4 8-8" stroke="white" stroke-width="2" fill="none" />
    </svg>
  );

  const FrensIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <symbol id="icon-person" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" fill="white" />
        <path d="M7,13 Q12,16 17,13" stroke="white" stroke-width="2" fill="none" />
      </symbol>
      <use href="#icon-person" x="-5" y="-2" width="24" height="24" />
      <use href="#icon-person" x="5" y="7" width="24" height="24" />
    </svg>
  );

  const LeaderboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <symbol id="icon-leaderboard" viewBox="0 0 24 24">
        <rect x="3" y="8" width="3" height="7" fill="white" />
        <rect x="8" y="4" width="3" height="11" fill="white" />
        <rect x="13" y="6" width="3" height="9" fill="white" />
      </symbol>
      <use href="#icon-leaderboard" x="0" y="0" width="24" height="24" />
      <use href="#icon-leaderboard" x="5" y="5" width="24" height="24" />
    </svg>
  );

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
          <TaskIcon />
          Tasks
        </div>
        {userData !== null && userData.id === 935718482 ? (
          <div className="nav-b" onClick={() => handleNavigation('/leaderboard')}>
            <LeaderboardIcon />
            Leaderboard
          </div>
        ) : (<></>)}
        <div className="nav-b" onClick={() => handleNavigation('/frens')}>
          <FrensIcon />
          Frens
        </div>
      </div>
    </div>
  );
};

