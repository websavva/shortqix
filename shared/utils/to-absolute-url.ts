export function toAbsoluteUrl(fullPath: string) {
  return (
    process.env.BASE_URL +
    (!fullPath.startsWith('/') ? '/' : '') +
    fullPath
  );
}
