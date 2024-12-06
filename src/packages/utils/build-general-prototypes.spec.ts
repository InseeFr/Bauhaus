import { describe, it, expect } from 'vitest';

import {
	buildFields,
	buildEmpty,
	buildEmptyWithContributor,
} from './build-general-proptypes';
import objectFromKeys from './object-from-keys';

vi.mock('./object-from-keys', () => ({
	default: (keys: string[], defaultValue: any) => {
		const obj: Record<string, any> = {};
		keys.forEach((key) => {
			obj[key] = defaultValue;
		});
		return obj;
	},
}));

describe('Module Tests', () => {
	const fieldsWithRequired = [
		['name', 'required', 'string'],
		['tags', 'optional', 'array'],
		['age', 'optional', 'number'],
	];

	describe('buildFields', () => {
		it('should extract field names from fieldsWithRequired', () => {
			const result = buildFields(fieldsWithRequired);
			expect(result).toEqual(['name', 'tags', 'age']);
		});
	});

	describe('buildEmpty', () => {
		it('should create an empty object with default values', () => {
			const result = buildEmpty(fieldsWithRequired);
			expect(result).toEqual({
				name: '',
				tags: [],
				age: '',
			});
		});
	});

	describe('buildEmptyWithContributor', () => {
		it('should create an empty object with a contributor and default values', () => {
			const defaultContributor = 'John Doe';
			const result = buildEmptyWithContributor(
				fieldsWithRequired,
				defaultContributor,
			);
			expect(result).toEqual({
				name: '',
				tags: [],
				age: '',
				contributor: 'John Doe',
			});
		});
	});
});
