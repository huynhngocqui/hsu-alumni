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

export function listJobApplications(id) {
  return apiClient.get(`/jobs/listings/${id}/applications`);
}

export function listOwnerJobListings(params = '') {
  return apiClient.get(`/jobs/owner/listings${params}`);
}

export function updateOwnerJobListing(id, payload) {
  return apiClient.patch(`/jobs/owner/listings/${id}`, payload);
}

export function closeOwnerJobListing(id) {
  return apiClient.post(`/jobs/owner/listings/${id}/close`);
}

export function deleteOwnerJobListing(id) {
  return apiClient.delete(`/jobs/owner/listings/${id}`);
}

export function duplicateOwnerJobListing(id) {
  return apiClient.post(`/jobs/owner/listings/${id}/duplicate`);
}

export function listMyApplications(params = '') {
  return apiClient.get(`/jobs/applications/me${params}`);
}

export function withdrawApplication(id) {
  return apiClient.post(`/jobs/applications/${id}/withdraw`);
}
