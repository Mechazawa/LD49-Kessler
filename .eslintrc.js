module.exports = {
  extends: '@mapcreator',
  rules: {
    'prefer-destructuring': 'off',
    'max-depth': 'off',
    'max-params': 'off',
    'max-len': 'off',
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'vue/script-indent': 0,
    'no-constructor-return': 'off',
  },
  globals: {
    sounds: 'readonly',
  },
  ignorePatterns: [
    'sound.js',
  ],
};
