import { apiClient } from './client';

export function listAdminUsers(params = '') {
  return apiClient.get(`/admin/users${params}`);
}

export function updateAdminUser(id, payload) {
  return apiClient.patch(`/admin/users/${id}`, payload);
}

export function listAdminArticles(params = '') {
  return apiClient.get(`/admin/content/articles${params}`);
}

export function createAdminArticle(payload) {
  return apiClient.post('/admin/content/articles', payload);
}

export function updateAdminArticle(id, payload) {
  return apiClient.patch(`/admin/content/articles/${id}`, payload);
}

export function deleteAdminArticle(id) {
  return apiClient.delete(`/admin/content/articles/${id}`);
}

export function listAdminGalleryItems() {
  return apiClient.get('/admin/content/gallery');
}

export function createAdminGalleryItem(payload) {
  return apiClient.post('/admin/content/gallery', payload);
}

export function updateAdminGalleryItem(id, payload) {
  return apiClient.patch(`/admin/content/gallery/${id}`, payload);
}

export function deleteAdminGalleryItem(id) {
  return apiClient.delete(`/admin/content/gallery/${id}`);
}

export function listAdminStories() {
  return apiClient.get('/admin/content/stories');
}

export function createAdminStory(payload) {
  return apiClient.post('/admin/content/stories', payload);
}

export function updateAdminStory(id, payload) {
  return apiClient.patch(`/admin/content/stories/${id}`, payload);
}

export function deleteAdminStory(id) {
  return apiClient.delete(`/admin/content/stories/${id}`);
}

export function listAdminTags() {
  return apiClient.get('/admin/tags');
}

export function createAdminTag(payload) {
  return apiClient.post('/admin/tags', payload);
}

export function updateAdminTag(id, payload) {
  return apiClient.patch(`/admin/tags/${id}`, payload);
}

export function deleteAdminTag(id) {
  return apiClient.delete(`/admin/tags/${id}`);
}
