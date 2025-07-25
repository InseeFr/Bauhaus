import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	base: 'Bauhaus',
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'Bauhaus',

			defaultLocale: 'root',

			locales: {
				// English docs in `src/content/docs/en/`
				root: {
					label: 'English',
					lang: 'en',
				},
			},
			sidebar: [
				{
					label: 'Developer Guide',
					items: [
						// Each item here is one entry in the navigation menu.
						{
							label: 'Getting Started',
							link: import.meta.env.BASE_URL + 'guides/getting-started/',
						},
						{
							label: 'Conventional Commits',
							link: import.meta.env.BASE_URL + 'guides/conventional_commit/',
						},
						{
							label: 'Git Branch Management Strategy',
							link: import.meta.env.BASE_URL + 'guides/pr_branch_strategy/',
						},
					],
				},
				{
					label: 'User Guide',
					autogenerate: {
						directory: import.meta.env.BASE_URL + 'guides/user-guide',
					},
				},
			],
		}),
	],
});
