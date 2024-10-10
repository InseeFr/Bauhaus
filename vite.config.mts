import react from '@vitejs/plugin-react';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';
import { viteEnvs } from 'vite-envs';

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
		viteEnvs({
			declarationFile: '.env',
		}),
	],
};
