import React, { createContext, useState, ReactNode, useContext } from 'react';

// Интерфейс уведомления
interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Интерфейс для контекста
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: number) => void;
}

// Создаем контекст
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Провайдер контекста
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Хук для использования контекста
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
