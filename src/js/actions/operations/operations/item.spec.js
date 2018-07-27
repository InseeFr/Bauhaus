import get, { saveOperation } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Operation actions', () => {
	describe('get a operation', () => {
		it('should call dispatch LOAD_OPERATIONS_OPERATION_SUCCESS action with the right operation', async () => {
			api.getOperation = function(id) {
				return Promise.resolve({ label: 'bbb' });
			};
			const id = 1;
			await get(id)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_OPERATION,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_OPERATION_SUCCESS,
				payload: { id, label: 'bbb' },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE action with the error', async () => {
			api.getOperation = function(id) {
				return Promise.reject('error');
			};
			const id = 1;
			await get(id)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_OPERATION,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE,
				payload: { err: 'error' },
			});
		});
	});
	describe('save a operation', () => {
		it('should call dispatch SAVE_OPERATIONS_OPERATION_SUCCESS action with the udpated operation', async () => {
			const operation = { label: 'aaa' };
			await saveOperation(operation)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_OPERATION,
				payload: { operation },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_OPERATION_SUCCESS,
				payload: operation,
			});
		});
	});
});
