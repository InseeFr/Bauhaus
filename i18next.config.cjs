const excludeGlobs = [
	'!src/packages/**/*.spec.{ts,tsx,js,jsx}',
	'!src/packages/**/*.test.{ts,tsx,js,jsx}',
	'!src/packages/i18n/locales/**',
	'!**/node_modules/**',
];

const migratedModules = ['modules-ddi', 'modules-structures', 'modules-codelists', 'modules-datasets'];

module.exports = {
	locales: ['fr', 'en'],
	extract: migratedModules.map((module) => ({
		input: [`src/packages/${module}/**/*.{ts,tsx,js,jsx}`, ...excludeGlobs],
		output: `src/packages/${module}/i18n/locales/{{language}}.json`,
	})),
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
