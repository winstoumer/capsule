import React, { useState, useEffect } from 'react';
import './notification.scss';
import IconType from './IconType'; // Убедитесь, что путь корректен

// Интерфейс для уведомления
export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Пропсы для компонента уведомлений
interface NotificationProps {
  notifications: Notification[];
  onRemove: (id: number) => void;
}

// Компонент уведомлений
const NotificationList: React.FC<NotificationProps> = ({ notifications, onRemove }) => {
  useEffect(() => {
    const timerIds = notifications.map(notification =>
      setTimeout(() => onRemove(notification.id), 3000)
    );

    return () => {
      timerIds.forEach(clearTimeout);
    };
  }, [notifications, onRemove]);

  // Функция для выбора типа иконки в зависимости от типа уведомления
  const getIconType = (type: 'success' | 'error' | 'info'): 'checkmark' | 'arrow-left' | 'arrow-right' => {
    switch (type) {
      case 'success':
        return 'checkmark';
      case 'error':
        return 'arrow-left'; // Или заменить на подходящую иконку
      case 'info':
        return 'arrow-right'; // Или заменить на подходящую иконку
      default:
        return 'checkmark'; // Установите иконку по умолчанию
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

// Хук для управления уведомлениями
const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Функция для добавления уведомления
  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
  };

  // Функция для удаления уведомления
  const removeNotification = (id: number) => {
    setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
};

export { NotificationList, useNotifications };
