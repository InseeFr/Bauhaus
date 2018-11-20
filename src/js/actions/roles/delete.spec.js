import get from './delete';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/api';

const dispatch = jest.fn();
jest.mock('js/remote-api/api');

describe('Delete actions', () => {
	beforeEach(() => dispatch.mockClear());
	it('should call dispatch DELETE_ROLE_SUCCESS action', async () => {
		api.postDeleteRole = function(id) {
			return Promise.resolve([{ label: 'bbb' }]);
		};
		const data = 1;
		await get(data)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.DELETE_ROLE,
			payload: { data: 1 },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.DELETE_ROLE_SUCCESS,
			payload: { data: 1 },
		});
	});
	it('should call dispatch DELETE_ROLE_FAILURE action', async () => {
		api.postDeleteRole = function(id) {
			return Promise.reject('error');
		};
		const data = 1;
		await get(data)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.DELETE_ROLE,
			payload: { data: 1 },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.DELETE_ROLE_FAILURE,
			payload: { data: 1, err: 'error' },
		});
	});
});
