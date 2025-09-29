export function toAbsoluteUrl(url: string) {
  return (
    process.env.BASE_URL +
    (!url.startsWith('/') ? '/' : '') +
    url
  );
}
