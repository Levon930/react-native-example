module.exports = {
  root: true,
  parser: "babel-eslint",
  extends: [
    "rallycoding",
    "plugin:jsx-control-statements/recommended",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  plugins: ["jsx-control-statements", "jest"],
  env: {
    "browser": true,
    "mocha": true,
    "node": true,
    "es6": true,
    "amd": true,
    "jest/globals": true
  },
  rules: {
    "react/prop-types": 0,
    "react/jsx-no-bind": 0,
    "react/jsx-filename-extension": 0,
    "react/jsx-indent": [2, 2],
    "react/jsx-no-undef": [2],
    "react-native/no-inline-styles": 0,
    "react/display-name": 0,
    "react/jsx-indent-props": [2, 2],
    "react/jsx-tag-spacing": [2, {
      "closingSlash": "never",
      "beforeSelfClosing": "always",
      "afterOpening": "never"
    }],
    "jsx-control-statements/jsx-jcs-no-undef": 0,
    "no-unused-vars": 0,
    "no-undef": 0,
    "indent": [2, 2, {
      "MemberExpression": 1,
      "SwitchCase": 1
    }],
    "no-delete-var": 2,
    "no-eval": 2,
    "arrow-body-style": 0,
    "comma-dangle": [2, "always-multiline"],
    "new-cap": 0,
    "no-underscore-dangle": 0,
    "default-case": 0,
    "no-mixed-operators": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "no-else-return": 0,
    "react/require-extension": "off",
    "padded-blocks": 0,
    "dot-notation": 0,
    "prefer-template": 0
  }
};
