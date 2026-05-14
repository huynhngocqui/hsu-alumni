import { useEffect } from 'react';
import { resolveMediaUrl } from '../utils/media';

function ensureMetaTag(selector, create) {
  let tag = document.querySelector(selector);
  const created = !tag;

  if (!tag) {
    tag = document.createElement('meta');
    Object.entries(create).forEach(([key, value]) => {
      tag.setAttribute(key, value);
    });
    document.head.appendChild(tag);
  }

  return { tag, created };
}

export function useSeoMetadata({ title, description, image }) {
  useEffect(() => {
    if (!title && !description && !image) {
      return undefined;
    }

    const previousTitle = document.title;
    const descriptionMeta = ensureMetaTag('meta[name="description"]', { name: 'description' });
    const ogTitleMeta = ensureMetaTag('meta[property="og:title"]', { property: 'og:title' });
    const ogDescriptionMeta = ensureMetaTag('meta[property="og:description"]', { property: 'og:description' });
    const ogImageMeta = ensureMetaTag('meta[property="og:image"]', { property: 'og:image' });

    const previousDescription = descriptionMeta.tag.getAttribute('content') || '';
    const previousOgTitle = ogTitleMeta.tag.getAttribute('content') || '';
    const previousOgDescription = ogDescriptionMeta.tag.getAttribute('content') || '';
    const previousOgImage = ogImageMeta.tag.getAttribute('content') || '';

    if (title) {
      document.title = title;
      ogTitleMeta.tag.setAttribute('content', title);
    }

    if (description) {
      descriptionMeta.tag.setAttribute('content', description);
      ogDescriptionMeta.tag.setAttribute('content', description);
    }

    const resolvedImage = resolveMediaUrl(image);

    if (resolvedImage) {
      ogImageMeta.tag.setAttribute('content', resolvedImage);
    }

    return () => {
      document.title = previousTitle;

      if (descriptionMeta.created) {
        descriptionMeta.tag.remove();
      } else {
        descriptionMeta.tag.setAttribute('content', previousDescription);
      }

      if (ogTitleMeta.created) {
        ogTitleMeta.tag.remove();
      } else {
        ogTitleMeta.tag.setAttribute('content', previousOgTitle);
      }

      if (ogDescriptionMeta.created) {
        ogDescriptionMeta.tag.remove();
      } else {
        ogDescriptionMeta.tag.setAttribute('content', previousOgDescription);
      }

      if (ogImageMeta.created) {
        ogImageMeta.tag.remove();
      } else {
        ogImageMeta.tag.setAttribute('content', previousOgImage);
      }
    };
  }, [description, image, title]);
}