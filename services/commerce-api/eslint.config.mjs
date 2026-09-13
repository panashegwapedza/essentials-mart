// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/application/**/*.ts', 'src/ports/**/*.ts', 'src/domain.ts', 'src/commerce.ts', 'src/buckpay.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['**/adapters/*', '**/adapters/**'], message: 'Core code must not import adapters directly.' },
            { group: ['**/http/*', '**/http/**'], message: 'Core code must not depend on HTTP transport.' },
          ],
        },
      ],
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs', '.dependency-cruiser.cjs'],
  },
);
