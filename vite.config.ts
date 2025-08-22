import react from '@vitejs/plugin-react';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';
import { defineConfig, loadEnv } from 'vite';
import { viteEnvs } from 'vite-envs';
import tsconfigPaths from 'vite-tsconfig-paths';
import csp from 'vite-plugin-csp-guard';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isProd = mode === 'production';
	return {
		optimizeDeps: {
			esbuildOptions: {
				plugins: [fixReactVirtualized],
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler' as const,
				},
			},
		},
		build: {
			outDir: 'build',
		},
		server: {
			port: 3000,
		},
		plugins: [
			react(),
			csp({
				dev: {
					run: true,
				},
				policy: {
					'style-src-elem': ["'unsafe-inline'", 'https://fonts.googleapis.com'],
					'script-src-elem': [
						"'unsafe-inline'",
						"'self'",
						'https://ajax.googleapis.com/',
					],
					'worker-src': ["'self'", 'blob:'],
					'frame-src': [
						"'self'",
						isProd ? '__OIDC_BASE_URL__' : env.VITE_OIDC_BASE_URL,
					],
					'font-src': ["'self'", 'https://fonts.gstatic.com/'],
					'connect-src': [
						isProd ? '__API_BASE_HOST__' : env.VITE_API_BASE_HOST + '/',
						'ws://localhost:3000',
						isProd ? '__OIDC_BASE_URL__' : env.VITE_OIDC_BASE_URL,
					],
				},
				build: {
					sri: false,
				},
			}),
			tsconfigPaths(),
			viteEnvs({
				declarationFile: '.env',
				computedEnv: async () => {
					const path = await import('path');
					const fs = await import('fs/promises');

					const packageJson = JSON.parse(
						await fs.readFile(path.resolve(__dirname, 'package.json'), 'utf-8'),
					);

					// Here you can define any arbitrary values they will be available
					// in `import.meta.env` and it's type definitions.
					// You can also compute defaults for variable declared in `.env` files.
					return {
						VITE_NAME: packageJson.name,
						VITE_VERSION: packageJson.version,
					};
				},
			}),
		],
	};
});
