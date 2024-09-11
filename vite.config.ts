import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

export default defineConfig(() => {

	return {
		optimizeDeps: {
			esbuildOptions: {
				plugins: [fixReactVirtualized],
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
