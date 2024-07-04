import * as A from './array-utils';

describe('array utils', () => {
	describe('filter by key date', () => {
		it('returns true if the date matches', () => {
			const evt = { creationDate: '2017-07-15T10:51:47.812' };
			const start = '2017-07-01T10:51:47.812';
			const end = '2017-07-31T10:51:47.812';
			const filter = A.filterKeyDate('creationDate')(start, end);
			expect(filter(evt)).toBe(true);
		});

		it('returns false if the date does not match', () => {
			const evt = { creationDate: '2017-06-28T10:51:47.812' };
			const start = '2017-07-01T10:51:47.812';
			const end = '2017-07-31T10:51:47.812';
			const filter = A.filterKeyDate('creationDate')(start, end);
			expect(filter(evt)).toBe(false);
		});
	});

	describe('creatSelectListSelectedLast', () => {
		it('should return null', () => {
			expect(A.creatSelectListSelectedLast(0)).toBeNull();
		});

		it('should return max.length elements', () => {
			expect(A.creatSelectListSelectedLast(5)).toHaveLength(5);
		});
	});

	describe('getMembers', () => {
		const array = [{ idLinked: '1', prefLabelLg1: 'A', conceptLink: 'LINK' }];
		it('should return empty array', () => {
			expect(A.getMembers(array, 'LINK_A')).toEqual([]);
		});

		it('should return array', () => {
			expect(A.getMembers(array, 'LINK')).toHaveLength(array.length);
			expect(A.getMembers(array, 'LINK')).toEqual([
				{
					id: '1',
					prefLabelLg1: 'A',
				},
			]);
		});
	});
});
