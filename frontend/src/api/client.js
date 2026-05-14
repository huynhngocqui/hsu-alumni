const DEFAULT_HEADERS = {
  Accept: 'application/json',
};

function extractErrorMessage(payload) {
  if (!payload) {
    return '';
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const message = extractErrorMessage(item);
      if (message) {
        return message;
      }
    }
    return '';
  }

  if (typeof payload === 'object') {
    for (const key of ['detail', 'error', 'message']) {
      const message = extractErrorMessage(payload[key]);
      if (message) {
        return message;
      }
    }

    for (const value of Object.values(payload)) {
      const message = extractErrorMessage(value);
      if (message) {
        return message;
      }
    }
  }

  return '';
}

function getCookie(name) {
  if (typeof document === 'undefined') {
    return '';
  }

  return document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))
    ?.split('=')[1] ?? '';
}

async function request(path, options = {}) {
  const headers = {
    ...DEFAULT_HEADERS,
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers ?? {}),
  };

  const response = await fetch(`/api${path}`, {
    credentials: 'include',
    ...options,
    headers,
    body:
      options.body instanceof FormData || options.body == null
        ? options.body
        : JSON.stringify(options.body),
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(extractErrorMessage(payload) || 'Đã có lỗi xảy ra.');
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const apiClient = {
  get: (path, options) => request(path, { method: 'GET', ...options }),
  post: (path, body, options) =>
    request(path, {
      method: 'POST',
      body,
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        ...(options?.headers ?? {}),
      },
      ...options,
    }),
  patch: (path, body, options) =>
    request(path, {
      method: 'PATCH',
      body,
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        ...(options?.headers ?? {}),
      },
      ...options,
    }),
  put: (path, body, options) =>
    request(path, {
      method: 'PUT',
      body,
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        ...(options?.headers ?? {}),
      },
      ...options,
    }),
  delete: (path, options) =>
    request(path, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        ...(options?.headers ?? {}),
      },
      ...options,
    }),
};
