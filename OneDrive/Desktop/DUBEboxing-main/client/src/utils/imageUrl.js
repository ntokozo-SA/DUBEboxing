/**
 * Resolves image paths stored in localStorage (data URLs, absolute URLs, or legacy /uploads paths).
 */
export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return url;
}
