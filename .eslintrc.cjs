const production = process.env.NODE_ENV === 'production'

module.exports = {
  extends: '@uxuip',
  rules: {
    'no-console': production ? 'error' : 'warn',
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
      },
    ],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'UNIQUE',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'SLOT',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-debugger': 'warn',
    'no-restricted-syntax': 'warn',
    'vue/no-template-shadow': 'off',
  },
}
