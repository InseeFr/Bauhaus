import isVersioningPossible from './is-versioning-possible';

describe('classification-notes-utils', () => {
	it('should return false because new changeNote is empty', () => {
		expect(
			isVersioningPossible({ changeNoteLg1: '' }, { changeNoteLg1: '' })
		).toBeFalsy();
	});
	it("should return false because changeNote doesn't change", () => {
		expect(
			isVersioningPossible({ changeNoteLg1: 'A' }, { changeNoteLg1: 'A' })
		).toBeFalsy();
	});
	it('should return true', () => {
		expect(
			isVersioningPossible({ changeNoteLg1: 'A' }, { changeNoteLg1: 'AA' })
		).toBeTruthy();
	});
});
