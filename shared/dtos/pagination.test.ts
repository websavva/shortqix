import { describe, it, expect } from 'vitest';

import { PaginationParamsSchema } from './pagination';

describe('PaginationParamsSchema', () => {
  const cases = [
    {
      name: 'default values',
      input: {},
      expectedSuccess: true,
      expectedOutput: {
        page: 1,
        limit: 5,
      },
    },
    {
      name: 'only limit',
      input: {
        limit: 10,
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 1,
        limit: 10,
      },
    },
    {
      name: 'only page',
      input: {
        page: 1,
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 1,
        limit: 5,
      },
    },
    {
      name: 'too large limit',
      input: {
        limit: 101,
      },
      expectedSuccess: false,
    },
    {
      name: 'valid page and limit',
      input: {
        page: 1,
        limit: 10,
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 1,
        limit: 10,
      },
    },
    {
      name: 'page only (limit defaults to 5)',
      input: {
        page: 3,
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 3,
        limit: 5,
      },
    },
    {
      name: 'limit only (page defaults to 1)',
      input: {
        limit: 20,
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 1,
        limit: 20,
      },
    },
    {
      name: 'maximum limit (100)',
      input: {
        page: 1,
        limit: 100,
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 1,
        limit: 100,
      },
    },
    {
      name: 'coerce string to number',
      input: {
        page: '5',
        limit: '25',
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 5,
        limit: 25,
      },
    },
    {
      name: 'coerce string page only',
      input: {
        page: '10',
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 10,
        limit: 5,
      },
    },
    {
      name: 'large page number',
      input: {
        page: 999,
        limit: 50,
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 999,
        limit: 50,
      },
    },
    {
      name: 'limit exceeds maximum (101)',
      input: {
        page: 1,
        limit: 101,
      },
      expectedSuccess: false,
    },
    {
      name: 'limit exceeds maximum (500)',
      input: {
        page: 1,
        limit: 500,
      },
      expectedSuccess: false,
    },
    {
      name: 'zero page',
      input: {
        page: 0,
        limit: 10,
      },
      expectedSuccess: false,
    },
    {
      name: 'negative page',
      input: {
        page: -1,
        limit: 10,
      },
      expectedSuccess: false,
    },
    {
      name: 'zero limit',
      input: {
        page: 1,
        limit: 0,
      },
      expectedSuccess: false,
    },
    {
      name: 'negative limit',
      input: {
        page: 1,
        limit: -5,
      },
      expectedSuccess: false,
    },
    {
      name: 'decimal page (rounds)',
      input: {
        page: 2.7,
        limit: 10,
      },
      expectedSuccess: false,
    },
    {
      name: 'decimal limit (rounds)',
      input: {
        page: 1,
        limit: 15.5,
      },
      expectedSuccess: false,
    },
    {
      name: 'non-numeric string page',
      input: {
        page: 'invalid',
        limit: 10,
      },
      expectedSuccess: false,
    },
    {
      name: 'non-numeric string limit',
      input: {
        page: 1,
        limit: 'invalid',
      },
      expectedSuccess: false,
    },
    {
      name: 'null values',
      input: {
        page: null,
        limit: null,
      },
      expectedSuccess: false,
    },
    {
      name: 'undefined values (should use defaults)',
      input: {
        page: undefined,
        limit: undefined,
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 1,
        limit: 5,
      },
    },
    {
      name: 'boolean values',
      input: {
        page: true,
        limit: false,
      },
      expectedSuccess: false,
    },
    {
      name: 'array values',
      input: {
        page: [1, 2],
        limit: [10, 20],
      },
      expectedSuccess: false,
    },
    {
      name: 'object values',
      input: {
        page: { value: 1 },
        limit: { value: 10 },
      },
      expectedSuccess: false,
    },
    {
      name: 'empty string (coerces to NaN)',
      input: {
        page: '',
        limit: '',
      },
      expectedSuccess: false,
    },
    {
      name: 'numeric string with spaces',
      input: {
        page: ' 5 ',
        limit: ' 10 ',
      },
      expectedSuccess: true,
      expectedOutput: {
        page: 5,
        limit: 10,
      },
    },
    {
      name: 'Infinity page',
      input: {
        page: Infinity,
        limit: 10,
      },
      expectedSuccess: false,
    },
    {
      name: 'NaN values',
      input: {
        page: 'invalid',
        limit: 'invalid',
      },
      expectedSuccess: false,
    },
  ];

  it.each(cases)(
    '$name',
    ({ input, expectedSuccess, expectedOutput }) => {
      const result =
        PaginationParamsSchema.safeParse(input);

      expect(result.success).toBe(expectedSuccess);

      if (expectedSuccess) {
        expect(result.data).toEqual(expectedOutput);
      }
    },
  );
});
