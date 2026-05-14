import { apiClient } from './client';
import { uploadAdminMedia } from './admin';

function buildQueryString(params = {}) {
  if (typeof params === 'string') {
    return params;
  }

  const searchParams = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''))
  ).toString();

  return searchParams ? `?${searchParams}` : '';
}

export function listAlumniPosts(params = {}) {
  return apiClient.get(`/cong-dong-alumni${buildQueryString(params)}`);
}

export function getAlumniPostDetail(slug) {
  return apiClient.get(`/cong-dong-alumni/${slug}`);
}

export function listAdminAlumniPosts(params = {}) {
  return apiClient.get(`/admin/cong-dong-alumni${buildQueryString(params)}`);
}

export function createAdminAlumniPost(payload) {
  return apiClient.post('/admin/cong-dong-alumni', payload);
}

export function updateAdminAlumniPost(id, payload) {
  return apiClient.put(`/admin/cong-dong-alumni/${id}`, payload);
}

export function deleteAdminAlumniPost(id) {
  return apiClient.delete(`/admin/cong-dong-alumni/${id}`);
}

export function uploadAlumniMedia(file) {
  return uploadAdminMedia(file);
}