module.exports = {
  extends: '../.eslintrc.js',
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
};
