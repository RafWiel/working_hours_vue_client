module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ["*.vue"],
      rules: {
        'max-len': 'off', // disables line length check
        'vue/max-len': [
          'error',
          {
            'code': 160,
            'template': 9000,
            'ignoreTemplateLiterals': true,
            'ignoreUrls': true,
            'ignoreStrings': true
          }
        ],
        // 'object-curly-newline': ['error', {'multiline': true}, { "minProperties": 1 }],
        'object-curly-newline': 'off',
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
        'spaced-comment': 'off',
        'no-multiple-empty-lines': 'off',
        'brace-style': [2, 'stroustrup', { "allowSingleLine": true }],
        'indent': 'off',
      }
    },
    {
      files: ["*.js"],
      rules: {
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
        'import/prefer-default-export': 'off',
      }
    },
  ],
};
