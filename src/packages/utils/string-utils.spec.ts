import { describe, it, expect } from 'vitest';

import { cleanId, deburr } from './string-utils';

describe('cleanId', () => {
	it('should return an empty string if no id is provided', () => {
		expect(cleanId()).toBe('');
	});

	it('should replace spaces with hyphens and convert to lowercase', () => {
		expect(cleanId('Hello World')).toBe('hello-world');
		expect(cleanId('TeStInG Spaces')).toBe('testing-spaces');
	});

	it('should handle an empty string', () => {
		expect(cleanId('')).toBe('');
	});
});

describe('deburr', () => {
	it('should remove diacritical marks from characters', () => {
		expect(deburr('àèìòù')).toBe('aeiou');
		expect(deburr('çãõñ')).toBe('caon');
	});

	it('should return the same string if no diacritical marks are present', () => {
		expect(deburr('hello')).toBe('hello');
		expect(deburr('12345')).toBe('12345');
	});

	it('should handle an empty string', () => {
		expect(deburr('')).toBe('');
	});
});
