import reducerClassificationItems, { getItems } from './';
import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

describe('reducerClassificationItems', () => {
	test('action LOAD_CLASSIFICATION_ITEMS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_ITEMS,
			payload: { id: 'id1' },
		};
		const result = reducerClassificationItems({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADING,
			},
		});
	});
	test('action LOAD_CLASSIFICATION_ITEMS_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_ITEMS_SUCCESS,
			payload: { id: 'id1', results: ['My tree data'] },
		};
		const result = reducerClassificationItems({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: ['My tree data'],
			},
		});
	});
});

describe('getItems', () => {
	test('getItems selector should extract nothing', () => {
		const result = getItems(
			{ classificationItems: { id1: { results: ['My tree data'] } } },
			'id2'
		);
		expect(result).toEqual();
	});
	test('getItems selector should extract results', () => {
		const result = getItems(
			{ classificationItems: { id1: { results: ['My tree data'] } } },
			'id1'
		);
		expect(result).toEqual(['My tree data']);
	});
});
