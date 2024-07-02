import reducer from './codesList';
import * as A from 'js/actions/constants';
import { LOADED, LOADING, ERROR } from 'js/constants';

describe('operationsCodesList reducer', () => {
	it('LOAD_OPERATIONS_CODES_LIST', () => {
		const action = A.LOAD_OPERATIONS_CODES_LIST;
		const result = reducer.operationsCodesList(
			{ old: 'old' },
			{
				type: action,
			}
		);
		expect(result).toEqual({
			results: {
				CL_FREQ: { codes: [] },
				CL_SOURCE_CATEGORY: { codes: [] },
			},
			status: LOADING,
		});
	});
	it('LOAD_OPERATIONS_CODES_LIST_SUCCESS', () => {
		const action = A.LOAD_OPERATIONS_CODES_LIST_SUCCESS;
		const result = reducer.operationsCodesList(
			{ results: { old: 'old' } },
			{
				type: action,
				payload: {
					notation: 'id',
				},
			}
		);
		expect(result).toEqual({
			results: { id: { notation: 'id' }, old: 'old' },
			status: LOADED,
		});
	});
	it('LOAD_OPERATIONS_CODES_LIST_FAILURE', () => {
		const action = A.LOAD_OPERATIONS_CODES_LIST_FAILURE;
		const result = reducer.operationsCodesList(
			{ old: 'old' },
			{
				type: action,
				payload: {
					err: 'err',
				},
			}
		);
		expect(result).toEqual({ err: 'err', status: ERROR });
	});
	it('OTHER', () => {
		const action = 'OTHER';
		const result = reducer.operationsCodesList(
			{ old: 'old' },
			{
				type: action,
				payload: {},
			}
		);
		expect(result).toEqual({ old: 'old' });
	});
});
