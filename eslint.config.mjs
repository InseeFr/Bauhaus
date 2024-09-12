import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {

    settings: { react: { version: '18.3' } },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "no-extra-boolean-cast": "off",
      '@typescript-eslint/ban-ts-comment': 'off',
      "react/no-deprecated": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-case-declarations": "off",
      "react/no-unknown-property": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-children-prop": "off",
      "react/jsx-key": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-constant-binary-expression": "off",
      "no-irregular-whitespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "no-prototype-builtins": "off"
    },
    languageOptions: {
      globals: {
        it: "readonly",
        describe: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeEach: "readonly",
        global: "readonly"
      }
    },

  },
  {

    ignores: ["**/*.svg"],
  }
];
