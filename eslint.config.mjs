import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
	{
		ignores: [
			'**/*.svg',
			'documentation/',
			'website/',
			'build/',
			'scripts',
			'test-results',
		],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
	},
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat['jsx-runtime'],
	{
		settings: { react: { version: '18.3' } },
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
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
