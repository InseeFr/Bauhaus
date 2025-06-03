import react from '@vitejs/plugin-react';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';
import { defineConfig, loadEnv } from 'vite';
import { viteEnvs } from 'vite-envs';
import csp from 'vite-plugin-csp-guard';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		optimizeDeps: {
			esbuildOptions: {
				plugins: [fixReactVirtualized],
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
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
					'script-src-elem': ["'self'", 'https://ajax.googleapis.com/'],
					'font-src': ["'self'", 'https://fonts.gstatic.com/'],
					'connect-src': [env.VITE_API_BASE_HOST + '/', 'ws://localhost:3000'],
				},
				build: {
					sri: true,
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
