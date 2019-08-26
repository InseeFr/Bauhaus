import reducerConceptsGeneral, { getGeneral } from './general';
import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';
import * as generalUtils from 'js/utils/concepts/general';

describe('reducerConceptsGeneral', () => {
	test('action UPDATE_CONCEPT_SUCCESS', () => {
		const action = {
			type: A.UPDATE_CONCEPT_SUCCESS,
			payload: { id: 'id1' },
		};
		const result = reducerConceptsGeneral(
			{ id1: 'previous', id2: 'previous' },
			action
		);
		expect(result).toEqual({ id1: {}, id2: 'previous' });
	});
	test('action VALIDATE_CONCEPT_LIST_SUCCESS', () => {
		const action = {
			type: A.VALIDATE_CONCEPT_LIST_SUCCESS,
			payload: { ids: ['id1', 'id2'] },
		};
		const result = reducerConceptsGeneral(
			{ id1: 'previous', id2: 'previous', id3: 'previous' },
			action
		);
		expect(result).toEqual({ id1: {}, id2: {}, id3: 'previous' });
	});
	test('action LOAD_CONCEPT_GENERAL_SUCCESS', () => {
		const action = {
			type: A.LOAD_CONCEPT_GENERAL_SUCCESS,
			payload: { id: 'id1', results: { prefLabelLg1: 'My concept' } },
		};
		const result = reducerConceptsGeneral({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: Object.assign(generalUtils.empty(), {
					prefLabelLg1: 'My concept',
				}),
			},
		});
	});
});

describe('getGeneral', () => {
	test('getGeneral selector should extract nothing', () => {
		const result = getGeneral({ id1: { results: 'results' } }, 'id2');
		expect(result).toEqual();
	});
	test('getGeneral selector should extract results', () => {
		const result = getGeneral({ id1: { results: 'results' } }, 'id1');
		expect(result).toEqual('results');
	});
});
