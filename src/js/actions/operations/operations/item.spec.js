import get, { saveOperation } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';
import { LOADING, NOT_LOADED } from 'js/constants';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Operation actions', () => {
	beforeEach(() => dispatch.mockClear());

	describe('save a operation', () => {
		it('should call dispatch SAVE_OPERATIONS_OPERATION_SUCCESS action with the udpated operation', async () => {
			api.putOperation = function(id) {
				return Promise.resolve('');
			};

			const operation = { label: 'aaa', id: '1' };
			await saveOperation(operation, () => {})(dispatch);
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
