import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';

export default defineConfig(() => {
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
		plugins: [react()],
	};
});
