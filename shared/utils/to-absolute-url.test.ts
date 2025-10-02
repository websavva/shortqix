import { describe, it, expect, vi } from 'vitest';

import { toAbsoluteUrl } from './to-absolute-url';

describe('toAbsoluteUrl', () => {
  const cases = [
    {
      name: 'should return the absolute url',
      input: '/test',
      expected: 'https://test.com/test',
    },
    {
      name: 'should return the absolute url with protocol',
      input: 'test',
      expected: 'https://test.com/test',
    },
    {
      name: 'should handle custom base url',
      input: '/test',
      expected: 'https://custom.com/test',
      baseUrl: 'https://custom.com',
    },
    {
      input: '/foo/bar?baz=qux&zoo=123&name=%23%23#quux',
      expected:
        'https://test.com/foo/bar?baz=qux&zoo=123&name=%23%23#quux',
    },
    {
      input: '/foo/bar?baz=qux&zoo=123&name=%23%23#quux',
      expected:
        'https://custom.com/foo/bar?baz=qux&zoo=123&name=%23%23#quux',
      baseUrl: 'https://custom.com',
    },
  ];

  it.each(cases)(
    '$name',
    ({ input, expected, baseUrl = 'https://test.com' }) => {
      vi.stubEnv('SQX_BASE_URL', baseUrl);

      expect(toAbsoluteUrl(input)).toBe(expected);
    },
  );
});
