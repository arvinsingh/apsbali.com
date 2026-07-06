import nextVitals from 'eslint-config-next/core-web-vitals'
import { flat as mdx, flatCodeBlocks } from 'eslint-plugin-mdx'

const projectRules = {
  'prefer-const': 'error',
  'no-var': 'error',
  'prefer-arrow-callback': 'error',
  'prefer-template': 'error',
  'no-useless-concat': 'error',
  'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  'no-else-return': 'error',
  'no-empty-function': 'error',
  'no-empty-pattern': 'error',
  'no-lone-blocks': 'error',
  'no-multi-spaces': 'error',
  'no-trailing-spaces': 'error',
  'no-unneeded-ternary': 'error',
  'no-useless-return': 'error',
  'no-whitespace-before-property': 'error',
  'object-shorthand': ['error', 'always'],
  'no-unsafe-optional-chaining': 'error',
  'no-unused-expressions': [
    'error',
    { allowShortCircuit: true, allowTernary: true },
  ],
  'react-hooks/set-state-in-effect': 'off',
}

const eslintConfig = [
  {
    ignores: ['.next/**', 'content/**', 'out/**', 'public/**'],
  },
  ...nextVitals,
  mdx,
  flatCodeBlocks,
  {
    files: ['**/*.{js,jsx,ts,tsx,md,mdx}'],
    rules: projectRules,
    settings: {
      'mdx/code-blocks': true,
    },
  },
]

export default eslintConfig
