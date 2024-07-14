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
      }, 100); // Задержка должна соответствовать длительности анимации
    } else {
      navigate(path);
    }
  };

  return (
    <div className='bottom-navigation'>
      <div className='navigation'>
        <div className="nav-b" onClick={() => handleNavigation('/earn')}>
          Tasks
        </div>
        <div className="nav-b" onClick={() => handleNavigation('/frens')}>
          Frens
        </div>
        <div className="nav-b" onClick={() => handleNavigation('/collections')}>
          Nft
        </div>
      </div>
    </div>
  );
};

