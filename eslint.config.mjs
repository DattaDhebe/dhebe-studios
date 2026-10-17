import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['node_modules/**', '.next/**', 'out/**', 'public/**', 'trade/**', 'trading_bot/**'],
}, {
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
  rules: { 'no-unreachable': 'error', 'no-constant-condition': 'error', 'no-duplicate-case': 'error' },
}, {
  files: ['**/*.js', '**/*.mjs'],
  rules: { 'no-unreachable': 'error', 'no-duplicate-case': 'error' },
});
