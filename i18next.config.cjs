module.exports = {
	locales: ['fr', 'en'],
	extract: {
		input: [
			'src/packages/modules-ddi/**/*.{ts,tsx,js,jsx}',
			'!src/packages/**/*.spec.{ts,tsx,js,jsx}',
			'!src/packages/**/*.test.{ts,tsx,js,jsx}',
			'!src/packages/i18n/locales/**',
			'!**/node_modules/**',
		],
		output: 'src/packages/modules-ddi/i18n/locales/{{language}}.json',
	},
	lint: {
		input: ['src/packages/**/*.{ts,tsx,js,jsx}'],
		ignore: [
			'**/*.spec.{ts,tsx,js,jsx}',
			'**/*.test.{ts,tsx,js,jsx}',
			'**/i18n/locales/**',
			'**/node_modules/**',
		],
	},
};
