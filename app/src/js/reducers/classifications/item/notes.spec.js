import reducerConceptsNotes, { getNotes, getAllNotes } from './notes';
import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

describe('reducerConceptsNotes', () => {
	test('action LOAD_CLASSIFICATION_ITEM_NOTES_VERSION', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION,
			payload: { classificationId: 'nafr2', itemId: 'A', version: 2 },
		};
		const result = reducerConceptsNotes(
			{
				nafr2: {
					A: { 1: { status: LOADED, results: 'nafr2 - A - notes v1' } },
				},
			},
			action
		);
		expect(result).toEqual({
			nafr2: {
				A: {
					1: { status: LOADED, results: 'nafr2 - A - notes v1' },
					2: { status: LOADING },
				},
			},
		});
	});
	test('action LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_SUCCESS,
			payload: {
				classificationId: 'nafr2',
				itemId: 'B',
				version: 2,
				results: 'nafr2 - B - notes v2',
			},
		};
		const result = reducerConceptsNotes(
			{
				nafr2: {
					A: { 1: { status: LOADED, results: 'nafr2 - A - notes v1' } },
				},
			},
			action
		);
		expect(result).toEqual({
			nafr2: {
				A: {
					1: { status: LOADED, results: 'nafr2 - A - notes v1' },
				},
				B: { 2: { status: LOADED, results: 'nafr2 - B - notes v2' } },
			},
		});
	});
});

describe('getNotes', () => {
	test('getNotes selector should extract nothing', () => {
		const result = getNotes(
			{
				nafr2: {
					'23.99Z': {
						1: { status: LOADED, results: 'nafr2 - 23.99Z - notes v1' },
						2: { status: LOADED, results: 'nafr2 - 23.99Z - notes v2' },
					},
				},
			},
			'nafr2',
			'23.99Z',
			3
		);
		expect(result).toEqual();
	});
	test('getNotes selector should extract results', () => {
		const result = getNotes(
			{
				nafr2: {
					'23.99Z': {
						1: { status: LOADED, results: 'nafr2 - 23.99Z - notes v1' },
						2: { status: LOADED, results: 'nafr2 - 23.99Z - notes v2' },
					},
				},
			},
			'nafr2',
			'23.99Z',
			2
		);
		expect(result).toEqual('nafr2 - 23.99Z - notes v2');
	});
});

describe('getAllNotes', () => {
	test('getAllNotes selector should extract nothing', () => {
		const result = getAllNotes(
			{
				nafr2: {},
			},
			'nafr2',
			'23.99Z',
			3
		);
		expect(result).toBeNull();
	});
	test('getAllNotes selector should extract results', () => {
		const result = getAllNotes(
			{
				nafr2: {
					'23.99Z': {
						1: { status: LOADED, results: 'nafr2 - 23.99Z - notes v1' },
						2: { status: LOADED, results: 'nafr2 - 23.99Z - notes v2' },
					},
				},
			},
			'nafr2',
			'23.99Z',
			2
		);
		expect(result).toEqual({
			1: 'nafr2 - 23.99Z - notes v1',
			2: 'nafr2 - 23.99Z - notes v2',
		});
	});
});
