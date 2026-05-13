import { apiClient } from './client';

export function listAdminUsers(params = '') {
  return apiClient.get(`/admin/users${params}`);
}

export function listAdminArticles(params = '') {
  return apiClient.get(`/admin/content/articles${params}`);
}
