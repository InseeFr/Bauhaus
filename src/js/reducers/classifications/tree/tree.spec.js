import reducerClassificationTree, { getTree } from './';
import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

describe('reducerClassificationTree', () => {
	test('action LOAD_CLASSIFICATION_TREE', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_TREE,
			payload: { id: 'id1' },
		};
		const result = reducerClassificationTree({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADING,
			},
		});
	});
	test('action LOAD_CLASSIFICATION_TREE_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_TREE_SUCCESS,
			payload: { id: 'id1', results: ['My tree data'] },
		};
		const result = reducerClassificationTree({}, action);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: ['My tree data'],
			},
		});
	});
});

describe('getTree', () => {
	test('getTree selector should extract nothing', () => {
		const result = getTree(
			{ classificationTree: { id1: { results: ['My tree data'] } } },
			'id2'
		);
		expect(result).toEqual();
	});
	test('getTree selector should extract results', () => {
		const result = getTree(
			{ classificationTree: { id1: { results: ['My tree data'] } } },
			'id1'
		);
		expect(result).toEqual(['My tree data']);
	});
});
