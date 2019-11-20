import reducerSeriesGeneral, { getGeneral } from './general';
import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';
import * as generalUtils from 'js/applications/classifications/utils/series/general';

describe('reducerSeriesGeneral', () => {
	test('action UPDATE_CLASSIFICATIONS_SERIES_SUCCESS', () => {
		const action = {
			type: A.UPDATE_CLASSIFICATIONS_SERIES_SUCCESS,
			payload: { id: 'id1' },
		};
		const result = reducerSeriesGeneral(
			{ id1: 'previous', id2: 'previous' },
			action
		);
		expect(result).toEqual({ id1: {}, id2: 'previous' });
	});
	test('action LOAD_CLASSIFICATIONS_SERIES_GENERAL_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATIONS_SERIES_GENERAL_SUCCESS,
			payload: { id: 'id1', results: { prefLabelLg1: 'My family' } },
		};
		const result = reducerSeriesGeneral({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: Object.assign(generalUtils.empty(), {
					prefLabelLg1: 'My family',
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
