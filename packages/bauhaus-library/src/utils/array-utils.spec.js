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
});
