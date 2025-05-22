import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'lcov'],
			include: ['src/**/*.{ts,tsx,js,jsx}'],
			exclude: ['src/packages/tests-utils'],
		},
		include: ['src/**/*.spec.*'],
		environment: 'happy-dom',
		globals: true,
		setupFiles: ['./setupTests.js'],
	},
});
