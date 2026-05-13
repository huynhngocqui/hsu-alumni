import { createContext, useMemo, useState } from 'react';

export const NotificationContext = createContext({
  items: [],
  unreadCount: 0,
  pushNotification: () => {},
  markAllAsRead: () => {},
});

const INITIAL_NOTIFICATIONS = [
  {
    id: 'welcome',
    title: 'Bắt đầu hoàn thiện hồ sơ',
    message: 'Hãy cập nhật lĩnh vực quan tâm để hệ thống có thể gợi ý Co-op và việc làm phù hợp.',
    read: false,
  },
];

export function NotificationProvider({ children }) {
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);

  const value = useMemo(
    () => ({
      items,
      unreadCount: items.filter((item) => !item.read).length,
      pushNotification: (notification) => {
        setItems((current) => [{ ...notification, read: false }, ...current]);
      },
      markAllAsRead: () => {
        setItems((current) => current.map((item) => ({ ...item, read: true })));
      },
    }),
    [items],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
