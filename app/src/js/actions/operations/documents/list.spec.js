import get from './list';
import api from 'js/remote-api/api';
const dispatch = jest.fn();

jest.mock('js/remote-api/api');

describe('List actions', () => {
	beforeEach(() => {
		beforeEach(() => dispatch.mockClear());
	});
	it('should dispatch LOAD_OPERATIONS_DOCUMENTS action', () => {
		api.getDocumentsList = function() {
			return Promise.reject('error');
		};
		get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			payload: {},
			type: 'LOAD_OPERATIONS_DOCUMENTS',
		});
	});

	it('should call getDocumentsList', async () => {
		const dispatch = jest.fn();
		const getDocumentsList = jest.fn().mockRejectedValue('error');
		api.getDocumentsList = getDocumentsList;
		await get()(dispatch);

		expect(api.getDocumentsList).toHaveBeenCalled();
	});

	it('should dispatch LOAD_OPERATIONS_DOCUMENTS_SUCCESS', async () => {
		const dispatch = jest.fn();
		api.getDocumentsList = function() {
			return Promise.resolve([]);
		};
		await get()(dispatch);

		expect(dispatch).toHaveBeenLastCalledWith({
			payload: {
				results: [],
			},
			type: 'LOAD_OPERATIONS_DOCUMENTS_SUCCESS',
		});
	});

	it('should dispatch LOAD_OPERATIONS_DOCUMENTS_SUCCESS with a formatted payload', async () => {
		const dispatch = jest.fn();
		api.getDocumentsList = function() {
			return Promise.resolve([
				{
					label: 'B',
					uri: 'http://google.com/page',
				},
				{
					label: 'A',
					uri: 'http://google.com/page',
				},
			]);
		};
		await get()(dispatch);

		expect(dispatch).toHaveBeenLastCalledWith({
			payload: {
				results: [
					{
						id: 'page',
						label: 'B',
						uri: 'http://google.com/page',
					},
					{
						id: 'page',
						label: 'A',
						uri: 'http://google.com/page',
					},
				],
			},
			type: 'LOAD_OPERATIONS_DOCUMENTS_SUCCESS',
		});
	});

	it('should dispatch LOAD_OPERATIONS_DOCUMENTS_FAILURE', async () => {
		const dispatch = jest.fn();
		api.getDocumentsList = function() {
			return Promise.reject('error');
		};
		await get()(dispatch);

		expect(dispatch).toHaveBeenLastCalledWith({
			payload: {
				err: 'error',
			},
			type: 'LOAD_OPERATIONS_DOCUMENTS_FAILURE',
		});
	});
});
