// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Disables no-explicit-any rule
      '@typescript-eslint/no-floating-promises': 'off', // Disables no-floating-promises rule
      '@typescript-eslint/no-unsafe-argument': 'off', // Disables no-unsafe-argument rule
      '@typescript-eslint/no-unsafe-call': 'off', // Disables no-unsafe-call rule
    },
  },
);
