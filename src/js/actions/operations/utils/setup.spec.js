import { loadOrganisations } from './setup';
import * as A from '../../../actions/constants';
import { OrganisationsApi } from '../../../new-architecture/sdk';

const dispatch = jest.fn();
describe('setup operations', () => {
	describe('loadOrganisations', () => {
		it('should call dispatch LOAD_OPERATIONS_ORGANISATIONS_SUCCESS action with the right operation', async () => {
			OrganisationsApi.getOrganisations = function () {
				return Promise.resolve({ label: 'bbb' });
			};
			await loadOrganisations(dispatch);
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_ORGANISATIONS_SUCCESS,
				payload: { label: 'bbb' },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_ORGANISATIONS_FAILURE action with the right operation', async () => {
			OrganisationsApi.getOrganisations = function () {
				return Promise.reject({ err: 'err' });
			};
			await loadOrganisations(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_ORGANISATIONS_FAILURE,
				payload: { err: { err: 'err' } },
			});
		});
	});
});
