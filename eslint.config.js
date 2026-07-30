const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');

module.exports = [
    {
        ignores: ['out/**', 'node_modules/**', '**/*.d.ts'],
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            '@typescript-eslint/naming-convention': 'error',
            curly: 'error',
            eqeqeq: 'error',
            'no-throw-literal': 'error',
            semi: 'off',
            'prefer-const': 'error',
            'no-trailing-spaces': 'error',
            'eol-last': 'error',
        },
    },
];
