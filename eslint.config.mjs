import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: ['dist/**/*'],
    },
    {
        files: ['src/*.ts'],

        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: {
                ...globals.browser,
            },
        },

        plugins: {
            '@typescript-eslint': tseslint,
            prettier: prettierPlugin,
        },

        rules: {
            ...tseslint.configs.recommended.rules,
        },
    },
    prettierRecommended,
];
