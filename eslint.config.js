import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import formatjs from 'eslint-plugin-formatjs';

export default [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    plugins: { formatjs },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
