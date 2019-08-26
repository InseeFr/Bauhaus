import getCorrespondenceAssociation from './association';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/classifications-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/classifications-api');

describe('Associations actions', () => {
	it('should call dispatch LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_SUCCESS action with the right data', async () => {
		api.getCorrespondenceAssociation = function() {
			return Promise.resolve('results');
		};
		await getCorrespondenceAssociation(1, 2)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION,
			payload: { correspondenceId: 1, associationId: 2 },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_SUCCESS,
			payload: { correspondenceId: 1, associationId: 2, results: 'results' },
		});
	});

	it('should call dispatch LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_FAILURE action with an error object', async () => {
		api.getCorrespondenceAssociation = function() {
			return Promise.reject('error');
		};
		await getCorrespondenceAssociation(1, 2)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION,
			payload: { correspondenceId: 1, associationId: 2 },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_FAILURE,
			payload: { err: 'error', correspondenceId: 1, associationId: 2 },
		});
	});
});
