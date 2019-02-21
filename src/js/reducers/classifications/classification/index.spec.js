import { getClassificationsFamiliesList } from './';

describe('getClassificationsFamiliesList', () => {
	it('should return getClassificationsFamiliesList', () => {
		const input = {
			classificationsFamiliesList: 'classificationsFamiliesList',
		};
		const output = 'classificationsFamiliesList';
		expect(getClassificationsFamiliesList(input)).toEqual(output);
	});
});
