import get, { saveSims } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('SIMS actions', () => {
	beforeEach(() => dispatch.mockClear());
	describe('get a sims', () => {
		it('should call dispatch LOAD_OPERATIONS_SIMS_SUCCESS action with the right sims', async () => {
			api.getSims = function(id) {
				return Promise.resolve({ label: 'bbb', id, rubrics: [] });
			};
			const id = 1;
			await get(id)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_SIMS,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
				payload: { id, label: 'bbb', rubrics: {} },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_SIMS_LIST_FAILURE action with the error', async () => {
			api.getSims = function(id) {
				return Promise.reject('error');
			};
			const id = 1;
			await get(id)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_SIMS,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_SIMS_LIST_FAILURE,
				payload: { err: 'error' },
			});
		});
	});
	describe('save a sims', () => {
		it('should call dispatch SAVE_OPERATIONS_SIMS_SUCCESS action with the udpated sims', async () => {
			api.putSims = function(id) {
				return Promise.resolve('');
			};
			const sims = { label: 'aaa' };
			await saveSims(sims)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_SIMS,
				payload: sims,
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
				payload: sims,
			});
		});
	});
});
