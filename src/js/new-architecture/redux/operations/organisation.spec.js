import reducer from './organisations';
import {
	LOAD_OPERATIONS_ORGANISATIONS_FAILURE,
	LOAD_OPERATIONS_ORGANISATIONS_SUCCESS,
} from '../actions/constants';
import { ERROR, LOADED } from '../../sdk/constants';

describe('operationsOrganisations reducer', () => {
	it('LOAD_OPERATIONS_ORGANISATIONS_SUCCESS', () => {
		const result = reducer.operationsOrganisations(
			{ old: 'old' },
			{
				type: LOAD_OPERATIONS_ORGANISATIONS_SUCCESS,
				payload: [{ label: 'b' }, { label: 'a' }],
			}
		);
		expect(result).toEqual({
			status: LOADED,
			results: [{ label: 'a' }, { label: 'b' }],
		});
	});
	it('LOAD_OPERATIONS_ORGANISATIONS_FAILURE', () => {
		const result = reducer.operationsOrganisations(
			{ old: 'old' },
			{
				type: LOAD_OPERATIONS_ORGANISATIONS_FAILURE,
				payload: {
					err: 'err',
				},
			}
		);
		expect(result).toEqual({ err: 'err', status: ERROR });
	});
	it('OTHER', () => {
		const result = reducer.operationsOrganisations(
			{ old: 'old' },
			{
				type: 'OTHER',
				payload: {},
			}
		);
		expect(result).toEqual({ old: 'old' });
	});
});
