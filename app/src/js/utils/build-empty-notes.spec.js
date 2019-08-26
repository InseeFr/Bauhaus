import { buildEmptyNotes } from './build-empty-notes';

describe('build-empty-notes-utils', () => {
	it('should return an empty object', () => {
		expect(buildEmptyNotes([])).toEqual({});
	});
	it('should return an object with empty notes', () => {
		expect(
			buildEmptyNotes([
				'scopeNoteLg1',
				'scopeNoteLg2',
				'definitionLg1',
				'definitionLg2',
			])
		).toEqual({
			scopeNoteLg1: '',
			scopeNoteLg2: '',
			definitionLg1: '',
			definitionLg2: '',
		});
	});
});
