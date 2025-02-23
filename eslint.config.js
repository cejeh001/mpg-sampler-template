import js from "@eslint/js";
import globals from "globals";

export default [
    {
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
            globals: {
                ...globals.browser,
            }
        }
    },
    js.configs.recommended,
    {
        rules: {
            'indent': ['error', 4],
            'no-undef': 'off',
            'no-unused-vars': 'off',
            'no-var': 'warn',
            'no-use-before-define': 'off',
            'prefer-const': 'warn',
        },
    },
];
