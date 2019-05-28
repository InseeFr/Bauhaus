import { mapStateToProps } from './index';
import { NOT_LOADED, LOADED } from 'js/constants';

describe('DocumentHomeContainer', () => {
	it('should return NOT_LOADED status if the data is not available', () => {
		const result = mapStateToProps({});
		expect(result).toEqual({ documents: [], status: NOT_LOADED });
	});
	it('should return documents if available', () => {
		const result = mapStateToProps({
			operationsDocumentsList: {
				results: ['results'],
				status: LOADED,
				err: 'err',
			},
		});
		expect(result).toEqual({
			documents: ['results'],
			status: LOADED,
			err: 'err',
		});
	});
});
