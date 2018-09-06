import get from './list';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('MSD actions', () => {
	it('should call dispatch LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS action with the sorted array', async () => {
		api.getMetadataStructureList = function() {
			return Promise.resolve([
				{ idMas: 's-1', label: 'bbb' },
				{ idMas: 's-2', label: 'aaa' },
			]);
		};
		api.getMetadataAttributesList = function() {
			return Promise.resolve([
				{ id: 's-1', rangeType: 'rangeType1' },
				{ id: 's-2', rangeType: 'rangeType2' },
			]);
		};
		await get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS,
			payload: {
				results: {
					's-1': {
						children: {},
						codeList: undefined,
						idMas: 's-1',
						isPresentational: false,
						label: 'bbb',
						rangeType: 'rangeType1',
					},
					's-2': {
						children: {},
						codeList: undefined,
						idMas: 's-2',
						isPresentational: false,
						label: 'aaa',
						rangeType: 'rangeType2',
					},
				},
			},
		});
	});

	it('should call dispatch LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE action with an error object', async () => {
		api.getMetadataAttributesList = function() {
			return Promise.reject('error');
		};
		await get()(dispatch);
		expect(dispatch).toHaveBeenCalledWith({
			type: A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
			payload: {},
		});
		expect(dispatch).toHaveBeenLastCalledWith({
			type: A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE,
			payload: { err: 'error' },
		});
	});
});
