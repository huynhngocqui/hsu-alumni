import { apiClient } from './client';

export function getHomepageContent() {
  return apiClient.get('/content/home');
}

export function listArticles(params = '') {
  return apiClient.get(`/content/articles${params}`);
}

export function listAlumniStories(params = '') {
  return apiClient.get(`/content/alumni-stories${params}`);
}

export function listGalleryItems(params = '') {
  return apiClient.get(`/content/gallery${params}`);
}

export function contributeGalleryLink(payload) {
  return apiClient.post('/content/gallery/contribute', payload);
}
