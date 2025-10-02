export function toAbsoluteUrl(fullPath: string) {
  return (
    process.env.SQX_BASE_URL +
    (!fullPath.startsWith('/') ? '/' : '') +
    fullPath
  );
}
