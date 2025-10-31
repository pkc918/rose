import rose from '@antfu/eslint-config'

export default rose(
  {
    typescript: true,
    vue: true,
  },
  {
    ignores: [
      '**/types',
      '**/*.svg',
      'packages/templates/**',
    ],
  },
  {
    rules: {
      'vue/no-deprecated-functional-template': 'off',
      'vue/one-component-per-file': 'off',
      'vue/no-template-shadow': 'off',
      'vue/require-prop-types': 'off',
      'ts/ban-types': 'off',
      'node/no-callback-literal': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'node/prefer-global/process': 'off',
      'ts/unified-signatures': 'off',
      'ts/no-unsafe-function-type': 'off',
      'ts/no-dynamic-delete': 'off',
      'eqeqeq': 'off',
      'no-async-promise-executor': 'off',
    },
  },
)
