import { apiClient } from './client';

export function listTags() {
  return apiClient.get('/tags');
}
