module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  },
  overrides: [
    {
      files: ['*.vue'],
      extends: [
        'plugin:vue/vue3-essential',
        '@vue/eslint-config-prettier'
      ],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
} 