import { getCollection } from './';

describe('getCollection', () => {
	test('getCollection selector should extract results', () => {
		const result = getCollection(
			{
				general: {},
				members: {},
			},
			'id1'
		);
		expect(result).toEqual();
	});
	test('getCollection selector should extract results', () => {
		const result = getCollection(
			{
				general: { id1: { results: 'general id1' } },
				members: { id1: { results: 'members id1' } },
			},
			'id1'
		);
		expect(result).toEqual({ general: 'general id1', members: 'members id1' });
	});
});
