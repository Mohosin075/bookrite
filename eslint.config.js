import tseslint from 'typescript-eslint';
import plugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': plugin,
    },
    rules: {
      'no-console': 'error',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      'no-unreachable': 'error',
      'no-empty': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
];

export const ignores = ['node_modules/', 'dist/'];
