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
      // Pre-existing code style debt: kept as warnings (not build-breaking)
      // so turning lint on for the first time doesn't block an unrelated
      // PR. Tighten to 'error' once the backlog is cleared.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Enterprise Implementation Pattern (ADR-004, EIP-027): the domain and
    // application layers are the core and must stay adapter/transport
    // agnostic. This is scoped ONLY to those files -- composition/, http/,
    // index.ts, and tests are expected to wire or exercise adapters
    // directly, so they are intentionally excluded here (the corresponding
    // dependency-cruiser rules enforce the same boundary at the module
    // level with the same scoping).
    files: ['src/application/**/*.ts', 'src/ports/**/*.ts', 'src/domain.ts', 'src/commerce.ts', 'src/buckpay.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/adapters/*', '**/adapters/**'],
              message:
                'Domain/application layer code must not import adapters directly. Wire adapters through src/composition instead (see ADR-004, EIP-027).',
            },
            {
              group: ['**/http/*', '**/http/**'],
              message: 'Domain/application layer code must not depend on the HTTP transport layer.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs', '.dependency-cruiser.cjs'],
  },
);
