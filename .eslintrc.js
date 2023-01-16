module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-var': 'warn',
    'prefer-const': 'warn',
    'one-var': ['warn', 'never']
  }
};
