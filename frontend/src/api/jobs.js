import { apiClient } from './client';

export function listJobListings(params = '') {
  return apiClient.get(`/jobs/listings${params}`);
}

export function getJobListing(id) {
  return apiClient.get(`/jobs/listings/${id}`);
}

export function createJobListing(payload) {
  return apiClient.post('/jobs/listings', payload);
}

export function applyToJob(id, payload) {
  return apiClient.post(`/jobs/listings/${id}/apply`, payload);
}
