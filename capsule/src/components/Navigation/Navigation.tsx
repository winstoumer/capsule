// navigation.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navigation.scss';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26">
      <rect x="2" y="2" width="20" height="20" rx="3" ry="3" stroke="gray" stroke-width="1" fill="none" />
      <path d="M6 12l4 4 8-8" stroke="white" stroke-width="2" fill="none" />
    </svg>
  );

  const FrensIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26">
      <symbol id="icon-person" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" fill="white" />
        <path d="M7,13 Q12,16 17,13" stroke="white" stroke-width="2" fill="none" />
      </symbol>
      <use href="#icon-person" x="-5" y="-2" width="24" height="24" />
      <use href="#icon-person" x="5" y="7" width="24" height="24" />
    </svg>
  );

  return (
    <div className='bottom-navigation'>
      <div className='navigation'>
        <div className="nav-b" onClick={() => handleNavigation('/earn')}>
          <TaskIcon />
          Tasks
        </div>
        <div className="nav-b" onClick={() => handleNavigation('/frens')}>
          <FrensIcon />
          Frens
        </div>
      </div>
    </div>
  );
};

