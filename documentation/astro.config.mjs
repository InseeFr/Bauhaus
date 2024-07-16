import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	base: 'Bauhaus',
	trailingSlash: "always",
	integrations: [
		starlight({
			title: 'Bauhaus',

			defaultLocale: 'root',

			locales: {
				// English docs in `src/content/docs/en/`
				root: {
					label: 'English',
					lang: 'en'
				},
				fr: {
					label: 'Français',
				},
			},
			sidebar: [
				{
					label: 'Developer Guide',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Getting Started', link: import.meta.env.BASE_URL + 'guides/getting-started/' },
					],
				},
				{
					label: 'User Guide',
					autogenerate: { directory: import.meta.env.BASE_URL + 'guides/user-guide' },
				},
			],
		}),
	],
});
