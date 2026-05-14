import { useEffect, useState } from 'react';
import { resolveMediaUrl } from '../../utils/media';

function BrandImage({ src, alt, className = '', fallback = null, ...props }) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = resolveMediaUrl(src);

  useEffect(() => {
    setHasError(false);
  }, [resolvedSrc]);

  if (!resolvedSrc || hasError) {
    return fallback;
  }

  return <img src={resolvedSrc} alt={alt} className={className} onError={() => setHasError(true)} {...props} />;
}

export default BrandImage;