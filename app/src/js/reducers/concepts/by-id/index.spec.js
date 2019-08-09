import { getConcept } from './';
import { LOADED } from 'js/constants';

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
				general: {
					id1: { results: { prefLabelLg1: 'My concept', conceptVersion: '2' } },
				},
				notes: {
					id1: {
						1: { status: LOADED, results: 'id1 notes v1' },
						2: { status: LOADED, results: 'id1 notes v2' },
					},
				},
				links: { id1: { results: 'links id1' } },
			},
			'id1'
		);
		expect(result).toEqual({
			general: { prefLabelLg1: 'My concept', conceptVersion: '2' },
			notes: 'id1 notes v2',
			links: 'links id1',
		});
	});
});
