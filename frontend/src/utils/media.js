const INTERNAL_MEDIA_HOSTS = new Set(['backend', 'localhost', '127.0.0.1', '0.0.0.0']);

function hasExplicitScheme(value) {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value);
}

export function resolveMediaUrl(value) {
  if (typeof value !== 'string') {
    return value || '';
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return '';
  }

  if (trimmedValue.startsWith('data:') || trimmedValue.startsWith('blob:')) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith('/media/')) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith('media/')) {
    return `/${trimmedValue}`;
  }

  const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

  try {
    const parsedUrl = new URL(trimmedValue, baseOrigin);
    const isMediaPath = parsedUrl.pathname.startsWith('/media/');
    const isKnownInternalHost = INTERNAL_MEDIA_HOSTS.has(parsedUrl.hostname);
    const isCurrentHost = typeof window !== 'undefined' && parsedUrl.hostname === window.location.hostname;

    if (isMediaPath && (isKnownInternalHost || isCurrentHost || !hasExplicitScheme(trimmedValue))) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }
  } catch {
    return trimmedValue;
  }

  return trimmedValue;
}

export function normalizeMarkdownMediaUrls(content) {
  if (typeof content !== 'string' || !content.trim()) {
    return content;
  }

  return content.replace(
    /https?:\/\/(?:backend|localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(\/media\/[^\s)"']+)/gi,
    '$1'
  );
}