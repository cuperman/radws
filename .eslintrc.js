// refer to: http://eslint.org/docs/user-guide/

module.exports = {
  extends: 'eslint:recommended',

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },

  env: {
    browser: false,
    es6: true,
    node: true
  },

  rules: {
    'indent':     [ 'error', 2, { SwitchCase: 1 } ],
    'quotes':     [ 'error', 'single' ],
    'semi':       [ 'error', 'always' ]
  }
};
