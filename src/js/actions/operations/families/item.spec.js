import get, { saveFamily } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Families actions', () => {
	describe('get a family', () => {
		it('should call dispatch LOAD_OPERATIONS_FAMILY_SUCCESS action with the right family', async () => {
			api.getFamily = function(id) {
				return Promise.resolve({ label: 'bbb' });
			};
			const id = 1;
			await get(id)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_FAMILY,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_FAMILY_SUCCESS,
				payload: { id, label: 'bbb' },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_FAMILIES_LIST_FAILURE action with the error', async () => {
			api.getFamily = function(id) {
				return Promise.reject('error');
			};
			const id = 1;
			await get(id)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_FAMILY,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_FAMILIES_LIST_FAILURE,
				payload: { err: 'error' },
			});
		});
	});
	describe('save a family', () => {
		it('should call dispatch SAVE_OPERATIONS_FAMILY_SUCCESS action with the udpated family', async () => {
			const family = { label: 'aaa' };
			await saveFamily(family)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_FAMILY,
				payload: { family },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_FAMILY_SUCCESS,
				payload: family,
			});
		});
	});
});
