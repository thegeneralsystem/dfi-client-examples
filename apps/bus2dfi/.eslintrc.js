module.exports = {
  extends: '../../.eslintrc.js',
  root: true,
  env: {
    browser: false,
    node: true,
  },
  parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
};
