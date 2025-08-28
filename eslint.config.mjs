import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import vitestPlugin from 'eslint-plugin-vitest';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPerfPlugin from 'eslint-plugin-react-perf';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintReact from '@eslint-react/eslint-plugin';

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
	vitestPlugin.configs.recommended,
	reactPerfPlugin.configs.flat.recommended,
	jsxA11y.flatConfigs.recommended,
	eslintReact.configs['recommended-typescript'],
	{
		languageOptions: {
			globals: globals.browser,
		},
	},

	{
		settings: { react: { version: '18.3' } },
		rules: {
			'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/prefer-for-of': 'off',
			'react-perf/jsx-no-new-array-as-prop': 'off',
			'react-perf/jsx-no-new-function-as-prop': 'off',
			'react-perf/jsx-no-new-object-as-prop': 'off',
			'jsx-a11y/no-autofocus': 'off',
			'jsx-a11y/click-events-have-key-events': 'off',
			'jsx-a11y/no-noninteractive-element-interactions': 'off',
			'jsx-a11y/no-static-element-interactions': 'off',
			'@eslint-react/no-array-index-key': 'off',
			'@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
			'@eslint-react/dom/no-dangerously-set-innerhtml': 'off',
			'@eslint-react/no-component-will-receive-props': 'off',
			'@eslint-react/no-unstable-default-props': 'off',
			'@eslint-react/hooks-extra/no-unnecessary-use-prefix': 'off',
			'@eslint-react/no-unstable-context-value': 'off',
			'@eslint-react/no-unused-class-component-members': 'off',
			'@eslint-react/no-nested-component-definitions': 'off',
			'@eslint-react/no-duplicate-key': 'off',
			'@eslint-react/web-api/no-leaked-interval': 'off',
			// Final valid rules
			'vitest/expect-expect': 'off',
			'vitest/valid-title': [
				'error',
				{
					allowArguments: true,
				},
			],
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
