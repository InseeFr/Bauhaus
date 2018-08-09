import get from './list';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Indicators actions', () => {
	it('should call dispatch LOAD_OPERATIONS_INDICATORS_LIST_SUCCESS action with the sorted array', async () => {
		api.getIndicatorsList = function() {
			return Promise.resolve([{ label: 'bbb' }, { label: 'aaa' }]);
		};
		await get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_OPERATIONS_INDICATORS_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_OPERATIONS_INDICATORS_LIST_SUCCESS,
			payload: { results: [{ label: 'aaa' }, { label: 'bbb' }] },
		});
	});

	it('should call dispatch LOAD_OPERATIONS_INDICATORS_LIST_FAILURE action with an error object', async () => {
		api.getIndicatorsList = function() {
			return Promise.reject('error');
		};
		await get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_OPERATIONS_INDICATORS_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_OPERATIONS_INDICATORS_LIST_FAILURE,
			payload: { err: 'error' },
		});
	});
});
