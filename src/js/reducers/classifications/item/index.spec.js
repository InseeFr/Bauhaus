import { getItem } from './';
import { LOADED } from 'js/constants';

describe('getItem', () => {
	test('getItem selector should extract results', () => {
		const result = getItem(
			{
				classificationItemGeneral: {},
				classificationItemNotes: {},
				classificationItemMembers: {},
			},
			'nafr2',
			'nafr2'
		);
		expect(result).toEqual();
	});
	test('getConcept selector should extract results', () => {
		const result = getItem(
			{
				classificationItemGeneral: {
					nafr2: {
						A: {
							status: LOADED,
							results: { prefLabelLg1: 'label', conceptVersion: 2 },
						},
					},
				},
				classificationItemNotes: {
					nafr2: {
						A: {
							1: { status: LOADED, results: 'nafr2 - A - notes v1' },
							2: { status: LOADED, results: 'nafr2 - A - notes v2' },
						},
					},
				},
				classificationItemNarrowers: {
					nafr2: {
						A: { status: LOADED, results: 'narrowers' },
					},
				},
			},
			'nafr2',
			'A'
		);
		expect(result).toEqual({
			general: { prefLabelLg1: 'label', conceptVersion: 2 },
			notes: 'nafr2 - A - notes v2',
			narrowers: 'narrowers',
		});
	});
	test('getConcept selector should extract results', () => {
		const result = getItem(
			{
				classificationItemGeneral: {
					nafr2: {
						A: {
							status: LOADED,
							results: { prefLabelLg1: 'label', conceptVersion: 2 },
						},
					},
				},
				classificationItemNotes: {
					nafr2: {
						A: {
							1: { status: LOADED, results: 'nafr2 - A - notes v1' },
							2: { status: LOADED, results: 'nafr2 - A - notes v2' },
						},
					},
				},
				classificationItemNarrowers: {
					nafr2: {
						A: { status: LOADED, results: 'narrowers' },
					},
				},
			},
			'nafr2',
			'A'
		);
		expect(result).toEqual({
			general: { prefLabelLg1: 'label', conceptVersion: 2 },
			notes: 'nafr2 - A - notes v2',
			narrowers: 'narrowers',
		});
	});
});
