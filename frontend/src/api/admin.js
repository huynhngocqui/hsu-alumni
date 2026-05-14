import { apiClient } from './client';

function buildQueryString(params = {}) {
  if (typeof params === 'string') {
    return params;
  }

  const queryString = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    )
  ).toString();

  return queryString ? `?${queryString}` : '';
}

export function getAdminSummary() {
  return apiClient.get('/admin/summary');
}

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

export function listAdminNewsPosts(params = {}) {
  return apiClient.get(`/admin/tin-tuc${buildQueryString(params)}`);
}

export function getAdminNewsPost(id) {
  return apiClient.get(`/admin/tin-tuc/${id}`);
}

export function createAdminNewsPost(payload) {
  return apiClient.post('/admin/tin-tuc', payload);
}

export function updateAdminNewsPost(id, payload) {
  return apiClient.put(`/admin/tin-tuc/${id}`, payload);
}

export function deleteAdminNewsPost(id) {
  return apiClient.delete(`/admin/tin-tuc/${id}`);
}

export function listAdminNewsCategories() {
  return apiClient.get('/admin/tin-tuc/danh-muc');
}

export function createAdminNewsCategory(payload) {
  return apiClient.post('/admin/tin-tuc/danh-muc', payload);
}

export function updateAdminNewsCategory(id, payload) {
  return apiClient.put(`/admin/tin-tuc/danh-muc/${id}`, payload);
}

export function deleteAdminNewsCategory(id) {
  return apiClient.delete(`/admin/tin-tuc/danh-muc/${id}`);
}

export function listAdminEvents(params = {}) {
  return apiClient.get(`/admin/su-kien${buildQueryString(params)}`);
}

export function getAdminEvent(id) {
  return apiClient.get(`/admin/su-kien/${id}`);
}

export function createAdminEvent(payload) {
  return apiClient.post('/admin/su-kien', payload);
}

export function updateAdminEvent(id, payload) {
  return apiClient.put(`/admin/su-kien/${id}`, payload);
}

export function deleteAdminEvent(id) {
  return apiClient.delete(`/admin/su-kien/${id}`);
}

export function uploadAdminMedia(file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/admin/upload', formData);
}
