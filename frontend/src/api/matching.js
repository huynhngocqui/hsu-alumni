import { apiClient } from './client';

export function listDashboardMatches() {
  return apiClient.get('/matching/dashboard');
}