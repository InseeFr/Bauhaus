import { getClassificationsFamiliesList, getClassification } from './';

describe('getClassificationsFamiliesList', () => {
	it('should return getClassificationsFamiliesList', () => {
		const input = {
			classificationsFamiliesList: 'classificationsFamiliesList',
		};
		const output = 'classificationsFamiliesList';
		expect(getClassificationsFamiliesList(input)).toEqual(output);
	});
});

describe('getClassification', () => {
	it('should return undefined if the general is undefined', () => {
		const state = { classificationGeneral: {} };
		const id = 1;
		expect(getClassification(state, id)).toBeUndefined();
	});

	it('should return undefined if the levels are undefined', () => {
		const state = {
			classificationGeneral: { 1: { results: 'results' } },
			classificationLevels: {},
		};
		const id = 1;
		expect(getClassification(state, id)).toBeUndefined();
	});

	it('should return an object with the general and levels', () => {
		const state = {
			classificationGeneral: { 1: { results: 'results' } },
			classificationLevels: { 1: { results: 'results' } },
		};
		const id = 1;
		expect(getClassification(state, id)).toEqual({
			general: 'results',
			levels: 'results',
		});
	});
});
