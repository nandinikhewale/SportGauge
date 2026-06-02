import { useState } from 'react';
import { imageFallback } from '../constants/media';

export default function LazyImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  seed = 'default',
}) {
  const [uri, setUri] = useState(src);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <img
        src={uri}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => {
          if (!uri.includes('picsum.photos')) {
            setUri(imageFallback(seed));
          }
        }}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
}
