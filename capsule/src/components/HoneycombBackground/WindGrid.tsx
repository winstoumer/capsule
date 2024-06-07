import React, { useState, useEffect } from 'react';
import './WindGrid.scss';

const WindGrid: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="northern-lights">
      <svg className={`lights ${isAnimating ? 'animate' : ''}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: '#5ac8fa', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0575e6', stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        <path d="M0,30 Q30,-10 60,30 Q90,70 100,30" fill="url(#grad1)" />
        <path d="M0,50 Q30,10 60,50 Q90,90 100,50" fill="url(#grad1)" />
        <path d="M0,70 Q30,30 60,70 Q90,110 100,70" fill="url(#grad1)" />
      </svg>
    </div>
  );
};

export default WindGrid;


