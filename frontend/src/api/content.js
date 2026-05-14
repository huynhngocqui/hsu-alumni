import { apiClient } from './client';

export function getPublicContentPage(slug) {
  return apiClient.get(`/content/pages/${slug}`);
}

export function listPublicStories(category) {
  const suffix = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiClient.get(`/content/stories${suffix}`);
}

export function getPublicStoryDetail(slug) {
  return apiClient.get(`/content/stories/${slug}`);
}

export function listPublicGallery() {
  return apiClient.get('/content/gallery');
}

export function getHomepageContent() {
  return apiClient.get('/content/home');
}

export function listArticles(params = '') {
  if (params && typeof params === 'object') {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
    ).toString();
    return apiClient.get(`/content/articles${qs ? '?' + qs : ''}`);
  }
  return apiClient.get(`/content/articles${params}`);
}

export function getArticleDetail(slug) {
  return apiClient.get(`/content/articles/${slug}`);
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
