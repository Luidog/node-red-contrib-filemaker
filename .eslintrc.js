module.exports = {
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 9
  },
  globals: {
    RED: false,
    $: false
  },
  plugins: ["prettier", "html"],
  extends: ["google", "eslint:recommended", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-invalid-this": "off",
    "require-jsdoc": "off"
  }
};
