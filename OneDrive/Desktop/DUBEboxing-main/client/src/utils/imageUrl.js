/**
 * Build a URL for files in CRA's public folder (logo, hero video, etc.).
 */
export function publicAsset(path) {
  const base = process.env.PUBLIC_URL || '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const encoded = normalized
    .split('/')
    .map((segment, index) =>
      index === 0 ? segment : encodeURIComponent(decodeURIComponent(segment))
    )
    .join('/');
  return `${base}${encoded}`;
}

/**
 * Resolves image paths: data URLs, absolute URLs, public paths, or legacy /uploads paths.
 */
export function resolveImageUrl(url) {
  if (!url) return '';

  if (url.startsWith('data:')) {
    return url;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const { pathname } = new URL(url);
      if (pathname.startsWith('/uploads/') || pathname.startsWith('/')) {
        return publicAsset(pathname);
      }
    } catch {
      /* use original url */
    }
    return url;
  }

  if (url.startsWith('/uploads/') || url.startsWith('/')) {
    return publicAsset(url);
  }

  return url;
}
