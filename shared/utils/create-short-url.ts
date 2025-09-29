import { toAbsoluteUrl } from './to-absolute-url';

export function createShortUrl(code: string) {
  return toAbsoluteUrl(`/s/${code}`);
}
