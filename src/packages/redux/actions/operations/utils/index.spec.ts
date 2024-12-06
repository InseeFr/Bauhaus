import { ReduxModel } from '../../../model';
import { getItemFactory, getPublishFactory } from './index';

const dispatch = vi.fn();

describe('getItemFactory', () => {
	beforeEach(() => dispatch.mockClear());

	it('should call dispatch SUCCESS action with the right operation', async () => {
		const remoteCall = function () {
			return Promise.resolve('result');
		};
		const id = '1';
		await getItemFactory(remoteCall, 'LOADING', 'SUCCESS', 'FAILURE')(id)(
			dispatch,
			() => ({}) as unknown as ReduxModel,
		);
		expect(dispatch).toHaveBeenCalledWith({
			type: 'LOADING',
			payload: { id },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: 'SUCCESS',
			payload: 'result',
		});
	});
	it('should call dispatch FAILURE action with the error', async () => {
		const remoteCall = function () {
			return Promise.reject('error');
		};
		const id = '1';
		await getItemFactory(remoteCall, 'LOADING', 'SUCCESS', 'FAILURE')(id)(
			dispatch,
			() => ({}) as unknown as ReduxModel,
		);
		expect(dispatch).toHaveBeenCalledWith({
			type: 'LOADING',
			payload: { id },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: 'FAILURE',
			payload: { err: 'error' },
		});
	});
});

describe('getPublishFactory', () => {
	beforeEach(() => dispatch.mockClear());

	it('should call dispatch SUCCESS action with the right operation', async () => {
		const remoteCall = function () {
			return Promise.resolve('result');
		};
		const id = 1;
		await getPublishFactory(
			remoteCall,
			'LOADING',
			'SUCCESS',
			'FAILURE',
		)({
			id,
		})(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: 'LOADING',
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: 'SUCCESS',
			payload: 'result',
		});
	});
	it('should call dispatch FAILURE action with the error', async () => {
		const remoteCall = function () {
			return Promise.reject('error');
		};
		const id = 1;
		await getPublishFactory(
			remoteCall,
			'LOADING',
			'SUCCESS',
			'FAILURE',
		)({
			id,
		})(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: 'LOADING',
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: 'FAILURE',
			payload: { err: 'error' },
		});
	});
});
