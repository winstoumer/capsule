import React, { useEffect } from 'react';
import './notification.scss';
import IconType from './IconType'; // Убедитесь, что путь корректен
import { useNotifications } from '../Providers/NotificationContext';

const NotificationList: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  useEffect(() => {
    const timerIds = notifications.map(notification =>
      setTimeout(() => removeNotification(notification.id), 3000)
    );

    return () => {
      timerIds.forEach(clearTimeout);
    };
  }, [notifications, removeNotification]);

  const getIconType = (type: 'success' | 'error' | 'info'): 'checkmark' | 'error' | 'info' => {
    switch (type) {
      case 'success':
        return 'checkmark';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'checkmark';
    }
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className='notification'>
          <IconType type={getIconType(notification.type)} strokeColor='white' />
          <span className="notification-text">{notification.message}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
