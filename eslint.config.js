const parser = require('@typescript-eslint/parser');
const plugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
    // Node config for config files
    {
        files: ['eslint.config.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                __dirname: 'readonly',
                process: 'readonly',
            },
        },
        rules: {},
    },
    // Main TypeScript/JavaScript config
    {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                __dirname: 'readonly',
                global: 'readonly',
                console: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': plugin,
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'off',
            'no-undef': 'off',
            'no-unused-expressions': 'error',
            'no-unreachable': 'error',
            'no-empty': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        },
    },
];

module.exports.ignores = ['node_modules/', 'dist/'];