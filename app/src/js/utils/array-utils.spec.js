import * as A from './array-utils';

describe('array utils', () => {
	describe('arrayToString', () => {
		it('should return an empty string', () => {
			expect(A.arrayToString([])).toEqual('');
		});
		it('should return a string containing array elements', () => {
			const array = ['aaa', 'bbb', 'ccc'];
			expect(A.arrayToString(array)).toEqual('aaa - bbb - ccc');
		});
	});

	describe('arrayKeepUniqueField', () => {
		it('should return an array of id objects', () => {
			const array = [{ id: '1', label: 'A' }, { id: '2', label: 'B' }];
			const res = ['a', 'b'];
			expect(A.arrayKeepUniqueField(array, 'label')).toEqual(res);
		});
	});

	describe('arrayDifferenceByID', () => {
		it('should return a diff array', () => {
			const arrayA = [{ id: '1', label: 'A' }, { id: '2', label: 'B' }];
			const arrayB = [{ id: '2', label: 'B' }];
			const res = [{ id: '1', label: 'A' }];
			expect(A.arrayDifferenceByID(arrayA, arrayB)).toEqual(res);
			expect(A.arrayDifferenceByID(arrayB, arrayA)).toEqual([]);
		});
	});

	describe('sortArray', () => {
		it('should return a same length array', () => {
			const array = [{ id: '2', label: 'B' }, { id: '1', label: 'A' }];
			expect(A.sortArray('id')(array)).toHaveLength(array.length);
		});

		it('should return a sorted array', () => {
			const array = [{ id: '2', label: 'B' }, { id: '1', label: 'A' }];
			const res = [{ id: '1', label: 'A' }, { id: '2', label: 'B' }];
			expect(A.sortArray('id')(array)).toEqual(res);
		});
	});

	describe('filterDeburr', () => {
		it('should return true ', () => {
			expect(A.filterDeburr('AA')('aa')).toBeTruthy();
			expect(A.filterDeburr('Eé')('eEeEe')).toBeTruthy();
		});
		it('should return false ', () => {
			expect(A.filterDeburr('A')('e')).toBeFalsy();
			expect(A.filterDeburr('Eé')('é')).toBeFalsy();
		});
	});

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

	describe('nbResults', () => {
		it('should return string ends with any letter', () => {
			expect(A.nbResults([])).toMatch(/[A-Za-z]{1}$/);
			expect(A.nbResults(['A'])).toMatch(/[A-Za-z]{1}$/);
		});

		it("should return string ends with 's'", () => {
			expect(A.nbResults(['a', 'b']).endsWith('s')).toBeTruthy();
		});
	});

	describe('range', () => {
		it('should return an array of integers from start to end - 1', () => {
			expect(A.range(3, 6)).toEqual([3, 4, 5]);
		});
	});
});
