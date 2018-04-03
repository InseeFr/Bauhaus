import reducerConceptsNotes, { getNotes, getAllNotes } from './notes';
import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

describe('reducerConceptsNotes', () => {
	test('action LOAD_NOTES_VERSION', () => {
		const action = {
			type: A.LOAD_NOTES_VERSION,
			payload: { id: 'id1', version: 2 },
		};
		const result = reducerConceptsNotes(
			{ id1: { 1: { status: LOADED, results: 'id1 notes v1' } } },
			action
		);
		expect(result).toEqual({
			id1: {
				1: { status: LOADED, results: 'id1 notes v1' },
				2: { status: LOADING },
			},
		});
	});
	test('action LOAD_NOTES_VERSION_SUCCESS', () => {
		const action = {
			type: A.LOAD_NOTES_VERSION_SUCCESS,
			payload: { id: 'id1', version: 2, results: 'id1 notes v2' },
		};
		const result = reducerConceptsNotes(
			{ id1: { 1: { status: LOADED, results: 'id1 notes v1' } } },
			action
		);
		expect(result).toEqual({
			id1: {
				1: { status: LOADED, results: 'id1 notes v1' },
				2: { status: LOADED, results: 'id1 notes v2' },
			},
		});
	});
});

describe('getNotes', () => {
	test('getNotes selector should extract nothing', () => {
		const result = getNotes(
			{
				id1: {
					1: { status: LOADED, results: 'id1 notes v1' },
					2: { status: LOADED, results: 'id1 notes v2' },
				},
			},
			'id1',
			3
		);
		expect(result).toEqual();
	});
	test('getNotes selector should extract results', () => {
		const result = getNotes(
			{
				id1: {
					1: { status: LOADED, results: 'id1 notes v1' },
					2: { status: LOADED, results: 'id1 notes v2' },
				},
			},
			'id1',
			2
		);
		expect(result).toEqual('id1 notes v2');
	});
});

describe('getAllNotes', () => {
	test('getAllNotes selector should extract nothing', () => {
		const result = getAllNotes(
			{
				id2: {},
			},
			'id1'
		);
		expect(result).toBeNull();
	});
	test('getAllNotes selector should extract results', () => {
		const result = getAllNotes(
			{
				id1: {
					1: { status: LOADED, results: 'id1 notes v1' },
					2: { status: LOADED, results: 'id1 notes v2' },
				},
			},
			'id1',
			2
		);
		expect(result).toEqual({ 1: 'id1 notes v1', 2: 'id1 notes v2' });
	});
});
