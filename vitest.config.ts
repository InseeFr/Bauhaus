import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	test: {
		coverage: {
			provider: 'istanbul',
      reporter: ['text'],
			exclude: ['node_modules', '*.svg'],
		},
		include: ['**/*.spec.*'],
		environment: "jsdom",
		globals: true
	},
})
