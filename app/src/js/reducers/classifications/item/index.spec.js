import { getItem, getFullItem } from './';
import { LOADED } from 'js/constants';

describe('classification-item-selector', () => {
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
		test('getItem selector should extract results', () => {
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
		test('getItem selector should extract results', () => {
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
	describe('getFullItem', () => {
		test('getFullItem selector should extract results', () => {
			const result = getFullItem(
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
		test('getFullItem selector should extract results', () => {
			const result = getFullItem(
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
				notes: { 1: 'nafr2 - A - notes v1', 2: 'nafr2 - A - notes v2' },
				narrowers: 'narrowers',
			});
		});
		test('getItem selector should extract results', () => {
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
});
