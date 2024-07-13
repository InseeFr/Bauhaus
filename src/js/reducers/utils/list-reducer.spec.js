import listReducer from './list-reducer';
import { LOADED, LOADING, ERROR } from '../../constants';

describe('listReducer', () => {
	const reducer = listReducer(['load', 'success', 'failure']);
	const state = {};
	test('listReducer should return default case', () => {
		const action = {
			type: 'XXX',
			payload: {},
		};
		expect(reducer(state, action)).toEqual(state);
	});
	test('listReducer should return LOADING status', () => {
		const action = {
			type: 'load',
		};
		expect(reducer(state, action).status).toEqual(LOADING);
	});
	test('listReducer should return LOADED status', () => {
		const action = {
			type: 'success',
			payload: { results: 'results' },
		};
		expect(reducer(state, action).status).toEqual(LOADED);
		expect(reducer(state, action).results).toEqual('results');
	});
	test('listReducer should return ERROR status', () => {
		const action = {
			type: 'failure',
			payload: { err: 'Error' },
		};
		expect(reducer(state, action).status).toEqual(ERROR);
		expect(reducer(state, action).err).toEqual('Error');
	});
});
