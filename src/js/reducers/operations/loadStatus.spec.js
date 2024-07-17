import * as A from '../../actions/constants';
import { LOADED, NOT_LOADED, LOADING } from '../../constants';
import { operationsSimsCurrentStatus } from './loadStatus';

describe('operationsSimsCurrentStatus reducer', () => {
	it('should return the previous state', () => {
		expect(operationsSimsCurrentStatus('STATE', { type: 'BAD_TYPE' })).toBe(
			'STATE'
		);
	});

	it('should return LOADED', () => {
		expect(
			operationsSimsCurrentStatus('STATE', {
				type: A.LOAD_OPERATIONS_SIMS_SUCCESS,
			})
		).toBe(LOADED);
	});
	it('should return NOT_LOADED', () => {
		expect(
			operationsSimsCurrentStatus('STATE', {
				type: A.SAVE_OPERATIONS_SIMS_SUCCESS,
			})
		).toBe(NOT_LOADED);
	});
	it('should return LOADING', () => {
		expect(
			operationsSimsCurrentStatus('STATE', { type: A.LOAD_OPERATIONS_SIMS })
		).toBe(LOADING);
		expect(
			operationsSimsCurrentStatus('STATE', { type: A.SAVE_OPERATIONS_SIMS })
		).toBe(LOADING);
	});
});
