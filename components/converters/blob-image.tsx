'use client';

import { useEffect, useState, type ImgHTMLAttributes } from 'react';

export function BlobImage({ blob, ...props }: { blob: Blob } & ImgHTMLAttributes<HTMLImageElement>) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url ? <img {...props} src={url} /> : null;
}
