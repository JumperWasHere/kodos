import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

export default [
  {
    ignores: ['**/.next/**', '**/node_modules/**', 'coverage/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // The existing codebase uses these patterns extensively. Keep them visible
      // while allowing lint to serve as a usable incremental quality gate.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
    },
  },
]
