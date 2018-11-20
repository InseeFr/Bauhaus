import get from './agent';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/api';

const dispatch = jest.fn();
jest.mock('js/remote-api/api');

describe('Agent actions', () => {
	beforeEach(() => dispatch.mockClear());
	it('should call dispatch LOAD_AGENT_LIST_SUCCESS action', async () => {
		api.getAgentList = function(id) {
			return Promise.resolve([{ label: 'bbb' }]);
		};
		const data = 1;
		await get(data)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_AGENT_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_AGENT_LIST_SUCCESS,
			payload: { results: [{ label: 'bbb' }] },
		});
	});
	it('should call dispatch LOAD_AGENT_LIST_FAILURE action', async () => {
		api.getAgentList = function(id) {
			return Promise.reject('error');
		};
		const data = 1;
		await get(data)(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_AGENT_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_AGENT_LIST_FAILURE,
			payload: { err: 'error' },
		});
	});
});
