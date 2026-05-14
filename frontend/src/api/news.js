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

export function listNewsPosts(params = {}) {
  return apiClient.get(`/tin-tuc${buildQueryString(params)}`);
}

export function getNewsPostDetail(slug) {
  return apiClient.get(`/tin-tuc/${slug}`);
}

export function listNewsCategories() {
  return apiClient.get('/tin-tuc/danh-muc');
}