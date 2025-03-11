import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["src/*.ts"],

        languageOptions: {
            parser: tsparser,
            sourceType: "module",
        },

        plugins: {
            "@typescript-eslint": tseslint,
            prettier: prettierPlugin,
        },

        rules: {
            ...tseslint.configs.recommended.rules,
            ...prettierConfig.rules,
            "@typescript-eslint/no-unused-vars": "warn",
            "no-console": "warn",
            "semi": ["error", "always"],
            "quotes": ["error", "double"],
            "prettier/prettier": "error",
        },
    },
];
