import { afterEach, describe, expect, it, vi } from 'vitest';

import { install } from './dev-tools';
import load from './load';

vi.mock('./dev-tools', () => ({
	install: vi.fn(),
}));

describe('load', () => {
	const originalEnv = { ...import.meta.env };

	afterEach(() => {
		import.meta.env = { ...originalEnv };
		vi.clearAllMocks();
	});

	it('should not import dev-tools if VITE_DEV_TOOLS_ENABLED is false', async () => {
		import.meta.env.VITE_DEV_TOOLS_ENABLED = 'false';
		const store = {};
		const callback = vi.fn();

		await load(store, callback);

		expect(install).not.toHaveBeenCalled();
		expect(callback).toHaveBeenCalledTimes(1);
	});
});
