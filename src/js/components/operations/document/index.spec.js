import { mapStateToProps } from './index';
import { NOT_LOADED, LOADED } from 'js/constants';

describe('DocumentHomeContainer', () => {
	it('should return NOT_LOADED status if the data is not available', () => {
		const result = mapStateToProps({
			operationsDocuments: { status: NOT_LOADED },
		});
		expect(result).toEqual({
			documentStores: [],
			documentStoresStatus: NOT_LOADED,
		});
	});
	it('should return documents if available', () => {
		const result = mapStateToProps({
			operationsDocuments: {
				results: {
					full: [
						{ uri: 'uri/1', labelLg1: 'labelLg1' },
						{ uri: 'uri/2', labelLg2: 'labelLg2' },
					],
				},
				status: LOADED,
				err: 'err',
			},
		});
		expect(result).toEqual({
			documentStores: [
				{
					label: 'labelLg1',
					uri: 'uri/1',
				},
				{
					label: 'labelLg2',
					uri: 'uri/2',
				},
			],
			documentStoresStatus: LOADED,
		});
	});
});
