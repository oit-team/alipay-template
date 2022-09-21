module.exports = {
  extends: [
    '@oit/vue',
  ],
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    getCurrentPages: 'readonly',
  },
  overrides: [
    {
      files: [
        'manifest.json',
      ],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/key-spacing': 'off',
        'jsonc/indent': 'off',
      },
    },
  ],
  rules: {
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
    ],
    'vue/component-definition-name-casing': [
      'error',
      'kebab-case',
    ],
  },
}
