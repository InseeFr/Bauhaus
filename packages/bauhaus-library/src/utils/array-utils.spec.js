import * as A from './array-utils';

const D = { result: 'result', results: 'results' };

describe('array utils', () => {
	describe('nbResults', () => {
		it('should return string ends with any letter', () => {
			expect(A.nbResults([], D)).toMatch(/[A-Za-z]{1}$/);
			expect(A.nbResults(['A'], D)).toMatch(/[A-Za-z]{1}$/);
		});

		it("should return string ends with 's'", () => {
			expect(A.nbResults(['a', 'b'], D).endsWith('s')).toBeTruthy();
		});
	});

	describe('arrayDifferenceByID', () => {
		it('should return a diff array', () => {
			const arrayA = [
				{ id: '1', label: 'A' },
				{ id: '2', label: 'B' },
			];
			const arrayB = [{ id: '2', label: 'B' }];
			const res = [{ id: '1', label: 'A' }];
			expect(A.arrayDifferenceByID(arrayA, arrayB)).toEqual(res);
			expect(A.arrayDifferenceByID(arrayB, arrayA)).toEqual([]);
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
});
