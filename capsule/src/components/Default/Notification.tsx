import React, { useState } from 'react';
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
  onClose: (id: number) => void;
}

// Компонент уведомлений
const Notification: React.FC<NotificationProps> = ({ notifications, onClose }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button onClick={() => onClose(notification.id)}>Close</button>
        </div>
      ))}
    </div>
  );
};

// Хук для управления уведомлениями
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Функция для добавления уведомления
  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  // Функция для удаления уведомления
  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) => prevNotifications.filter(n => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
};

export default Notification;
