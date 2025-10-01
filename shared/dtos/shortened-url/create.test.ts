import { describe, it, expect } from 'vitest';

import { CreateShortenedUrlDtoSchema } from './create';

describe('CreateShortenedUrlDtoSchema', () => {
  const cases = [
    {
      name: 'secure url',
      input: {
        url: 'https://www.google.com',
      },
      expected: true,
    },
    {
      name: 'insecure url',
      input: {
        url: 'http://www.google.com',
      },
      expected: true,
    },

    {
      name: 'wss url',
      input: {
        url: 'wss://www.google.com',
      },
      expected: false,
    },
    {
      name: 'ftp url',
      input: {
        url: 'ftp://www.google.com',
      },
      expected: false,
    },
    {
      name: 'empty url',
      input: {
        url: '',
      },
      expected: false,
    },
    {
      name: 'invalid url',
      input: {
        url: 'invalid',
      },
      expected: false,
    },

    {
      name: 'null code',
      input: {
        url: 'https://www.google.com',
        code: null,
      },
      expected: true,
    },
    {
      name: 'empty code',
      input: {
        url: 'https://www.google.com',
        code: '',
      },
      expected: true,
    },
  ];

  it.each(cases)('$name', ({ input, expected }) => {
    expect(
      CreateShortenedUrlDtoSchema.safeParse(input).success,
    ).toBe(expected);
  });
});
