module.exports = {
  extends: '../../.eslintrc.js',
  root: true,
  env: {
    browser: true,
    node: false,
  },
  ignorePatterns: ['vite.config.js'],
  parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
};
