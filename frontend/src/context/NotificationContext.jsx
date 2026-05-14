import { createContext, useEffect, useMemo, useState } from 'react';

import { listNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../api/notifications';
import { useAuth } from '../hooks/useAuth';

export const NotificationContext = createContext({
  items: [],
  unreadCount: 0,
  pushNotification: () => {},
  markAsRead: async () => {},
  markAllAsRead: () => {},
  refreshNotifications: async () => [],
});

export function NotificationProvider({ children }) {
  const { isAuthenticated, isAuthReady } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;

    async function bootstrapNotifications() {
      if (!isAuthReady) {
        return;
      }

      if (!isAuthenticated) {
        if (active) {
          setItems([]);
        }
        return;
      }

      try {
        const nextItems = await listNotifications();
        if (active) {
          setItems(nextItems);
        }
      } catch {
        if (active) {
          setItems([]);
        }
      }
    }

    bootstrapNotifications();

    return () => {
      active = false;
    };
  }, [isAuthReady, isAuthenticated]);

  const value = useMemo(
    () => ({
      items,
      unreadCount: items.filter((item) => !item.read).length,
      pushNotification: (notification) => {
        setItems((current) => [{ ...notification, read: false }, ...current]);
      },
      markAsRead: async (id) => {
        if (!isAuthenticated) {
          setItems((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
          return null;
        }

        const updated = await markNotificationAsRead(id);
        setItems((current) => current.map((item) => (item.id === id ? updated : item)));
        return updated;
      },
      markAllAsRead: async () => {
        if (!isAuthenticated) {
          setItems((current) => current.map((item) => ({ ...item, read: true })));
          return [];
        }

        const nextItems = await markAllNotificationsAsRead();
        setItems(nextItems);
        return nextItems;
      },
      refreshNotifications: async () => {
        if (!isAuthenticated) {
          setItems([]);
          return [];
        }

        const nextItems = await listNotifications();
        setItems(nextItems);
        return nextItems;
      },
    }),
    [isAuthenticated, items],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
