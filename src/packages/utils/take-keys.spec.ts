import { describe, it, expect } from 'vitest';

import { takeKeys } from './take-keys';

describe('takeKeys', () => {
	it('should extract specified keys with their corresponding values', () => {
		const obj = { a: 1, b: 2, c: 3 };
		const keys = ['a', 'b'];
		const result = takeKeys(keys)(obj);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	it('should return an empty string for keys with null values', () => {
		const obj = { a: null, b: 2, c: 3 };
		const keys = ['a', 'b'];
		const result = takeKeys(keys)(obj);

		expect(result).toEqual({ a: '', b: 2 });
	});

	it('should ignore keys that do not exist in the object', () => {
		const obj = { a: 1, b: 2 };
		const keys = ['a', 'b', 'c'];
		const result = takeKeys(keys)(obj);

		expect(result).toEqual({ a: 1, b: 2, c: undefined });
	});

	it('should return an empty object if no keys are specified', () => {
		const obj = { a: 1, b: 2 };
		const keys: string[] = [];
		const result = takeKeys(keys)(obj);

		expect(result).toEqual({});
	});

	it('should return an object with empty strings if the source object is empty', () => {
		const obj: Record<string, unknown> = { a: null };
		const keys = ['a', 'b'];
		const result = takeKeys(keys)(obj);

		expect(result).toEqual({ a: '', b: undefined });
	});
});
