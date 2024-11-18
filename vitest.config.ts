import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		coverage: {
			provider: 'istanbul',
			reporter: ['text'],
			include: ['src/**/*.{ts,tsx,js,jsx}'],
		},
		include: ['src/**/*.spec.*'],
		environment: 'jsdom',
		globals: true,
	},
});
