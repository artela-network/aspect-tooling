module.exports = {
  extends: ['@theguild'],
  rules: {
    // not necessary here, we don‘t build with bob
    'import/extensions': 'off',
    // pushing to array multiple times is not a big deal
    'unicorn/no-array-push-push': 'off',
    '@typescript-eslint/no-this-alias': 'warn',
    'import/no-default-export': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unicorn/prefer-node-protocol': 'off',
    '@typescript-eslint/ban-types': 'off',
    // AssemblyScript `===` is a reference equality check, not a value equality check. We are trying to do a value check. Learn more: https://github.com/AssemblyScript/assemblyscript/issues/621#issuecomment-497973428
    eqeqeq: 'off',
  },
  overrides: [
    {
      files: ['packages/libs/**'],
      rules: {
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        'logical-assignment-operators': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'unicorn/filename-case': 'warn',
        'sonarjs/no-inverted-boolean-check': 'warn',
        '@typescript-eslint/no-loss-of-precision': 'warn',
        // AssemblyScript types are different from TS and in cases we want to use what TS may think we should not
      },
    },
  ],
};
