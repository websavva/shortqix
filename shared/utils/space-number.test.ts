import { describe, it, expect } from 'vitest';

import {
  spaceNumber,
  NON_BREAKING_SPACE,
} from './space-number';

describe('spaceNumber', () => {
  const cases = [
    {
      name: 'should format thousand with space',
      input: 1000,
      expected: `1 000`,
    },
    {
      name: 'should format million with spaces',
      input: 1000000,
      expected: `1 000 000`,
    },
    {
      name: 'should format billion with spaces',
      input: 1000000000,
      expected: `1 000 000 000`,
    },
    {
      name: 'should not add space for numbers less than 1000',
      input: 999,
      expected: '999',
    },
    {
      name: 'should handle zero',
      input: 0,
      expected: '0',
    },
    {
      name: 'should handle single digit',
      input: 5,
      expected: '5',
    },
    {
      name: 'should handle two digits',
      input: 42,
      expected: '42',
    },
    {
      name: 'should handle three digits',
      input: 123,
      expected: '123',
    },
    {
      name: 'should format four digits',
      input: 1234,
      expected: `1 234`,
    },
    {
      name: 'should format five digits',
      input: 12345,
      expected: `12 345`,
    },
    {
      name: 'should format six digits',
      input: 123456,
      expected: `123 456`,
    },
    {
      name: 'should format seven digits',
      input: 1234567,
      expected: `1 234 567`,
    },
    {
      name: 'should handle negative numbers',
      input: -1000,
      expected: `-1 000`,
    },
    {
      name: 'should handle large negative numbers',
      input: -1234567,
      expected: `-1 234 567`,
    },
    {
      name: 'should round decimal numbers',
      input: 1234.567,
      expected: `1 234.567`,
    },
    {
      name: 'should round down decimal numbers',
      input: 1234.4,
      expected: `1 234.4`,
    },
    {
      name: 'should handle exact thousands',
      input: 5000,
      expected: `5 000`,
    },
    {
      name: 'should handle numbers with mixed digits',
      input: 9876543,
      expected: `9 876 543`,
    },
    {
      name: 'should handle numbers with mixed digits and custom delimiter',
      input: 9876543,
      delimiter: ',',
      expected: `9,876,543`,
    },
    {
      name: 'should handle scientific notation',
      input: 15e6,
      expected: `15 000 000`,
    },
    {
      name: 'should handle scientific notation with negative exponent',
      input: 89e-10,
      expected: `0.0000000089`,
    },
  ];

  it.each(cases)(
    '$name',
    ({ input, expected, delimiter = ' ' }) => {
      expect(spaceNumber(input, delimiter)).toBe(expected);
    },
  );

  it('should handle numbers with mixed digits and default delimiter', () => {
    expect(spaceNumber(9876543)).toBe(
      `9${NON_BREAKING_SPACE}876${NON_BREAKING_SPACE}543`,
    );
  });
});
