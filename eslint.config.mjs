import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'object-curly-spacing': ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-trailing-spaces': 'error',
      'semi-style': ['error', 'last'],
      'indent': ['error', 2],
      'jsx-quotes': ['error', 'prefer-single'],
      'comma-dangle': [
        'error',
        {
          arrays: 'never',
          objects: 'never',
          imports: 'never',
          exports: 'never',
          functions: 'never'
        }
      ],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never', { beforeStatementContinuationChars: 'never' }],
      'no-mixed-spaces-and-tabs': 0
    }
  }
]

export default eslintConfig
