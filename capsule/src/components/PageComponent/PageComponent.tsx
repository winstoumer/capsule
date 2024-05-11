import React, { useEffect, ReactNode } from 'react';

interface PageComponentProps {
  children: ReactNode;
}

const PageComponent: React.FC<PageComponentProps> = ({ children }) => {
  
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.setHeaderColor('#000000');
          window.Telegram.WebApp.headerColor('#4815ff');
          window.Telegram.WebApp.expand();
        }
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  return <>{children}</>;
};

export default PageComponent;
