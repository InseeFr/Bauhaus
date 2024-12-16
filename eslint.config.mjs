import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: [
			'**/*.svg',
			'documentation/',
			'website/',
			'build/',
			'scripts',
			'test-results',
			'coverage/',
		],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
	},
	pluginJs.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	pluginReact.configs.flat['jsx-runtime'],
	{
		languageOptions: {
			globals: globals.browser,
		},
	},

	{
		settings: { react: { version: '18.3' } },
		rules: {
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/prefer-for-of': 'off',
		},
		languageOptions: {
			globals: {
				it: 'readonly',
				describe: 'readonly',
				expect: 'readonly',
				vi: 'readonly',
				beforeEach: 'readonly',
				global: 'readonly',
			},
		},
	},
];
