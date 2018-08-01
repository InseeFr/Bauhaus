import get from './list';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Operations actions', () => {
	it('should call dispatch LOAD_OPERATIONS_OPERATION_SUCCESS action with the sorted array', async () => {
		api.getOperationsList = function() {
			return Promise.resolve([{ label: 'bbb' }, { label: 'aaa' }]);
		};
		await get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_OPERATIONS_OPERATIONS_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_OPERATIONS_OPERATIONS_LIST_SUCCESS,
			payload: { results: [{ label: 'aaa' }, { label: 'bbb' }] },
		});
	});

	it('should call dispatch LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE action with an error object', async () => {
		api.getOperationsList = function() {
			return Promise.reject('error');
		};
		await get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_OPERATIONS_OPERATIONS_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE,
			payload: { err: 'error' },
		});
	});
});
