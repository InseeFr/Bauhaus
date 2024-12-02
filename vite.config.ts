import react from '@vitejs/plugin-react';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';
import { viteEnvs } from 'vite-envs';
import tsconfigPaths from 'vite-tsconfig-paths';

export default {
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
