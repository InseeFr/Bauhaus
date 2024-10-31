import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
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
