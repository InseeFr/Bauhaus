import { getCorrespondencesList, getCorrespondence } from '.';

describe('getCorrespondencesList', () => {
	it('should return the classificationsCorrespondencesList object', () => {
		const input = {
			classificationsCorrespondencesList: 'classificationsCorrespondencesList',
		};
		const output = 'classificationsCorrespondencesList';
		expect(getCorrespondencesList(input)).toEqual(output);
	});
});
describe('getCorrespondence', () => {
	it('should return the correspondence object', () => {
		const input = {
			classificationsCorrespondenceGeneral: {
				1: { results: 'results' },
			},
			classificationsCorrespondenceAssociations: { 1: { results: 'results' } },
		};
		const output = { associations: 'results', correspondence: 'results' };
		expect(getCorrespondence(input, 1)).toEqual(output);
	});
});
