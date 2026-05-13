import { useEffect, useState } from 'react';

function BrandImage({ src, alt, className = '', fallback = null }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return fallback;
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
}

export default BrandImage;