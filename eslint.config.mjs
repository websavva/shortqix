import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  eslintPluginPrettier,
  {
    ignores: ['*.test.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'off',
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
              pattern: '#shared/**',
              patternOptions: {
                dot: true,
                nocomment: true,
              },
              group: 'internal',
            },
            {
              pattern: '#server/**',
              patternOptions: {
                dot: true,
                nocomment: true,
              },
              group: 'internal',
            },
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

      // Vue formatting rules
      'vue/no-export-in-script-setup': 'off',
      'vue/html-self-closing': 'off',
      'vue/camelcase': 'error',
      'vue/attributes-order': 'error',
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],

      // Vue template rules (non-formatting)
      'vue/no-template-key': 'error',
      'vue/no-textarea-mustache': 'error',
      'vue/require-multiline-attribute': 'off',
      'vue/v-for-delimiter-style': ['error', 'in'],
      'vue/component-definition-name-casing': [
        'error',
        'PascalCase',
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: true,
          ignores: [],
        },
      ],
      'vue/custom-event-name-casing': [
        'error',
        'camelCase',
      ],
      'vue/define-macros-order': [
        'error',
        {
          order: [
            'defineOptions',
            'defineProps',
            'defineEmits',
            'defineSlots',
          ],
        },
      ],
      'vue/no-multiple-objects-in-class': 'error',
      'vue/no-useless-mustaches': [
        'error',
        {
          ignoreIncludesComment: false,
          ignoreStringEscape: false,
        },
      ],
      'vue/padding-line-between-blocks': [
        'error',
        'always',
      ],
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/require-direct-export': 'error',
      'vue/v-on-event-hyphenation': [
        'error',
        'always',
        {
          autofix: false,
          ignore: [],
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
]);
