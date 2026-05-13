import { apiClient } from './client';

export function lookupPeopleSoftProfile(payload) {
  return apiClient.post('/integrations/peoplesoft/lookup', payload);
}
