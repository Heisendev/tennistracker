import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importorder from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      importorder.flatConfigs.recommended,
      importorder.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "import/order":
        [1, {
          "groups": [
            "external",
            "builtin",
            "internal",
            "sibling",
            "parent",
            "index"],
          "pathGroups": [
            { "pattern": "components", "group": "internal" },
            { "pattern": "components/**", "group": "internal" },
            { "pattern": "constants/**", "group": "internal" },
            { "pattern": "services/**", "group": "internal" },
            { "pattern": "error/**", "group": "internal" },
            { "pattern": "hooks/**", "group": "internal" },
            { "pattern": "locales/**", "group": "internal" },
            { "pattern": "assets/**", "group": "internal", "position": "after" }
          ],
          "pathGroupsExcludedImportTypes": ["internal"],
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          },
          "newlines-between": "always"
        }
        ],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        },
        typescript: {
          project: ['./tsconfig.app.json', './tsconfig.node.json'],
          noWarnOnMultipleProjects: true,
        },
      },
    },
  },
])
