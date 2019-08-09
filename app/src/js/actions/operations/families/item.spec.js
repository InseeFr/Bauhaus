import { saveFamily } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Families actions', () => {
	beforeEach(() => dispatch.mockClear());
	describe('save a family', () => {
		it('should call dispatch SAVE_OPERATIONS_FAMILY_SUCCESS action with the udpated family', async () => {
			api.putFamily = function(id) {
				return Promise.resolve('1');
			};
			const family = { label: 'aaa', id: '1' };
			const callback = jest.fn();

			await saveFamily(family, callback)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_FAMILY,
				payload: family,
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_FAMILY_SUCCESS,
				payload: family,
			});
			expect(callback).toHaveBeenCalledWith(null, '1');
		});

		it('should call dispatch SAVE_OPERATIONS_FAMILY_FAILURE action with the err', async () => {
			api.putFamily = function(id) {
				return Promise.reject('err');
			};
			const family = { label: 'aaa', id: '1' };
			const callback = jest.fn();

			await saveFamily(family, callback)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_FAMILY,
				payload: family,
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_FAMILY_FAILURE,
				payload: { err: 'err' },
			});
			expect(callback).toHaveBeenCalledWith('err');
		});
	});
});
