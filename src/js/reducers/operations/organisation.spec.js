import reducer from './organisations';
import * as A from '../../actions/constants';
import { LOADED, ERROR } from '../../new-architecture/sdk/constants';

describe('operationsOrganisations reducer', () => {
	it('LOAD_OPERATIONS_ORGANISATIONS_SUCCESS', () => {
		const action = A.LOAD_OPERATIONS_ORGANISATIONS_SUCCESS;
		const result = reducer.operationsOrganisations(
			{ old: 'old' },
			{
				type: action,
				payload: [{ label: 'b' }, { label: 'a' }],
			}
		);
		expect(result).toEqual({
			status: LOADED,
			results: [{ label: 'a' }, { label: 'b' }],
		});
	});
	it('LOAD_OPERATIONS_ORGANISATIONS_FAILURE', () => {
		const action = A.LOAD_OPERATIONS_ORGANISATIONS_FAILURE;
		const result = reducer.operationsOrganisations(
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
		const result = reducer.operationsOrganisations(
			{ old: 'old' },
			{
				type: action,
				payload: {},
			}
		);
		expect(result).toEqual({ old: 'old' });
	});
});
