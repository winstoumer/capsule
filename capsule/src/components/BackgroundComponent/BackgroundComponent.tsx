import React, { useEffect, useState } from 'react';
import './backgroundComponent.scss';

const BackgroundComponent: React.FC = () => {
    const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBouncing(!bouncing);
    }, 2000); // Изменение состояния "прыжка" каждые 2 секунды

    return () => clearInterval(interval);
  }, [bouncing]);

  return (
    <div className={`App ${bouncing ? 'bouncing' : ''}`}>
      <div className="trampoline">
        <div className="person"></div>
      </div>
    </div>
  );
};

export default BackgroundComponent;