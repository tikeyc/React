// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: ['airbnb'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // 在这里添加你的规则
  rules: {
    // 导入 .js .jsx 文件时无需提供后缀名
    'import/extensions': ['error', 'always', {
      js: 'never',
      jsx: 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': 0,
    'no-console': 0,
    'no-alert': 0,
    'no-param-reassign': 0,
    'react/forbid-prop-types': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'react/no-danger': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
    'arrow-parens': ['error', "as-needed"],
    'function-paren-newline': 0,
    'react/require-default-props': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    indent: ['error', 2, { 'MemberExpression': 1 }],
    'react/no-find-dom-node': 0
  }
}
