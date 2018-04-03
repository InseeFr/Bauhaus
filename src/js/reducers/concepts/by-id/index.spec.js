import { getConcept } from './';

describe('getConcept', () => {
	test('getConcept selector should extract results', () => {
		const result = getConcept(
			{
				general: {},
			},
			'id1'
		);
		expect(result).toEqual();
	});
	test('getConcept selector should extract results', () => {
		const result = getConcept(
			{
				general: { id1: { results: 'general id1' } },

				links: { id1: { results: 'links id1' } },
			},
			'id1'
		);
		expect(result).toEqual();
	});
});
