import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";
import jest from "eslint-plugin-jest";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("prettier", "plugin:jest-dom/recommended"),
    {
        plugins: {
            "testing-library": testingLibrary,
            "jest-dom": jestDom,
            jest,
        },

        languageOptions: {
            globals: {
                ...globals.mocha,
            },

            parser: babelParser,
            ecmaVersion: 2018,
            sourceType: "module",

            parserOptions: {
                requireConfigFile: false,

                babelOptions: {
                    presets: ["@babel/preset-react"],
                },
            },
        },

        settings: {
            react: {
                version: "16.3.0",
            },
        },

        rules: {
            "jsx-a11y/href-no-hash": 0,
            "no-useless-escape": "off",
            "no-duplicate-imports": "error",
            "import/no-anonymous-default-export": 0,
            "jest/no-disabled-tests": "error",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error",
            "jest-dom/prefer-in-document": 0,
        },
    },
];
