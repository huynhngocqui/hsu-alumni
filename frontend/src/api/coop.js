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

export function listOwnerCoopListings(params = '') {
  return apiClient.get(`/coop/owner/listings${params}`);
}

export function updateOwnerCoopListing(id, payload) {
  return apiClient.patch(`/coop/owner/listings/${id}`, payload);
}

export function closeOwnerCoopListing(id) {
  return apiClient.post(`/coop/owner/listings/${id}/close`);
}

export function deleteOwnerCoopListing(id) {
  return apiClient.delete(`/coop/owner/listings/${id}`);
}

export function duplicateOwnerCoopListing(id) {
  return apiClient.post(`/coop/owner/listings/${id}/duplicate`);
}
