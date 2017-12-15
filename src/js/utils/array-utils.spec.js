import { range, filterKeyDate } from './array-utils';

describe('range', () => {
	it('should return an array of integers from start to end - 1', () => {
		expect(range(3, 6)).toEqual([3, 4, 5]);
	});
});

describe('filter by key date', () => {
	it('returns true if the date matches', () => {
		const evt = { creationDate: '2017-07-15T10:51:47.812' };
		const start = '2017-07-01T10:51:47.812';
		const end = '2017-07-31T10:51:47.812';
		const filter = filterKeyDate('creationDate')(start, end);
		expect(filter(evt)).toBe(true);
	});

	it('returns false if the date does not match', () => {
		const evt = { creationDate: '2017-06-28T10:51:47.812' };
		const start = '2017-07-01T10:51:47.812';
		const end = '2017-07-31T10:51:47.812';
		const filter = filterKeyDate('creationDate')(start, end);
		expect(filter(evt)).toBe(false);
	});
});
