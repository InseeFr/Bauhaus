module.exports = {
	locales: ['fr', 'en'],
	extract: {
		input: [
			'src/packages/modules-ddi/**/*.{ts,tsx,js,jsx}',
			'!src/packages/modules-ddi/**/*.spec.{ts,tsx,js,jsx}',
			'!src/packages/modules-ddi/**/*.test.{ts,tsx,js,jsx}',
			'!src/packages/modules-ddi/i18n/locales/**',
			'!**/node_modules/**',
		],
		output: 'src/packages/modules-ddi/i18n/locales/{{language}}.json',
		removeUnusedKeys: true,
	},
};
