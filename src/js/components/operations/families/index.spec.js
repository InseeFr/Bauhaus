import { mapStateToProps } from './index';
import { NOT_LOADED, LOADED } from 'js/constants';

describe('FamiliesHomeContainer', () => {
	it('should return NOT_LOADED status if the data is not available', () => {
		const result = mapStateToProps({});
		expect(result).toEqual({ families: [], status: NOT_LOADED });
	});
	it('should return families if available', () => {
		const result = mapStateToProps({
			operationsFamiliesList: {
				results: ['results'],
				status: LOADED,
				err: 'err',
			},
		});
		expect(result).toEqual({
			families: ['results'],
			status: LOADED,
			err: 'err',
		});
	});
});
