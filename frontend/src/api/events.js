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

export function listEvents(params = {}) {
  return apiClient.get(`/su-kien${buildQueryString(params)}`);
}

export function getEventDetail(slug) {
  return apiClient.get(`/su-kien/${slug}`);
}