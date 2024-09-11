import { HELP, mapStateToProps, VIEW } from './index';
import { LOADED, NOT_LOADED } from '../../sdk/constants';

describe('', () => {
	it('should return NOT_LOADED for the metadataStructureStatus', () => {
		const input = {};
		const expected = {
			metadataStructureStatus: NOT_LOADED,
			metadataStructure: [],
		};
		expect(mapStateToProps(input)).toEqual(expected);
	});

	it('should return a empty object as currenSims for the HELP MODE', () => {
		const input = {
			operationsMetadataStructureList: {
				results: 'operationsMetadataStructureList',
				status: LOADED,
			},
			geographies: {},
			operationsDocuments: {},
		};

		const props = {
			mode: HELP,
			match: {
				params: {
					id: 1,
				},
			},
		};
		const output = mapStateToProps(input, props);
		expect(output.currentSims).toEqual({});
	});

	it('should return a complete currenSims for the VIEW MODE', () => {
		const input = {
			operationsMetadataStructureList: {
				results: 'operationsMetadataStructureList',
				status: LOADED,
			},
			operationsDocuments: {},
			operationsSimsCurrent: {
				id: 1,
				idOperation: 2,
			},
			geographies: {},
		};

		const props = {
			mode: VIEW,
			match: {
				params: {
					id: 1,
				},
			},
		};
		const output = mapStateToProps(input, props);
		expect(output.currentSims).toEqual({
			id: 1,
			idOperation: 2,
		});
	});
});
