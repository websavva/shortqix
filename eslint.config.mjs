import withNuxt from './.nuxt/eslint.config.mjs';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt(
  {
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '#**',
              patternOptions: {
                dot: true,
                nocomment: true,
              },
              group: 'external',
            },
            {
              pattern: '#*/**',
              patternOptions: {
                dot: true,
                nocomment: true,
              },
              group: 'external',
            },
            {
              pattern: '~/**',
              group: 'internal',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
        },
      ],

      'vue/html-self-closing': 'off',
      'vue/camelcase': 'error',
      'vue/attributes-order': 'error',
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/server*'], // Forbid importing from @/server
              message:
                'Please use the #server alias instead of @/server.',
            },
          ],
        },
      ],
    },
  },
);
