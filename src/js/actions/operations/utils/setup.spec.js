import { loadCodesList, loadOrganisations } from './setup';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/codelist-api';
import apiOrganisations from 'js/remote-api/organisations-api';

const dispatch = jest.fn();
describe('setup operations', () => {
	describe('loadCodesList', () => {
		it('should call dispatch LOAD_OPERATIONS_CODES_LIST_SUCCESS action with the right operation', async () => {
			api.getCodesList = function(id) {
				return Promise.resolve({ label: 'bbb', id });
			};
			await loadCodesList(['notation'], dispatch);
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_CODES_LIST_SUCCESS,
				payload: { id: 'notation', label: 'bbb' },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_CODES_LIST_FAILURE action with the right operation', async () => {
			api.getCodesList = function(id) {
				return Promise.reject({ err: 'err' });
			};
			await loadCodesList(['notation'], dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_CODES_LIST_FAILURE,
				payload: { err: { err: 'err' } },
			});
		});
	});
	describe('loadOrganisations', () => {
		it('should call dispatch LOAD_OPERATIONS_ORGANISATIONS_SUCCESS action with the right operation', async () => {
			apiOrganisations.getOrganisations = function(id) {
				return Promise.resolve({ label: 'bbb' });
			};
			await loadOrganisations(dispatch);
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_ORGANISATIONS_SUCCESS,
				payload: { label: 'bbb' },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_ORGANISATIONS_FAILURE action with the right operation', async () => {
			apiOrganisations.getOrganisations = function(id) {
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
