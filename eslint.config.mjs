import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
	eslint.configs.recommended,
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			prettier: prettier,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			'prettier/prettier': 'error',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
	{
		ignores: ['fr.twitchat.sdPlugin/bin/**', 'node_modules/**', 'dist/**'],
	},
];
