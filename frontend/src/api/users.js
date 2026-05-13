import { apiClient } from './client';

export function getCurrentUserProfile() {
  return apiClient.get('/users/me');
}

export function updateCurrentUserProfile(payload) {
  return apiClient.patch('/users/me', payload);
}

export function changePassword(payload) {
  return apiClient.put('/users/me/password', payload);
}
