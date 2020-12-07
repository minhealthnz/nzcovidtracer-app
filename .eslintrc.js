module.exports = {
  root: true,
  extends: [
    "@react-native-community",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:react-native-a11y/all",
    "plugin:redux-saga/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort", "redux-saga"],
  rules: {
    quotes: ["error", "double"],
    curly: ["error", "all"],
    eqeqeq: ["error", "smart"],
    // @todo - temporarily disabled until further testing
    "react-native-a11y/has-valid-accessibility-ignores-invert-colors": "off",
    "react-native-a11y/has-accessibility-hint": "off",
    "simple-import-sort/sort": "error",
    "prefer-const": "error",
    "redux-saga/no-unhandled-errors": "off",
    "no-console": "error"
  },
};
