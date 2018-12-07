import get, { saveSims } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';
import { LOADING, NOT_LOADED } from 'js/constants';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('SIMS actions', () => {
	beforeEach(() => dispatch.mockClear());
	it('should return nothing if the status is LOADING', async () => {
		const getState = () => {
			return { operationsSimsCurrentStatus: LOADING };
		};
		await get(1)(dispatch, getState);

		expect(dispatch).not.toHaveBeenCalledWith();
	});
	describe('get a sims', () => {
		it('should call dispatch LOAD_OPERATIONS_SIMS_SUCCESS action with the right sims if the status is not LOADING', async () => {
			api.getSims = function(id) {
				return Promise.resolve({ label: 'bbb', id, rubrics: [] });
			};
			const getState = () => {
				return { operationsSimsCurrentStatus: NOT_LOADED };
			};
			const id = 1;
			await get(id)(dispatch, getState);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_SIMS,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
				payload: { id, label: 'bbb', rubrics: {} },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_SIMS_LIST_FAILURE action with the error if the status is not LOADING', async () => {
			api.getSims = function(id) {
				return Promise.reject('error');
			};
			const getState = () => {
				return { operationsSimsCurrentStatus: NOT_LOADED };
			};
			const id = 1;
			await get(id)(dispatch, getState);
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
			const sims = { id: 1, label: 'aaa' };
			await saveSims(sims, () => {})(dispatch);
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
