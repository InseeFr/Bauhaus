import reducer from './codesList';
import {
	LOAD_OPERATIONS_CODES_LIST,
	LOAD_OPERATIONS_CODES_LIST_FAILURE,
	LOAD_OPERATIONS_CODES_LIST_SUCCESS,
} from '../actions/constants';
import { ERROR, LOADED, LOADING } from '@sdk/constants';

describe('operationsCodesList reducer', () => {
	it('LOAD_OPERATIONS_CODES_LIST', () => {
		const result = reducer.operationsCodesList({ old: 'old' } as any, {
			type: LOAD_OPERATIONS_CODES_LIST,
		});
		expect(result).toEqual({
			results: {
				CL_FREQ: { codes: [] },
				CL_SOURCE_CATEGORY: { codes: [] },
			},
			status: LOADING,
		});
	});
	it('LOAD_OPERATIONS_CODES_LIST_SUCCESS', () => {
		const result = reducer.operationsCodesList(
			{ results: { old: 'old' } } as any,
			{
				type: LOAD_OPERATIONS_CODES_LIST_SUCCESS,
				payload: {
					notation: 'id',
				},
			},
		);
		expect(result).toEqual({
			results: { id: { notation: 'id' }, old: 'old' },
			status: LOADED,
		});
	});
	it('LOAD_OPERATIONS_CODES_LIST_FAILURE', () => {
		const result = reducer.operationsCodesList({ old: 'old' } as any, {
			type: LOAD_OPERATIONS_CODES_LIST_FAILURE,
			payload: {
				err: 'err',
			},
		});
		expect(result).toEqual({ err: 'err', status: ERROR });
	});
	it('OTHER', () => {
		const result = reducer.operationsCodesList({ old: 'old' } as any, {
			type: 'OTHER',
			payload: {},
		});
		expect(result).toEqual({ old: 'old' });
	});
});
