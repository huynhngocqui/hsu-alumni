import { apiClient } from './client';

export function listNotifications() {
  return apiClient.get('/notifications');
}

export function markNotificationAsRead(id) {
  return apiClient.patch(`/notifications/${id}/read`);
}

export function markAllNotificationsAsRead() {
  return apiClient.patch('/notifications/read-all');
}
