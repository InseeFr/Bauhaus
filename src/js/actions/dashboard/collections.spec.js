import get from './collections';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/concepts-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('get collection dashboard list', () => {
	it('should call dispatch LOAD_COLLECTION_DASHBOARD_LIST_SUCCESS action with the sorted list', async () => {
		api.getCollectionDashboardList = function(id) {
			return Promise.resolve([{ label: 'bbb' }, { label: 'aaa' }]);
		};
		await get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_COLLECTION_DASHBOARD_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_COLLECTION_DASHBOARD_LIST_SUCCESS,
			payload: { results: [{ label: 'aaa' }, { label: 'bbb' }] },
		});
	});
	it('should call dispatch LOAD_COLLECTION_DASHBOARD_LIST_FAILURE action with the error', async () => {
		api.getCollectionDashboardList = function(id) {
			return Promise.reject('error');
		};
		await get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_COLLECTION_DASHBOARD_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_COLLECTION_DASHBOARD_LIST_FAILURE,
			payload: { err: 'error' },
		});
	});
});
