import { apiClient } from './client';

export function listCoopListings(params = '') {
  return apiClient.get(`/coop/listings${params}`);
}

export function getCoopListing(id) {
  return apiClient.get(`/coop/listings/${id}`);
}

export function createCoopListing(payload) {
  return apiClient.post('/coop/listings', payload);
}
