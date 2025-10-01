import { describe, it, expect } from 'vitest';

import { shortUrlCode } from './code';

describe('shortUrlCode', () => {
  const cases = [
    {
      name: 'digits only',
      input: '1234567890',
      expected: true,
    },
    {
      name: 'empty code',
      input: '',
      expected: false,
    },
    {
      name: 'letters only',
      input: 'abcdefghijklmnopqrstuvwxyz',
      expected: true,
    },
    {
      name: 'mixed',
      input: 'a2s32p2q',
      expected: true,
    },
    {
      name: 'too long',
      input: 'x'.repeat(33),
      expected: false,
    },
    {
      name: 'equal to 32',
      input: 'x'.repeat(32),
      expected: true,
    },
    {
      name: 'with hyphen',
      input: 'custom-123',
      expected: true,
    },
    {
      name: 'with underscore',
      input: 'custom_123',
      expected: true,
    },
    {
      name: 'only hyphen',
      input: '-',
      expected: false,
    },
    {
      name: 'only underscore',
      input: '_',
      expected: false,
    },
    {
      name: 'only underscores and hyphens',
      input: '-_---_-',
      expected: false,
    },
  ];

  it.each(cases)('$name', ({ input, expected }) => {
    expect(shortUrlCode().safeParse(input).success).toBe(
      expected,
    );
  });
});
