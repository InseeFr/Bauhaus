import get from './add';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/api';

const dispatch = jest.fn();
jest.mock('js/remote-api/api');

describe('Add actions', () => {
	beforeEach(() => dispatch.mockClear());
	it('should call dispatch ADD_ROLE_SUCCESS action', async () => {
		api.postAddRole = function(id) {
			return Promise.resolve({ label: 'bbb', id });
		};
		const data = 1;
		await get(data)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.ADD_ROLE,
			payload: { data },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.ADD_ROLE_SUCCESS,
			payload: { data },
		});
	});
	it('should call dispatch ADD_ROLE_FAILURE action', async () => {
		api.postAddRole = function(id) {
			return Promise.reject('error');
		};
		const data = 1;
		await get(data)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.ADD_ROLE,
			payload: { data },
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.ADD_ROLE_FAILURE,
			payload: { data: 1, err: 'error' },
		});
	});
});
