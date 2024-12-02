import { LOADED } from '@sdk/constants';

import * as generalUtils from '../../../modules-classifications/utils/classification/general';
import {
	LOAD_CLASSIFICATION_GENERAL_SUCCESS,
	UPDATE_CLASSIFICATION_SUCCESS,
} from '../../actions/constants';
import reducerClassificationGeneral, { getGeneral } from './general';

describe('reducerClassificationGeneral', () => {
	test('action UPDATE_CLASSIFICATION_SUCCESS', () => {
		const action = {
			type: UPDATE_CLASSIFICATION_SUCCESS,
			payload: { id: 'id1' },
		};
		const result = reducerClassificationGeneral(
			{ id1: 'previous', id2: 'previous' },
			action,
		);
		expect(result).toEqual({ id1: {}, id2: 'previous' });
	});
	test('action LOAD_CLASSIFICATION_GENERAL_SUCCESS', () => {
		const action = {
			type: LOAD_CLASSIFICATION_GENERAL_SUCCESS,
			payload: { id: 'id1', results: { prefLabelLg1: 'My classification' } },
		};
		const result = reducerClassificationGeneral({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: {
					...generalUtils.empty(),
					prefLabelLg1: 'My classification',
				},
			},
		});
	});
});

describe('getGeneral', () => {
	test('should extract nothing', () => {
		const result = getGeneral({ id1: { results: 'results' } }, 'id2');
		expect(result).toEqual(undefined);
	});
	test('should extract results', () => {
		const result = getGeneral({ id1: { results: 'results' } }, 'id1');
		expect(result).toEqual('results');
	});
});
