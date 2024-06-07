module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier","sonarjs"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "unicorn",
        "prettier",
        "airbnb-base",
        "plugin:unicorn/recommended",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:sonarjs/recommended-legacy",
      ],
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "tsconfig.json",
        sourceType: "module",
      },
    },
  ],
  rules: {
    "newline-before-return": "error",
    "@typescript-eslint/no-var-requires": 0,
    "import/no-import-module-exports": "off",
    'unicorn/better-regex': 'error',
		'unicorn/…': 'error',
  },
};
