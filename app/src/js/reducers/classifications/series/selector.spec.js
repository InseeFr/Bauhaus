import { getClassificationsSeriesList } from './selector';
describe('getClassificationsSeriesList', () => {
	it('should return the classificationsSeriesList', () => {
		const input = {
			classificationsSeriesList: 'classificationsSeriesList',
		};
		const output = 'classificationsSeriesList';
		expect(getClassificationsSeriesList(input)).toEqual(output);
	});
});
