import remove from './delete';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/concepts-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/concepts-api');

describe('Concepts actions', () => {
	it('should call dispatch DELETE_CONCEPT_SUCCESS action with the sorted array', async () => {
		api.deleteConcept = function() {
			return Promise.resolve([{ label: 'bbb' }, { label: 'aaa' }]);
		};
		await remove(1)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.DELETE_CONCEPT,
			payload: { id: 1 },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.DELETE_CONCEPT_SUCCESS,
			payload: { id: 1 },
		});
	});

	it('should call dispatch DELETE_CONCEPT_FAILURE action with an error object', async () => {
		api.deleteConcept = function() {
			return Promise.reject('error');
		};
		await remove(1)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.DELETE_CONCEPT,
			payload: { id: 1 },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.DELETE_CONCEPT_FAILURE,
			payload: { err: 'error', id: 1 },
		});
	});
});
