import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  // Debe ir antes de las reglas propias: desactiva curly si va después
  prettier,
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Legibilidad: bloques siempre con llaves y sin condicionales anidados
      curly: ['error', 'all'],
      'no-nested-ternary': 'error',
      'no-else-return': 'error',
      'no-unneeded-ternary': 'error',
      'no-lonely-if': 'error',
      'max-depth': ['warn', 4],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['error'] }],
    },
  },
])
