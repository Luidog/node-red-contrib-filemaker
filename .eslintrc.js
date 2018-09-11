module.exports = {
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  plugins: ['prettier'],
  extends: ['google', 'eslint:recommended'],
  rules: {
    'prettier/prettier': 'error'
  }
};