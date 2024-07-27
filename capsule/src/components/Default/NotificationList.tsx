import React, { useState, useEffect } from 'react';
import './notification.scss';

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

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
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
