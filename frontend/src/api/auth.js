import { apiClient } from './client';

export function loginUser(payload) {
  return apiClient.post('/auth/login', payload);
}

export function registerUser(payload) {
  return apiClient.post('/auth/register', payload);
}

export function requestPasswordReset(payload) {
  return apiClient.post('/auth/forgot-password', payload);
}

export function resetPassword(payload) {
  return apiClient.post('/auth/reset-password', payload);
}

export function logoutUser() {
  return apiClient.post('/auth/logout');
}
