import * as A from './array-utils';

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

describe('nbResults', () => {
	it('should return string ends with any letter', () => {
		expect(A.nbResults([])).toMatch(/[A-Za-z]{1}$/);
		expect(A.nbResults(['A'])).toMatch(/[A-Za-z]{1}$/);
	});

	it("should return string ends with 's'", () => {
		expect(
			A.nbResults(['a', 'b'], 'euros', 'euro').endsWith('euros')
		).toBeTruthy();
	});
});

describe('filterKeyDeburr', () => {
	describe('the value is single', () => {
		it('should return true if the value is present', () => {
			expect(A.filterKeyDeburr(['label'])('a')({ label: 'a' })).toBeTruthy();
		});
		it('should return false if the value is not present', () => {
			expect(A.filterKeyDeburr(['label'])('a')({ label: 'b' })).toBeFalsy();
		});
	});
	describe('the value is multiple', () => {
		it('should return true if the value is present', () => {
			expect(A.filterKeyDeburr(['label'])('a')({ label: ['a'] })).toBeTruthy();
		});
		it('should return false if the value is not present', () => {
			expect(A.filterKeyDeburr(['label'])('a')({ label: ['b'] })).toBeFalsy();
		});
	});
	describe('the key has a full path', () => {
		it('should return true if the value is present', () => {
			expect(
				A.filterKeyDeburr(['components.label'])('a')({
					components: [{ label: 'a' }],
				})
			).toBeTruthy();
		});
		it('should return true if the value is present in an array', () => {
			expect(
				A.filterKeyDeburr(['components.label'])('a')({
					components: [{ label: ['a'] }],
				})
			).toBeTruthy();
		});
		it('should return false if the value is not present', () => {
			expect(
				A.filterKeyDeburr(['components.label'])('b')({
					components: [{ label: ['a'] }],
				})
			).toBeFalsy();
		});
	});

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
	describe('range', () => {
		it('should return an array of integers from start to end - 1', () => {
			expect(A.range(3, 6)).toEqual([3, 4, 5]);
		});
	});
});
