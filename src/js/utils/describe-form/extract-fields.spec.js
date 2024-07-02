import buildExtractFields from './extract-fields';

describe('Build extract fields', () => {
	it('returns a function which takes some data and returns a copy with the requested fields', () => {
		const extractFields = buildExtractFields(['firstName', 'lastName']);
		expect(
			extractFields({ firstName: 'bobby', lastName: 'fischer', hobby: 'chess' })
		).toEqual({
			firstName: 'bobby',
			lastName: 'fischer',
		});
	});
});
