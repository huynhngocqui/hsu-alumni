import { apiClient } from './client';

export function getPublicContentPage(slug) {
  return apiClient.get(`/content/pages/${slug}`);
}

export function listPublicStories(category) {
  const suffix = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiClient.get(`/content/stories${suffix}`);
}

export function listPublicGallery() {
  return apiClient.get('/content/gallery');
}

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
