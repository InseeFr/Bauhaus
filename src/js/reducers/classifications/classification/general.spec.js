import reducerClassificationGeneral, { getGeneral } from './general';
import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';
import * as generalUtils from 'js/applications/classifications/utils/classification/general';

describe('reducerClassificationGeneral', () => {
	test('action UPDATE_CLASSIFICATION_SUCCESS', () => {
		const action = {
			type: A.UPDATE_CLASSIFICATION_SUCCESS,
			payload: { id: 'id1' },
		};
		const result = reducerClassificationGeneral(
			{ id1: 'previous', id2: 'previous' },
			action
		);
		expect(result).toEqual({ id1: {}, id2: 'previous' });
	});
	test('action LOAD_CLASSIFICATION_GENERAL_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_GENERAL_SUCCESS,
			payload: { id: 'id1', results: { prefLabelLg1: 'My classification' } },
		};
		const result = reducerClassificationGeneral({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: Object.assign(generalUtils.empty(), {
					prefLabelLg1: 'My classification',
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
