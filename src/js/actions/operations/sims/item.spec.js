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
		beforeEach(() => {
			api.getOperation = jest.fn(id => Promise.resolve({ series: { id: 2 } }));
			api.getOperationsWithoutReport = jest.fn(() => ['value1']);
		});

		it('should call getOperation/getOperationsWithoutReport method and dispatch LOAD_OPERATIONS_SIMS_SUCCESS action with the right sims if the status is not LOADING', async () => {
			api.getSims = jest.fn(id => {
				return Promise.resolve({
					label: 'bbb',
					idOperation: 3,
					id,
					rubrics: [],
				});
			});

			const getState = () => {
				return { operationsSimsCurrentStatus: NOT_LOADED };
			};
			const id = 1;
			await get(id)(dispatch, getState);

			expect(api.getSims).toHaveBeenCalledWith(1);
			expect(api.getOperation).toHaveBeenCalledWith(3);
			expect(api.getOperationsWithoutReport).toHaveBeenCalledWith(2);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_SIMS,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
				payload: {
					id,
					label: 'bbb',
					rubrics: {},
					idOperation: 3,
					parentsWithoutSims: ['value1'],
				},
			});
		});

		it('should not call getOperation/getOperationsWithoutReport method and dispatch LOAD_OPERATIONS_SIMS_SUCCESS action with the right sims if the status is not LOADING', async () => {
			api.getSims = jest.fn(id => {
				return Promise.resolve({
					label: 'bbb',
					idSims: 3,
					id,
					rubrics: [],
				});
			});
			const getState = () => {
				return { operationsSimsCurrentStatus: NOT_LOADED };
			};
			const id = 1;
			await get(id)(dispatch, getState);

			expect(api.getSims).toHaveBeenCalledWith(1);
			expect(api.getOperation).not.toHaveBeenCalledWith(3);
			expect(api.getOperationsWithoutReport).not.toHaveBeenCalledWith(2);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_SIMS,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
				payload: {
					id,
					label: 'bbb',
					rubrics: {},
					idSims: 3,
					parentsWithoutSims: [],
				},
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
		const sims = { id: 1, label: 'aaa' };

		beforeEach(() => {
			api.putSims = jest.fn(id => {
				return Promise.resolve('');
			});
			api.postSims = jest.fn(id => {
				return Promise.resolve('');
			});
			api.getOperation = jest.fn(() => Promise.resolve('result get operation'));
			api.getSerie = jest.fn(() => Promise.resolve('result get serie'));
			api.getIndicator = jest.fn(() => Promise.resolve('result get indicator'));
		});

		describe.each`
			method            | id
			${'getOperation'} | ${'idOperation'}
			${'getSerie'}     | ${'idSeries'}
			${'getIndicator'} | ${'idIndicator'}
		`('get labels from parent', ({ method, id, expected }) => {
			const apis = ['getOperation', 'getSerie', 'getIndicator'];

			it(`should call ${method} if the labelLg1 is not defined and if the ${id} is defined`, async () => {
				await saveSims(
					{
						...sims,
						[id]: 1,
					},
					() => {}
				)(dispatch);

				apis
					.filter(api => api !== method)
					.forEach(method => {
						expect(api[method]).not.toHaveBeenCalled();
					});
				expect(api[method]).toHaveBeenCalledWith(1);
			});

			it(`should not call ${method} if the labelLg1 is defined`, async () => {
				await saveSims(
					{
						...sims,
						labelLg1: 'labelLg1',
					},
					() => {}
				)(dispatch);
				apis.forEach(method => {
					expect(api[method]).not.toHaveBeenCalled();
				});
			});

			it(`should not call getOperation if the labelLg1 is not defined and if the idOperation is not defined`, async () => {
				await saveSims(
					{
						...sims,
					},
					() => {}
				)(dispatch);
				expect(api.getOperation).not.toHaveBeenCalled();
				expect(api.getSerie).not.toHaveBeenCalled();
				expect(api.getIndicator).not.toHaveBeenCalled();
			});
		});

		it('should call putSims method and dispatch SAVE_OPERATIONS_SIMS_SUCCESS action with the udpated sims', async () => {
			await saveSims(sims, () => {})(dispatch);

			expect(api.putSims).toHaveBeenCalled();
			expect(api.postSims).not.toHaveBeenCalled();
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_SIMS,
				payload: sims,
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
				payload: sims,
			});
		});

		it('should call postSims method and dispatch SAVE_OPERATIONS_SIMS_SUCCESS action with the udpated sims', async () => {
			const creationSims = { label: 'label' };
			await saveSims(creationSims, () => {})(dispatch);

			expect(api.postSims).toHaveBeenCalled();
			expect(api.putSims).not.toHaveBeenCalled();
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_SIMS,
				payload: creationSims,
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
				payload: creationSims,
			});
		});
	});
});
