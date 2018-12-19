import get, { saveOperation } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';
import { LOADING, NOT_LOADED } from 'js/constants';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Operation actions', () => {
	beforeEach(() => dispatch.mockClear());

	describe('get a operation', () => {
		it('should return nothing if the status is LOADING', async () => {
			const getState = () => {
				return { operationsOperationCurrentStatus: LOADING };
			};
			await get(1)(dispatch, getState);

			expect(dispatch).not.toHaveBeenCalledWith();
		});
		it('should call dispatch LOAD_OPERATIONS_OPERATION_SUCCESS action with the right operation if the status is not LOADING', async () => {
			api.getOperation = function(id) {
				return Promise.resolve({ label: 'bbb', id });
			};
			const id = 1;
			const getState = () => {
				return { operationsOperationCurrentStatus: NOT_LOADED };
			};
			await get(id)(dispatch, getState);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_OPERATION,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_OPERATION_SUCCESS,
				payload: { id, label: 'bbb' },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE action with the error  if the status is not LOADING', async () => {
			api.getOperation = function(id) {
				return Promise.reject('error');
			};
			const id = 1;
			const getState = () => {
				return { operationsOperationCurrentStatus: NOT_LOADED };
			};
			await get(id)(dispatch, getState);
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
			api.putOperation = function(id) {
				return Promise.resolve('');
			};

			const operation = { label: 'aaa' };
			await saveOperation(operation)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_OPERATION,
				payload: operation,
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_OPERATION_SUCCESS,
				payload: operation,
			});
		});
	});
});
