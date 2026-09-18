/** Prefix public assets for subdirectory hosting while preserving external URLs. */
export function assetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return path.startsWith('/') && !path.startsWith('//') ? `${basePath}${path}` : path;
}
