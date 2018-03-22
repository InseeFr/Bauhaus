import takeKeys from './take-keys';

describe('take-keys', () => {
	const obj = { a: 'A', b: 'B', c: 'C' };
	it('should return empty object', () => {
		expect(takeKeys([])(obj)).toEqual({});
		expect(takeKeys(['z'])(obj)).toEqual({});
	});

	it('should return object with a key', () => {
		expect(takeKeys(['a'])(obj)).toEqual({ a: 'A' });
	});

	it('should return whole attrs', () => {
		expect(takeKeys(['a', 'b', 'c'])(obj)).toEqual(obj);
	});
});
