import sonarjs from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import * as eslintrc from '@eslint/eslintrc';



export default [
  {
    languageOptions: {
      globals: eslintrc.Legacy.environments.get('es2024'),
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      'unicorn/better-regex': 'error',
      'unicorn/…': 'error',
    },
  },
  [
  sonarjs.configs.recommended,
  {
    plugins: {
      sonarjs,
    },
  },
]
];