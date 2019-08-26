import getCorrespondenceAssociations from './associations';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/classifications-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/classifications-api');

describe('Associations actions', () => {
	it('should call dispatch LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_SUCCESS action with the right data', async () => {
		api.getCorrespondenceAssociations = function() {
			return Promise.resolve('results');
		};
		await getCorrespondenceAssociations(1)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS,
			payload: { id: 1 },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_SUCCESS,
			payload: { id: 1, results: 'results' },
		});
	});

	it('should call dispatch LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_FAILURE action with an error object', async () => {
		api.getCorrespondenceAssociations = function() {
			return Promise.reject('error');
		};
		await getCorrespondenceAssociations(1)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS,
			payload: { id: 1 },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_FAILURE,
			payload: { err: 'error', id: 1 },
		});
	});
});
