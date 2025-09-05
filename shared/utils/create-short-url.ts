export function createShortUrl(code: string) {
  return `${process.env.BASE_URL}/s/${code}`;
}
