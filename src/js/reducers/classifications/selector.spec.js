import { getClassificationsList } from './selector';
describe('getClassificationsList', () => {
	it('should return the classificationsList', () => {
		const input = {
			classificationsList: 'classificationsList',
		};
		const output = 'classificationsList';
		expect(getClassificationsList(input)).toEqual(output);
	});
});
